import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://novinaisolution.com"),
  title: "NovinAISolution | مشاوره و خدمات هوش مصنوعی برای کسب‌وکار",
  description:
    "NovinAISolution - ارائه‌دهنده خدمات مشاوره هوش مصنوعی، ایجاد زیرساخت AI برای کسب‌وکارها، آموزش و ابزارهای هوش مصنوعی. تحول دیجیتال کسب‌وکار شما با هوش مصنوعی.",
  keywords: [
    "هوش مصنوعی",
    "مشاوره هوش مصنوعی",
    "AI consulting",
    "NovinAISolution",
    "نوین ای آی سولوشن",
    "زیرساخت هوش مصنوعی",
    "آموزش هوش مصنوعی",
    "ابزارهای AI",
    "تحول دیجیتال",
    "machine learning",
    "deep learning",
    "اتوماسیون هوشمند",
    "کسب‌وکار هوشمند",
  ],
  authors: [{ name: "NovinAISolution" }],
  creator: "NovinAISolution",
  publisher: "NovinAISolution",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "NovinAISolution | مشاوره و خدمات هوش مصنوعی",
    description:
      "ارائه‌دهنده خدمات مشاوره هوش مصنوعی، ایجاد زیرساخت AI و آموزش برای کسب‌وکارها",
    url: "https://novinaisolution.com",
    siteName: "NovinAISolution",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1344,
        height: 768,
        alt: "NovinAISolution - مشاوره و خدمات هوش مصنوعی",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NovinAISolution | مشاوره و خدمات هوش مصنوعی",
    description:
      "ارائه‌دهنده خدمات مشاوره هوش مصنوعی، ایجاد زیرساخت AI و آموزش برای کسب‌وکارها",
  },
  alternates: {
    canonical: "https://novinaisolution.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NovinAISolution",
              description:
                "ارائه‌دهنده خدمات مشاوره هوش مصنوعی و ایجاد زیرساخت AI برای کسب‌وکارها",
              url: "https://novinaisolution.com",
              logo: "https://novinaisolution.com/logo.png",
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["Persian", "English"],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "NovinAISolution",
              url: "https://novinaisolution.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://novinaisolution.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
