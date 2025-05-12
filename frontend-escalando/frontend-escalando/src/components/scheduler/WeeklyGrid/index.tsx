
import React, { useState } from "react";
import { isWeekend, isSameDay, format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DayHeader from "./DayHeader";
import TimeColumn from "./TimeColumn";
import TimeSlotCell from "./TimeSlotCell";
import SessionContextMenu from "./SessionContextMenu";
import WeekendToggle from "./WeekendToggle";
import SessionsDataTable from "../SessionsDataTable";
import { useIsMobile } from "@/hooks/use-mobile";

interface WeeklyGridProps {
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

const WeeklyGrid: React.FC<WeeklyGridProps> = ({
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

  // Handle context menu (right click)
  const handleContextMenu = (date: Date, time: string) => {
    const sessions = getSessionsForDateTime(date, time);
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
      
      // Set the selected time slot data
      setSelectedTimeSlot({
        date,
        time,
        sessions: enhancedSessions
      });
    }
  };

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

  const handleViewDetails = () => {
    if (selectedTimeSlot.sessions.length > 0) {
      setShowDetailsDialog(true);
    }
  };

  return (
    <div className="space-y-4">
      <WeekendToggle showWeekends={showWeekends} setShowWeekends={setShowWeekends} />
      
      <div className={cn(
        "grid gap-1 mb-2",
        showWeekends ? "grid-cols-8" : "grid-cols-6"
      )}>
        <div className="text-center pt-8 font-semibold text-xs text-muted-foreground uppercase">
          Hora
        </div>
        {displayDays.map((day, i) => (
          <DayHeader 
            key={i} 
            day={day} 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate} 
            isMobile={isMobile}
          />
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden bg-white dark:bg-card">
        <div className={cn(
          "grid divide-x divide-border",
          showWeekends ? "grid-cols-8" : "grid-cols-6"
        )}>
          {/* Time slots column */}
          <TimeColumn hours={centerHours} />

          {/* Days columns */}
          {displayDays.map((day, dayIndex) => (
            <div key={dayIndex} className="col-span-1 divide-y divide-border">
              {centerHours.map((hour, hourIndex) => {
                const sessions = getSessionsForDateTime(day, hour);
                const sessionsCount = getSessionsCountAtTime(day, hour);
                const isPastSession = day < new Date() || (isSameDay(day, new Date()) && hour < format(new Date(), 'HH:mm'));

                return (
                  <SessionContextMenu 
                    key={hourIndex}
                    hasActiveSessions={sessions.length > 0}
                    onViewDetails={handleViewDetails}
                    onShowSessionDetails={() => onShowSessionDetails(selectedTimeSlot.sessions)}
                  >
                    <TimeSlotCell
                      day={day}
                      hour={hour}
                      sessions={sessions}
                      sessionsCount={sessionsCount}
                      isPastSession={isPastSession}
                      therapists={therapists}
                      viewAll={viewAll}
                      onClick={() => handleTimeSlotClick(day, hour)}
                      onContextMenu={() => handleContextMenu(day, hour)}
                    />
                  </SessionContextMenu>
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

export default WeeklyGrid;
