import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    container: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-l-4 border-emerald-500 shadow-emerald-100',
    iconColor: 'text-emerald-500',
    title: 'text-emerald-800',
    message: 'text-emerald-700',
    progress: 'bg-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  error: {
    icon: XCircle,
    container: 'bg-gradient-to-r from-rose-500/10 to-red-500/10 border-l-4 border-rose-500 shadow-rose-100',
    iconColor: 'text-rose-500',
    title: 'text-rose-800',
    message: 'text-rose-700',
    progress: 'bg-rose-400',
    badge: 'bg-rose-100 text-rose-700',
  },
  warning: {
    icon: AlertTriangle,
    container: 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-l-4 border-amber-500 shadow-amber-100',
    iconColor: 'text-amber-500',
    title: 'text-amber-800',
    message: 'text-amber-700',
    progress: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700',
  },
  info: {
    icon: Info,
    container: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-l-4 border-blue-500 shadow-blue-100',
    iconColor: 'text-blue-500',
    title: 'text-blue-800',
    message: 'text-blue-700',
    progress: 'bg-blue-400',
    badge: 'bg-blue-100 text-blue-700',
  },
};

export function ToastItem({ id, type = 'info', title, message, duration = 4500, onClose }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const variant = VARIANTS[type] || VARIANTS.info;
  const Icon = variant.icon;

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);

    // Progress bar countdown
    const step = 100 / (duration / 50);
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          return 0;
        }
        return prev - step;
      });
    }, 50);

    // Auto dismiss
    const dismissTimer = setTimeout(() => handleClose(), duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
      clearInterval(progressTimer);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(id), 350);
  };

  return (
    <div
      className={`
        relative w-full max-w-sm rounded-xl shadow-lg overflow-hidden
        transition-all duration-350 ease-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${variant.container}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`mt-0.5 shrink-0 ${variant.iconColor}`}>
          <Icon size={22} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <p className={`text-sm font-semibold leading-snug ${variant.title}`}>{title}</p>
          )}
          {message && (
            <p className={`text-xs mt-0.5 leading-relaxed ${variant.message}`}>{message}</p>
          )}
        </div>

        <button
          onClick={handleClose}
          className="shrink-0 ml-1 p-1 rounded-lg hover:bg-black/10 transition-colors"
          aria-label="Close notification"
        >
          <X size={14} className="text-zinc-500" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-black/5 w-full">
        <div
          className={`h-full transition-all ease-linear ${variant.progress}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-5 right-5 z-9999 flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}
