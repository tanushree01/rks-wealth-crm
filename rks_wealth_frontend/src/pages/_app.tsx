import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token && (router.pathname === "/" || router.pathname === "/login")) {
      // Redirect to dashboard if authenticated
      router.push("/dashboard");
    } else if (!token && router.pathname !== "/login") {
      // Redirect to login if not authenticated
      router.push("/login");
    }
  }, [router.pathname]);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
