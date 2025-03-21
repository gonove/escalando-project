
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { patients, sessions } from "@/data/mockData";
import { Patient, Session } from "@/types/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Phone, Mail, File, Plus, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const patient = patients.find((p) => p.id === id) as Patient | undefined;
  const patientSessions = sessions
    .filter((s) => s.patientId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  
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

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {!isMobile && (
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
          {/* Información del paciente */}
          <Card className="lg:w-1/3">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{patient.name}</CardTitle>
                  <CardDescription>
                    {patient.age} años | {patient.gender}
                  </CardDescription>
                </div>
                <Badge className="bg-therapy-500">
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
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>
                      {patient.location || "Sin dirección registrada"}
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
            </CardContent>
          </Card>

          {/* Tabs con sesiones e historial */}
          <div className="flex-1">
            <Tabs 
              defaultValue="overview" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="sessions">Sesiones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plan de Tratamiento</CardTitle>
                    <CardDescription>
                      Objetivos y progreso terapéutico
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {patient.treatmentPlan ? (
                      <>
                        <div>
                          <h4 className="font-medium mb-2">Objetivos Generales</h4>
                          <p>{patient.treatmentPlan}</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">
                          No hay un plan de tratamiento definido
                        </p>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          asChild
                        >
                          <Link to={`/patients/${id}/treatment`}>
                            <Plus className="h-4 w-4" />
                            Crear Plan de Tratamiento
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {patientSessions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Última Sesión</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-therapy-100 text-therapy-700 p-3 rounded-full">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Fecha</p>
                            <p className="font-medium">
                              {new Date(patientSessions[0].date).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="ml-6">
                            <p className="text-sm text-muted-foreground">Hora</p>
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

                        <Button
                          variant="outline"
                          className="w-full"
                          asChild
                        >
                          <Link to={`/sessions/${patientSessions[0].id}`}>
                            Ver Detalles
                          </Link>
                        </Button>
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
                              <div className="bg-therapy-100 text-therapy-700 p-3 rounded-full mr-4">
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
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 sm:mt-0"
                                    asChild
                                  >
                                    <Link to={`/sessions/${session.id}`}>
                                      Ver Detalles
                                    </Link>
                                  </Button>
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
