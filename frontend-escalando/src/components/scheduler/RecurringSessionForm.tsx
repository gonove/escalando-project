
import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { RecurrencePattern } from "@/types/models";

interface RecurringSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (recurrencePattern: RecurrencePattern) => void;
  initialDate: Date;
}

const RecurringSessionForm: React.FC<RecurringSessionFormProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialDate,
}) => {
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>({
    frequency: "weekly",
    interval: 1,
    dayOfWeek: initialDate.getDay(),
    endDate: format(new Date(initialDate.getFullYear(), initialDate.getMonth() + 2, initialDate.getDate()), "yyyy-MM-dd"),
    occurrences: 8,
  });

  const [endType, setEndType] = useState<"date" | "occurrences">("occurrences");
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(initialDate.getFullYear(), initialDate.getMonth() + 2, initialDate.getDate())
  );

  const handleFrequencyChange = (value: string) => {
    setRecurrencePattern({
      ...recurrencePattern,
      frequency: value as "daily" | "weekly" | "monthly",
    });
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setRecurrencePattern({
        ...recurrencePattern,
        interval: value,
      });
    }
  };

  const handleOccurrencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setRecurrencePattern({
        ...recurrencePattern,
        occurrences: value,
      });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      setRecurrencePattern({
        ...recurrencePattern,
        endDate: format(date, "yyyy-MM-dd"),
      });
    }
  };

  const handleEndTypeChange = (value: string) => {
    setEndType(value as "date" | "occurrences");
    
    // Reset the other end type value
    if (value === "date") {
      setRecurrencePattern({
        ...recurrencePattern,
        occurrences: undefined,
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      });
    } else {
      setRecurrencePattern({
        ...recurrencePattern,
        endDate: undefined,
        occurrences: 8,
      });
    }
  };

  const handleConfirm = () => {
    onConfirm(recurrencePattern);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Programar sesión recurrente</DialogTitle>
          <DialogDescription>
            Configure la frecuencia y duración de las sesiones recurrentes
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Fecha inicial</Label>
            <div className="p-2 border rounded-md bg-muted/20">
              {format(initialDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Repetir cada</Label>
              <Select
                value={recurrencePattern.frequency}
                onValueChange={handleFrequencyChange}
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Día</SelectItem>
                  <SelectItem value="weekly">Semana</SelectItem>
                  <SelectItem value="monthly">Mes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval">Intervalo</Label>
              <Input
                id="interval"
                type="number"
                min="1"
                value={recurrencePattern.interval}
                onChange={handleIntervalChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-type">Finalizar</Label>
            <Select
              value={endType}
              onValueChange={handleEndTypeChange}
            >
              <SelectTrigger id="end-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="occurrences">Después de un número de ocurrencias</SelectItem>
                <SelectItem value="date">En una fecha específica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {endType === "occurrences" ? (
            <div className="space-y-2">
              <Label htmlFor="occurrences">Número de ocurrencias</Label>
              <Input
                id="occurrences"
                type="number"
                min="1"
                value={recurrencePattern.occurrences}
                onChange={handleOccurrencesChange}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="end-date">Fecha de finalización</Label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                disabled={(date) => date < initialDate}
                initialFocus
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Programar sesiones recurrentes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringSessionForm;
