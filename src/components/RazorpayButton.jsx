import React, { useState } from 'react';
import useRazorpayScript from '../lib/useRazorpayScript';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const razorpayLogo = (
  <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle mr-2">
    <g>
      <path d="M7.5 28L24.5 4.5C25.5 3 28 3.5 27.5 5.5L20.5 28C20 29.5 17.5 29.5 17 28L7.5 28Z" fill="#0B72E7"/>
      <path d="M12 28L25 10.5C25.5 10 26.5 10.5 26 11.5L17.5 28C17 29 15 29 14.5 28L12 28Z" fill="#2B7BFF"/>
    </g>
  </svg>
);

export default function RazorpayButton({ amount, onSuccess, onCancel, onError, customer, isSubmitting }) {
  const isLoaded = useRazorpayScript();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!isLoaded) {
      alert('Razorpay is not loaded yet. Please wait a moment and try again.');
      return;
    }

    if (!amount || amount <= 0) {
      alert('Invalid order amount.');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Razorpay order on the backend
      const res = await fetch(`${API_BASE}/razorpay/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR' }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error (${res.status}): ${text}`);
      }

      const order = await res.json();

      if (order.error) {
        alert('Server error: ' + order.error);
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay payment modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SVtxwS1gIf2WRT',
        amount: order.amount,
        currency: order.currency,
        name: 'Subitcharan Tex',
        description: 'Payment for your order',
        order_id: order.id,
        handler: async function (response) {
          // Step 3: Verify payment signature on the backend
          try {
            const verifyRes = await fetch(`${API_BASE}/razorpay/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verification = await verifyRes.json();

            if (verification.status === 'success') {
              onSuccess && onSuccess(response);
            } else {
              alert('Payment verification failed: ' + (verification.message || 'Unknown error'));
              onCancel && onCancel();
            }
          } catch (err) {
            console.error('Verification request failed:', err);
            alert('Payment verification request failed. Please contact support.');
            onCancel && onCancel();
          }
        },
        prefill: {
          name: customer?.name || '',
          email: customer?.email || '',
          contact: customer?.phone || '',
        },
        notes: {
          store: 'Subitcharan Tex',
        },
        theme: {
          color: '#2B7BFF',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            onCancel && onCancel();
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        alert('Payment failed: ' + response.error.description);
        onError && onError(response.error);
        onCancel && onCancel(response.error);
      });

      rzp.open();
    } catch (err) {
      console.error('Razorpay initiation error:', err);
      alert('Could not initiate payment. Make sure the backend server is running at http://localhost:5000');
      onError && onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id="razorpay-pay-btn"
      type="button"
      onClick={handlePayment}
      disabled={isSubmitting || loading || !isLoaded}
      className="w-full py-4 text-white font-medium rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all bg-[#2B7BFF] hover:bg-[#1a65e0] disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : !isLoaded ? (
        <span>Loading payment gateway...</span>
      ) : (
        <>
          {razorpayLogo}
          Pay ₹{amount?.toLocaleString('en-IN')} securely with Razorpay
        </>
      )}
    </button>
  );
}
