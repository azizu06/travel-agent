import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Travel Agent",
  description:
    "Enter a location and dates to get a shareable trip page with flights, hotels, activities, and real weather.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
