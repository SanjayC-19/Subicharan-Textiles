// Razorpay Checkout script loader for React
import { useEffect } from 'react';

export default function useRazorpayScript() {
  useEffect(() => {
    if (document.getElementById('razorpay-checkout-js')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);
// File removed: useRazorpayScript hook and all Razorpay-related code.
