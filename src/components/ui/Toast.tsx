"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Flask, X } from "@phosphor-icons/react/ssr";

type ToastInput = { title: string; body?: string };
type ToastItem = ToastInput & { id: number };

const ToastContext = createContext<(toast: ToastInput) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

/**
 * Polite live region for demo notices ("Sign in isn't part of this demo").
 * Toasts dismiss themselves after a few seconds and can be closed manually.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const push = useCallback(
    (toast: ToastInput) => {
      const id = ++counter.current;
      setToasts((current) => [...current.slice(-2), { ...toast, id }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), 6000),
      );
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((timer) => clearTimeout(timer));
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+6rem)] z-(--z-toast) flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:px-6"
      >
        {toasts.map((toast) => (
          <ToastView key={toast.id} title={toast.title} body={toast.body} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function ToastView({ title, body, onDismiss }: { title: string; body?: string; onDismiss?: () => void }) {
  return (
    <div className="surface-navy pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-card border border-line p-4 shadow-float">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-pill border border-dashed border-line-strong text-accent">
        <Flask size={16} weight="bold" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-fg">{title}</p>
        {body ? <p className="mt-0.5 text-small text-fg-muted">{body}</p> : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-control text-fg-muted transition-colors is-hover:bg-fg/10 is-hover:text-fg"
      >
        <X size={18} weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}
