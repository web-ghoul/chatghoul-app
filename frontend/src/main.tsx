import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./assets/index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Toaster richColors />
    <App />
  </BrowserRouter>
);
