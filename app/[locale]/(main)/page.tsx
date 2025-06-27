"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Calendar,
  Clock,
  Scissors,
  Sparkles,
  Star,
  Users,
  Heart,
  Droplet,
  Feather,
  AlertCircle,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocalizedFields } from "@/lib/utils";
import { Price } from "@/components/price";

const serviceIcons = [
  <Scissors className="h-7 w-7" />,
  <Sparkles className="h-7 w-7" />,
  <Clock className="h-7 w-7" />,
  <Star className="h-7 w-7" />,
  <Heart className="h-7 w-7" />,
  <Droplet className="h-7 w-7" />,
];

export default function HomePage() {
  const t = useTranslations("HomePage");
  const { data: session } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const headerRef = useRef(null);
  const servicesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const galleryRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const locale = useLocale();

  const {
    data: servicesData,
    isLoading: isLoadingServices,
    isError: isErrorServices,
  } = useQuery({
    queryKey: ["services", locale],
    queryFn: () => api.getServices(locale, { ordering: "id" }),
  });

  const services = servicesData?.results || [];

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    setIsLoaded(true);
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!isLoaded) return;

    // Hero section animation
    gsap.fromTo(
      ".hero-svg path",
      { strokeDasharray: 100, strokeDashoffset: 100, opacity: 0 },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power3.inOut",
        stagger: 0.15,
      }
    );

    gsap.fromTo(
      ".hero-svg circle",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, delay: 0.5, ease: "back.out(1.7)" }
    );

    // Beauty elements animation
    gsap.fromTo(
      ".beauty-element",
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        delay: 0.8,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)",
      }
    );

    // Services Section
    ScrollTrigger.create({
      trigger: servicesRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          ".service-card",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: "power3.out" }
        );
      },
    });

    // Testimonials
    ScrollTrigger.create({
      trigger: testimonialsRef.current,
      start: "top 75%",
      onEnter: () => {
        gsap.fromTo(
          ".testimonial-item",
          { scale: 0.9, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.3,
            ease: "power2.out",
          }
        );
      },
    });

    // Gallery
    ScrollTrigger.create({
      trigger: galleryRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.fromTo(
          ".gallery-item",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power1.out" }
        );
      },
    });

    // Stats
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          ".stat-item",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: "power1.out" }
        );

        // Animate numbers
        const counters = document.querySelectorAll(".stat-number");
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute("data-target") || "0");
          gsap.fromTo(
            counter,
            { innerText: 0 },
            {
              innerText: target,
              duration: 2,
              ease: "power2.out",
              snap: { innerText: 1 },
            }
          );
        });
      },
    });

    // CTA
    ScrollTrigger.create({
      trigger: ctaRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          ".cta-content",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
      },
    });
  }, [isLoaded]);

  // Parallax effect using Framer Motion
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Testimonials data
  const testimonials = [
    {
      text: t("testimonials.first.text"),
      author: t("testimonials.first.author"),
      role: t("testimonials.first.role"),
    },
    {
      text: t("testimonials.second.text"),
      author: t("testimonials.second.author"),
      role: t("testimonials.second.role"),
    },
    {
      text: t("testimonials.third.text"),
      author: t("testimonials.third.author"),
      role: t("testimonials.third.role"),
    },
  ];

  // Gallery images
  const gallery = [
    "/gallery/salon1.jpg",
    "/gallery/salon2.jpg",
    "/gallery/salon3.jpg",
    "/gallery/salon4.jpg",
    "/gallery/salon5.jpg",
    "/gallery/salon6.jpg",
  ];

  // Stats
  const stats = [
    { value: 5000, label: t("stats.clients") },
    { value: 15, label: t("stats.stylists") },
    { value: 8, label: t("stats.years") },
    { value: 20, label: t("stats.awards") },
  ];

  return (
    <>
      {/* Hero Section */}
      <motion.section
        ref={headerRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-primary/5 pt-16">
        <div className="container max-w-6xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left z-10">
            <h1 className="font-mono text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t("hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              {t("hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="text-lg font-medium px-6 py-6 bg-primary hover:bg-primary/90 relative overflow-hidden group">
                <Link href="/booking">
                  <span className="relative z-10 flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    {t("hero.bookButton")}
                  </span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="text-lg font-medium px-6 py-6 relative overflow-hidden group">
                <Link href="#services">
                  <span className="relative z-10">
                    {t("hero.servicesButton")}
                  </span>
                  <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-md"></span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            {/* Beauty Salon SVG illustration */}
            <svg
              className="hero-svg w-full max-w-lg mx-auto"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg">
              {/* Main salon chair outline */}
              <path
                d="M160 280 C160 240 240 240 240 280 L240 320 C240 330 160 330 160 320 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary/50"
                strokeLinecap="round"
              />

              {/* Chair back */}
              <path
                d="M160 280 C160 230 180 170 200 120 C220 170 240 230 240 280"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary/60"
                strokeLinecap="round"
              />

              {/* Chair base */}
              <path
                d="M190 320 L190 350 L210 350 L210 320"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary/70"
                strokeLinecap="round"
              />

              {/* Mirror frame */}
              <rect
                x="120"
                y="50"
                width="160"
                height="200"
                rx="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-primary/30"
              />

              {/* Mirror reflection */}
              <rect
                x="130"
                y="60"
                width="140"
                height="180"
                rx="2"
                fill="currentColor"
                className="text-primary/10"
              />

              {/* Beauty elements */}
              {/* Scissors */}
              <g className="beauty-element">
                <path
                  d="M85 150 Q 95 160 85 170 M85 150 Q 75 160 85 170"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary"
                  strokeLinecap="round"
                />
                <circle
                  cx="85"
                  cy="150"
                  r="5"
                  fill="currentColor"
                  className="text-primary"
                />
                <circle
                  cx="85"
                  cy="170"
                  r="5"
                  fill="currentColor"
                  className="text-primary"
                />
              </g>

              {/* Comb */}
              <g className="beauty-element">
                <path
                  d="M310 150 L330 150 M310 160 L330 160"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-primary"
                  strokeLinecap="round"
                />
                <path
                  d="M310 140 L330 140 L330 170 L310 170 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                />
                <path
                  d="M330 140 L340 135 L340 175 L330 170"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                />
              </g>

              {/* Perfume bottle */}
              <g className="beauty-element">
                <rect
                  x="290"
                  y="220"
                  width="30"
                  height="40"
                  rx="2"
                  fill="currentColor"
                  className="text-primary/40"
                />
                <rect
                  x="295"
                  y="210"
                  width="20"
                  height="10"
                  rx="2"
                  fill="currentColor"
                  className="text-primary/60"
                />
                <circle
                  cx="305"
                  cy="210"
                  r="5"
                  fill="currentColor"
                  className="text-primary/80"
                />
              </g>

              {/* Hair dryer */}
              <g className="beauty-element">
                <path
                  d="M80 220 C80 210 90 205 100 210 L120 220 C130 225 130 235 120 240 L100 250 C90 255 80 250 80 240 Z"
                  fill="currentColor"
                  className="text-primary/50"
                />
                <path
                  d="M80 230 L60 240"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-primary/70"
                  strokeLinecap="round"
                />
              </g>

              {/* Droplets animation */}
              <g className="beauty-element">
                <circle
                  cx="100"
                  cy="100"
                  r="3"
                  fill="currentColor"
                  className="text-primary/80"
                />
                <circle
                  cx="110"
                  cy="85"
                  r="2"
                  fill="currentColor"
                  className="text-primary/80"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="2.5"
                  fill="currentColor"
                  className="text-primary/80"
                />
                <circle
                  cx="300"
                  cy="100"
                  r="3"
                  fill="currentColor"
                  className="text-primary/80"
                />
                <circle
                  cx="290"
                  cy="85"
                  r="2"
                  fill="currentColor"
                  className="text-primary/80"
                />
                <circle
                  cx="310"
                  cy="90"
                  r="2.5"
                  fill="currentColor"
                  className="text-primary/80"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Decorative floating elements */}
        <motion.div
          className="absolute top-[20%] left-[10%] h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}>
          <Droplet className="h-8 w-8 text-primary/60" />
        </motion.div>

        <motion.div
          className="absolute top-[60%] right-[15%] h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}>
          <Sparkles className="h-6 w-6 text-primary/80" />
        </motion.div>

        <motion.div
          className="absolute bottom-[20%] left-[20%] h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center"
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}>
          <Heart className="h-5 w-5 text-primary/70" />
        </motion.div>

        <motion.div
          className="absolute bottom-[30%] right-[25%] h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.5,
          }}>
          <Feather className="h-4 w-4 text-primary/70" />
        </motion.div>
      </motion.section>

      {/* Services Section */}
      <section
        id="services"
        ref={servicesRef}
        className="py-24 bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/5"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-primary/5"></div>

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {t("services.title")}
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              {t("services.subtitle")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isLoadingServices &&
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-8 bg-card border rounded-xl shadow-sm">
                  <Skeleton className="h-16 w-16 rounded-2xl mb-4" />
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              ))}

            {isErrorServices && (
              <div className="md:col-span-2 flex flex-col items-center justify-center text-center p-8 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
                <AlertCircle className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">
                  {t("services.error.title")}
                </h3>
                <p>{t("services.error.message")}</p>
              </div>
            )}

            {!isLoadingServices &&
              !isErrorServices &&
              services.length === 0 && (
                <div className="md:col-span-2 flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-xl border">
                  <Scissors className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">
                    {t("services.empty.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("services.empty.message")}
                  </p>
                </div>
              )}

            {!isLoadingServices &&
              !isErrorServices &&
              services.slice(0, 4).map((service, i) => {
                const { name, description } = getLocalizedFields(
                  service,
                  locale
                );
                return (
                  <motion.div
                    key={service.id}
                    className="service-card p-8 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                    {/* Background decoration */}
                    <div className="absolute -right-10 -top-10 w-20 h-20 rounded-full bg-primary/5 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute -left-10 -bottom-10 w-20 h-20 rounded-full bg-primary/5 group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-4 relative z-10 overflow-hidden group-hover:bg-primary/20 transition-colors duration-300">
                      <motion.div
                        initial={{ rotate: 0 }}
                        whileHover={{ rotate: 10 }}
                        transition={{ duration: 0.3 }}>
                        {serviceIcons[i % serviceIcons.length]}
                      </motion.div>

                      {/* Animated glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-primary/20 rounded-2xl opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.5, opacity: 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-2xl font-semibold mb-2">{name}</h3>
                      <p className="text-muted-foreground mb-4">
                        {description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-mono font-semibold text-primary">
                          <Price amount={service.base_price} />
                        </span>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="relative overflow-hidden group/btn">
                          <Link href={`/booking?service=${service.id}`}>
                            <span className="relative z-10">
                              {t("services.bookNow")}
                            </span>
                            <span className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300 rounded-md"></span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          <div className="mt-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}>
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden group">
                <Link href="/services">
                  <span className="relative z-10 flex items-center">
                    {t("services.viewAllButton")}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={testimonialsRef}
        className="py-24 bg-primary/5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>

        {/* Animated decorative elements */}
        <motion.div
          className="absolute top-20 right-[10%] h-40 w-40 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute bottom-20 left-[10%] h-60 w-60 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {t("testimonials.title")}
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              {t("testimonials.subtitle")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                className="testimonial-item p-8 bg-card border rounded-xl shadow-sm relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 },
                }}>
                {/* Decorative quote mark in the background */}
                <div className="absolute -right-4 -top-4 text-8xl text-primary/5 font-serif">
                  "
                </div>

                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ opacity: 0, rotate: 0 }}
                  whileHover={{ opacity: 1, rotate: 6 }}
                  transition={{ duration: 1 }}
                />

                <div className="relative z-10">
                  <div className="mb-4 text-primary flex">
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: i * 0.2 + j * 0.1,
                          }}>
                          <Star className="h-5 w-5 fill-current mr-1" />
                        </motion.div>
                      ))}
                  </div>
                  <p className="text-lg mb-6 italic relative">
                    <span className="relative z-10">"{testimonial.text}"</span>
                  </p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary relative overflow-hidden group-hover:bg-primary/30 transition-colors duration-300">
                      <motion.span
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}>
                        {testimonial.author.charAt(0)}
                      </motion.span>

                      {/* Circle pulse animation on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{
                          scale: 1.5,
                          opacity: 0,
                          transition: { repeat: Infinity, duration: 1.2 },
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section
        ref={galleryRef}
        className="py-24 bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-[5%] w-32 h-32 rounded-full bg-primary/5 blur-xl"></div>
        <div className="absolute bottom-20 left-[5%] w-32 h-32 rounded-full bg-primary/5 blur-xl"></div>

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {t("gallery.title")}
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              {t("gallery.subtitle")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((image, i) => (
              <motion.div
                key={i}
                className="gallery-item aspect-square relative overflow-hidden rounded-xl border border-primary/10 shadow-sm group"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 },
                }}>
                {/* Beauty service image placeholder with icon */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center">
                  {i % 3 === 0 && (
                    <Scissors className="h-12 w-12 text-primary/30 mb-3 group-hover:text-primary/60 transition-colors duration-300" />
                  )}
                  {i % 3 === 1 && (
                    <Sparkles className="h-12 w-12 text-primary/30 mb-3 group-hover:text-primary/60 transition-colors duration-300" />
                  )}
                  {i % 3 === 2 && (
                    <Heart className="h-12 w-12 text-primary/30 mb-3 group-hover:text-primary/60 transition-colors duration-300" />
                  )}
                  <span className="text-primary/50 font-medium text-lg group-hover:text-primary/80 transition-colors duration-300">
                    {t("gallery.itemText")}
                  </span>
                </div>

                {/* Hover overlay with animated border */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                  <div className="absolute inset-4 border-2 border-primary/30 rounded-lg">
                    <motion.div
                      className="absolute top-0 left-0 h-full w-1 bg-primary/40"
                      initial={{ height: 0 }}
                      whileHover={{ height: "100%" }}
                      transition={{ duration: 0.3, delay: 0 }}
                    />
                    <motion.div
                      className="absolute top-0 left-0 h-1 w-full bg-primary/40"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                    <motion.div
                      className="absolute top-0 right-0 h-full w-1 bg-primary/40"
                      initial={{ height: 0 }}
                      whileHover={{ height: "100%" }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 w-full bg-primary/40"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="relative overflow-hidden group">
              <Link href="/gallery">
                <span className="relative z-10 flex items-center">
                  {t("gallery.viewMoreButton") || "View More"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-md"></span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats section */}
      <section
        ref={statsRef}
        className="py-24 bg-primary/5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>

        {/* Animated decorative elements */}
        <motion.div
          className="absolute top-[30%] left-[5%] h-32 w-32 rounded-full bg-primary/10 blur-xl"
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute bottom-[30%] right-[5%] h-40 w-40 rounded-full bg-primary/10 blur-xl"
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}>
            <h2 className="text-4xl md:text-5xl font-bold font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-4">
              {t("stats.title") || "Our Impact"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("stats.subtitle") ||
                "The numbers that define our passion for beauty"}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="stat-item text-center bg-card p-8 rounded-xl border shadow-sm relative overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 },
                }}>
                {/* Decorative background elements */}
                <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-primary/5 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -left-6 -bottom-6 w-12 h-12 rounded-full bg-primary/5 group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative z-10">
                  <motion.h3
                    className="stat-number text-4xl md:text-5xl font-bold font-mono text-primary mb-2"
                    data-target={stat.value}
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}>
                    0
                  </motion.h3>
                  <motion.p
                    className="text-xl text-muted-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}>
                    {stat.label}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="py-24 bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('/beauty-pattern.svg')] bg-repeat opacity-5"></div>

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            className="cta-content rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}>
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary to-primary/80"></div>

            {/* Animated decorative elements */}
            <motion.div
              className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white opacity-10 blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, -10, 0],
                y: [0, 10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            <motion.div
              className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white opacity-10 blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
            />

            <div className="relative z-10">
              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground font-mono"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                {t("cta.title")}
              </motion.h2>
              <motion.p
                className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}>
                {t("cta.description")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="text-lg font-medium px-8 py-6 relative overflow-hidden group">
                  <Link href="/booking">
                    <span className="relative z-10 flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      {t("cta.button")}
                    </span>
                    <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></span>
                  </Link>
                </Button>
              </motion.div>

              {/* Beauty services icons */}
              <div className="flex justify-center mt-10 space-x-6">
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}>
                  <Scissors className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}>
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}>
                  <Heart className="h-6 w-6 text-white" />
                </motion.div>
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}>
                  <Droplet className="h-6 w-6 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
