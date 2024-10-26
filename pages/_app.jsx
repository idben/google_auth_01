import "@/styles/globals.sass";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }) {
  return(
    <AuthProvider>
      <Script src="https://apis.google.com/js/api.js" strategy="beforeInteractive" />
      <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
