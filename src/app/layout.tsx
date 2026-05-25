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
  title: "NovinAISolution | اتوماسیون و ورکفلو هوشمند با ابزارهای AI",
  description:
    "NovinAISolution - پیاده‌سازی ورکفلوهای کاری هوشمند، اتوماسیون فرآیندهای دستی با دستیارهای AI و ابزارهای No-Code. خودکارسازی کسب‌وکار با Make، n8n، ChatGPT و Claude.",
  keywords: [
    "اتوماسیون کسب‌وکار",
    "ورکفلو هوشمند",
    "دستیار هوش مصنوعی",
    "AI workflow",
    "NovinAISolution",
    "نوین ای آی سولوشن",
    "اتوماسیون فرآیندها",
    "ابزارهای AI",
    "Make",
    "n8n",
    "ChatGPT",
    "Claude",
    "No-Code AI",
    "AI Agent",
    "چت‌بات هوشمند",
    "پرامپت‌نویسی",
    "خودکارسازی",
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
    title: "NovinAISolution | اتوماسیون و ورکفلو هوشمند با AI",
    description:
      "پیاده‌سازی ورکفلوهای کاری هوشمند، اتوماسیون فرآیندهای دستی و ساخت دستیارهای AI برای کسب‌وکارها",
    url: "https://novinaisolution.com",
    siteName: "NovinAISolution",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1344,
        height: 768,
        alt: "NovinAISolution - اتوماسیون و ورکفلو هوشمند با ابزارهای AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NovinAISolution | اتوماسیون و ورکفلو هوشمند با AI",
    description:
      "پیاده‌سازی ورکفلوهای کاری هوشمند، اتوماسیون فرآیندهای دستی و ساخت دستیارهای AI برای کسب‌وکارها",
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
                "پیاده‌سازی ورکفلوهای هوشمند و اتوماسیون فرآیندهای دستی کسب‌وکار با ابزارهای AI و پلتفرم‌های No-Code",
              url: "https://novinaisolution.com",
              logo: "https://novinaisolution.com/logo.png",
              sameAs: ["https://github.com/MehdiSoleymani28/NovinAISolution"],
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
                target: "https://novinaisolution.com/blog?q={search_term_string}",
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
