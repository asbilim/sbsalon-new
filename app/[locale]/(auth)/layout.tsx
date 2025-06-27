import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/toaster";
import { dashboardConfig } from "@/lib/config";
import { Providers } from "@/components/providers";
import { Metadata } from "next";
import { DefaultFavicon } from "@/components/ui/default-favicon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${dashboardConfig.name} - Authentication`,
  description: dashboardConfig.description,
};

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <DefaultFavicon />
      </head>
      <body className={`${inter.className} min-h-screen bg-auth-background`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-b from-background to-secondary/5">
              <div className="w-full max-w-md">{children}</div>
            </div>
            <Toaster />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
