import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SPEED Evidence Hub",
  description: "Software Practice Empirical Evidence Database"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Header />
        <main className="mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-6 py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white text-sm text-slate-500">
          <div className="mx-auto max-w-6xl px-6 py-4">© {new Date().getFullYear()} SPEED · Software Practice Empirical Evidence Database</div>
        </footer>
      </body>
    </html>
  );
}

