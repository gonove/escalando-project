
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Edit, Phone, User, MapPin, FileText, Plus, ChevronDown, ChevronUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { patients, getSessionsByPatient } from "@/data/mockData";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Find the patient by ID
  const patient = patients.find(p => p.id === id);
  
  // Get all sessions for this patient
  const patientSessions = id ? getSessionsByPatient(id) : [];
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...patientSessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
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
  
  // Handle session expansion toggle
  const toggleSession = (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };
  
  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Paciente no encontrado</h2>
          <p className="text-muted-foreground mb-6">No pudimos encontrar el paciente solicitado.</p>
          <Link to="/patients">
            <Button>Volver a Pacientes</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Back button on desktop (mobile is handled in Layout) */}
        {!isMobile && (
          <div className="flex items-center">
            <Link to="/patients">
              <Button variant="ghost" className="-ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Pacientes
              </Button>
            </Link>
          </div>
        )}
        
        {/* Patient header section */}
        <div className={cn(
          "flex flex-col space-y-4", 
          !isMobile && "sm:flex-row sm:items-start sm:justify-between sm:space-y-0"
        )}>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border">
              <AvatarFallback className="text-lg bg-therapy-50 text-therapy-700">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">{patient.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-muted-foreground">
                <span>{calculateAge(patient.dateOfBirth)}</span>
                {patient.diagnosis && (
                  <>
                    <span className="text-xs">•</span>
                    <Badge variant="outline" className="font-normal">
                      {patient.diagnosis}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className={cn(
            "flex gap-2",
            isMobile ? "w-full" : "justify-end"
          )}>
            <Link to={`/patients/${patient.id}/edit`} className={isMobile ? "flex-1" : ""}>
              <Button variant="outline" className={isMobile ? "w-full" : ""}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            </Link>
            <Link to={`/sessions/new?patientId=${patient.id}`} className={isMobile ? "flex-1" : ""}>
              <Button className={isMobile ? "w-full" : ""}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Sesión
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Tabs for patient information */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="sessions">Sesiones</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>
          
          {/* Patient Information Tab */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-therapy-500" />
                      <p>{formatDate(patient.dateOfBirth)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Responsable</p>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-therapy-500" />
                      <p>{patient.parentName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Contacto</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-therapy-500" />
                      <p>{patient.contactNumber}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-therapy-500" />
                      <p>{patient.address || "No especificada"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historial Médico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Diagnóstico</p>
                  <p>{patient.diagnosis || "No especificado"}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Notas Médicas</p>
                  <p>{patient.medicalNotes || "No hay notas médicas registradas."}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            {sortedSessions.length > 0 ? (
              <div className="space-y-4">
                {sortedSessions.map((session) => (
                  <Card key={session.id} className="overflow-hidden">
                    <div
                      className="p-4 cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => toggleSession(session.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <CalendarDays className="h-5 w-5 text-therapy-500" />
                          <div>
                            <p className="font-medium">{formatDate(session.date)}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.title || "Sesión de terapia"}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          {expandedSession === session.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {expandedSession === session.id && (
                      <>
                        <Separator />
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Objetivos de la Sesión
                              </h4>
                              <p>{session.objectives || "No se especificaron objetivos."}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Actividades Realizadas
                              </h4>
                              <p>{session.activities || "No se registraron actividades."}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Progreso
                              </h4>
                              <p>{session.progress || "No se registró progreso."}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Recomendaciones
                              </h4>
                              <p>{session.recommendations || "No hay recomendaciones."}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link to={`/sessions/${session.id}/edit`} className="w-full">
                            <Button variant="outline" className="w-full">
                              <Edit className="mr-2 h-4 w-4" />
                              Editar Sesión
                            </Button>
                          </Link>
                        </CardFooter>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No hay sesiones registradas
                  </h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Aún no has registrado ninguna sesión para este paciente.
                  </p>
                  <Link to={`/sessions/new?patientId=${patient.id}`}>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Sesión
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Documents Tab (Placeholder) */}
          <TabsContent value="documents">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No hay documentos adjuntos
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  Aún no has adjuntado ningún documento para este paciente.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Documento
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default PatientDetail;
