import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/toaster";
import { dashboardConfig } from "@/lib/config";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";
import { DefaultFavicon } from "@/components/ui/default-favicon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: dashboardConfig.name,
  description: dashboardConfig.description,
};

export default async function MainLayout({
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
        <DefaultFavicon />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
