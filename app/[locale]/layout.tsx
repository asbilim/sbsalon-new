import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

/**
 * This is a minimal root layout that allows route groups to completely
 * define their own layouts independently. Each route group ((main), (auth), etc.)
 * will have its own independent layout with its own <html> and <body> tags.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
