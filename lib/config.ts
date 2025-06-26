/**
 * SBsalon Configuration
 * Customize these settings to change the appearance and behavior of the salon booking system
 */

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
}

export interface DashboardConfig {
  name: string;
  description: string;
  logoUrl: string;
  favicon: string;
  repositoryUrl: string;
  backendUrl: string;
  api: {
    baseUrl: string;
    debugMode: boolean;
  };
  blog: {
    enabled: boolean;
    name: string;
  };
}

export const dashboardConfig: DashboardConfig = {
  name: "SBsalon",
  description: "Premium beauty salon and barber services",
  repositoryUrl: "https://github.com/asbilim/sbsalon-new.git",
  logoUrl: "/logo.svg",
  favicon: "/favicon.ico",
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000",
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/admin",
    debugMode: process.env.NODE_ENV === "development",
  },
  blog: {
    enabled: true,
    name: "Beauty Blog",
  },
};
