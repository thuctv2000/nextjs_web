import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono, Archivo, DM_Mono, Literata } from "next/font/google";
import { AppProvider } from "@/presentation/providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500"],
});

// Portfolio landing page (design DNA: oryzo.ai) — namespaced so it doesn't
// override the fonts used by the auth / lixi / face-filter routes above.
const archivo = Archivo({
  variable: "--font-pf-display",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-pf-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-pf-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Tran Van Thuc — Mobile Developer",
  description:
    "Flutter & React Native developer with 3 years of experience shipping cross-platform and native mobile apps. Based in Ho Chi Minh City.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable} ${archivo.variable} ${dmMono.variable} ${literata.variable} antialiased min-h-screen overflow-x-hidden`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
