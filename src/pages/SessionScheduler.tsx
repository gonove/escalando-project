import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  User,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  UsersRound
} from "lucide-react";
import { patients } from "@/data/mockData";
import {
  format,
  addDays,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameDay,
  parseISO,
  isAfter,
  isBefore,
  getDate,
  getDay,
  eachDayOfInterval,
  isPast,
  isToday
} from "date-fns";
import { es } from "date-fns/locale";
import { useIsMobile, useIsTablet, useIsMobileOrTablet } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import MonthlyView from "@/components/scheduler/MonthlyView";
import RecurringSessionForm from "@/components/scheduler/RecurringSessionForm";
import { RecurrencePattern } from "@/types/models";
import { WeeklyTimeView } from "@/components/scheduler/WeeklyTimeView";
import { WeeklyWithHours } from "@/components/scheduler/WeeklyWithHours";
import SessionDetailDialog from "@/components/scheduler/SessionDetailDialog";
import RescheduleSessionDialog from "@/components/scheduler/RescheduleSessionDialog";

const therapists = [
  { id: "prof1", name: "Ana García", specialty: "Terapeuta Ocupacional" },
  { id: "prof2", name: "Carlos Rodríguez", specialty: "Psicólogo Infantil" },
  { id: "prof3", name: "Laura Martínez", specialty: "Logopeda" },
  { id: "prof4", name: "Sofía López", specialty: "Fisioterapeuta" },
];

const centerHours = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
];

const sessionTypes = [
  { id: "regular", name: "Sesión Regular" },
  { id: "evaluation", name: "Evaluación" },
  { id: "follow-up", name: "Seguimiento" },
  { id: "first-time", name: "Primera Consulta" },
];

const initialScheduledSessions = [
  {
    id: "ses_1",
    patientId: patients[0].id,
    therapistId: "prof1",
    date: addDays(new Date(), 1),
    time: "09:00",
    duration: 60,
    type: "regular"
  },
  {
    id: "ses_2",
    patientId: patients[1].id,
    therapistId: "prof2",
    date: addDays(new Date(), 2),
    time: "11:30",
    duration: 45,
    type: "follow-up"
  },
  {
    id: "ses_3",
    patientId: patients[2].id,
    therapistId: "prof3",
    date: addDays(new Date(), 4),
    time: "16:00",
    duration: 60,
    type: "regular"
  },
  {
    id: "ses_4",
    patientId: patients[0].id,
    therapistId: "prof1",
    date: addDays(new Date(), 3),
    time: "10:00",
    duration: 45,
    type: "follow-up"
  },
  {
    id: "ses_5",
    patientId: patients[3].id,
    therapistId: "prof4",
    date: addDays(new Date(), 1),
    time: "15:30",
    duration: 60,
    type: "evaluation"
  },
  {
    id: "ses_6",
    patientId: patients[0].id,
    therapistId: "prof1",
    date: addDays(new Date(), -3),
    time: "14:00",
    duration: 60,
    type: "follow-up",
    progress: "Se observó una mejora significativa en la capacidad de atención. El paciente completó todos los ejercicios programados."
  }
];

const SessionScheduler = () => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [monthStart, setMonthStart] = useState(startOfMonth(currentDate));
  const [selectedTherapist, setSelectedTherapist] = useState<string>("prof1");
  const [viewAll, setViewAll] = useState<boolean>(true);
  const [calendarView, setCalendarView] = useState<"week" | "month" | "time">("time");
  const [scheduledSessions, setScheduledSessions] = useState(initialScheduledSessions);
  const [formData, setFormData] = useState({
    patientId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    duration: "60",
    type: "regular",
    notes: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [isRecurringSession, setIsRecurringSession] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [selectedTimeForRecurring, setSelectedTimeForRecurring] = useState<string | null>(null);
  const [selectedDateForRecurring, setSelectedDateForRecurring] = useState<Date | null>(null);
  const [showWeekends, setShowWeekends] = useState<boolean>(true);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [showSessionDetail, setShowSessionDetail] = useState<boolean>(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState<boolean>(false);
  const { toast } = useToast();
  const [lastClickTimeTracker, setLastClickTimeTracker] = useState<Record<string, number>>({});

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const generateMonthDays = () => {
    const monthStartDay = startOfMonth(currentDate);
    const monthEndDay = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStartDay, end: monthEndDay });

    const firstDayOfMonth = getDay(monthStartDay);
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const prevMonthDays = Array.from({ length: adjustedFirstDay }).map((_, i) =>
      addDays(monthStartDay, -(adjustedFirstDay - i))
    );
    const totalDaysToShow = 42;
    const daysFromNextMonth = Array.from({ length: totalDaysToShow - prevMonthDays.length - days.length }).map((_, i) =>
      addDays(monthEndDay, i + 1)
    );
    return [...prevMonthDays, ...days, ...daysFromNextMonth];
  };

  const monthDays = generateMonthDays();

  const nextPeriod = () => {
    if (calendarView === "week" || calendarView === "time") {
      setWeekStart(addWeeks(weekStart, 1));
    } else {
      setMonthStart(addMonths(monthStart, 1));
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const prevPeriod = () => {
    if (calendarView === "week" || calendarView === "time") {
      setWeekStart(subWeeks(weekStart, 1));
    } else {
      setMonthStart(subMonths(monthStart, 1));
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });

    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  const isTimeSlotAvailable = (date: Date, time: string) => {
    const isTherapistBooked = scheduledSessions.some(session =>
      session.therapistId === selectedTherapist &&
      isSameDay(session.date, date) &&
      session.time === time
    );

    const sessionsAtTime = scheduledSessions.filter(session =>
      isSameDay(session.date, date) &&
      session.time === time
    ).length;

    if (!viewAll) {
      return !isTherapistBooked && sessionsAtTime < 3;
    }
    else {
      return sessionsAtTime < 3;
    }
  };

  const getSessionsCountAtTime = (date: Date, time: string) => {
    return scheduledSessions.filter(session =>
      isSameDay(session.date, date) &&
      session.time === time
    ).length;
  };

  const getFilteredSessions = () => {
    return scheduledSessions.filter(session => {
      if (viewAll) {
        return isSameDay(session.date, selectedDate);
      }
      return session.therapistId === selectedTherapist && isSameDay(session.date, selectedDate);
    });
  };

  const getSessionsForDate = (date: Date) => {
    return scheduledSessions.filter(session => {
      if (viewAll) {
        return isSameDay(session.date, date);
      }
      return session.therapistId === selectedTherapist && isSameDay(session.date, date);
    });
  };

  const getSessionsForDateTime = (date: Date, time: string) => {
    const sessions = scheduledSessions.filter(session => {
      const isDateMatch = isSameDay(session.date, date);
      const isTimeMatch = session.time === time;
      const isTherapistMatch = viewAll || session.therapistId === selectedTherapist;

      return isDateMatch && isTimeMatch && isTherapistMatch;
    });

    return sessions.map(session => {
      const patient = patients.find(p => p.id === session.patientId);
      return {
        ...session,
        patientName: patient ? patient.name : "Paciente desconocido"
      };
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.patientId) {
      errors.patientId = "Debe seleccionar un paciente";
    }

    if (!formData.date) {
      errors.date = "Debe seleccionar una fecha";
    }

    if (!formData.time) {
      errors.time = "Debe seleccionar una hora";
    }

    const selectedDateTime = parseISO(formData.date);
    const sessionsAtSameTime = scheduledSessions.filter(session => {
      const sessionDate = new Date(session.date);
      const isSameDate = isSameDay(sessionDate, selectedDateTime);
      return isSameDate && session.time === formData.time;
    });

    if (sessionsAtSameTime.length >= 3) {
      errors.time = "El centro ya tiene 3 sesiones programadas en este horario";
    }

    const isTimeSlotBooked = scheduledSessions.some(session => {
      const sessionDate = new Date(session.date);
      const isSameDate = isSameDay(sessionDate, parseISO(formData.date));
      return (
        isSameDate &&
        session.time === formData.time &&
        session.therapistId === selectedTherapist
      );
    });

    if (isTimeSlotBooked) {
      errors.time = "Este horario ya está ocupado para este terapeuta";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newSession = {
      id: `ses_${Date.now()}`,
      patientId: formData.patientId,
      therapistId: selectedTherapist,
      date: parseISO(formData.date),
      time: formData.time,
      duration: parseInt(formData.duration),
      type: formData.type
    };

    setScheduledSessions([...scheduledSessions, newSession]);

    setFormData({
      patientId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
      duration: "60",
      type: "regular",
      notes: ""
    });

    toast({
      title: "Sesión agendada",
      description: "La sesión ha sido programada correctamente",
    });

    setShowNewSessionForm(false);
  };

  const handleRecurringSession = (recurrencePattern: RecurrencePattern) => {
    if (!selectedDateForRecurring || !selectedTimeForRecurring || !formData.patientId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un paciente, fecha y hora para programar sesiones recurrentes",
        variant: "destructive"
      });
      return;
    }

    const newSessions = [];
    let currentDate = new Date(selectedDateForRecurring);
    let sessionsCreated = 0;

    const endDate = recurrencePattern.endDate ? parseISO(recurrencePattern.endDate) : null;
    const maxOccurrences = recurrencePattern.occurrences || 100;

    while (
      (endDate ? isBefore(currentDate, endDate) : true) &&
      sessionsCreated < maxOccurrences
    ) {
      newSessions.push({
        id: `ses_${Date.now()}_${sessionsCreated}`,
        patientId: formData.patientId,
        therapistId: selectedTherapist,
        date: new Date(currentDate),
        time: selectedTimeForRecurring,
        duration: parseInt(formData.duration || "60"),
        type: formData.type || "regular",
        isRecurring: true,
        recurrencePattern
      });

      switch (recurrencePattern.frequency) {
        case "daily":
          currentDate = addDays(currentDate, recurrencePattern.interval);
          break;
        case "weekly":
          currentDate = addWeeks(currentDate, recurrencePattern.interval);
          break;
        case "monthly":
          currentDate = addMonths(currentDate, recurrencePattern.interval);
          break;
      }

      sessionsCreated++;
    }

    setScheduledSessions([...scheduledSessions, ...newSessions]);

    toast({
      title: "Sesiones recurrentes agendadas",
      description: `Se han programado ${newSessions.length} sesiones recurrentes`,
    });

    setShowRecurringForm(false);
    setSelectedTimeForRecurring(null);
  };

  const handleCalendarViewChange = (view: "week" | "month" | "time") => {
    setCalendarView(view);
    if (view === "month") {
      setMonthStart(startOfMonth(currentDate));
    } else {
      setWeekStart(startOfWeek(currentDate, { weekStartsOn: 1 }));
    }
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    const isAvailable = isTimeSlotAvailable(date, time);

    if (!isAvailable) {
      toast({
        title: "Horario no disponible",
        description: "Este horario ya está ocupado o el centro está al máximo de capacidad",
        variant: "destructive"
      });
      return;
    }

    setFormData({
      ...formData,
      date: format(date, "yyyy-MM-dd"),
      time: time
    });

    setShowNewSessionForm(true);
  };

  const handleOpenRecurringModal = (date: Date, time: string) => {
    const isAvailable = isTimeSlotAvailable(date, time);

    if (!isAvailable) {
      toast({
        title: "Horario no disponible",
        description: "Este horario ya está ocupado o el centro está al máximo de capacidad",
        variant: "destructive"
      });
      return;
    }

    setSelectedDateForRecurring(date);
    setSelectedTimeForRecurring(time);
    setShowRecurringForm(true);
  };

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
    setShowSessionDetail(true);
  };

  const handleRescheduleClick = () => {
    setShowSessionDetail(false);
    setShowRescheduleDialog(true);
  };

  const handleRescheduleSession = (sessionId: string, newDate: Date, newTime: string) => {
    setScheduledSessions(prevSessions => 
      prevSessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            date: newDate,
            time: newTime
          };
        }
        return session;
      })
    );
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Programar Sesiones</h1>
            <p className="text-muted-foreground">
              Agenda y gestiona sesiones con tus pacientes
            </p>
          </div>
          <Button
            className={cn("flex items-center gap-2", isMobile && "w-full")}
            onClick={() => setShowNewSessionForm(true)}
          >
            <Plus className="h-4 w-4" />
            Nueva Sesión
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Calendario</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={prevPeriod}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextPeriod}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              {calendarView === "week" || calendarView === "time" ? (
                <>
                  {format(weekStart, "d 'de' MMMM", { locale: es })} - {format(addDays(weekStart, 6), "d 'de' MMMM, yyyy", { locale: es })}
                </>
              ) : (
                <>
                  {format(monthStart, "MMMM yyyy", { locale: es })}
                </>
              )}
            </CardDescription>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Label htmlFor="calendar-therapist" className="sm:mr-2">Ver agenda de:</Label>
                <Select
                  value={viewAll ? "all" : selectedTherapist}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setViewAll(true);
                    } else {
                      setViewAll(false);
                      setSelectedTherapist(value);
                    }
                  }}
                >
                  <SelectTrigger id="calendar-therapist" className="w-full sm:w-[250px]">
                    <SelectValue placeholder="Seleccionar terapeuta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <UsersRound className="h-4 w-4" />
                        <span>Todos los terapeutas</span>
                      </div>
                    </SelectItem>
                    {therapists.map((therapist) => (
                      <SelectItem key={therapist.id} value={therapist.id}>
                        {therapist.name} - {therapist.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <Tabs
                  value={calendarView}
                  onValueChange={(value) => handleCalendarViewChange(value as "week" | "month" | "time")}
                  className="w-auto"
                >
                  <TabsList className="grid w-[280px] grid-cols-3">
                    <TabsTrigger value="time">Sem/Hr</TabsTrigger>
                    <TabsTrigger value="week">Semanal</TabsTrigger>
                    <TabsTrigger value="month">Mensual</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {calendarView === "time" && (
              <WeeklyWithHours
                weekDays={weekDays}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                centerHours={centerHours}
                getSessionsForDateTime={getSessionsForDateTime}
                isTimeSlotAvailable={isTimeSlotAvailable}
                getSessionsCountAtTime={getSessionsCountAtTime}
                viewAll={viewAll}
                selectedTherapist={selectedTherapist}
                therapists={therapists}
                showWeekends={showWeekends}
                setShowWeekends={setShowWeekends}
                onScheduleClick={(date, time) => {
                  const sessionsAtTime = getSessionsForDateTime(date, time);
                  
                  if (sessionsAtTime.length > 0) {
                    setSelectedSession(sessionsAtTime[0]);
                    setShowSessionDetail(true);
                  } else {
                    handleTimeSlotClick(date, time);
                    setSelectedDateForRecurring(date);
                    setSelectedTimeForRecurring(time);
                    setIsRecurringSession(false);
                  }
                }}
              />
            )}
            {calendarView === "week" && (
              <WeeklyTimeView
                weekDays={weekDays}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                isMobile={isMobile}
                getFilteredSessions={getFilteredSessions}
                therapists={therapists}
                viewAll={viewAll}
                selectedTherapist={selectedTherapist}
                patients={patients}
              />
            )}
            {calendarView === "month" && (
              <MonthlyView
                monthDays={monthDays}
                currentDate={currentDate}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                getSessionsForDate={getSessionsForDate}
                getFilteredSessions={getFilteredSessions}
                therapists={therapists}
                viewAll={viewAll}
                selectedTherapist={selectedTherapist}
                patients={patients}
              />
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Próximas Sesiones</CardTitle>
            <CardDescription>
              Sesiones programadas para los próximos días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledSessions
                .filter(session => isAfter(session.date, new Date()) || isSameDay(session.date, new Date()))
                .sort((a, b) => {
                  const dateCompare = a.date.getTime() - b.date.getTime();
                  if (dateCompare !== 0) return dateCompare;

                  const timeA = parseInt(a.time.replace(':', ''));
                  const timeB = parseInt(b.time.replace(':', ''));
                  return timeA - timeB;
                })
                .slice(0, 5)
                .map((session, i) => {
                  const patient = patients.find(p => p.id === session.patientId);
                  const therapist = therapists.find(t => t.id === session.therapistId);

                  return (
                    <Card key={i} className="overflow-hidden border-0 shadow-sm w-full">
                      <div className="flex flex-col sm:flex-row items-start p-4 bg-white hover:bg-gray-50 transition-colors w-full dark:bg-card dark:hover:bg-muted/10">
                        <div className="bg-escalando-100 text-escalando-700 p-3 rounded-full mr-4 mb-3 sm:mb-0 dark:bg-escalando-900/20 dark:text-escalando-100">
                          <CalendarCheck className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <div>
                              <p className="font-medium">
                                {format(session.date, "EEEE d 'de' MMMM", { locale: es })} • {session.time}
                              </p>
                              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3">
                                <p className="text-sm flex items-center">
                                  <User className="h-3.5 w-3.5 mr-1" />
                                  {patient?.name}
                                </p>
                                <span className="hidden xs:inline text-muted-foreground">•</span>
                                <p className="text-sm text-muted-foreground">
                                  {therapist?.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center mt-3 sm:mt-0 gap-2 w-full sm:w-auto">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full sm:w-auto"
                                onClick={() => {
                                  setSelectedSession(session);
                                  setShowRescheduleDialog(true);
                                }}
                              >
                                Reprogramar
                              </Button>
                              <Button 
                                size="sm" 
                                className="w-full sm:w-auto"
                                onClick={() => {
                                  setSelectedSession(session);
                                  setShowSessionDetail(true);
                                }}
                              >
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}

              {scheduledSessions.filter(session => isAfter(session.date, new Date()) || isSameDay(session.date, new Date())).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay sesiones programadas para los próximos días</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Dialog open={showNewSessionForm} onOpenChange={setShowNewSessionForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Sesión</DialogTitle>
              <DialogDescription>
                Complete los datos para agendar una sesión
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="therapist">Terapeuta</Label>
                  <Select
                    value={selectedTherapist}
                    onValueChange={(value) => setSelectedTherapist(value)}
                  >
                    <SelectTrigger id="therapist">
                      <SelectValue placeholder="Seleccionar terapeuta" />
                    </SelectTrigger>
                    <SelectContent>
                      {therapists.map((therapist) => (
                        <SelectItem key={therapist.id} value={therapist.id}>
                          {therapist.name} - {therapist.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient" className={cn(formErrors.patientId && "text-destructive")}>
                    Paciente
                  </Label>
                  <Select
                    value={formData.patientId}
                    onValueChange={(value) => handleInputChange("patientId", value)}
                  >
                    <SelectTrigger id="patient" className={cn(formErrors.patientId && "border-destructive")}>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => {
                        const sessionCount = scheduledSessions.filter(
                          session => session.patientId === patient.id
                        ).length;

                        return (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                            {sessionCount > 0 && ` (${sessionCount} sesiones)`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {formErrors.patientId && (
                    <p className="text-xs text-destructive mt-1">{formErrors.patientId}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className={cn(formErrors.date && "text-destructive")}>
                      Fecha
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className={cn(formErrors.date && "border-destructive")}
                    />
                    {formErrors.date && (
                      <p className="text-xs text-destructive mt-1">{formErrors.date}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className={cn(formErrors.time && "text-destructive")}>
                      Hora
                    </Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) => handleInputChange("time", value)}
                    >
                      <SelectTrigger id="time" className={cn(formErrors.time && "border-destructive")}>
                        <SelectValue placeholder="Seleccionar hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {centerHours.map((hour) => {
                          const selectedDate = parseISO(formData.date);
                          const sessionsAtTime = scheduledSessions.filter(s =>
                            isSameDay(s.date, selectedDate) && s.time === hour
                          ).length;

                          const isTherapistBooked = scheduledSessions.some(s =>
                            isSameDay(s.date, selectedDate) &&
                            s.time === hour &&
                            s.therapistId === selectedTherapist
                          );

                          const isDisabled = sessionsAtTime >= 3 || isTherapistBooked;

                          return (
                            <SelectItem
                              key={hour}
                              value={hour}
                              disabled={isDisabled}
                            >
                              {hour} {isDisabled && " (Ocupado)"}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {formErrors.time && (
                      <p className="text-xs text-destructive mt-1">{formErrors.time}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración (min)</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => handleInputChange("duration", value)}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Seleccionar duración" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                        <SelectItem value="90">90 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de sesión</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {sessionTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    placeholder="Agregar notas sobre la sesión"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      setShowNewSessionForm(false);
                      setShowRecurringForm(true);
                    }}
                  >
                    Programar serie recurrente
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowNewSessionForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Agendar Sesión</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={showRecurringForm} onOpenChange={setShowRecurringForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Programar Sesiones Recurrentes</DialogTitle>
              <DialogDescription>
                Configure las sesiones periódicas
              </DialogDescription>
            </DialogHeader>
            <RecurringSessionForm
              isOpen={showRecurringForm}
              onClose={() => setShowRecurringForm(false)}
              onConfirm={handleRecurringSession}
              initialDate={selectedDateForRecurring}
            />
          </DialogContent>
        </Dialog>

        {selectedSession && (
          <SessionDetailDialog
            session={selectedSession}
            patient={patients.find(p => p.id === selectedSession.patientId)}
            therapist={therapists.find(t => t.id === selectedSession.therapistId)}
            open={showSessionDetail}
            onOpenChange={setShowSessionDetail}
            onReschedule={handleRescheduleClick}
            isPast={isPast(new Date(selectedSession.date)) && !isToday(new Date(selectedSession.date))}
          />
        )}

        {selectedSession && (
          <RescheduleSessionDialog
            session={selectedSession}
            patient={patients.find(p => p.id === selectedSession.patientId)}
            therapist={therapists.find(t => t.id === selectedSession.therapistId)}
            centerHours={centerHours}
            open={showRescheduleDialog}
            onOpenChange={setShowRescheduleDialog}
            onReschedule={handleRescheduleSession}
            getSessionsAtDateTime={getSessionsForDateTime}
          />
        )}
      </motion.div>
    </Layout>
  );
};

export default SessionScheduler;
