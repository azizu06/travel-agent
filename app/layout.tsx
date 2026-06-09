import "./globals.css";
import { Carter_One, Roboto_Slab } from "next/font/google";
import type { Metadata } from "next";

const carterOne = Carter_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-carter-one",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
  title: "PopChoice",
  description: "Movie recommendations for groups powered by semantic search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${carterOne.variable} ${robotoSlab.variable}`}>
        {children}
      </body>
    </html>
  );
}
