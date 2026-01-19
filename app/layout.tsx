import type { Metadata } from "next";
import { Kanit, Poppins } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  weight: ["300", "400", "600"],
  subsets: ["thai", "latin"],
  variable: "--font-kanit",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "My Portfolio | Programmer CV",
  description: "Personal website and portfolio",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Portfolio",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${kanit.variable} ${poppins.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
