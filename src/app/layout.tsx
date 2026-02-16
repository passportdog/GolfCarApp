import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Village Cart Studio",
  description: "Create stunning, branded content for your golf cart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.variable} font-sans h-full bg-stone-50 text-stone-900`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}