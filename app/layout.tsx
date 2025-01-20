// import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Lato } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// import { Weight } from "lucide-react";
// import Navbar from '@/components/Navbar';
// import { Toast } from "@radix-ui/react-toast";
// import { Toaster } from "@/components/ui/toaster";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${lato.className} bg-gray-50`}>
          <div className="max-w-6xl mx-auto min-h-screen">
            {/* <Navbar /> */}
            {children}
            {/* <Toaster /> */}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
