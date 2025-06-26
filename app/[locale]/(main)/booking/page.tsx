"use client";

import { useEffect, useMemo, useState } from "react";
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
import { cn, getInitials, getLocalizedFields } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  User,
  Clock,
  Scissors,
  Sparkles,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/salon";

export default function BookingPage() {
  const t = useTranslations("BookingPage");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [selectedServiceId, setSelectedServiceId] = useState<
    string | undefined
  >();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<
    string | undefined
  >();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services", locale],
    queryFn: () => api.getServices(locale, { ordering: "name" }),
  });
  const services = servicesData?.results || [];

  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["employees", locale],
    queryFn: () => api.getEmployees(locale),
    enabled: !!selectedServiceId,
  });
  const employees = employeesData?.results || [];

  const availableEmployees = useMemo(() => {
    if (!selectedServiceId) return [];
    return employees.filter(
      (employee) =>
        employee.is_available &&
        employee.services.some(
          (service) => String(service.id) === selectedServiceId
        )
    );
  }, [selectedServiceId, employees]);

  const selectedService = useMemo(
    () => services.find((s) => String(s.id) === selectedServiceId),
    [services, selectedServiceId]
  );

  const selectedEmployee = useMemo(
    () => employees.find((e) => String(e.id) === selectedEmployeeId),
    [employees, selectedEmployeeId]
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
      employee: "",
      notes: "",
    },
  });

  useEffect(() => {
    const serviceId = searchParams.get("service");
    if (serviceId && services.length > 0) {
      if (services.some((s) => String(s.id) === serviceId)) {
        setValue("service", serviceId);
        setSelectedServiceId(serviceId);
      }
    }
  }, [searchParams, services, setValue]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setValue("service", serviceId);
    setSelectedEmployeeId(undefined);
    setValue("employee", "");
    setDate(undefined);
    setTime(undefined);
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setValue("employee", employeeId);
  };

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
    const bookingData = {
      ...data,
      date: format(date, "yyyy-MM-dd"),
      time,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      reset();
      setSelectedServiceId(undefined);
      setSelectedEmployeeId(undefined);
      setDate(undefined);
      setTime(undefined);
      toast({
        title: t("success.title"),
        description: t("success.description"),
      });
      setTimeout(() => setIsSuccess(false), 5000);
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

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ];

  if (isSuccess) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-32">
        <motion.div
          className="text-center py-12 bg-card p-8 rounded-xl border"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t("success.heading")}</h2>
          <p className="text-muted-foreground mb-6">{t("success.message")}</p>
          <Button onClick={() => setIsSuccess(false)}>
            {t("success.newBooking")}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </motion.p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("form.yourInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
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
                  <div className="space-y-2 md:col-span-2">
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
                </CardContent>
              </Card>

              {/* Booking Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("form.bookingDetails")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="service">{t("form.service")}</Label>
                    <Select
                      value={selectedServiceId}
                      onValueChange={handleServiceChange}
                      disabled={isLoadingServices}>
                      <SelectTrigger
                        id="service"
                        className={cn({
                          "border-destructive": errors.service,
                        })}>
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
                          <SelectItem
                            key={service.id}
                            value={String(service.id)}>
                            {getLocalizedFields(service, locale).name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Employee Selection */}
                  <AnimatePresence>
                    {selectedServiceId && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4">
                        <Label>{t("form.employee")}</Label>
                        {isLoadingEmployees ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-28 w-full" />
                            <Skeleton className="h-28 w-full" />
                          </div>
                        ) : availableEmployees.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableEmployees.map((employee) => {
                              const { name } = getLocalizedFields(
                                employee,
                                locale
                              );
                              return (
                                <Card
                                  key={employee.id}
                                  onClick={() =>
                                    handleEmployeeSelect(String(employee.id))
                                  }
                                  className={cn(
                                    "cursor-pointer transition-all",
                                    selectedEmployeeId === String(employee.id)
                                      ? "border-primary ring-2 ring-primary"
                                      : "hover:shadow-md"
                                  )}>
                                  <CardContent className="p-4 flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src={undefined} />
                                      <AvatarFallback className="text-2xl">
                                        {getInitials(name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h4 className="font-semibold">{name}</h4>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {employee.specialties
                                          .slice(0, 3)
                                          .map((spec) => (
                                            <Badge
                                              key={spec.id}
                                              variant="secondary">
                                              {
                                                getLocalizedFields(spec, locale)
                                                  .name
                                              }
                                            </Badge>
                                          ))}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center p-6 bg-muted/50 rounded-xl border">
                            <User className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                            <h3 className="text-lg font-semibold mb-1">
                              {t("form.noEmployee.title")}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {t("form.noEmployee.message")}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Date & Time */}
                  <AnimatePresence>
                    {selectedEmployeeId && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("form.date")}</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date
                                  ? format(date, "PPP")
                                  : t("form.pickDate")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(d) =>
                                  d < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label>{t("form.time")}</Label>
                          <Select onValueChange={setTime} value={time}>
                            <SelectTrigger>
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
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">{t("form.notes")}</Label>
                    <Textarea
                      id="notes"
                      rows={4}
                      placeholder={t("form.notesPlaceholder")}
                      {...register("notes")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sticky Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("summary.title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AnimatePresence>
                      <motion.div
                        layout
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}>
                        {!selectedService && (
                          <div className="flex items-center text-muted-foreground">
                            <Info className="mr-2 h-4 w-4" />
                            <p>{t("summary.start")}</p>
                          </div>
                        )}

                        {selectedService && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {getLocalizedFields(selectedService, locale).name}
                            </span>
                            <span className="font-mono text-lg">
                              ${selectedService.base_price}
                            </span>
                          </div>
                        )}

                        {selectedEmployee && (
                          <div className="flex items-center gap-3 pt-4 border-t">
                            <Avatar>
                              <AvatarImage src={undefined} />
                              <AvatarFallback>
                                {getInitials(
                                  getLocalizedFields(selectedEmployee, locale)
                                    .name
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {
                                  getLocalizedFields(selectedEmployee, locale)
                                    .name
                                }
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("summary.specialist")}
                              </p>
                            </div>
                          </div>
                        )}

                        {date && time && (
                          <div className="flex items-center gap-3 pt-4 border-t">
                            <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {format(date, "EEEE, MMMM do")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                @ {time}
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={
                    isSubmitting ||
                    !selectedServiceId ||
                    !selectedEmployeeId ||
                    !date ||
                    !time
                  }>
                  {isSubmitting ? t("form.submitting") : t("form.submit")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
