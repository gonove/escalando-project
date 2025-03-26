
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
  eachDayOfInterval
} from "date-fns";
import { es } from "date-fns/locale";
import { useIsMobile, useIsTablet, useIsMobileOrTablet } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import WeeklyTimeView from "@/components/scheduler/WeeklyTimeView";
import MonthlyView from "@/components/scheduler/MonthlyView";
import RecurringSessionForm from "@/components/scheduler/RecurringSessionForm";
import { RecurrencePattern } from "@/types/models";

// Lista de terapeutas
const therapists = [
  { id: "th_1", name: "Ana García", specialty: "Terapeuta Ocupacional" },
  { id: "th_2", name: "Carlos Rodríguez", specialty: "Psicólogo Infantil" },
  { id: "th_3", name: "Laura Martínez", specialty: "Logopeda" },
  { id: "th_4", name: "Sofía López", specialty: "Fisioterapeuta" },
];

// Horarios disponibles del centro
const centerHours = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
];

// Tipos de sesiones
const sessionTypes = [
  { id: "regular", name: "Sesión Regular" },
  { id: "evaluation", name: "Evaluación" },
  { id: "follow-up", name: "Seguimiento" },
  { id: "first-time", name: "Primera Consulta" },
];

// Fake scheduled sessions for the UI
const initialScheduledSessions = [
  { 
    id: "ses_1",
    patientId: patients[0].id, 
    therapistId: "th_1",
    date: addDays(new Date(), 1), 
    time: "09:00", 
    duration: 60,
    type: "regular"
  },
  { 
    id: "ses_2",
    patientId: patients[1].id, 
    therapistId: "th_2",
    date: addDays(new Date(), 2), 
    time: "11:30", 
    duration: 45,
    type: "follow-up"
  },
  { 
    id: "ses_3",
    patientId: patients[2].id, 
    therapistId: "th_3",
    date: addDays(new Date(), 4), 
    time: "16:00", 
    duration: 60,
    type: "regular"
  },
  {
    id: "ses_4",
    patientId: patients[0].id,
    therapistId: "th_1",
    date: addDays(new Date(), 3),
    time: "10:00",
    duration: 45,
    type: "follow-up"
  },
  {
    id: "ses_5", 
    patientId: patients[3].id,
    therapistId: "th_4",
    date: addDays(new Date(), 1),
    time: "15:30",
    duration: 60,
    type: "evaluation"
  }
];

const SessionScheduler = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = useIsMobileOrTablet();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [monthStart, setMonthStart] = useState(startOfMonth(currentDate));
  const [selectedTherapist, setSelectedTherapist] = useState<string>("th_1");
  const [viewAll, setViewAll] = useState<boolean>(false);
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
  const { toast } = useToast();
  
  // Generate days for the week view
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  
  // Generate days for the month view
  const generateMonthDays = () => {
    const monthStartDay = startOfMonth(currentDate);
    const monthEndDay = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStartDay, end: monthEndDay });
    
    // Get the first day of the month
    const firstDayOfMonth = getDay(monthStartDay);
    
    // Adjust for Monday as first day of week (European/Spanish calendar)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    // Add days from previous month to fill the first week
    const prevMonthDays = Array.from({ length: adjustedFirstDay }).map((_, i) => 
      addDays(monthStartDay, -(adjustedFirstDay - i))
    );
    
    // Add days from next month to complete the calendar grid (6 rows x 7 days)
    const totalDaysToShow = 42; // 6 weeks
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

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[field]) {
      const newErrors = { ...formErrors };
      delete newErrors[field];
      setFormErrors(newErrors);
    }
  };

  // Validate form before submission
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
    
    // Check if the patient already has 3 scheduled sessions
    const patientSessions = scheduledSessions.filter(
      session => session.patientId === formData.patientId
    );
    
    if (patientSessions.length >= 3) {
      errors.patientId = "Este paciente ya tiene 3 sesiones programadas";
    }
    
    // Check if the selected time slot already has 3 sessions booked (center limit)
    const selectedDateTime = parseISO(formData.date);
    const sessionsAtSameTime = scheduledSessions.filter(session => {
      const sessionDate = new Date(session.date);
      const isSameDate = isSameDay(sessionDate, selectedDateTime);
      return isSameDate && session.time === formData.time;
    });
    
    if (sessionsAtSameTime.length >= 3) {
      errors.time = "El centro ya tiene 3 sesiones programadas en este horario";
    }
    
    // Check if the selected time slot is already booked for this therapist
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create a new session
    const newSession = {
      id: `ses_${Date.now()}`,
      patientId: formData.patientId,
      therapistId: selectedTherapist,
      date: parseISO(formData.date),
      time: formData.time,
      duration: parseInt(formData.duration),
      type: formData.type
    };
    
    // Add the new session
    setScheduledSessions([...scheduledSessions, newSession]);
    
    // Reset form
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

  // Handle recurring session creation
  const handleRecurringSession = (recurrencePattern: RecurrencePattern) => {
    if (!selectedDateForRecurring || !selectedTimeForRecurring || !formData.patientId) {
      toast({
        title: "Error",
        description: "Debe seleccionar un paciente, fecha y hora para programar sesiones recurrentes",
        variant: "destructive"
      });
      return;
    }
    
    // Create recurring sessions based on the pattern
    const newSessions = [];
    let currentDate = new Date(selectedDateForRecurring);
    let sessionsCreated = 0;
    
    // Determine end condition
    const endDate = recurrencePattern.endDate ? parseISO(recurrencePattern.endDate) : null;
    const maxOccurrences = recurrencePattern.occurrences || 100; // Fallback to a large number
    
    while (
      (endDate ? isBefore(currentDate, endDate) : true) && 
      sessionsCreated < maxOccurrences
    ) {
      // Create a session for this date
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
      
      // Advance to next date based on frequency
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
    
    // Add the new sessions
    setScheduledSessions([...scheduledSessions, ...newSessions]);
    
    toast({
      title: "Sesiones recurrentes agendadas",
      description: `Se han programado ${newSessions.length} sesiones recurrentes`,
    });
    
    setShowRecurringForm(false);
    setSelectedTimeForRecurring(null);
  };

  // Filter sessions by therapist and date
  const getFilteredSessions = () => {
    return scheduledSessions.filter(session => {
      // Si viewAll está activado, ignorar el filtro de terapeuta
      const isForSelectedTherapist = viewAll || session.therapistId === selectedTherapist;
      
      // If a date is selected, filter by that date too
      if (selectedDate) {
        return isForSelectedTherapist && isSameDay(session.date, selectedDate);
      }
      
      return isForSelectedTherapist;
    });
  };

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    return scheduledSessions.filter(session => {
      if (viewAll) {
        return isSameDay(session.date, date);
      }
      return session.therapistId === selectedTherapist && isSameDay(session.date, date);
    });
  };

  // Get sessions for a specific date and time
  const getSessionsForDateTime = (date: Date, time: string) => {
    const sessions = scheduledSessions.filter(session => {
      const isDateMatch = isSameDay(session.date, date);
      const isTimeMatch = session.time === time;
      const isTherapistMatch = viewAll || session.therapistId === selectedTherapist;
      
      return isDateMatch && isTimeMatch && isTherapistMatch;
    });
    
    // Add patient name to each session for display purposes
    return sessions.map(session => {
      const patient = patients.find(p => p.id === session.patientId);
      return {
        ...session,
        patientName: patient ? patient.name : "Paciente desconocido"
      };
    });
  };

  // Check if a time slot is available
  const isTimeSlotAvailable = (date: Date, time: string) => {
    // Check if the therapist is already booked at this time
    const isTherapistBooked = scheduledSessions.some(session => 
      session.therapistId === selectedTherapist && 
      isSameDay(session.date, date) && 
      session.time === time
    );
    
    // Check if the center already has 3 sessions at this time
    const sessionsAtTime = scheduledSessions.filter(session => 
      isSameDay(session.date, date) && 
      session.time === time
    );
    
    return !isTherapistBooked && sessionsAtTime.length < 3;
  };

  // Get the number of sessions at a specific time slot
  const getSessionsCountAtTime = (date: Date, time: string) => {
    return scheduledSessions.filter(session => 
      isSameDay(session.date, date) && 
      session.time === time
    ).length;
  };

  // Handle calendar view change
  const handleCalendarViewChange = (view: "week" | "month" | "time") => {
    setCalendarView(view);
    if (view === "month") {
      setMonthStart(startOfMonth(currentDate));
    } else {
      setWeekStart(startOfWeek(currentDate, { weekStartsOn: 1 }));
    }
  };

  // Handle click on a time slot to schedule a session
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
    
    // Set selected date and time in the form
    setFormData({
      ...formData,
      date: format(date, "yyyy-MM-dd"),
      time: time
    });
    
    // Show the new session form
    setShowNewSessionForm(true);
  };

  // Handle click to open recurring session modal
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
                    <TabsTrigger value="time">Semanal con hora</TabsTrigger>
                    <TabsTrigger value="week">Semanal</TabsTrigger>
                    <TabsTrigger value="month">Mensual</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {calendarView === "time" && (
              <WeeklyTimeView 
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
                onScheduleClick={(date, time) => {
                  // On right-click or long press, open recurring session
                  // For simplicity, we'll use a context menu or double click
                  // Long-press is harder to implement in this interface
                  handleTimeSlotClick(date, time);
                  
                  // We'll store the data for potential recurring session
                  setSelectedDateForRecurring(date);
                  setSelectedTimeForRecurring(time);
                  setIsRecurringSession(false);
                }}
              />
            )}
            {calendarView === "week" && (
              // Vista semanal (código existente)
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xs text-muted-foreground uppercase">
                        {format(day, isMobile ? "EEE" : "EEEE", { locale: es })}
                      </p>
                      <Button 
                        variant={isSameDay(day, selectedDate || new Date()) ? "default" : "ghost"} 
                        className={cn(
                          "w-full rounded-full font-normal",
                          isSameDay(day, new Date()) && !isSameDay(day, selectedDate || new Date()) && "bg-escalando-100 text-escalando-900 hover:bg-escalando-200 hover:text-escalando-900"
                        )}
                        onClick={() => setSelectedDate(day)}
                      >
                        {format(day, "d")}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      Sesiones programadas
                      {selectedDate && (
                        <span className="ml-2 text-muted-foreground">
                          ({format(selectedDate, "d 'de' MMMM", { locale: es })})
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="bg-muted/30 rounded-md p-4">
                    <div className="text-sm font-medium mb-4">
                      {viewAll ? "Horario: Todos los terapeutas" : `Horario: ${therapists.find(t => t.id === selectedTherapist)?.name}`}
                    </div>
                    <div className="space-y-2">
                      {getFilteredSessions().length > 0 ? (
                        getFilteredSessions().map((session, i) => {
                          const patient = patients.find(p => p.id === session.patientId);
                          const therapist = therapists.find(t => t.id === session.therapistId);
                          
                          return (
                            <Card 
                              key={i} 
                              className="overflow-hidden border border-muted shadow-sm"
                            >
                              <div className="p-3 flex items-center gap-3">
                                <div className="w-2 h-10 rounded-full bg-escalando-400" />
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                      <p className="font-medium">{patient?.name}</p>
                                      <div className="flex items-center text-sm text-muted-foreground flex-wrap">
                                        <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                        <span>{format(session.date, "EEEE d 'de' MMMM", { locale: es })}</span>
                                      </div>
                                      {viewAll && (
                                        <div className="text-sm text-muted-foreground mt-1">
                                          <span className="font-medium">Terapeuta:</span> {therapist?.name}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center text-sm font-medium mt-1 sm:mt-0">
                                      <Clock className="h-3.5 w-3.5 mr-1" />
                                      <span>{session.time} ({session.duration} min)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No hay sesiones programadas{selectedDate ? ` para ${format(selectedDate, "d 'de' MMMM", { locale: es })}` : ""}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {calendarView === "month" && (
              <MonthlyView 
                monthDays={monthDays}
                currentDate={currentDate}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                getSessionsForDate={getSessionsForDate}
              />
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
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
                  // Primero ordenar por fecha
                  const dateCompare = a.date.getTime() - b.date.getTime();
                  if (dateCompare !== 0) return dateCompare;
                  
                  // Si la fecha es igual, ordenar por hora
                  const timeA = parseInt(a.time.replace(':', ''));
                  const timeB = parseInt(b.time.replace(':', ''));
                  return timeA - timeB;
                })
                .slice(0, 5) // Mostrar solo las próximas 5 sesiones
                .map((session, i) => {
                  const patient = patients.find(p => p.id === session.patientId);
                  const therapist = therapists.find(t => t.id === session.therapistId);
                  
                  return (
                    <Card key={i} className="overflow-hidden border-0 shadow-sm w-full">
                      <div className="flex flex-col sm:flex-row items-start p-4 bg-white hover:bg-gray-50 transition-colors w-full">
                        <div className="bg-escalando-100 text-escalando-700 p-3 rounded-full mr-4 mb-3 sm:mb-0">
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
                              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                Reprogramar
                              </Button>
                              <Button size="sm" className="w-full sm:w-auto">
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                
              {scheduledSessions.filter(session => isAfter(session.date, new Date())).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay sesiones programadas para los próximos días</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* New Session Form Dialog */}
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
                        // Contar sesiones programadas para este paciente
                        const sessionCount = scheduledSessions.filter(
                          session => session.patientId === patient.id
                        ).length;
                        
                        // Deshabilitar pacientes que ya tienen 3 sesiones
                        const disabled = sessionCount >= 3;
                        
                        return (
                          <SelectItem 
                            key={patient.id} 
                            value={patient.id}
                            disabled={disabled}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{patient.name}</span>
                              {sessionCount > 0 && (
                                <span className="text-xs bg-muted rounded-full px-2 py-0.5">
                                  {sessionCount} sesión{sessionCount > 1 ? "es" : ""}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {formErrors.patientId && (
                    <p className="text-sm font-medium text-destructive">{formErrors.patientId}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-time" className={cn(formErrors.time && "text-destructive")}>
                      Hora
                    </Label>
                    <Select 
                      value={formData.time} 
                      onValueChange={(value) => handleInputChange("time", value)}
                    >
                      <SelectTrigger 
                        id="session-time"
                        className={cn(formErrors.time && "border-destructive")}
                      >
                        <SelectValue placeholder="Seleccionar hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {centerHours.map((time) => {
                          const date = formData.date ? parseISO(formData.date) : new Date();
                          const isAvailable = isTimeSlotAvailable(date, time);
                          const sessionsCount = getSessionsCountAtTime(date, time);
                          
                          return (
                            <SelectItem 
                              key={time} 
                              value={time}
                              disabled={!isAvailable}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{time}</span>
                                {sessionsCount > 0 ? (
                                  <span className={cn(
                                    "text-xs rounded-full px-2 py-0.5",
                                    sessionsCount === 3 ? "bg-red-100 text-red-600" : "bg-muted"
                                  )}>
                                    {sessionsCount}/3
                                  </span>
                                ) : !isAvailable ? (
                                  <span className="text-xs text-destructive">Ocupado</span>
                                ) : null}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {formErrors.time && (
                      <p className="text-sm font-medium text-destructive">{formErrors.time}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-duration">Duración</Label>
                    <Select 
                      value={formData.duration} 
                      onValueChange={(value) => handleInputChange("duration", value)}
                    >
                      <SelectTrigger id="session-duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                        <SelectItem value="90">90 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-type">Tipo de Sesión</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger id="session-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Detalles adicionales sobre la sesión..." 
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsRecurringSession(true);
                        setShowRecurringForm(true);
                      }}
                    >
                      Programar como sesión recurrente
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" className={isMobile ? "w-full" : "mr-2"} onClick={() => setShowNewSessionForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className={isMobile ? "w-full" : ""}>
                  Agendar Sesión
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Recurring Session Form */}
        <RecurringSessionForm 
          isOpen={showRecurringForm}
          onClose={() => setShowRecurringForm(false)}
          onConfirm={handleRecurringSession}
          initialDate={selectedDateForRecurring || new Date()}
        />
      </motion.div>
    </Layout>
  );
};

export default SessionScheduler;
