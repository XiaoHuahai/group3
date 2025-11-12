import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SPEED Evidence Hub",
  description: "Software Practice Empirical Evidence Database"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-primary">SPEED</h1>
            <nav className="flex items-center gap-4 text-sm">
              <a className="hover:text-primary" href="/">
                Search
              </a>
              <a className="hover:text-primary" href="/auth">
                Sign In / Register
              </a>
              <a className="hover:text-primary" href="/dashboard">
                Dashboard
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-6 py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white text-sm text-slate-500">
          <div className="mx-auto max-w-6xl px-6 py-4">© {new Date().getFullYear()} SPEED · Software Practice Empirical Evidence Database</div>
        </footer>
      </body>
    </html>
  );
}

