
import React from "react";
import { cn } from "@/lib/utils";
import SessionPreview from "./SessionPreview";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimeSlotCellProps {
  day: Date;
  hour: string;
  sessions: any[];
  sessionsCount: number;
  isPastSession: boolean;
  therapists: any[];
  viewAll: boolean;
  onClick: () => void;
  onContextMenu: () => void;
}

const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  day,
  hour,
  sessions,
  sessionsCount,
  isPastSession,
  therapists,
  viewAll,
  onClick,
  onContextMenu,
}) => {
  const hasCapacity = sessionsCount < 3;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "h-16 relative cursor-pointer",
              isSameDay(day, new Date()) && "bg-escalando-50 dark:bg-escalando-900/10",
              !hasCapacity && "bg-gray-100 dark:bg-muted/20",
              isPastSession && sessions.length > 0 && "bg-amber-50 dark:bg-amber-900/10"
            )}
            onClick={onClick}
            onContextMenu={onContextMenu}
          >
            <SessionPreview 
              sessions={sessions} 
              viewAll={viewAll} 
              therapists={therapists} 
              isPastSession={isPastSession} 
            />

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
              <p className="text-xs text-muted-foreground mt-1">
                Duración: 45 minutos
              </p>
              {sessions.length > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                  Doble clic o clic derecho para ver detalles
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
};

export default TimeSlotCell;
