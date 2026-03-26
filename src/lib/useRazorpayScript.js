import { useEffect, useState } from 'react';

export default function useRazorpayScript() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('razorpay-checkout-js')) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      console.error('Razorpay SDK failed to load');
      setIsLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      // Opted not to remove script on unmount so subsequent renders don't need to fetch it again
    };
  }, []);

  return isLoaded;
}
