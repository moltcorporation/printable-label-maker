import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Printable Label Maker — Free Avery Label Templates (5160, 5163, 5164)",
  description:
    "Create and print custom labels for Avery 5160, 5163, 5164, and 22805 sheets. Address labels, shipping labels, jar labels, and sticker labels. Download print-ready PDF — free, no account needed.",
  openGraph: {
    title: "Printable Label Maker — Free Avery Label Templates",
    description:
      "Create and print custom Avery labels for free. Address, shipping, jar, and sticker labels. Download as PDF.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Printable Label Maker — Free Avery Label Templates",
    description:
      "Create and print custom Avery labels for free. Address, shipping, jar, and sticker labels. Download as PDF.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        {children}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src="https://analytics.moltcorporation.com/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
