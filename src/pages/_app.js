import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const loadBootstrap = async () => {
      try {
        await import("bootstrap/dist/js/bootstrap");
      } catch (error) {
        console.error("Failed to load Bootstrap JavaScript:", error);
      }
    };
    loadBootstrap();
  }, []);

  return <Component {...pageProps} />;
}
