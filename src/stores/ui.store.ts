import { atom, map } from 'nanostores';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

// Loading state
export const $isLoading = atom<boolean>(false);
export const $loadingMessage = atom<string>('');

// Toast notifications
export const $toasts = map<Record<string, Toast>>({});

// Modal state
export const $activeModal = atom<string | null>(null);
export const $modalData = atom<unknown>(null);

// Sidebar state (for admin layout)
export const $sidebarOpen = atom<boolean>(true);

// Actions
let toastId = 0;

export function showToast(
  type: ToastType,
  title: string,
  description?: string,
  duration = 5000
): string {
  const id = `toast-${++toastId}`;
  const toast: Toast = { id, type, title, description, duration };

  $toasts.setKey(id, toast);

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
}

export function removeToast(id: string) {
  const current = $toasts.get();
  const { [id]: _, ...rest } = current;
  $toasts.set(rest);
}

export function clearToasts() {
  $toasts.set({});
}

export function setLoading(loading: boolean, message = '') {
  $isLoading.set(loading);
  $loadingMessage.set(message);
}

export function openModal(modalId: string, data?: unknown) {
  $activeModal.set(modalId);
  $modalData.set(data);
}

export function closeModal() {
  $activeModal.set(null);
  $modalData.set(null);
}

export function toggleSidebar() {
  $sidebarOpen.set(!$sidebarOpen.get());
}

export function setSidebarOpen(open: boolean) {
  $sidebarOpen.set(open);
}

// Convenience toast functions
export const toast = {
  success: (title: string, description?: string) =>
    showToast('success', title, description),
  error: (title: string, description?: string) =>
    showToast('error', title, description, 8000), // Errors stay longer
  warning: (title: string, description?: string) =>
    showToast('warning', title, description),
  info: (title: string, description?: string) =>
    showToast('info', title, description),
};
