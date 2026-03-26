import { db } from '../config/Firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

const ORDERS_COLLECTION = 'orders';

/**
 * Saves a new order to Firestore
 * @param {Object} orderData - The order details
 * @returns {Promise<string>} - The Firestore document ID
 */
export const saveOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      status: 'Ordered', // Initial status
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving order:', error);
    throw new Error('Failed to save order to database');
  }
};

/**
 * Fetches all orders for a specific user
 * @param {string} userId - The user's UID
 * @returns {Promise<Array>} - List of orders
 */
export const getOrdersByUser = async (userId) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore timestamp to JS Date string
      createdAt: doc.data().createdAt?.toDate().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to fetch your orders');
  }
};

/**
 * Fetches a single order by its ID (not Firestore ID, but our ORD-XXXX)
 * @param {string} orderId - The ORD-XXXX ID
 * @returns {Promise<Object|null>} - The order object
 */
export const getOrderByOrderId = async (orderId) => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), where('orderId', '==', orderId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order details');
  }
};
