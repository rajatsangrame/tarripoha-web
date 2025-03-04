import { create } from 'zustand';

interface DialogState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  // eslint-disable-next-line no-unused-vars
  showDialog: (title: string, message: string, onConfirm: () => void) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  open: false,
  title: '',
  message: '',
  onConfirm: () => {
    // no-op
  },
  showDialog: (title, message, onConfirm) =>
    set({ open: true, title, message, onConfirm }),
  closeDialog: () => set({ open: false }),
}));
