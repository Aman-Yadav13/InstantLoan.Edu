import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="instaloan_edu"
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
