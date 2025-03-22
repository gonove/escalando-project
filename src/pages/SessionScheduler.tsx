
import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Plus, User, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { patients } from "@/data/mockData";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { useIsMobile, useIsTablet, useIsMobileOrTablet } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SessionScheduler = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = useIsMobileOrTablet();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  
  const nextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };
  
  const prevWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
  };
  
  // Generate days for the week view
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  
  // Fake scheduled sessions for the UI
  const scheduledSessions = [
    { 
      patientId: patients[0].id, 
      date: addDays(new Date(), 1), 
      time: "09:00", 
      duration: 60
    },
    { 
      patientId: patients[1].id, 
      date: addDays(new Date(), 2), 
      time: "11:30", 
      duration: 45
    },
    { 
      patientId: patients[2].id, 
      date: addDays(new Date(), 4), 
      time: "16:00", 
      duration: 60
    },
  ];
  
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
          <Button className={cn("flex items-center gap-2", isMobile && "w-full")}>
            <Plus className="h-4 w-4" />
            Nueva Sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form for scheduling a new session */}
          <Card className="lg:col-span-1 order-2 lg:order-1 w-full">
            <CardHeader>
              <CardTitle className="text-lg">Nueva Sesión</CardTitle>
              <CardDescription>
                Complete los datos para agendar una sesión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Paciente</Label>
                <Select>
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-date">Fecha</Label>
                <Input 
                  id="session-date" 
                  type="date" 
                  value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => e.target.value && setSelectedDate(new Date(e.target.value))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-time">Hora</Label>
                  <Input id="session-time" type="time" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-duration">Duración</Label>
                  <Select defaultValue="60">
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
                <Select defaultValue="regular">
                  <SelectTrigger id="session-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Sesión Regular</SelectItem>
                    <SelectItem value="evaluation">Evaluación</SelectItem>
                    <SelectItem value="follow-up">Seguimiento</SelectItem>
                    <SelectItem value="first-time">Primera Consulta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea id="notes" placeholder="Detalles adicionales sobre la sesión..." />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end flex-col sm:flex-row gap-2">
              <Button variant="outline" className={isMobile ? "w-full" : "mr-2"}>Cancelar</Button>
              <Button className={isMobile ? "w-full" : ""}>Agendar Sesión</Button>
            </CardFooter>
          </Card>

          {/* Calendar Week View */}
          <Card className="lg:col-span-2 order-1 lg:order-2 w-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Calendario Semanal</CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" onClick={prevWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {format(weekStart, "d 'de' MMMM", { locale: es })} - {format(addDays(weekStart, 6), "d 'de' MMMM, yyyy", { locale: es })}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                <h3 className="text-sm font-medium">Sesiones programadas</h3>
                
                {scheduledSessions.map((session, i) => {
                  const patient = patients.find(p => p.id === session.patientId);
                  const isToday = isSameDay(session.date, selectedDate || new Date());
                  
                  return (
                    <Card 
                      key={i} 
                      className={cn(
                        "overflow-hidden border border-muted shadow-sm",
                        isToday && "border-escalando-300 bg-escalando-50"
                      )}
                    >
                      <div className="p-3 flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-10 rounded-full",
                          isToday ? "bg-escalando-400" : "bg-gray-200"
                        )} />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <div>
                              <p className="font-medium">{patient?.name}</p>
                              <div className="flex items-center text-sm text-muted-foreground flex-wrap">
                                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                <span>{format(session.date, "EEEE d 'de' MMMM", { locale: es })}</span>
                              </div>
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
                })}
                
                {scheduledSessions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay sesiones programadas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

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
              {scheduledSessions.map((session, i) => {
                const patient = patients.find(p => p.id === session.patientId);
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
                            <p className="text-sm text-muted-foreground truncate flex items-center">
                              <User className="h-3.5 w-3.5 mr-1" /> 
                              {patient?.name}
                            </p>
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
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default SessionScheduler;
