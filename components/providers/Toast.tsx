'use client';

import { AnimatePresence, m } from 'framer-motion';
import { CircleCheck, X } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { EASE_IN, EASE_OUT } from '@/components/ui/motion';

type ToastInput = { title: string; body?: string };
type ToastItem = ToastInput & { id: number };

const ToastContext = createContext<(toast: ToastInput) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastItem | null>(null);

  const push = useCallback((input: ToastInput) => setToast({ ...input, id: Date.now() }), []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 7000);
    return () => window.clearTimeout(id);
  }, [toast]);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-toast flex justify-center md:inset-x-auto md:bottom-8 md:right-8"
      >
        <AnimatePresence>
          {toast ? (
            <m.div
              key={toast.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE_OUT } }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.16, ease: EASE_IN } }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-sm bg-surface py-3 pl-4 pr-2 shadow-lift-3 ring-1 ring-line/25"
            >
              <CircleCheck className="mt-3 size-5 shrink-0 text-accent" aria-hidden />
              <div className="py-2">
                <p className="font-semibold text-ink">{toast.title}</p>
                {toast.body ? <p className="mt-0.5 text-sm text-ink-muted">{toast.body}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Cerrar aviso"
                className="ml-auto grid size-11 shrink-0 place-items-center rounded-sm text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                <X className="size-5" aria-hidden />
              </button>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
