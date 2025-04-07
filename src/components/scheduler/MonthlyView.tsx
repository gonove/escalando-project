
import React from "react";
import { format, isSameDay, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { CalendarIcon, Clock } from "lucide-react";

interface MonthlyViewProps {
  monthDays: Date[];
  currentDate: Date;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  getSessionsForDate: (date: Date) => any[];
  getFilteredSessions: () => any[];
  therapists: any[];
  viewAll: boolean;
  selectedTherapist: string;
  patients: any[];
}

const MonthlyView: React.FC<MonthlyViewProps> = ({
  monthDays,
  currentDate,
  selectedDate,
  setSelectedDate,
  getSessionsForDate,
  getFilteredSessions,
  therapists,
  viewAll,
  selectedTherapist,
  patients
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, i) => (
          <div key={i} className="text-center p-2">
            <p className="text-xs text-muted-foreground uppercase">{day}</p>
          </div>
        ))}

        {monthDays.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const daySessionsCount = getSessionsForDate(day).length;

          return (
            <div
              key={i}
              className={cn(
                "p-1 h-20 border border-border/40 relative cursor-pointer",
                !isCurrentMonth && "bg-muted/20",
                isSelected && "ring-2 ring-primary ring-inset"
              )}
              onClick={() => setSelectedDate(day)}
            >
              <div className={cn(
                "flex justify-center items-center w-6 h-6 rounded-full mx-auto",
                isToday && "bg-escalando-100 text-escalando-900 dark:bg-escalando-900/20 dark:text-escalando-300",
                isSelected && "bg-primary text-primary-foreground"
              )}>
                {format(day, "d")}
              </div>

              {daySessionsCount > 0 && (
                <div className="mt-1">
                  <div className={cn(
                    "text-xs text-center w-full py-0.5 rounded",
                    daySessionsCount >= 12 ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300" :
                      daySessionsCount >= 8 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300" :
                        "bg-muted text-muted-foreground"
                  )}>
                    {daySessionsCount} {daySessionsCount === 1 ? "sesión" : "sesiones"}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Display sessions for selected date */}
      {selectedDate && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Sesiones programadas
              <span className="ml-2 text-muted-foreground">
                ({format(selectedDate, "d 'de' MMMM", { locale: es })})
              </span>
            </h3>
          </div>

          <div className="bg-muted/30 rounded-md p-4 dark:bg-muted/10">
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
                      className="overflow-hidden border border-muted shadow-sm dark:border-muted/50"
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
                              <span>{session.time} (45 min)</span>
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
      )}
    </div>
  );
};

export default MonthlyView;
