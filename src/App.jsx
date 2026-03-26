import Chatbot from './chatbot/Chatbot';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Collections from './pages/Collections';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';


// Admin
import AddProduct from './admin/AddProduct';

const App = () => {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col font-sans text-gray-800">
          <Navbar />
          <main className="flex-grow pt-20">
            <Routes>
              {/* Static Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              {/* E-Commerce Pages */}
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/collections" element={<Collections />} />
              {/* Cart & Checkout */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* Profiles */}
              <Route path="/profile/:role" element={<Profile />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/my-orders" element={<MyOrders />} />

              {/* Admin Portal */}
              <Route path="/admin/add-product" element={<AddProduct />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Chatbot groqApiKey={process.env.REACT_APP_GROQ_API_KEY} />
      </CartProvider>
    </Router>
  );
};

export default App;
