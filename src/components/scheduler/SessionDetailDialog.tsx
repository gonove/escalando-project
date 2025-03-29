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
  Receipt,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { sessionTypes } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface SessionDetailDialogProps {
  session: any;
  patient: any;
  therapist: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: () => void;
  isPast: boolean;
  sessions?: any[]; // Support for multiple sessions (up to 3 per time slot)
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
  
  const currentPatient = patient || (multipleSessions && sessions[0].patient);
  const currentTherapist = therapist || (multipleSessions && sessions[0].therapist);

  if (!currentPatient || !currentTherapist) return null;

  const getSessionTypeLabel = (type: string) => {
    return sessionTypes[type] || type;
  };

  const handleViewSummary = (patientId: string, sessionId: string) => {
    navigate(`/sessions/summary/${patientId}/${sessionId}`);
    onOpenChange(false);
  };

  const handleCreateBilling = (patientId: string, sessionId: string) => {
    navigate(`/sessions/billing/${patientId}/${sessionId}`);
    onOpenChange(false);
  };
  
  const handleAddNotes = (patientId: string, sessionId: string) => {
    navigate(`/sessions/summary/${patientId}/${sessionId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {multipleSessions ? 'Sesiones programadas' : 'Detalles de la Sesión'}
          </DialogTitle>
          <DialogDescription>
            {multipleSessions 
              ? `${sessions.length} ${sessions.length === 1 ? 'sesión programada' : 'sesiones programadas'} en este horario` 
              : 'Información completa de la sesión programada'}
          </DialogDescription>
        </DialogHeader>

        {multipleSessions ? (
          <div className="space-y-4 py-4">
            <Card className="bg-muted/30 border-muted">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(sessions[0].date), "EEEE d 'de' MMMM, yyyy", { locale: es })} • {sessions[0].time}
                  </span>
                  <Badge variant="outline" className="ml-auto">
                    {sessions.length}/3 sesiones
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="all">
                  <Users className="h-4 w-4 mr-2" />
                  Todas las sesiones
                </TabsTrigger>
                <TabsTrigger value="details">
                  <FileText className="h-4 w-4 mr-2" />
                  Detalle individual
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4 space-y-4">
                {sessions.map((ses, index) => {
                  const pat = ses.patient;
                  const ther = ses.therapist;
                  const isSessionPast = new Date(ses.date + 'T' + ses.time) < new Date();
                  
                  return (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-escalando-500">{getSessionTypeLabel(ses.type)}</Badge>
                            {ses.isRecurring && <Badge variant="outline">Recurrente</Badge>}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-4 pt-2">
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/20 text-primary p-2 rounded-full">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{pat.name}</h3>
                              <p className="text-sm text-muted-foreground">{pat.diagnosis}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/20 text-primary p-2 rounded-full">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">Terapeuta</h3>
                              <p>{ther.name}</p>
                              <p className="text-xs text-muted-foreground">{ther.specialty}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 pt-2">
                            {!isSessionPast ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAddNotes(pat.id, ses.id)}
                              >
                                <FileEdit className="h-3.5 w-3.5 mr-1" />
                                Añadir Notas
                              </Button>
                            ) : (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewSummary(pat.id, ses.id)}
                                >
                                  <FileEdit className="h-3.5 w-3.5 mr-1" />
                                  Ver Resumen
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => handleCreateBilling(pat.id, ses.id)}
                                >
                                  <Receipt className="h-3.5 w-3.5 mr-1" />
                                  Facturación
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                {sessions.map((ses, index) => {
                  const pat = ses.patient;
                  const ther = ses.therapist;
                  const isSessionPast = new Date(ses.date + 'T' + ses.time) < new Date();
                  
                  return (
                    <div key={index} className={index > 0 ? "mt-6" : ""}>
                      {index > 0 && <Separator className="mb-6" />}
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="font-medium">Sesión {index + 1}</h3>
                        <Badge className="bg-escalando-500">{getSessionTypeLabel(ses.type)}</Badge>
                        {ses.isRecurring && <Badge variant="outline">Recurrente</Badge>}
                      </div>
                      
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
                                  <p>{pat.name}</p>
                                  <p className="text-sm text-muted-foreground">{pat.diagnosis}</p>
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
                                  <p>{ther.name}</p>
                                  <p className="text-sm text-muted-foreground">{ther.specialty}</p>
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
                                  <p>{format(new Date(ses.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
                                  <p className="text-sm text-muted-foreground">{ses.time} ({ses.duration} minutos)</p>
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
                                    <Badge variant="outline">{getSessionTypeLabel(ses.type)}</Badge>
                                    {ses.isRecurring && <Badge variant="outline">Recurrente</Badge>}
                                  </div>
                                  {ses.notes && (
                                    <p className="text-sm text-muted-foreground mt-2">{ses.notes}</p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {isSessionPast && ses.progress && (
                        <Card className="mt-4">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/20 text-primary p-2 rounded-full">
                                <CalendarCheck className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium">Progreso</h3>
                                <p className="text-sm mt-1">{ses.progress}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div className="flex justify-end gap-2 mt-4">
                        {!isSessionPast ? (
                          <Button 
                            variant="outline"
                            onClick={() => handleAddNotes(pat.id, ses.id)}
                          >
                            <FileEdit className="h-4 w-4 mr-2" />
                            Añadir Notas
                          </Button>
                        ) : (
                          <>
                            <Button 
                              variant="outline"
                              onClick={() => handleViewSummary(pat.id, ses.id)}
                            >
                              <FileEdit className="h-4 w-4 mr-2" />
                              Ver Resumen
                            </Button>
                            <Button 
                              variant="secondary"
                              onClick={() => handleCreateBilling(pat.id, ses.id)}
                            >
                              <Receipt className="h-4 w-4 mr-2" />
                              Facturación
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </TabsContent>
            </Tabs>
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
              <Button onClick={() => handleViewSummary(currentPatient.id, currentSession.id)}>
                <FileEdit className="h-4 w-4 mr-2" />
                Ver Resumen
              </Button>

              <Button variant="secondary" onClick={() => handleCreateBilling(currentPatient.id, currentSession.id)}>
                <Receipt className="h-4 w-4 mr-2" />
                Facturación
              </Button>
            </>
          ) : !multipleSessions && (
            <Button onClick={() => handleAddNotes(currentPatient.id, currentSession.id)}>
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
