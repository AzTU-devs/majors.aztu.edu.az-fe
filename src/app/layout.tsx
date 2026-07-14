import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import ThemeProvider from "@/components/themeProvider/ThemeProvider";

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
    default: "AZTU — Təhsil Proqramları | Azerbaijan Technical University",
    template: "%s | AZTU",
  },
  description:
    "Azərbaycan Texniki Universitetinin bakalavr və magistr ixtisasları, fakültələr, kafedralar, sillabuslar və təlim nəticələri — hamısı bir yerdə.",
  keywords: ["AZTU", "Azerbaijan Technical University", "ixtisaslar", "təhsil proqramları", "bakalavr", "magistr", "fakültələr"],
  // Favicon comes from src/app/icon.png (the new AZTU dark logo).
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}