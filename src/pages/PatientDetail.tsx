import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { sessions } from "@/data/mockData";
import { Patient, Session } from "@/types/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Phone, Mail, File, Plus, ChevronLeft, Clipboard, ClipboardCheck, FilePlus, Ambulance } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile, useIsTablet, useIsMobileOrTablet } from "@/hooks/use-mobile";
import DevelopmentalMilestones from "@/components/patient/DevelopmentalMilestones";
import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "@/api/patient";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();

  const patientSessions = sessions
    .filter((s) => s.patientId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = useIsMobileOrTablet();

  const { isLoading, data: patient, error } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatientById(id)
  });

  console.log(patient)

  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Paciente no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            El paciente que buscas no existe o ha sido eliminado.
          </p>
          <Button asChild>
            <Link to="/patients">Volver a Pacientes</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const pendingEvaluations = patientSessions.filter(s => !s.progress).length;
  const completedEvaluations = patientSessions.filter(s => s.progress).length;

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {!isMobileOrTablet && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="h-8 w-8"
              >
                <Link to="/patients">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-2xl font-semibold">Paciente</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                asChild
              >
                <Link to={`/patients/${id}/edit`}>
                  <File className="h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                asChild
              >
                <Link to={`/patients/${id}/initial-evaluation`}>
                  <Clipboard className="h-4 w-4" />
                  Evaluación Inicial
                </Link>
              </Button>
              <Button
                className="flex items-center gap-2"
                asChild
              >
                <Link to={`/sessions/new?patientId=${id}`}>
                  <Plus className="h-4 w-4" />
                  Nueva Sesión
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="lg:w-1/3">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{patient.fullName}</CardTitle>
                  <CardDescription>
                    {patient.dateOfBirth ? `${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} años` : "Sin fecha de nacimiento"} | {patient.gender}
                  </CardDescription>
                </div>
                <Badge className="bg-escalando-500">
                  {patient.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Información de contacto
                </h3>
                <Separator />
                <div className="grid gap-3 pt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`https://wa.me/${patient.contacts[0].phone}?text=Hola, este es un mensaje relacionado con el paciente ${patient.fullName}`} target="_blank" rel="noopener noreferrer">{patient.contacts[0].phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ambulance className="h-4 w-4 text-muted-foreground" />
                    <a href={`https://wa.me/${patient.contacts[1].phone}?text=Hola, este es un mensaje relacionado con el paciente ${patient.fullName}`} target="_blank" rel="noopener noreferrer">{patient.contacts[1].phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.contacts[0].email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>
                      {patient.address || "Sin dirección registrada"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Información médica
                </h3>
                <Separator />
                <div className="grid gap-3 pt-3">
                  <div>
                    <span className="text-sm font-medium block">Diagnóstico</span>
                    <span>{patient.diagnosis}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium block">Notas</span>
                    <span className="text-sm text-muted-foreground">
                      {patient.notes || "Sin notas médicas"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Evaluaciones
                </h3>
                <Separator />
                <div className="pt-3">
                  <div className="flex justify-between">
                    <span>Pendientes</span>
                    <span className="font-medium">{pendingEvaluations}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Completadas</span>
                    <span className="font-medium">{completedEvaluations}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Sesiones
                </h3>
                <Separator />
                <div className="pt-3">
                  <div className="flex justify-between">
                    <span>Total de sesiones</span>
                    <span className="font-medium">{patientSessions.length}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Última sesión</span>
                    <span className="font-medium">
                      {patientSessions.length > 0
                        ? new Date(patientSessions[0].date).toLocaleDateString("es-ES")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {isMobileOrTablet && (
                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    asChild
                  >
                    <Link to={`/patients/${id}/edit`}>
                      <File className="h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    asChild
                  >
                    <Link to={`/patients/${id}/initial-evaluation`}>
                      <Clipboard className="h-4 w-4" />
                      Evaluación Inicial
                    </Link>
                  </Button>
                  <Button
                    className="flex items-center gap-2"
                    asChild
                  >
                    <Link to={`/sessions/new?patientId=${id}`}>
                      <Plus className="h-4 w-4" />
                      Nueva Sesión
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex-1">
            <Tabs
              defaultValue="overview"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="sessions">Sesiones</TabsTrigger>
                <TabsTrigger value="development">Neurodesarrollo</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                {patientSessions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Última Sesión</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="bg-escalando-100 text-escalando-700 p-3 rounded-full">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Fecha</p>
                            <p className="font-medium">
                              {new Date(patientSessions[0].date).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="sm:ml-6">
                            <p className="text-sm text-muted-foreground mb-1">Hora</p>
                            <p className="font-medium">
                              {patientSessions[0].time || "No especificada"}
                            </p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium mb-2">Progreso</h4>
                          <p>{patientSessions[0].progress}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 flex items-center gap-2"
                            asChild
                          >
                            <Link to={`/patients/${id}/sessions/${patientSessions[0].id}/summary`}>
                              <FilePlus className="h-4 w-4" />
                              Resumen de Sesión
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 flex items-center gap-2"
                            asChild
                          >
                            <Link to={`/patients/${id}/sessions/${patientSessions[0].id}/evaluation`}>
                              <ClipboardCheck className="h-4 w-4" />
                              Evaluación de Sesión
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="sessions" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Historial de Sesiones</CardTitle>
                      <Button
                        size="sm"
                        className="flex items-center gap-2"
                        asChild
                      >
                        <Link to={`/sessions/new?patientId=${id}`}>
                          <Plus className="h-4 w-4" />
                          Nueva Sesión
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {patientSessions.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                          Aún no hay sesiones registradas
                        </p>
                        <Button
                          className="flex items-center gap-2"
                          asChild
                        >
                          <Link to={`/sessions/new?patientId=${id}`}>
                            <Plus className="h-4 w-4" />
                            Registrar Primera Sesión
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {patientSessions.map((session) => (
                          <Card key={session.id} className="overflow-hidden border-0 shadow-sm">
                            <div className="flex items-center p-4 bg-white hover:bg-gray-50 transition-colors">
                              <div className="bg-escalando-100 text-escalando-700 p-3 rounded-full mr-4">
                                <Calendar className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <p className="font-medium">
                                      {new Date(session.date).toLocaleDateString("es-ES", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </p>
                                    <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                                      {session.type || "Sesión de terapia"}
                                    </p>
                                  </div>
                                  <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-1"
                                      asChild
                                    >
                                      <Link to={`/patients/${id}/sessions/${session.id}/summary`}>
                                        <FilePlus className="h-3.5 w-3.5" />
                                        Resumen
                                      </Link>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center gap-1"
                                      asChild
                                    >
                                      <Link to={`/patients/${id}/sessions/${session.id}/evaluation`}>
                                        <ClipboardCheck className="h-3.5 w-3.5" />
                                        Evaluación
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="development" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ficha de Neurodesarrollo</CardTitle>
                    <CardDescription>
                      Registro de hitos del desarrollo alcanzados por el paciente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DevelopmentalMilestones
                      patientId={id || ""}
                      initialMilestones={patient?.developmentalMilestones || []}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {isMobile && (
          <div className="fixed bottom-4 right-4 z-10">
            <Button
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg"
              asChild
            >
              <Link to={`/sessions/new?patientId=${id}`}>
                <Plus className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default PatientDetail;
