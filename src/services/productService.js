import { collection, getDocs, doc, getDoc, addDoc, query, where, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

// Collection References
const productsCollection = collection(db, "products");
const categoriesCollection = collection(db, "categories");
const ordersCollection = collection(db, "orders");
const messagesCollection = collection(db, "contactMessages");

// Product Services
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(productsCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return dummy data if Firebase is not configured yet
    return getDummyProducts();
  }
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such product!");
      return getDummyProducts().find(p => p.id === id) || null;
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return getDummyProducts().find(p => p.id === id) || null;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const q = query(productsCollection, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return getDummyProducts().filter(p => p.category === category);
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(productsCollection, productData);
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Contact Services
export const submitContactMessage = async (messageData) => {
  try {
    await addDoc(messagesCollection, {
      ...messageData,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Error submitting message:", error);
    return false; // we can fail gracefully
  }
};

// Order Services
export const placeOrder = async (orderData) => {
  try {
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      orderDate: new Date(),
      status: "pending"
    });
    return docRef.id;
  } catch (error) {
    console.error("Error placing order:", error);
    return "dummy-order-id-" + Math.floor(Math.random() * 10000);
  }
};

// Fallback dummy data for development without Firebase config
const getDummyProducts = () => [
  {
    id: "1",
    name: "Premium Kanchipuram Silk Saree",
    category: "Silk",
    price: 15999,
    description: "Authentic handwoven Kanchipuram silk saree with pure zari border.",
    imageURL: "https://images.unsplash.com/photo-1610030469983-98e550d61dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 12
  },
  {
    id: "2",
    name: "Classic Cotton Kurti",
    category: "Cotton",
    price: 1299,
    description: "Comfortable and breathable pure cotton kurti for daily wear.",
    imageURL: "https://images.unsplash.com/photo-1583391733958-6c510521e151?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 25
  },
  {
    id: "3",
    name: "Festive Designer Lehenga",
    category: "Sarees", // Grouped in Sarees/Lehengas logically
    price: 24500,
    description: "Intricately embroidered designer lehenga for weddings and festive occasions.",
    imageURL: "https://images.unsplash.com/photo-1595777457583-95e059f581ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 5
  },
  {
    id: "4",
    name: "Kids Ethnic Wear Set",
    category: "Kids Wear",
    price: 1899,
    description: "Adorable and comfortable ethnic wear set for kids.",
    imageURL: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 15
  },
  {
    id: "5",
    name: "Banarasi Silk Saree",
    category: "Silk",
    price: 12500,
    description: "Rich Banarasi silk saree with intricate floral motifs.",
    imageURL: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 8
  },
  {
    id: "6",
    name: "Handloom Cotton Saree",
    category: "Cotton",
    price: 3500,
    description: "Elegant handloom pure cotton saree perfect for office and summer wear.",
    imageURL: "https://images.unsplash.com/photo-1583391265698-466b372af2d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 20
  }
];
