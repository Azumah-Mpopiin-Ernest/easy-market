import { createRoot } from "react-dom/client"
import App from "./App"
const root = createRoot(document.getElementById("root"))

root.render(
    <App />
)


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .catch((err) => console.log("Service Worker registration failed: ", err));
  });
}
