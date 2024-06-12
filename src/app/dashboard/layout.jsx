import Navbar from "@/components/navbar";
import React from "react";

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
