import type { Metadata } from "next";
import { Urbanist } from 'next/font/google';

import "./globals.css";

export const metadata: Metadata = {
  title: "repol.ink: GitHub Repo Links",
  description: "Make custom urls for your GitHub Repositories",
  icons: {
    icon: '/favicon.png',
  }
};

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={urbanist.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
