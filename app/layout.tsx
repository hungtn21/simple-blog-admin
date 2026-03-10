import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Simple Blog Admin",
    template: "%s | Simple Blog Admin"
  },
  description: "Admin dashboard for blog management - Create, edit, and manage your blog posts with ease",
  keywords: ["blog", "admin", "dashboard", "content management", "posts"],
  authors: [{ name: "Simple Blog Team" }],
  creator: "Simple Blog Admin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://simple-blog-admin.vercel.app",
    siteName: "Simple Blog Admin",
    title: "Simple Blog Admin",
    description: "Admin dashboard for blog management - Create, edit, and manage your blog posts with ease",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple Blog Admin",
    description: "Admin dashboard for blog management",
    creator: "@simpleblog",
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
