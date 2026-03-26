import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ToastContainer } from '../components/Toast';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const id = ++idCounter;
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  }, []);

  const toast = useMemo(() => ({
    success: (title, message, opts) => show({ type: 'success', title, message, ...opts }),
    error: (title, message, opts) => show({ type: 'error', title, message, ...opts }),
    warning: (title, message, opts) => show({ type: 'warning', title, message, ...opts }),
    info: (title, message, opts) => show({ type: 'info', title, message, ...opts }),
  }), [show]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
