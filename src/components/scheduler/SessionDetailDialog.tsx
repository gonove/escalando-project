
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
import { sessionTypes } from '@/data/mockData';

interface SessionDetailDialogProps {
  session: any;
  patient: any;
  therapist: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: () => void;
  isPast: boolean;
  sessions?: any[]; // Add support for multiple sessions
}

const SessionDetailDialog: React.FC<SessionDetailDialogProps> = ({
  session,
  patient,
  therapist,
  open,
  onOpenChange,
  onReschedule,
  isPast,
  sessions = []
}) => {
  const navigate = useNavigate();
  const multipleSessions = sessions && sessions.length > 0;
  const currentSession = session || (multipleSessions ? sessions[0] : null);
  
  if (!currentSession) return null;
  
  const currentPatient = patient || (multipleSessions && sessions[0].patientId);
  const currentTherapist = therapist || (multipleSessions && sessions[0].therapistId);

  if (!currentPatient || !currentTherapist) return null;

  const getSessionTypeLabel = (type: string) => {
    return sessionTypes[type] || type;
  };

  const handleViewSummary = () => {
    navigate(`/sessions/summary/${currentPatient.id}/${currentSession.id}`);
    onOpenChange(false);
  };

  const handleCreateBilling = () => {
    navigate(`/sessions/billing/${currentPatient.id}/${currentSession.id}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {multipleSessions ? 'Sesiones programadas' : 'Detalles de la Sesión'}
          </DialogTitle>
          <DialogDescription>
            {multipleSessions 
              ? `${sessions.length} sesiones programadas en este horario` 
              : 'Información completa de la sesión programada'}
          </DialogDescription>
        </DialogHeader>

        {multipleSessions ? (
          <div className="space-y-4 py-4">
            {sessions.map((ses, index) => {
              const pat = ses.patient;
              const ther = ses.therapist;
              
              return (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/20 text-primary p-2 rounded-full">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{pat.name}</h3>
                            <p className="text-sm text-muted-foreground">{pat.diagnosis}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{getSessionTypeLabel(ses.type)}</Badge>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 text-primary p-2 rounded-full">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">Terapeuta</h3>
                          <p>{ther.name}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
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
                        <p>{currentPatient.name}</p>
                        <p className="text-sm text-muted-foreground">{currentPatient.diagnosis}</p>
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
                        <p>{currentTherapist.name}</p>
                        <p className="text-sm text-muted-foreground">{currentTherapist.specialty}</p>
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
                        <p>{format(new Date(currentSession.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
                        <p className="text-sm text-muted-foreground">{currentSession.time} ({currentSession.duration} minutos)</p>
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
                          <Badge variant="outline">{getSessionTypeLabel(currentSession.type)}</Badge>
                          {currentSession.isRecurring && <Badge variant="outline">Recurrente</Badge>}
                        </div>
                        {currentSession.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{currentSession.notes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {isPast && currentSession.progress && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 text-primary p-2 rounded-full">
                      <CalendarCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Progreso</h3>
                      <p className="text-sm mt-1">{currentSession.progress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 flex-wrap">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>

          {!multipleSessions && !isPast && (
            <Button variant="outline" onClick={onReschedule}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Reprogramar
            </Button>
          )}

          {!multipleSessions && isPast ? (
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
          ) : !multipleSessions && (
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
