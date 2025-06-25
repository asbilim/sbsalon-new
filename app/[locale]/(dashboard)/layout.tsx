import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/toaster";
import { dashboardConfig } from "@/lib/config";
import { Providers } from "@/components/providers";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${dashboardConfig.name} - Dashboard`,
  description: "Manage your account and settings",
};

export default async function DashboardRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-dashboard-background`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
} 