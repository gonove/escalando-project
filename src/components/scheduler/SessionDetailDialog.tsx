
import React from 'react';
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
import {
  CalendarIcon,
  Clock,
  User,
  FileText,
  CalendarCheck,
  FileEdit,
  Receipt
} from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface SessionDetailDialogProps {
  session: any;
  patient: any;
  therapist: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: () => void;
  isPast: boolean;
}

const SessionDetailDialog: React.FC<SessionDetailDialogProps> = ({
  session,
  patient,
  therapist,
  open,
  onOpenChange,
  onReschedule,
  isPast
}) => {
  const navigate = useNavigate();

  if (!session || !patient || !therapist) return null;

  const getSessionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'regular': 'Sesión Regular',
      'evaluation': 'Evaluación',
      'follow-up': 'Seguimiento',
      'first-time': 'Primera Consulta'
    };
    return types[type] || type;
  };

  const handleViewSummary = () => {
    navigate(`/sessions/summary/${patient.id}/${session.id}`);
    onOpenChange(false);
  };

  const handleCreateBilling = () => {
    navigate(`/sessions/billing/${patient.id}/${session.id}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles de la Sesión</DialogTitle>
          <DialogDescription>
            Información completa de la sesión programada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary p-2 rounded-full">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Paciente</h3>
                      <p>{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.diagnosis}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary p-2 rounded-full">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Terapeuta</h3>
                      <p>{therapist.name}</p>
                      <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary p-2 rounded-full">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Fecha y Hora</h3>
                      <p>{format(new Date(session.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
                      <p className="text-sm text-muted-foreground">{session.time} ({session.duration} minutos)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary p-2 rounded-full">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Detalles</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{getSessionTypeLabel(session.type)}</Badge>
                        {session.isRecurring && <Badge variant="outline">Recurrente</Badge>}
                      </div>
                      {session.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{session.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {isPast && session.progress && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 text-primary p-2 rounded-full">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Progreso</h3>
                    <p className="text-sm mt-1">{session.progress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>

          {!isPast && (
            <Button variant="outline" onClick={onReschedule}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Reprogramar
            </Button>
          )}

          {isPast ? (
            <>
              <Button onClick={handleViewSummary}>
                <FileEdit className="h-4 w-4 mr-2" />
                Ver Resumen
              </Button>

              <Button variant="secondary" onClick={handleCreateBilling}>
                <Receipt className="h-4 w-4 mr-2" />
                Facturación
              </Button>
            </>
          ) : (
            <Button onClick={handleViewSummary}>
              <FileEdit className="h-4 w-4 mr-2" />
              Añadir Notas
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailDialog;
