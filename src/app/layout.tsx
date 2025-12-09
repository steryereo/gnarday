import type { Metadata } from "next";

import { libreFranklin } from "../lib/fonts";

import "./globals.css";

export const metadata = {
  title: "GnarZone",
  description: "How many days?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${libreFranklin.className} text-onyx`}>
        <div className="min-h-dvh flex flex-col text-pretty p-12">
          {children}
        </div>
      </body>
    </html>
  );
}
