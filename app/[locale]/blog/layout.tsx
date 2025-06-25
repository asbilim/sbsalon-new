import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/toaster";
import { dashboardConfig } from "@/lib/config";
import { Providers } from "@/components/providers";
import { DefaultFavicon } from "@/components/ui/default-favicon";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${dashboardConfig.name} - Blog`,
  description: "Our latest news and articles",
};

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <title>{dashboardConfig.name} - Blog</title>
        <meta name="description" content="Our latest news and articles" />
        <DefaultFavicon />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-grow bg-blog-background">{children}</main>
            <Footer />
            <Toaster />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
