"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { api } from "@/lib/api";
import { Service } from "@/types/salon";
import { getLocalizedFields } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing/navigation";
import {
  AlertCircle,
  Scissors,
  Sparkles,
  Clock,
  Star,
  Heart,
  Droplet,
  ArrowRight,
} from "lucide-react";

const categoryIcons: { [key: string]: React.ReactNode } = {
  Hair: <Scissors className="h-6 w-6" />,
  "Skin Care": <Sparkles className="h-6 w-6" />,
  Nails: <Star className="h-6 w-6" />,
  Massage: <Heart className="h-6 w-6" />,
  Waxing: <Droplet className="h-6 w-6" />,
  Makeup: <Clock className="h-6 w-6" />,
};

interface GroupedService {
  categoryName: string;
  services: Service[];
}

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");
  const locale = useLocale();
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const {
    data: servicesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services", locale, "all"],
    queryFn: () => api.getServices(locale, { ordering: "category,id" }),
  });

  const groupedServices = servicesData?.results.reduce(
    (acc: GroupedService[], service: Service) => {
      const { category_name } = service;
      const { name: localizedCategoryName } = getLocalizedFields(
        service.category_details,
        locale
      );

      let group = acc.find((g) => g.categoryName === localizedCategoryName);
      if (!group) {
        group = { categoryName: localizedCategoryName, services: [] };
        acc.push(group);
      }
      group.services.push(service);
      return acc;
    },
    []
  );

  useEffect(() => {
    if (groupedServices && groupedServices.length > 0 && !activeCategory) {
      setActiveCategory(groupedServices[0].categoryName);
    }
  }, [groupedServices, activeCategory]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    if (mainContainerRef.current) {
      const triggers = ScrollTrigger.batch(".service-category-section", {
        onEnter: (batch) => {
          const id = batch[0].getAttribute("id");
          if (id) {
            setActiveCategory(id.replace("category-", ""));
          }
        },
        onEnterBack: (batch) => {
          const id = batch[0].getAttribute("id");
          if (id) {
            setActiveCategory(id.replace("category-", ""));
          }
        },
        start: "top 50%",
        end: "bottom 50%",
      });

      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    }
  }, [groupedServices]);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    gsap.to(window, {
      scrollTo: {
        y: `#category-${categoryName}`,
        offsetY: 100,
      },
      duration: 1,
      ease: "power3.inOut",
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-12">
              <Skeleton className="h-10 w-1/3 mb-8" />
              <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 col-span-1 md:col-span-3">
          <AlertCircle className="h-12 w-12 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">{t("error.title")}</h3>
          <p>{t("error.message")}</p>
        </div>
      );
    }

    if (!groupedServices || groupedServices.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-xl border col-span-1 md:col-span-3">
          <Scissors className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-2xl font-semibold mb-2">{t("empty.title")}</h3>
          <p className="text-muted-foreground">{t("empty.message")}</p>
        </div>
      );
    }

    return (
      <div className="w-full space-y-16">
        {groupedServices.map((group) => (
          <motion.section
            key={group.categoryName}
            id={`category-${group.categoryName}`}
            className="service-category-section"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold mb-8 font-mono tracking-tight text-primary">
              {group.categoryName}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {group.services.map((service, i) => {
                const { name, description } = getLocalizedFields(
                  service,
                  locale
                );
                return (
                  <motion.div
                    key={service.id}
                    className="bg-card border rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}>
                    <div className="p-8">
                      <h3 className="text-2xl font-semibold mb-3">{name}</h3>
                      <p className="text-muted-foreground mb-4 min-h-[70px]">
                        {description}
                      </p>
                      <div className="flex justify-between items-center mt-6">
                        <span className="text-2xl font-mono font-semibold text-primary">
                          ${service.base_price}
                        </span>
                        <Button asChild variant="outline">
                          <Link href={`/booking?service=${service.id}`}>
                            {t("bookNow")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <motion.div
                      className="h-1 bg-primary/20 w-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <div
          className="flex flex-col md:flex-row gap-16"
          ref={mainContainerRef}>
          <aside className="md:w-1/4 md:sticky top-24 self-start">
            <nav className="space-y-2">
              <h3 className="font-semibold text-lg mb-4 px-4">
                {t("categories")}
              </h3>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              {groupedServices?.map((group) => (
                <motion.button
                  key={group.categoryName}
                  onClick={() => handleCategoryClick(group.categoryName)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-3 ${
                    activeCategory === group.categoryName
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}>
                  {categoryIcons[group.services[0].category_name] || (
                    <Scissors className="h-6 w-6" />
                  )}
                  <span className="font-medium">{group.categoryName}</span>
                </motion.button>
              ))}
            </nav>
          </aside>
          <main className="md:w-3/4">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}
