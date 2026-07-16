import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { GTM_ID } from "@/lib/gtm";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Pendik Escort",
  description:
    "Pendik escort ilanları, güncel profiller ve detaylı bilgiler tek platformda. Kolay filtreleme ile aradığınız ilanlara hızlı erişim sağlayın.",
  keywords: ["Pendik", "Escort", "Escort listesi", "iletişim"],
  openGraph: {
    title: "Pendik Escort",
    description:
      "Pendik escort ilanları, güncel profiller ve detaylı bilgiler tek platformda. Kolay filtreleme ile aradığınız ilanlara hızlı erişim sağlayın.",
    url: siteUrl,
    siteName: "Pendik Escort",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/icon.jpg", width: 1023, height: 916 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pendik Escort",
    description:
      "Pendik escort ilanları, güncel profiller ve detaylı bilgiler tek platformda. Kolay filtreleme ile aradığınız ilanlara hızlı erişim sağlayın.",
    images: ["/icon.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "AgfmUTrd-jTelNJAnQ9Y75HOquKMmGHly63zFV97wTU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
