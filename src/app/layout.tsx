import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const aeonik = localFont({
  src: [
    {
      path: "../../public/fonts/aeoniktrial-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/aeoniktrial-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-aeonik",
});

const trobika = localFont({
  src: "../../public/fonts/Trobika-Regular.otf",
  variable: "--font-trobika",
});

export const metadata: Metadata = {
  title: "Kazi Nowshad Abir | Web Designer",
  description: "Web Designer based in Dhaka, Bangladesh",
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${aeonik.variable} ${trobika.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
