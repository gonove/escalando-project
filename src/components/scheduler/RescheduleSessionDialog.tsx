
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
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patients, therapists, centerHours } from "@/data/mockData";

interface RescheduleSessionDialogProps {
  session: any;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (updatedSession: any) => void;
}

const RescheduleSessionDialog: React.FC<RescheduleSessionDialogProps> = ({
  session,
  isOpen,
  onClose,
  onReschedule
}) => {
  const [newDate, setNewDate] = useState(
    session?.date instanceof Date 
      ? format(session.date, "yyyy-MM-dd") 
      : format(new Date(session?.date || new Date()), "yyyy-MM-dd")
  );
  const [newTime, setNewTime] = useState(session?.time || "09:00");
  const [errorMsg, setErrorMsg] = useState("");

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      setErrorMsg("Por favor selecciona una fecha y hora");
      return;
    }
    
    // Check if selected date is a weekend
    const selectedDate = new Date(newDate);
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setErrorMsg("No se pueden programar sesiones en fin de semana");
      return;
    }
    
    // Create updated session
    const updatedSession = {
      ...session,
      date: selectedDate,
      time: newTime
    };
    
    onReschedule(updatedSession);
  };

  if (!session) return null;

  const patient = patients.find(p => p.id === session.patientId);
  const therapist = therapists.find(t => t.id === session.therapistId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reprogramar Sesión</DialogTitle>
          <DialogDescription>
            Cambia la fecha y hora de la sesión para {patient?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-escalando-100 p-2 dark:bg-escalando-900/30">
                <User className="h-4 w-4 text-escalando-800 dark:text-escalando-100" />
              </div>
              <div>
                <p className="font-medium">{patient?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Con {therapist?.name} ({therapist?.specialty})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-escalando-100 p-2 dark:bg-escalando-900/30">
                <Calendar className="h-4 w-4 text-escalando-800 dark:text-escalando-100" />
              </div>
              <div>
                <p className="font-medium">Fecha y hora actual</p>
                <p className="text-sm text-muted-foreground">
                  {session.date instanceof Date 
                    ? format(session.date, "d 'de' MMMM 'de' yyyy", { locale: es }) 
                    : format(new Date(session.date), "d 'de' MMMM 'de' yyyy", { locale: es })} a las {session.time}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-date">Nueva fecha</Label>
            <Input
              id="new-date"
              type="date"
              value={newDate}
              onChange={(e) => {
                setNewDate(e.target.value);
                setErrorMsg("");
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-time">Nueva hora</Label>
            <Select
              value={newTime}
              onValueChange={(value) => {
                setNewTime(value);
                setErrorMsg("");
              }}
            >
              <SelectTrigger id="new-time">
                <SelectValue placeholder="Seleccionar hora" />
              </SelectTrigger>
              <SelectContent>
                {centerHours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {errorMsg && (
            <div className="text-destructive text-sm py-1">
              {errorMsg}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
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
