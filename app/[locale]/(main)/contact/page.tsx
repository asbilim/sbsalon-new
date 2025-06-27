"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  CheckCircle,
} from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: t("form.success.title"),
        description: t("form.success.description"),
      });

      setIsSuccess(true);
      reset();

      // Reset success state after a while
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("form.error.title"),
        description: t("form.error.description"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-12 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t("title")}
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="bg-card p-8 rounded-xl border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">{t("info.title")}</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      {t("info.address.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      Lütge Brückstraße 14
                      <br />
                      44135 Dortmund
                      <br />
                      Germany
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      {t("info.phone.title")}
                    </h3>
                    <p className="text-muted-foreground">+49 231 22383351</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      {t("info.email.title")}
                    </h3>
                    <p className="text-muted-foreground">info@sbsalon.com</p>
                    <p className="text-muted-foreground">booking@sbsalon.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full mr-4">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">
                      {t("info.hours.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("info.hours.weekdays")}
                    </p>
                    <p className="text-muted-foreground">
                      {t("info.hours.saturday")}
                    </p>
                    <p className="text-muted-foreground">
                      {t("info.hours.sunday")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-medium text-lg mb-3">
                  {t("info.social.title")}
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 p-2 rounded-full text-primary hover:bg-primary/20 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 p-2 rounded-full text-primary hover:bg-primary/20 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary/10 p-2 rounded-full text-primary hover:bg-primary/20 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-muted aspect-square rounded-xl overflow-hidden flex items-center justify-center">
              <div className="text-center p-6">
                <MapPin className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">{t("map.placeholder")}</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card p-8 rounded-xl border shadow-sm">
            {isSuccess ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {t("form.success.heading")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("form.success.message")}
                </p>
                <Button onClick={() => setIsSuccess(false)}>
                  {t("form.success.newMessage")}
                </Button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">{t("form.title")}</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("form.name.label")}</Label>
                    <Input
                      id="name"
                      placeholder={t("form.name.placeholder")}
                      {...register("name", { required: true })}
                      className={cn({ "border-destructive": errors.name })}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {t("form.errors.required")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("form.email.label")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("form.email.placeholder")}
                      {...register("email", {
                        required: true,
                        pattern: /^\S+@\S+$/i,
                      })}
                      className={cn({ "border-destructive": errors.email })}
                    />
                    {errors.email?.type === "required" && (
                      <p className="text-sm text-destructive">
                        {t("form.errors.required")}
                      </p>
                    )}
                    {errors.email?.type === "pattern" && (
                      <p className="text-sm text-destructive">
                        {t("form.errors.email")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("form.subject.label")}</Label>
                    <Input
                      id="subject"
                      placeholder={t("form.subject.placeholder")}
                      {...register("subject", { required: true })}
                      className={cn({ "border-destructive": errors.subject })}
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive">
                        {t("form.errors.required")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t("form.message.label")}</Label>
                    <Textarea
                      id="message"
                      placeholder={t("form.message.placeholder")}
                      rows={6}
                      {...register("message", { required: true })}
                      className={cn({ "border-destructive": errors.message })}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">
                        {t("form.errors.required")}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}>
                    {isSubmitting ? t("form.submitting") : t("form.submit")}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
