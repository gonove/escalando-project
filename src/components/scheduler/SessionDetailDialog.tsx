
import React from "react";
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
import { Calendar, Clock, User, FileText, Clipboard, Tag } from "lucide-react";
import { sessionTypes, patients, therapists } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

interface SessionDetailDialogProps {
  session: any;
  isOpen: boolean;
  onClose: () => void;
  onReschedule?: () => void;
  onGenerateReport?: () => void;
  onGenerateInvoice?: () => void;
}

const SessionDetailDialog: React.FC<SessionDetailDialogProps> = ({
  session,
  isOpen,
  onClose,
  onReschedule,
  onGenerateReport,
  onGenerateInvoice
}) => {
  if (!session) return null;

  const patient = patients.find(p => p.id === session.patientId);
  const therapist = therapists.find(t => t.id === session.therapistId);
  const sessionType = sessionTypes.find(t => t.id === session.type);
  const isPast = new Date(session.date) < new Date();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle de Sesión</DialogTitle>
          <DialogDescription>
            Información de la sesión programada
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
                  {patient?.age} años • {patient?.diagnosis}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-escalando-100 p-2 dark:bg-escalando-900/30">
                <Calendar className="h-4 w-4 text-escalando-800 dark:text-escalando-100" />
              </div>
              <div>
                <p className="font-medium">
                  {session.date instanceof Date 
                    ? format(session.date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
                    : format(new Date(session.date), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {session.time} ({session.duration} minutos)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-escalando-100 p-2 dark:bg-escalando-900/30">
                <User className="h-4 w-4 text-escalando-800 dark:text-escalando-100" />
              </div>
              <div>
                <p className="font-medium">{therapist?.name}</p>
                <p className="text-sm text-muted-foreground">{therapist?.specialty}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-escalando-100 p-2 dark:bg-escalando-900/30">
                <Tag className="h-4 w-4 text-escalando-800 dark:text-escalando-100" />
              </div>
              <div>
                <p className="font-medium">Tipo de sesión</p>
                <p className="text-sm text-muted-foreground">{sessionType?.name}</p>
              </div>
            </div>

            {session.notes && (
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-escalando-100 p-2 dark:bg-escalando-900/30">
                  <Clipboard className="h-4 w-4 text-escalando-800 dark:text-escalando-100" />
                </div>
                <div>
                  <p className="font-medium">Notas</p>
                  <p className="text-sm text-muted-foreground">{session.notes}</p>
                </div>
              </div>
            )}

            {session.billingStatus && (
              <div className="flex items-center mt-2">
                <p className="text-sm mr-2">Estado factura:</p>
                <Badge variant="outline" className={
                  session.billingStatus === "completed" 
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-100" 
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100"
                }>
                  {session.billingStatus === "completed" ? "Completada" : "Pendiente"}
                </Badge>
              </div>
            )}

            {session.reportStatus && (
              <div className="flex items-center mt-2">
                <p className="text-sm mr-2">Estado informe:</p>
                <Badge variant="outline" className={
                  session.reportStatus === "completed" 
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-100" 
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100"
                }>
                  {session.reportStatus === "completed" ? "Completado" : "Pendiente"}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          
          {!isPast && onReschedule && (
            <Button onClick={onReschedule}>
              Reprogramar
            </Button>
          )}
          
          {isPast && session.reportStatus !== "completed" && onGenerateReport && (
            <Button onClick={onGenerateReport}>
              <FileText className="h-4 w-4 mr-1" />
              Crear Informe
            </Button>
          )}
          
          {isPast && session.billingStatus !== "completed" && onGenerateInvoice && (
            <Button onClick={onGenerateInvoice}>
              <FileText className="h-4 w-4 mr-1" />
              Generar Factura
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailDialog;
