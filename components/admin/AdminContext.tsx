'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: ToastAction;
  duration: number;
}

export interface ToastOptions {
  variant?: ToastVariant;
  action?: ToastAction;
  duration?: number;
}

interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant: 'danger' | 'default';
  resolve: ((ok: boolean) => void) | null;
}

interface AdminCtx {
  isAuthenticated: boolean;
  user: User | null;
  loadingAuth: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  toasts: Toast[];
  toast: (message: string, variantOrOptions?: ToastVariant | ToastOptions) => string;
  dismissToast: (id: string) => void;
  confirm: (opts: { title?: string; message: string; confirmLabel?: string; variant?: 'danger' | 'default' }) => Promise<boolean>;
  confirmState: ConfirmState;
  resolveConfirm: (ok: boolean) => void;
}

const AdminContext = createContext<AdminCtx | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    return () => { Object.values(toastTimers.current).forEach(clearTimeout); };
  }, []);

  const toast = useCallback((message: string, variantOrOptions: ToastVariant | ToastOptions = 'success'): string => {
    const opts: ToastOptions = typeof variantOrOptions === 'string'
      ? { variant: variantOrOptions }
      : variantOrOptions;
    const variant = opts.variant ?? 'success';
    const duration = opts.duration ?? (opts.action ? 7000 : 4000);
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts(prev => [...prev, { id, message, variant, action: opts.action, duration }]);
    toastTimers.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete toastTimers.current[id];
    }, duration);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    clearTimeout(toastTimers.current[id]);
    delete toastTimers.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false, title: 'Are you sure?', message: '', confirmLabel: 'Confirm', variant: 'default', resolve: null,
  });

  const confirm = useCallback(
    ({ title = 'Are you sure?', message, confirmLabel = 'Confirm', variant = 'default' }: {
      title?: string; message: string; confirmLabel?: string; variant?: 'danger' | 'default';
    }): Promise<boolean> => new Promise(resolve => {
      setConfirmState({ open: true, title, message, confirmLabel, variant, resolve });
    }),
    [],
  );

  const resolveConfirm = useCallback((ok: boolean) => {
    setConfirmState(prev => { prev.resolve?.(ok); return { ...prev, open: false, resolve: null }; });
  }, []);

  return (
    <AdminContext.Provider value={{ isAuthenticated, user, loadingAuth, login, logout, toasts, toast, dismissToast, confirm, confirmState, resolveConfirm }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminCtx {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
}
