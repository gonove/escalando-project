
import React, { useState } from "react";
import { format, getDay, isBefore, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Calendar, Clock } from "lucide-react";

interface WeeklyWithHoursProps {
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
  onRescheduleClick?: (session: any) => void;
  onViewDetailClick?: (session: any) => void;
}

export const WeeklyWithHours: React.FC<WeeklyWithHoursProps> = ({
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
  onRescheduleClick,
  onViewDetailClick
}) => {
  const [showWeekends, setShowWeekends] = useState(false);
  
  // Filter out weekends if not showing them
  const displayedDays = showWeekends 
    ? weekDays 
    : weekDays.filter(day => {
        const dayOfWeek = getDay(day);
        return dayOfWeek !== 0 && dayOfWeek !== 6; // 0 is Sunday, 6 is Saturday
      });
  
  const now = new Date();
  const isDateInPast = (date: Date) => isBefore(date, now) && !isSameDay(date, now);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-weekends" 
            checked={showWeekends} 
            onCheckedChange={setShowWeekends} 
          />
          <Label htmlFor="show-weekends">Mostrar fines de semana</Label>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(150px,1fr))]">
          {/* Header row with days */}
          <div className="bg-muted/30 p-2 border-b border-r flex items-center justify-center">
            <span className="text-xs font-medium">Horas</span>
          </div>
          
          {displayedDays.map((day, i) => {
            const isToday = isSameDay(day, new Date());
            const isPast = isDateInPast(day);
            const dayOfWeek = getDay(day);
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            return (
              <div
                key={i}
                className={cn(
                  "p-2 text-center border-b border-r",
                  isToday ? "bg-escalando-50 dark:bg-escalando-900/10" : "",
                  isPast ? "bg-gray-50 dark:bg-muted/10" : "",
                  isWeekend ? "bg-gray-100 dark:bg-muted/30" : ""
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-xs uppercase text-muted-foreground">
                  {format(day, "EEEE", { locale: es })}
                </div>
                <div className={cn(
                  "font-medium",
                  isToday ? "text-escalando-800 dark:text-escalando-100" : ""
                )}>
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
          
          {/* Time slots with sessions */}
          {centerHours.map((hour, hourIndex) => (
            <React.Fragment key={hourIndex}>
              <div
                className={cn(
                  "p-2 border-b border-r flex items-center justify-center bg-muted/10 dark:bg-muted/5",
                  hourIndex % 2 !== 0 ? "bg-muted/20 dark:bg-muted/10" : ""
                )}
              >
                <span className="text-xs">{hour}</span>
              </div>
              
              {displayedDays.map((day, dayIndex) => {
                const sessions = getSessionsForDateTime(day, hour);
                const isAvailable = isTimeSlotAvailable(day, hour);
                const sessionCount = getSessionsCountAtTime(day, hour);
                const isPast = isDateInPast(day);
                
                return (
                  <div
                    key={`${hourIndex}-${dayIndex}`}
                    className={cn(
                      "h-16 relative cursor-pointer",
                      isSameDay(day, new Date()) && "bg-escalando-50 dark:bg-escalando-900/10",
                      !isAvailable && "bg-gray-100 dark:bg-muted/20",
                      isPast && "bg-gray-50 dark:bg-muted/10",
                      getDay(day) === 0 || getDay(day) === 6 ? "bg-gray-100 dark:bg-muted/30" : ""
                    )}
                    onClick={() => !isPast && isAvailable && onScheduleClick(day, hour)}
                  >
                    <div className="p-1 h-full overflow-hidden">
                      {sessions.length > 0 ? (
                        <div className="space-y-1">
                          {sessions.slice(0, 2).map((session, i) => {
                            const therapist = therapists.find(t => t.id === session.therapistId);
                            return (
                              <TooltipProvider key={i}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div 
                                      className={cn(
                                        "text-xs p-1 rounded truncate flex items-center justify-between",
                                        "bg-escalando-100 text-escalando-800 border border-escalando-200 dark:bg-escalando-900/30 dark:text-escalando-100"
                                      )}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // If past session, view detail, otherwise offer to reschedule
                                        if (isPast && onViewDetailClick) {
                                          onViewDetailClick(session);
                                        } else if (onRescheduleClick) {
                                          onRescheduleClick(session);
                                        }
                                      }}
                                    >
                                      <span className="truncate">{session.patientName}</span>
                                      <div 
                                        className="w-2 h-2 rounded-full ml-1 flex-shrink-0" 
                                        style={{ backgroundColor: therapist?.color || '#888' }}
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-xs space-y-1">
                                      <p className="font-medium">{session.patientName}</p>
                                      <p className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {format(day, "d MMM yyyy", { locale: es })}
                                      </p>
                                      <p className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {hour} ({session.duration} min)
                                      </p>
                                      <p>{therapist?.name}</p>
                                      <p className="italic">{isPast ? "Clic para ver detalle" : "Clic para reprogramar"}</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}

                          {sessions.length > 2 && (
                            <div className="text-xs text-center bg-gray-100 rounded dark:bg-muted/20">
                              +{sessions.length - 2} más
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          {!isPast && isAvailable && (
                            <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {sessionCount > 0 && (
                      <div className={cn(
                        "absolute top-0 right-0 text-[9px] font-medium px-1",
                        sessionCount >= 3 ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200" : 
                        sessionCount >= 2 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200" : 
                        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                      )}>
                        {sessionCount}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
