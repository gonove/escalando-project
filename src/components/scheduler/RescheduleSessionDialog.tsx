
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RescheduleSessionDialogProps {
  session: any;
  patient: any;
  therapist: any;
  centerHours: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (sessionId: string, newDate: Date, newTime: string) => void;
  getSessionsAtDateTime: (date: Date, time: string) => any[];
}

const RescheduleSessionDialog: React.FC<RescheduleSessionDialogProps> = ({
  session,
  patient,
  therapist,
  centerHours,
  open,
  onOpenChange,
  onReschedule,
  getSessionsAtDateTime
}) => {
  const { toast } = useToast();
  const [newDate, setNewDate] = useState<string>(format(new Date(session?.date || new Date()), "yyyy-MM-dd"));
  const [newTime, setNewTime] = useState<string>(session?.time || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!session || !patient || !therapist) return null;

  const validateForm = () => {
    const formErrors: Record<string, string> = {};
    
    if (!newDate) {
      formErrors.date = "Debe seleccionar una fecha";
    }
    
    if (!newTime) {
      formErrors.time = "Debe seleccionar una hora";
    }
    
    // Check if the new date/time is already occupied by this therapist
    const selectedDate = new Date(newDate);
    const sessionsAtNewTime = getSessionsAtDateTime(selectedDate, newTime);
    const isTimeSlotBooked = sessionsAtNewTime.some(s => 
      s.therapistId === therapist.id && s.id !== session.id
    );
    
    if (isTimeSlotBooked) {
      formErrors.time = "Este horario ya está ocupado para este terapeuta";
    }
    
    // Check if the center is at full capacity at this time (3 sessions)
    if (sessionsAtNewTime.length >= 3 && !sessionsAtNewTime.some(s => s.id === session.id)) {
      formErrors.time = "El centro ya tiene 3 sesiones programadas en este horario";
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleReschedule = () => {
    if (!validateForm()) return;
    
    onReschedule(session.id, new Date(newDate), newTime);
    
    toast({
      title: "Sesión reprogramada",
      description: `La sesión ha sido reprogramada para el ${format(new Date(newDate), "d 'de' MMMM", { locale: es })} a las ${newTime}`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reprogramar Sesión</DialogTitle>
          <DialogDescription>
            Cambie la fecha u hora de la sesión
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm mb-4">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{patient.name}</span>
            <span className="text-muted-foreground mx-1">•</span>
            <span className="text-muted-foreground">{therapist.name}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date" className={errors.date ? "text-destructive" : ""}>
                Nueva fecha
              </Label>
              <Input
                id="reschedule-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className={errors.date ? "border-destructive" : ""}
              />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reschedule-time" className={errors.time ? "text-destructive" : ""}>
                Nueva hora
              </Label>
              <Select
                value={newTime}
                onValueChange={setNewTime}
              >
                <SelectTrigger id="reschedule-time" className={errors.time ? "border-destructive" : ""}>
                  <SelectValue placeholder="Seleccionar hora" />
                </SelectTrigger>
                <SelectContent>
                  {centerHours.map((hour) => {
                    const selectedDate = new Date(newDate);
                    const sessionsAtTime = getSessionsAtDateTime(selectedDate, hour);
                    
                    // Check if this time is booked by this therapist
                    const isTherapistBooked = sessionsAtTime.some(s => 
                      s.therapistId === therapist.id && s.id !== session.id
                    );
                    
                    // Check if center is at full capacity
                    const isFullCapacity = sessionsAtTime.length >= 3 && 
                      !sessionsAtTime.some(s => s.id === session.id);
                    
                    const isDisabled = isTherapistBooked || isFullCapacity;
                    
                    return (
                      <SelectItem 
                        key={hour} 
                        value={hour}
                        disabled={isDisabled}
                      >
                        {hour} {isDisabled && " (Ocupado)"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.time && (
                <p className="text-xs text-destructive">{errors.time}</p>
              )}
            </div>
          </div>
          
          <div className="pt-4 text-sm">
            <p className="font-medium">Información actual:</p>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{format(new Date(session.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}</span>
              <span className="mx-1">•</span>
              <Clock className="h-3.5 w-3.5" />
              <span>{session.time}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleReschedule}>
            Reprogramar Sesión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleSessionDialog;
