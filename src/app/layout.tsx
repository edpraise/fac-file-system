import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";
import { SearchProvider } from "@/components/providers/SearchProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FORUM OF STATE COMMISSIONERS FOR FINANCE OF NIGERIA | FSCFN",
  description: "Secure financial file management and collaboration portal for State Commissioners of Finance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <NextAuthProvider>
          <ThemeProvider>
            <SearchProvider>
              <ToasterProvider />
              {children}
            </SearchProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
