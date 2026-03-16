import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const berkeleyMono = localFont({
  src: [
    {
      path: "../public/fonts/BerkeleyMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/BerkeleyMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/BerkeleyMono-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/BerkeleyMono-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    }
  ],
  variable: "--font-berkeley-mono",
});

export const metadata: Metadata = {
  title: "epsylene",
  description: "Personal page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={berkeleyMono.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
