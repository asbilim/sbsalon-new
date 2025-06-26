"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function BookingPage() {
  const t = useTranslations("BookingPage");
  const { toast } = useToast();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services", locale],
    queryFn: () => api.getServices(locale),
  });

  const services = servicesData?.results || [];

  // Form state
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      notes: "",
    },
  });

  useEffect(() => {
    const serviceId = searchParams.get("service");
    if (serviceId && services.length > 0) {
      const serviceExists = services.some((s) => String(s.id) === serviceId);
      if (serviceExists) {
        setValue("service", serviceId);
        setSelectedService(serviceId);
      }
    }
  }, [searchParams, services, setValue]);

  const handleServiceChange = (value: string) => {
    setValue("service", value);
    setSelectedService(value);
  };

  // Available time slots
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
  ];

  const onSubmit = async (data: any) => {
    if (!date || !time) {
      toast({
        variant: "destructive",
        title: t("errors.dateTime"),
        description: t("errors.dateTimeMessage"),
      });
      return;
    }

    setIsSubmitting(true);

    // Format the booking data
    const bookingData = {
      ...data,
      date: format(date, "yyyy-MM-dd"),
      time,
      // In a real application, this would be sent to your backend API
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success handling
      setIsSuccess(true);
      reset();
      setDate(undefined);
      setTime(undefined);

      toast({
        title: t("success.title"),
        description: t("success.description"),
      });

      // Reset the success state after showing for a while
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("errors.submitTitle"),
        description: t("errors.submitMessage"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {t("title")}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Booking Form */}
          <div className="bg-card p-8 rounded-xl border shadow-sm">
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
                  {t("success.heading")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("success.message")}
                </p>
                <Button onClick={() => setIsSuccess(false)}>
                  {t("success.newBooking")}
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("form.name")}</Label>
                  <Input
                    id="name"
                    {...register("name", { required: true })}
                    className={cn({ "border-destructive": errors.name })}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {t("errors.required")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("form.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: true,
                      pattern: /^\S+@\S+$/i,
                    })}
                    className={cn({ "border-destructive": errors.email })}
                  />
                  {errors.email?.type === "required" && (
                    <p className="text-sm text-destructive">
                      {t("errors.required")}
                    </p>
                  )}
                  {errors.email?.type === "pattern" && (
                    <p className="text-sm text-destructive">
                      {t("errors.email")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("form.phone")}</Label>
                  <Input
                    id="phone"
                    {...register("phone", { required: true })}
                    className={cn({ "border-destructive": errors.phone })}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">
                      {t("errors.required")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">{t("form.service")}</Label>
                  <Select
                    value={selectedService}
                    onValueChange={handleServiceChange}
                    disabled={isLoadingServices}>
                    <SelectTrigger
                      className={cn({ "border-destructive": errors.service })}>
                      <SelectValue
                        placeholder={
                          isLoadingServices
                            ? t("form.loadingServices")
                            : t("form.selectService")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={String(service.id)}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service && (
                    <p className="text-sm text-destructive">
                      {t("errors.required")}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("form.date")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left", {
                            "border-destructive": !date,
                          })}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : t("form.pickDate")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) =>
                            date < new Date() ||
                            date.getTime() < new Date().setHours(0, 0, 0, 0)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("form.time")}</Label>
                    <Select onValueChange={setTime}>
                      <SelectTrigger
                        className={cn({ "border-destructive": !time })}>
                        <SelectValue placeholder={t("form.selectTime")} />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t("form.notes")}</Label>
                  <Textarea
                    id="notes"
                    rows={4}
                    placeholder={t("form.notesPlaceholder")}
                    {...register("notes")}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}>
                  {isSubmitting ? t("form.submitting") : t("form.submit")}
                </Button>
              </form>
            )}
          </div>

          {/* Information Panel */}
          <div className="space-y-8">
            {/* Booking Information */}
            <div className="bg-card p-8 rounded-xl border shadow-sm">
              <h2 className="text-2xl font-bold mb-4">{t("info.title")}</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">{t("info.description")}</p>
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">{t("info.hours.title")}</h3>
                  <ul className="space-y-1">
                    <li className="flex justify-between">
                      <span>{t("info.hours.monday")}</span>
                      <span>9:00 AM - 7:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t("info.hours.tuesday")}</span>
                      <span>9:00 AM - 7:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t("info.hours.wednesday")}</span>
                      <span>9:00 AM - 7:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t("info.hours.thursday")}</span>
                      <span>9:00 AM - 7:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t("info.hours.friday")}</span>
                      <span>9:00 AM - 7:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t("info.hours.saturday")}</span>
                      <span>10:00 AM - 5:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>{t("info.hours.sunday")}</span>
                      <span>{t("info.hours.closed")}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-card p-8 rounded-xl border shadow-sm">
              <h2 className="text-2xl font-bold mb-4">{t("contact.title")}</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {t("contact.description")}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <p>+1 (555) 123-4567</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p>contact@sbsalon.com</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <p>123 Beauty Street, Style City, SC 12345</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
