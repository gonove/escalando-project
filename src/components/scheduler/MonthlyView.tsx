
import React from "react";
import { format, isSameDay, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface MonthlyViewProps {
  monthDays: Date[];
  currentDate: Date;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  getSessionsForDate: (date: Date) => any[];
}

const MonthlyView: React.FC<MonthlyViewProps> = ({
  monthDays,
  currentDate,
  selectedDate,
  setSelectedDate,
  getSessionsForDate,
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
                isToday && "bg-escalando-100 text-escalando-900",
                isSelected && "bg-primary text-primary-foreground"
              )}>
                {format(day, "d")}
              </div>
              
              {daySessionsCount > 0 && (
                <div className="mt-1">
                  <div className={cn(
                    "text-xs text-center w-full py-0.5 rounded",
                    daySessionsCount >= 12 ? "bg-red-100 text-red-600" : 
                    daySessionsCount >= 8 ? "bg-amber-100 text-amber-600" : 
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
    </div>
  );
};

export default MonthlyView;
