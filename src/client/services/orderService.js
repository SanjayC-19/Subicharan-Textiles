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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ORDERS_COLLECTION = 'orders';
const MATERIALS_COLLECTION = 'materials';

const normalizeOrder = (docSnap) => {
	const data = docSnap.data() || {};
	const createdAtRaw = data.createdAt;
	const createdAt = createdAtRaw?.toDate ? createdAtRaw.toDate().toISOString() : new Date(0).toISOString();

	const userId = data.user || {};
	const materialSnapshot = data.materialSnapshot || {};

	return {
		_id: docSnap.id,
		id: docSnap.id,
		userId: {
			_id: userId._id || data.userId || 'unknown-user',
			name: userId.name || 'Guest User',
			email: userId.email || '',
		},
		materialId: {
			_id: data.materialId || '',
			materialCode: materialSnapshot.materialCode || 'N/A',
			yarnType: materialSnapshot.yarnType || 'Item',
			pricePerMeter: Number(materialSnapshot.pricePerMeter || 0),
			color: materialSnapshot.color || data.color || 'N/A',
		},
		quantity: Number(data.quantity || 0),
		color: data.color || materialSnapshot.color || 'N/A',
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
	const { materialId, quantity, color, paymentMethod, deliveryAddress } = payload;
	if (!materialId || !quantity || !color || !paymentMethod || !deliveryAddress) {
		throw new Error('All order fields are required');
	}

	const user = readStoredUser();
	const userId = user?._id || user?.uid;
	if (!userId) {
		throw new Error('Please log in before placing an order.');
	}

	const materialRef = doc(db, MATERIALS_COLLECTION, materialId);
	const materialSnap = await getDoc(materialRef);
	if (!materialSnap.exists()) {
		throw new Error('Material not found');
	}

	const material = materialSnap.data();
	const qty = Number(quantity);
	const currentStock = Number(material.stock || 0);
	if (currentStock < qty) {
		throw new Error('Insufficient stock');
	}

	const totalPrice = Number(material.pricePerMeter || 0) * qty;

	await runTransaction(db, async (transaction) => {
		const latestSnap = await transaction.get(materialRef);
		if (!latestSnap.exists()) {
			throw new Error('Material not found');
		}

		const latest = latestSnap.data();
		const latestStock = Number(latest.stock || 0);
		if (latestStock < qty) {
			throw new Error('Insufficient stock');
		}

		transaction.update(materialRef, {
			stock: latestStock - qty,
			updatedAt: serverTimestamp(),
		});
	});

	const orderRef = await addDoc(collection(db, ORDERS_COLLECTION), {
		userId,
		user: {
			_id: userId,
			name: user.name || 'User',
			email: user.email || '',
		},
		materialId,
		materialSnapshot: {
			materialCode: material.materialCode || 'N/A',
			yarnType: material.yarnType || 'Item',
			pricePerMeter: Number(material.pricePerMeter || 0),
			color: material.color || color,
		},
		quantity: qty,
		color,
		paymentMethod,
		deliveryAddress,
		totalPrice,
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
