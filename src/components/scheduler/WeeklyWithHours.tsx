
import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, isSameDay, addDays, isWeekend } from "date-fns";
import { es } from "date-fns/locale";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  Clock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import SessionsDataTable from "./SessionsDataTable";

interface WeeklyTimeWithHoursViewProps {
  weekDays: Date[];
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  centerHours: string[];
  getSessionsForDateTime: (date: Date, time: string) => any[];
  isTimeSlotAvailable: (date: Date, time: string) => boolean;
  getSessionsCountAtTime: (date: Date, time: string) => number;
  viewAll: boolean;
  selectedTherapist: string;
  therapists: any[];
  onScheduleClick: (date: Date, time: string) => void;
  showWeekends: boolean;
  setShowWeekends: (show: boolean) => void;
  onShowSessionDetails?: (sessions: any[]) => void;
}

export const WeeklyWithHours: React.FC<WeeklyTimeWithHoursViewProps> = ({
  weekDays,
  selectedDate,
  setSelectedDate,
  centerHours,
  getSessionsForDateTime,
  isTimeSlotAvailable,
  getSessionsCountAtTime,
  viewAll,
  selectedTherapist,
  therapists,
  onScheduleClick,
  showWeekends,
  setShowWeekends,
  onShowSessionDetails = () => {}
}) => {
  const isMobile = useIsMobile();
  
  // Filter weekdays if weekends should be hidden
  const displayDays = showWeekends 
    ? weekDays 
    : weekDays.filter(day => !isWeekend(day));

  // Track click times for detecting single vs double clicks
  const [lastClick, setLastClick] = useState<{
    time: number,
    date: Date | null,
    timeSlot: string | null
  }>({
    time: 0,
    date: null,
    timeSlot: null
  });

  // State for session details dialog
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    date: Date | null,
    time: string | null,
    sessions: any[]
  }>({
    date: null,
    time: null,
    sessions: []
  });

  const handleTimeSlotClick = (date: Date, time: string) => {
    const now = new Date().getTime();
    const sessions = getSessionsForDateTime(date, time);
    
    // Check if this is a double click (within 300ms of the last click on the same cell)
    if (
      lastClick.date && 
      lastClick.timeSlot && 
      isSameDay(lastClick.date, date) && 
      lastClick.timeSlot === time && 
      now - lastClick.time < 300
    ) {
      // Double click - show session details if there are sessions
      if (sessions.length > 0) {
        // Enhance sessions with full therapist and patient info
        const enhancedSessions = sessions.map(session => {
          const therapist = therapists.find(t => t.id === session.therapistId);
          return {
            ...session,
            therapist,
            patient: session.patient
          };
        });
        
        setSelectedTimeSlot({
          date,
          time,
          sessions: enhancedSessions
        });
        setShowDetailsDialog(true);
      }
      
      // Reset click tracking
      setLastClick({
        time: 0,
        date: null,
        timeSlot: null
      });
    } else {
      // Single click - schedule new appointment
      onScheduleClick(date, time);
      
      // Update last click information
      setLastClick({
        time: now,
        date: date,
        timeSlot: time
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-weekends" 
            checked={showWeekends}
            onCheckedChange={setShowWeekends}
          />
          <Label htmlFor="show-weekends" className="text-sm">
            {showWeekends ? "Ocultar fines de semana" : "Mostrar fines de semana"}
          </Label>
        </div>
      </div>
      
      <div className={cn(
        "grid gap-1 mb-2",
        showWeekends ? "grid-cols-8" : "grid-cols-6"
      )}>
        <div className="text-center pt-8 font-semibold text-xs text-muted-foreground uppercase">
          Hora
        </div>
        {displayDays.map((day, i) => (
          <div key={i} className="text-center">
            <p className="text-xs text-muted-foreground uppercase">
              {format(day, isMobile ? "EEE" : "EEEE", { locale: es })}
            </p>
            <Button
              variant={isSameDay(day, selectedDate || new Date()) ? "default" : "ghost"}
              className={cn(
                "w-full rounded-full font-normal",
                isSameDay(day, new Date()) && !isSameDay(day, selectedDate || new Date()) && "bg-escalando-100 text-escalando-900 hover:bg-escalando-200 hover:text-escalando-900 dark:bg-escalando-500/30 dark:text-escalando-100 dark:hover:bg-escalando-500/50"
              )}
              onClick={() => setSelectedDate(day)}
            >
              {format(day, "d")}
            </Button>
          </div>
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
        <div className={cn(
          "grid divide-x divide-border",
          showWeekends ? "grid-cols-8" : "grid-cols-6"
        )}>
          {/* Time slots column */}
          <div className="col-span-1 divide-y divide-border">
            {centerHours.map((hour, hourIndex) => (
              <div
                key={hourIndex}
                className="h-24 flex items-center justify-center p-1"
              >
                <span className="text-xs font-medium">{hour}</span>
              </div>
            ))}
          </div>

          {/* Days columns */}
          {displayDays.map((day, dayIndex) => (
            <div key={dayIndex} className="col-span-1 divide-y divide-border">
              {centerHours.map((hour, hourIndex) => {
                const sessions = getSessionsForDateTime(day, hour);
                const sessionsCount = getSessionsCountAtTime(day, hour);
                const hasCapacity = sessionsCount < 3;
                const isPastSession = day < new Date() || (isSameDay(day, new Date()) && hour < format(new Date(), 'HH:mm'));

                return (
                  <TooltipProvider key={hourIndex}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "h-24 relative cursor-pointer",
                            isSameDay(day, new Date()) && "bg-escalando-50 dark:bg-escalando-900/10",
                            !hasCapacity && "bg-gray-100 dark:bg-muted/20",
                            isPastSession && sessions.length > 0 && "bg-amber-50 dark:bg-amber-900/10" // Highlight past sessions that need evaluation
                          )}
                          onClick={() => handleTimeSlotClick(day, hour)}
                        >
                          {sessions.length > 0 ? (
                            <div className="absolute inset-0 p-0.5 overflow-hidden">
                              {sessions.slice(0, 2).map((session, idx) => {
                                const therapist = therapists.find(t => t.id === session.therapistId);
                                return (
                                  <div
                                    key={idx}
                                    className={cn(
                                      "text-xs p-0.5 mb-0.5 rounded truncate",
                                      isPastSession && (!session.reportStatus || session.reportStatus === 'pending')
                                        ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-900/50"
                                        : "bg-escalando-100 text-escalando-800 border border-escalando-200 dark:bg-escalando-900/30 dark:text-escalando-100 dark:border-escalando-900/50"
                                    )}
                                    title={`${session.patientName} - ${therapist?.name}`}
                                  >
                                    <span className="font-medium">{session.patientName}</span>
                                    {viewAll && (
                                      <span className="text-xs text-escalando-600 dark:text-escalando-200 ml-1">
                                        ({therapist?.name.split(' ')[0]})
                                      </span>
                                    )}
                                  </div>
                                );
                              })}

                              {sessions.length > 2 && (
                                <div className="text-xs text-center bg-gray-100 rounded dark:bg-muted/20">
                                  +{sessions.length - 2} más
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-full flex items-center justify-center">
                                {isSameDay(day, new Date()) || day > new Date() ? (
                                  <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600" />
                                ) : null}
                              </div>
                            </div>
                          )}

                          {sessionsCount > 0 && (
                            <div className="absolute top-1 right-1">
                              <span className={cn(
                                "text-xs rounded-full px-1.5 py-0.5 font-medium",
                                sessionsCount === 3 
                                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-200" 
                                  : isPastSession && sessions.some(s => !s.reportStatus || s.reportStatus === 'pending')
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
                                    : "bg-gray-100 text-gray-700 dark:bg-muted/30 dark:text-muted-foreground"
                              )}>
                                {sessionsCount}/3
                              </span>
                            </div>
                          )}

                          {/* Add indicator for past sessions that need evaluation */}
                          {isPastSession && sessions.some(s => !s.reportStatus || s.reportStatus === 'pending') && (
                            <div className="absolute bottom-1 right-1">
                              <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200 rounded-full px-1.5 py-0.5 font-medium">
                                Pendiente
                              </span>
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="dark:bg-popover dark:text-popover-foreground dark:border-border">
                        {sessions.length > 0 ? (
                          <div className="space-y-1 p-1">
                            <p className="font-medium text-xs">
                              {format(day, "EEEE d 'de' MMMM", { locale: es })} - {hour}
                            </p>
                            <div className="space-y-1">
                              {sessions.map((session, idx) => {
                                const therapist = therapists.find(t => t.id === session.therapistId);
                                const needsEvaluation = isPastSession && (!session.reportStatus || session.reportStatus === 'pending');
                                
                                return (
                                  <div key={idx} className="flex items-center text-xs gap-1">
                                    <User className="h-3 w-3" />
                                    <span>{session.patientName}</span>
                                    {viewAll && (
                                      <>
                                        <span>-</span>
                                        <span className="text-muted-foreground">{therapist?.name}</span>
                                      </>
                                    )}
                                    {needsEvaluation && (
                                      <span className="ml-1 text-amber-600 dark:text-amber-400">(Evaluación pendiente)</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-xs mt-1">
                              {hasCapacity ? 
                                `${3 - sessionsCount} horarios disponibles` : 
                                "Horario completo (3/3)"}
                            </p>
                            {isPastSession && sessions.some(s => !s.reportStatus || s.reportStatus === 'pending') && (
                              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                                Doble clic para ver sesiones que necesitan evaluación
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="p-1">
                            <p className="text-xs">Horario disponible</p>
                            <p className="text-xs font-medium">
                              {format(day, "EEEE d 'de' MMMM", { locale: es })} - {hour}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Duración: 45 minutos
                            </p>
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Session Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles de las Sesiones</DialogTitle>
          </DialogHeader>
          
          {selectedTimeSlot.date && selectedTimeSlot.time && (
            <SessionsDataTable 
              sessions={selectedTimeSlot.sessions}
              therapists={therapists}
              date={selectedTimeSlot.date}
              time={selectedTimeSlot.time}
              onViewDetails={(session) => {
                setShowDetailsDialog(false);
                onShowSessionDetails([session]);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
