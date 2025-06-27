"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing/navigation";
import { DefaultLogo } from "@/components/ui/default-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Scissors,
  Star,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  const footerNavigation = {
    solutions: [
      { name: t("solutions.admin"), href: "#" },
      { name: t("solutions.analytics"), href: "#" },
      { name: t("solutions.commerce"), href: "#" },
      { name: t("solutions.insights"), href: "#" },
    ],
    support: [
      { name: t("support.docs"), href: "/blog" },
      { name: t("support.pricing"), href: "#" },
      { name: t("support.guides"), href: "#" },
      { name: t("support.api"), href: "#" },
    ],
    company: [
      { name: t("company.about"), href: "/about" },
      { name: t("company.blog"), href: "/blog" },
      { name: t("company.jobs"), href: "#" },
      { name: t("company.partners"), href: "#" },
    ],
    legal: [
      { name: t("legal.privacy"), href: "#" },
      { name: t("legal.terms"), href: "#" },
    ],
    social: [
      {
        name: "Instagram",
        href: "https://instagram.com",
        icon: (props: React.ComponentProps<typeof Instagram>) => (
          <Instagram {...props} />
        ),
      },
      {
        name: "Twitter",
        href: "https://twitter.com",
        icon: (props: React.ComponentProps<typeof Twitter>) => (
          <Twitter {...props} />
        ),
      },
      {
        name: "LinkedIn",
        href: "https://linkedin.com",
        icon: (props: React.ComponentProps<typeof Linkedin>) => (
          <Linkedin {...props} />
        ),
      },
      {
        name: "GitHub",
        href: "https://github.com",
        icon: (props: React.ComponentProps<typeof Github>) => (
          <Github {...props} />
        ),
      },
    ],
  };

  const goldAccentVariants = {
    initial: { width: 0 },
    animate: {
      width: "100%",
      transition: { duration: 1, ease: "easeInOut" as const },
    },
  };

  return (
    <footer className="relative bg-[#121212] text-white border-t border-[#D4AF37]/20 overflow-hidden">
      {/* Gold accent line at the top */}
      <div className="w-full h-[2px] bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20"></div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#D4AF37]/5 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-[#D4AF37]/5 blur-3xl"></div>

      {/* Gold scissors icon */}
      <div className="absolute right-8 top-16 opacity-5">
        <Scissors className="h-32 w-32 text-[#D4AF37]" strokeWidth={0.5} />
      </div>

      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-16 sm:py-20 lg:px-8 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 flex justify-center">
          <Link href="/" className="flex flex-col items-center">
            <DefaultLogo className="h-12 w-12" />
            <div className="relative mt-4">
              <span className="text-xl font-bold tracking-wider text-white">
                {t("siteName")}
              </span>
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="absolute -bottom-1 left-0 h-[1px] bg-[#D4AF37]"
                variants={goldAccentVariants}
              />
            </div>
          </Link>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}>
            <h3 className="text-sm uppercase font-semibold leading-6 text-[#D4AF37]">
              {t("categories.solutions")}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.solutions.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}>
            <h3 className="text-sm uppercase font-semibold leading-6 text-[#D4AF37]">
              {t("categories.support")}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}>
            <h3 className="text-sm uppercase font-semibold leading-6 text-[#D4AF37]">
              {t("categories.company")}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}>
            <h3 className="text-sm uppercase font-semibold leading-6 text-[#D4AF37]">
              {t("categories.legal")}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm uppercase font-semibold leading-6 text-[#D4AF37] mr-2">
                {t("categories.language")}
              </h3>
              <LanguageSwitcher />
            </div>
            <div className="mt-6">
              <h3 className="text-sm uppercase font-semibold leading-6 text-[#D4AF37]">
                {t("categories.followUs")}
              </h3>
              <div className="mt-4 flex space-x-4">
                {footerNavigation.social.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-[#D4AF37]"
                    target="_blank"
                    rel="noopener noreferrer">
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 border-t border-[#D4AF37]/20 pt-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center mb-4 space-x-2">
            <Star className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] uppercase text-xs tracking-widest font-light">
              Premium Beauty Services
            </span>
            <Star className="h-4 w-4 text-[#D4AF37]" />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center">
              <MapPin className="h-4 w-4 text-[#D4AF37] mr-2" />
              <span>Lütge Brückstraße 14, 44135 Dortmund</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center">
              <Phone className="h-4 w-4 text-[#D4AF37] mr-2" />
              <span>+49 231 22383351</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center">
              <Mail className="h-4 w-4 text-[#D4AF37] mr-2" />
              <span>info@sbsalon.com</span>
            </motion.div>
          </div>

          <p className="text-sm text-gray-500">
            &copy; {currentYear} {t("companyName")}. {t("allRightsReserved")}
          </p>
          <p className="mt-2 text-xs text-gray-600">
            {t("poweredBy")}{" "}
            <span className="font-medium text-[#D4AF37]">SBsalon</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
