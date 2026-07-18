import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Meridian Capital — Trade Global Markets With Confidence",
  description:
    "Trade Forex, Commodities, Indices, Stocks and Crypto CFDs through Meridian Capital — a premium global brokerage with institutional-grade execution and investment portfolios.",
  openGraph: {
    title: "Meridian Capital — Global Forex & Investment Brokerage",
    description:
      "Institutional-grade Forex, CFD and investment platform with managed portfolios and copy trading.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
