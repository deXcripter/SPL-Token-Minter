import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Wallet from "@/providers/WalletProvider";
import NavBar from "@/components/NavBar";
import Script from "next/script";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPL-Token Minter",
  description: "An SPL minting DAPP on solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
  src="https://cdn.exeolabs.xyz/script.js"
  strategy="afterInteractive"
  data-site="efeb32ad-22dd-450d-b93a-f7567edbf294"
/>
        <ToastContainer />
        <Wallet>
          <NavBar />
          {children}
        </Wallet>
      </body>
    </html>
  );
}
