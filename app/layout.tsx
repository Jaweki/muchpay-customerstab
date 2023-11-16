import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Muchpay-Customers tab",
  description:
    "Pay for your food with ease. Say good bye to long queues waiting to get a receipt. This system gets you a receipt of the meal you order within 30 seconds. Enjoy the in time update of meals on the menu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
