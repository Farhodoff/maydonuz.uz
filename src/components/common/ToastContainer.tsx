import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, ToastType } from '../../contexts/ToastContext';

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        iconBg: 'bg-emerald-100 text-emerald-600',
        icon: CheckCircle2,
      };
    case 'error':
      return {
        bg: 'bg-rose-50 border-rose-200 text-rose-900',
        iconBg: 'bg-rose-100 text-rose-600',
        icon: AlertCircle,
      };
    case 'warning':
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-900',
        iconBg: 'bg-amber-100 text-amber-600',
        icon: AlertTriangle,
      };
    case 'info':
    default:
      return {
        bg: 'bg-brand-50 border-brand-200 text-brand-950',
        iconBg: 'bg-brand-100 text-brand-700',
        icon: Info,
      };
  }
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 sm:top-5 sm:right-5 z-[9999] flex flex-col space-y-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      {toasts.map((toast) => {
        const style = getToastStyles(toast.type);
        const IconComponent = style.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-top-3 ${style.bg}`}
            role="alert"
          >
            <div className={`p-1.5 rounded-xl flex-shrink-0 mr-3 ${style.iconBg}`}>
              <IconComponent className="h-5 w-5" />
            </div>

            <div className="flex-1 text-sm font-semibold leading-snug pt-0.5">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 -mr-1 -mt-1 p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
