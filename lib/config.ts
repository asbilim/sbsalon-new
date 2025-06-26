/**
 * SBsalon Configuration
 * Premium Beauty Salon and Spa Experience
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
  brand: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
    };
  };
}

export const dashboardConfig: DashboardConfig = {
  name: "SBsalon",
  description: "Luxury beauty salon and premium styling services",
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
    name: "Beauty & Style Journal",
  },
  brand: {
    colors: {
      primary: "#D4AF37", // Gold
      secondary: "#9F8E45", // Darker gold
      background: "#121212", // Rich black
      text: "#F5F5F5", // Off-white
      accent: "#E8D282", // Light gold
    },
    typography: {
      headingFont: "Playfair Display, serif",
      bodyFont: "Inter, sans-serif",
    },
  },
};
