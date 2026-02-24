import type { Metadata } from "next";
import { Unbounded, Bai_Jamjuree } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Contactbar from "@/components/Contactbar/Contactbar";
import Footer from "@/components/Footer/Footer";
import ReduxProvider from "@/utils/lib/redux/ReduxProvider";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});
const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Dawlogger | Version Control for Music Producers",
    template: "%s | Dawlogger"
  },
  description: "Secure project management, intelligent version control, and real-time collaboration for music producers and studios.",
  keywords: [
    "music production",
    "version control",
    "stem management",
    "producer workflow",
    "cloud backup for daw",
    "collaboration for producers",
    "studio project management"
  ],
  authors: [{ name: "Dawlogger Team" }],
  creator: "Dawlogger",
  publisher: "Dawlogger",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dawlogger.com",
    title: "Dawlogger | Version Control for Music Producers",
    description: "Unified creative workflow for producers. Intelligent versioning, secure backups, and seamless collaboration.",
    siteName: "Dawlogger",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dawlogger - Harmonizing Creative Workflows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dawlogger | Version Control for Music Producers",
    description: "Modern project management for the modern music producer.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${unbounded.variable} ${baiJamjuree.variable} antialiased bg-[var(--background)] font-sans`}
      >
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
