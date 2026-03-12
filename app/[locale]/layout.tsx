import type { Metadata } from "next";
import AuthProvider from "../providers/AuthProvider";
import ReduxProvider from "../providers/ReduxProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <AuthProvider>
      <ReduxProvider>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </ReduxProvider>
    </AuthProvider>
  );
}
