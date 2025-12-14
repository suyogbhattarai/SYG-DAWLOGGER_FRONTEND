// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import ReduxProvider from "@/utils/lib/redux/ReduxProvider";
import AuthSessionListener from '@/components/ui/AuthSessionListener'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DAW Logger",
  description: "Professional project version control for music producers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  text-white`}
      >
        <ReduxProvider>
          <AuthSessionListener />
            {children}
        </ReduxProvider>
      </body>
    </html>
  );
}