import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Teck 4x4 - Plataforma de Cursos Nielsen",
    template: "%s | Teck 4x4",
  },
  description: "Plataforma educativa de cursos Nielsen con certificaciones. Aprende y obtén tu certificado en cursos especializados.",
  keywords: ["cursos", "educación", "certificaciones", "Nielsen", "Teck 4x4", "capacitación", "formación"],
  authors: [{ name: "Nielsen" }],
  creator: "Nielsen",
  publisher: "Nielsen",
  metadataBase: new URL("https://cursosnielsen.com.ar"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://cursosnielsen.com.ar",
    title: "Teck 4x4 - Plataforma de Cursos Nielsen",
    description: "Plataforma educativa de cursos Nielsen con certificaciones. Aprende y obtén tu certificado en cursos especializados.",
    siteName: "Teck 4x4",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Teck 4x4 - Plataforma de Cursos Nielsen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teck 4x4 - Plataforma de Cursos Nielsen",
    description: "Plataforma educativa de cursos Nielsen con certificaciones. Aprende y obtén tu certificado en cursos especializados.",
    images: ["/og-image.png"],
    creator: "@nielsen",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1d2e" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-secondary/30 min-h-screen flex flex-col`}
      >
        <div className="flex-1 p-2 sm:p-4 lg:p-6 transition-all duration-300">
          <div className="mx-auto max-w-[1920px] bg-background rounded-3xl shadow-xl overflow-hidden min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)] border border-border/40 relative flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
