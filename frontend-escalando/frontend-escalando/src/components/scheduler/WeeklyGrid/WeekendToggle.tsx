
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WeekendToggleProps {
  showWeekends: boolean;
  setShowWeekends: (show: boolean) => void;
}

const WeekendToggle: React.FC<WeekendToggleProps> = ({
  showWeekends,
  setShowWeekends,
}) => {
  return (
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
  );
};

export default WeekendToggle;
