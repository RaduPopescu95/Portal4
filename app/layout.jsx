"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import ScrollToTop from "@/components/common/ScrollTop";
import "../public/assets/scss/index.scss";
import { AuthProvider } from "@/context/AuthContext";
import { LoadScript } from "@react-google-maps/api";

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

export default function RootLayout({ children }) {
  const libraries = ["places"];
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Nunito:400,400i,500,600,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <AuthProvider>
            <Provider store={store}>{children}</Provider>
          </AuthProvider>
        </LoadScript>
        <ScrollToTop />
      </body>
    </html>
  );
}
