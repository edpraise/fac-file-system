import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";
import { SearchProvider } from "@/components/providers/SearchProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FORUM OF STATE COMMISSIONERS FOR FINANCE OF NIGERIA | GovDrive",
  description: "Secure financial file management and collaboration portal for State Commissioners of Finance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <SearchProvider>
            <ToasterProvider />
            {children}
          </SearchProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
