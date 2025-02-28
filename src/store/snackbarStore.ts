import { create } from "zustand";

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  showSnackbar: (message: string, severity?: "success" | "error" | "warning" | "info") => void;
  hideSnackbar: () => void;
};

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  severity: "success",
  showSnackbar: (message, severity = "success") =>
    set({ open: true, message, severity }),
  hideSnackbar: () => set({ open: false }),
}));
