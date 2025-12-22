import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info" | "message";

type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ToastConfig {
  title: string;
  description?: string;
  duration?: number;
  position?: ToastPosition;
}

export const handleToaster = (type: ToastType, config: ToastConfig): void => {
  const { title, description, duration, position } = config;

  const toastOptions = {
    description,
    duration,
    position,
    style: {
      background: "#1D1F1F",
      borderColor:"#242626"
    },
  };

  switch (type) {
    case "success":
      toast.success(title, toastOptions);
      break;
    case "error":
      toast.error(title, toastOptions);
      break;
    case "warning":
      toast.warning(title, toastOptions);
      break;
    case "info":
      toast.info(title, toastOptions);
      break;
    case "message":
      toast.message(title, toastOptions);
      break;
    default:
      toast(title, toastOptions);
  }
};
