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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${kanit.variable} ${poppins.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
