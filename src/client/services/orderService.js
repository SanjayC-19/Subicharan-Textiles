import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	runTransaction,
	serverTimestamp,
	updateDoc,
	where,
} from 'firebase/firestore';
import { db } from '../../config/Firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const ORDERS_COLLECTION = 'orders';
const MATERIALS_COLLECTION = 'materials';

const normalizeOrder = (docSnap) => {
	const data = docSnap.data() || {};
	const createdAtRaw = data.createdAt;
	const createdAt = createdAtRaw?.toDate ? createdAtRaw.toDate().toISOString() : new Date(0).toISOString();

	const userId = data.user || {};

	// Convert legacy single-item schema to items array
	const items = data.items || [];
	if (items.length === 0 && data.materialId) {
		items.push({
			materialId: data.materialId,
			materialCode: data.materialSnapshot?.materialCode || 'N/A',
			yarnType: data.materialSnapshot?.yarnType || 'Item',
			color: data.color || data.materialSnapshot?.color || 'N/A',
			pricePerMeter: Number(data.materialSnapshot?.pricePerMeter || 0),
			quantity: Number(data.quantity || 0),
		});
	}

	return {
		_id: docSnap.id,
		id: docSnap.id,
		userId: {
			_id: userId._id || data.userId || 'unknown-user',
			name: userId.name || 'Guest User',
			email: userId.email || '',
		},
		items,
		paymentMethod: data.paymentMethod || 'N/A',
		deliveryAddress: data.deliveryAddress || '',
		totalPrice: Number(data.totalPrice || 0),
		orderStatus: data.orderStatus || 'Pending',
		createdAt,
	};
};

const readStoredUser = () => {
	const raw = localStorage.getItem('user');
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
};

export const createOrder = async (payload) => {
	const { items, paymentMethod, deliveryAddress, totalPrice } = payload;
	if (!items || items.length === 0 || !paymentMethod || !deliveryAddress) {
		throw new Error('All order fields are required');
	}

	const user = readStoredUser();
	const userId = user?._id || user?.uid;
	if (!userId) {
		throw new Error('Please log in before placing an order.');
	}

	const materialRefs = items.map(item => doc(db, MATERIALS_COLLECTION, item._id));

	await runTransaction(db, async (transaction) => {
		// Read all documents first to lock them
		const snaps = await Promise.all(materialRefs.map(ref => transaction.get(ref)));

		// Verify stock
		snaps.forEach((snap, idx) => {
			if (!snap.exists()) {
				throw new Error(`Material ${items[idx].yarnType} not found in database.`);
			}
			const currentStock = Number(snap.data().stock || 0);
			const qty = Number(items[idx].cartQuantity || 0);
			if (currentStock < qty) {
				throw new Error(`Insufficient stock for ${items[idx].yarnType}.`);
			}
		});

		// Write updates
		snaps.forEach((snap, idx) => {
			const latest = snap.data();
			const latestStock = Number(latest.stock || 0);
			const qty = Number(items[idx].cartQuantity || 0);
			const newStock = latestStock - qty;

			transaction.update(snap.ref, {
				stock: newStock,
				updatedAt: serverTimestamp(),
			});

			if (latestStock >= 500 && newStock < 500) {
				fetch(`${API_BASE_URL}/alerts/low-stock`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						materialCode: latest.materialCode || 'N/A',
						yarnType: latest.yarnType || 'Item',
						color: latest.color || items[idx].selectedColor,
						stock: newStock,
					}),
				}).catch(err => console.error('Failed to send low stock alert:', err));
			}
		});
	});

	const formattedItems = items.map(item => ({
		materialId: item._id,
		materialCode: item.materialCode || 'N/A',
		yarnType: item.yarnType || 'Item',
		color: item.selectedColor || 'N/A',
		pricePerMeter: Number(item.pricePerMeter || 0),
		quantity: Number(item.cartQuantity || 0),
	}));

	const orderRef = await addDoc(collection(db, ORDERS_COLLECTION), {
		userId,
		user: {
			_id: userId,
			name: user.name || 'User',
			email: user.email || '',
		},
		items: formattedItems,
		paymentMethod,
		deliveryAddress,
		totalPrice: Number(totalPrice || 0),
		orderStatus: 'Pending',
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	});

	return { _id: orderRef.id, id: orderRef.id };
};

export const sendInvoiceEmail = async ({
	orderId,
	customer,
	items,
	total,
	payment,
}) => {
	const subtotal = Number(total || 0);
	const shipping = 0;
	const tax = 0;

	const response = await fetch(`${API_BASE_URL}/orders/send-invoice`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			orderId,
			customer,
			items,
			subtotal,
			shipping,
			tax,
			total: subtotal,
			payment: payment || {},
		}),
	});

	if (!response.ok) {
		let payload = null;
		try {
			payload = await response.json();
		} catch {
			payload = null;
		}
		throw new Error(payload?.error || 'Failed to send invoice email');
	}

	return response.json();
};

export const getAllOrders = async () => {
	const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
	return snapshot.docs
		.map(normalizeOrder)
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getOrderByOrderId = async (orderId) => {
	if (!orderId) return null;
	const docRef = doc(db, ORDERS_COLLECTION, orderId);
	const docSnap = await getDoc(docRef);
	
	if (!docSnap.exists()) return null;
	return normalizeOrder(docSnap);
};

export const getUserOrders = async (userId) => {
	if (!userId) return [];
	const q = query(collection(db, ORDERS_COLLECTION), where('userId', '==', userId));
	const snapshot = await getDocs(q);
	return snapshot.docs
		.map(normalizeOrder)
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const updateOrderStatus = async (id, orderStatus) => {
	await updateDoc(doc(db, ORDERS_COLLECTION, id), {
		orderStatus,
		updatedAt: serverTimestamp(),
	});
	return { _id: id, orderStatus };
};
