
import React from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DayHeaderProps {
  day: Date;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  isMobile: boolean;
}

const DayHeader: React.FC<DayHeaderProps> = ({
  day,
  selectedDate,
  setSelectedDate,
  isMobile,
}) => {
  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground uppercase">
        {format(day, isMobile ? "EEE" : "EEEE", { locale: es })}
      </p>
      <Button
        variant={isSameDay(day, selectedDate || new Date()) ? "default" : "ghost"}
        className={cn(
          "w-full rounded-full font-normal",
          isSameDay(day, new Date()) && 
          !isSameDay(day, selectedDate || new Date()) && 
          "bg-escalando-100 text-escalando-900 hover:bg-escalando-200 hover:text-escalando-900 dark:bg-escalando-500/30 dark:text-escalando-100 dark:hover:bg-escalando-500/50"
        )}
        onClick={() => setSelectedDate(day)}
      >
        {format(day, "d")}
      </Button>
    </div>
  );
};

export default DayHeader;
