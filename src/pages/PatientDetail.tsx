
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  Edit,
  FileText,
  Activity,
  Phone,
  Mail,
  Clock,
  Calendar,
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  getPatientById,
  getSessionsByPatient,
  getProfessionalById,
} from "@/data/mockData";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get patient data
  const patient = id ? getPatientById(id) : undefined;
  const sessions = id ? getSessionsByPatient(id) : [];
  const professional = patient?.professionalId 
    ? getProfessionalById(patient.professionalId) 
    : undefined;
  
  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Paciente no encontrado</h2>
          <p className="text-muted-foreground mb-6">
            No se encontró ningún paciente con el ID proporcionado.
          </p>
          <Button onClick={() => navigate("/patients")}>
            Volver a Pacientes
          </Button>
        </div>
      </Layout>
    );
  }

  // Calculate patient age
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 1) {
      // For babies less than 1 year old, show age in months
      const ageInMonths = today.getMonth() - birthDate.getMonth() + 
        (today.getFullYear() - birthDate.getFullYear()) * 12;
      return `${ageInMonths} meses`;
    }
    
    return `${age} años`;
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/patients")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{patient.name}</h1>
            <p className="text-muted-foreground flex items-center">
              {calculateAge(patient.dateOfBirth)}
              {patient.diagnosis && (
                <>
                  <span className="mx-2">•</span>
                  {patient.diagnosis}
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/sessions/new?patientId=${patient.id}`}>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Sesión
              </Button>
            </Link>
            <Link to={`/patients/${patient.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="mb-6">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="sessions">Sesiones</TabsTrigger>
            <TabsTrigger value="progress">Progreso</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</div>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-therapy-600" />
                      {new Date(patient.dateOfBirth).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Nombre del Responsable</div>
                    <div className="mt-1">{patient.parentName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Contacto</div>
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-2 text-therapy-600" />
                      {patient.contactNumber}
                    </div>
                  </div>
                  {patient.email && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Correo Electrónico</div>
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 mr-2 text-therapy-600" />
                        {patient.email}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Clínica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.diagnosis && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Diagnóstico</div>
                      <Badge variant="outline" className="mt-1 bg-therapy-50 text-therapy-800 hover:bg-therapy-100">
                        {patient.diagnosis}
                      </Badge>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Profesional Asignado</div>
                    <div className="flex items-center mt-1">
                      {professional?.name} • {professional?.specialty}
                    </div>
                  </div>
                  {patient.notes && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Notas</div>
                      <div className="p-3 bg-muted/50 rounded-md mt-1 text-sm">{patient.notes}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Tratamiento</CardTitle>
                <CardDescription>
                  {sessions.length > 0
                    ? `${sessions.length} sesiones registradas`
                    : "No hay sesiones registradas"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Primera Sesión</div>
                        <div className="flex items-center mt-1">
                          <CalendarClock className="h-4 w-4 mr-2 text-therapy-600" />
                          {new Date(sessions[sessions.length - 1].date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Última Sesión</div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-2 text-therapy-600" />
                          {new Date(sessions[0].date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">Último Progreso Registrado</div>
                      <div className="flex items-start">
                        <Activity className="h-5 w-5 mr-2 text-therapy-600 mt-0.5" />
                        <p>{sessions[0].progress}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-4">No hay sesiones registradas para este paciente.</p>
                    <Link to={`/sessions/new?patientId=${patient.id}`}>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Primera Sesión
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sessions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Historial de Sesiones</CardTitle>
                  <CardDescription>
                    Detalle de todas las sesiones realizadas
                  </CardDescription>
                </div>
                <Link to={`/sessions/new?patientId=${patient.id}`}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Sesión
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-6">
                    {sessions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((session) => (
                        <div key={session.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-muted/50 px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-therapy-600" />
                              <span className="font-medium">
                                {new Date(session.date).toLocaleDateString('es-ES', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Link to={`/sessions/${session.id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </div>
                          <div className="p-4 space-y-4">
                            <div>
                              <div className="text-sm font-medium text-muted-foreground mb-1">Notas de la Sesión</div>
                              <p>{session.notes}</p>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-muted-foreground mb-1">Progreso</div>
                              <p>{session.progress}</p>
                            </div>
                            {session.exercises && session.exercises.length > 0 && (
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-2">Ejercicios Asignados</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {session.exercises.map((exercise) => (
                                    <div key={exercise.id} className="bg-accent/50 p-3 rounded-md">
                                      <div className="font-medium">{exercise.name}</div>
                                      <div className="text-sm">{exercise.description}</div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {exercise.frequency && `${exercise.frequency} • `}
                                        {exercise.duration}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {session.recommendations && (
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Recomendaciones</div>
                                <p className="text-sm">{session.recommendations}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-6">No hay sesiones registradas para este paciente.</p>
                    <Link to={`/sessions/new?patientId=${patient.id}`}>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Primera Sesión
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Seguimiento de Progreso</CardTitle>
                <CardDescription>
                  Visualiza el avance del paciente a lo largo del tiempo
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {sessions.length > 0 ? (
                  <div className="space-y-8">
                    <div className="relative pt-8">
                      <div className="absolute left-4 h-full w-0.5 bg-muted-foreground/20" />
                      {sessions
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((session, index) => (
                          <div key={session.id} className="relative pl-10 pb-8">
                            <div className="absolute left-2 -translate-x-1/2 w-6 h-6 rounded-full bg-therapy-500 flex items-center justify-center">
                              <span className="text-xs font-medium text-white">{sessions.length - index}</span>
                            </div>
                            <div className="mb-2">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-therapy-600" />
                                <h3 className="text-base font-medium">
                                  {new Date(session.date).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </h3>
                              </div>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-4">
                              <h4 className="font-medium mb-2">Progreso Observado</h4>
                              <p>{session.progress}</p>
                              {session.recommendations && (
                                <>
                                  <Separator className="my-3" />
                                  <h4 className="font-medium mb-2">Recomendaciones</h4>
                                  <p className="text-sm">{session.recommendations}</p>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-6">No hay datos de progreso disponibles.</p>
                    <p className="text-sm max-w-md mx-auto mb-4">
                      Para registrar el progreso del paciente, necesitas crear sesiones de tratamiento.
                    </p>
                    <Link to={`/sessions/new?patientId=${patient.id}`}>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Primera Sesión
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default PatientDetail;
