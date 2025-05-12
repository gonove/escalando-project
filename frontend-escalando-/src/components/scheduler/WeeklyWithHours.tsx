
import React from "react";
import WeeklyGrid from "./WeeklyGrid";

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

export const WeeklyWithHours: React.FC<WeeklyTimeWithHoursViewProps> = (props) => {
  return <WeeklyGrid {...props} />;
};
