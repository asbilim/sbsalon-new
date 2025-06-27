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
import { Price } from "@/components/price";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  User,
  Clock,
  Scissors,
  Sparkles,
  Info,
  MapPin,
  Home,
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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingData } from "@/types/salon";

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
  const [isHomeService, setIsHomeService] = useState(false);
  const [bookingConfirmDialogOpen, setBookingConfirmDialogOpen] =
    useState(false);

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
    watch,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      service: "",
      employee: "",
      home_address: "",
      notes: "",
    },
  });

  const watchHomeAddress = watch("home_address");

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

  const handleFormSubmit = (data: any) => {
    if (!date || !time) {
      toast({
        variant: "destructive",
        title: t("errors.dateTime"),
        description: t("errors.dateTimeMessage"),
      });
      return;
    }

    // Open confirmation dialog
    setBookingConfirmDialogOpen(true);
  };

  const onSubmit = async (data: any) => {
    setBookingConfirmDialogOpen(false);

    if (!date || !time || !selectedServiceId || !selectedEmployeeId) {
      toast({
        variant: "destructive",
        title: t("errors.missingData"),
        description: t("errors.missingDataMessage"),
      });
      return;
    }

    setIsSubmitting(true);

    // Structure data according to API requirements
    const bookingData: BookingData = {
      client_details: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        address: data.address || "",
        location: {
          latitude: null,
          longitude: null,
        },
      },
      employee: selectedEmployeeId,
      service: selectedServiceId,
      booking_date: format(date, "yyyy-MM-dd"),
      timeslot: time, // This should be the UUID of a timeslot if your API requires it
      is_home_service: isHomeService,
      home_address: isHomeService ? data.home_address : "",
      client_notes: data.notes || "",
    };

    try {
      // Make API call to create booking
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/salon/bookings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API request failed: ${response.status} - ${JSON.stringify(
            errorData
          )}`
        );
      }

      setIsSuccess(true);
      reset();
      setSelectedServiceId(undefined);
      setSelectedEmployeeId(undefined);
      setDate(undefined);
      setTime(undefined);
      setIsHomeService(false);

      toast({
        title: t("success.title"),
        description: t("success.description"),
      });

      // Keep success state for 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        variant: "destructive",
        title: t("errors.submitTitle"),
        description:
          error instanceof Error ? error.message : t("errors.submitMessage"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch timeslot list
  const {
    data: timeslotData,
    isLoading: isLoadingTimeslots,
    error: timeslotError,
  } = useQuery({
    queryKey: ["timeslots"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/salon/timeslots`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch timeslots");
      }
      return res.json();
    },
  });

  const timeSlotsApi = timeslotData?.results || [];

  const selectedTimeSlot = useMemo(() => {
    return timeSlotsApi.find((s: any) => String(s.id) === time);
  }, [timeSlotsApi, time]);

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

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("form.yourInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">{t("form.firstName")}</Label>
                    <Input
                      id="first_name"
                      placeholder={t("form.firstNamePlaceholder")}
                      {...register("first_name", { required: true })}
                      className={cn({
                        "border-destructive": errors.first_name,
                      })}
                    />
                    {errors.first_name && (
                      <p className="text-sm text-destructive">
                        {t("errors.required")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">{t("form.lastName")}</Label>
                    <Input
                      id="last_name"
                      placeholder={t("form.lastNamePlaceholder")}
                      {...register("last_name", { required: true })}
                      className={cn({ "border-destructive": errors.last_name })}
                    />
                    {errors.last_name && (
                      <p className="text-sm text-destructive">
                        {t("errors.required")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("form.phone")}</Label>
                    <Input
                      id="phone"
                      placeholder={t("form.phonePlaceholder")}
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
                    <Label htmlFor="email">{t("form.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("form.emailPlaceholder")}
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
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">{t("form.address")}</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder={t("form.addressPlaceholder")}
                      className={cn({ "border-destructive": errors.address })}
                    />
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
                          {isLoadingTimeslots ? (
                            <Skeleton className="h-10 w-full" />
                          ) : timeslotError ? (
                            <p className="text-sm text-destructive">
                              {t("errors.timeslotLoad")}
                            </p>
                          ) : timeSlotsApi.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              {t("form.noTimeslots")}
                            </p>
                          ) : (
                            <Select onValueChange={setTime} value={time}>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("form.selectTime")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlotsApi.map((slot: any) => (
                                  <SelectItem key={slot.id} value={slot.id}>
                                    {slot.start_time} - {slot.end_time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Home Service Option */}
                  <AnimatePresence>
                    {selectedServiceId && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="home-service">
                              {t("form.homeService")}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {t("form.homeServiceDescription")}
                            </p>
                          </div>
                          <Switch
                            id="home-service"
                            checked={isHomeService}
                            onCheckedChange={setIsHomeService}
                          />
                        </div>

                        {isHomeService && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2">
                            <Label htmlFor="home_address">
                              {t("form.homeAddress")}
                              <span className="text-destructive ml-1">*</span>
                            </Label>
                            <Input
                              id="home_address"
                              {...register("home_address", {
                                required: isHomeService,
                              })}
                              placeholder={t("form.homeAddressPlaceholder")}
                              className={cn({
                                "border-destructive": errors.home_address,
                              })}
                            />
                            {errors.home_address && (
                              <p className="text-sm text-destructive">
                                {t("errors.required")}
                              </p>
                            )}
                          </motion.div>
                        )}
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
                            <span className="text-2xl font-mono font-semibold text-primary">
                              <Price amount={selectedService.base_price} />
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
                                @
                                {selectedTimeSlot
                                  ? `${selectedTimeSlot.start_time} - ${selectedTimeSlot.end_time}`
                                  : ""}
                              </p>
                            </div>
                          </div>
                        )}

                        {isHomeService && (
                          <div className="flex items-center gap-3 pt-4 border-t">
                            <Home className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {t("summary.homeService")}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {watchHomeAddress || t("summary.addressNeeded")}
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
                    !time ||
                    (isHomeService && !watchHomeAddress)
                  }>
                  {isSubmitting ? t("form.submitting") : t("form.submit")}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Booking Confirmation Dialog */}
        <Dialog
          open={bookingConfirmDialogOpen}
          onOpenChange={setBookingConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("confirmation.title")}</DialogTitle>
              <DialogDescription>
                {t("confirmation.description")}
              </DialogDescription>
            </DialogHeader>

            {selectedService && selectedEmployee && date && time && (
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("summary.service")}:
                  </span>
                  <span className="font-medium">
                    {getLocalizedFields(selectedService, locale).name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("summary.specialist")}:
                  </span>
                  <span className="font-medium">
                    {getLocalizedFields(selectedEmployee, locale).name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("summary.dateTime")}:
                  </span>
                  <span className="font-medium">
                    {format(date, "PPP")} @
                    {selectedTimeSlot
                      ? ` ${selectedTimeSlot.start_time} - ${selectedTimeSlot.end_time}`
                      : ""}
                  </span>
                </div>

                {isHomeService && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("summary.location")}:
                    </span>
                    <span className="font-medium">
                      {t("summary.homeServiceLocation")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("summary.price")}:
                  </span>
                  <span className="font-medium text-lg font-mono">
                    <Price amount={selectedService.base_price} />
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setBookingConfirmDialogOpen(false)}>
                {t("confirmation.cancel")}
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>
                {t("confirmation.confirm")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
