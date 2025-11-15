import { createRoot } from "react-dom/client"
import App from "./App"
const root = createRoot(document.getElementById("root"))

root.render(
    <App />
)


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')  // vite-plugin-pwa generates sw.js
      .then(reg => console.log('SW registered', reg))
      .catch(err => console.log('SW registration failed', err))
  })
}

