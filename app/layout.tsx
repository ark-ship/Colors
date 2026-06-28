import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Onchain Color",
  description: "Just color. Fully onchain.",
  keywords: ["NFT", "Mint", "Ethereum", "Onchain Color", "Crypto Art"],
  icons: {
    icon: "/Logo_with_BG.png",       // Sets the standard favicon
    apple: "/Logo_with_BG.png",      // Optional: Sets the icon for iOS home screen bookmarks
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-neutral-950">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}