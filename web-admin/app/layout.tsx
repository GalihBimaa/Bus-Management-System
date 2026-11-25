import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nusantara Hijau — Sistem Keberangkatan Bus",
  description: "Aplikasi manajemen keberangkatan bus, kursi, GPS, manifest, dan bagasi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full">
      <body
        className={`${jakarta.className} min-h-full flex flex-col bg-slate-50 text-slate-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
