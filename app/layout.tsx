import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meridian — journeys, composed",
  description:
    "Enter a location and dates to get a shareable trip page with flights, hotels, activities, and real weather.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${jakarta.variable} ${fraunces.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
