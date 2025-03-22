
import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  FileEdit, 
  Calendar, 
  Users,
  ClipboardList,
  Award,
  Clock
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { professionals, patients, sessions } from "@/data/mockData";
import { useIsMobile, useIsTablet, useIsMobileOrTablet } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Profile = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = useIsMobileOrTablet();
  
  // Get the first professional for demo purposes
  const professional = professionals[0];
  
  // Get patients for this professional
  const myPatients = patients.filter(
    (patient) => patient.professionalId === professional.id
  );
  
  // Get sessions for this professional
  const mySessions = sessions.filter(
    (session) => session.professionalId === professional.id
  );
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Mi Perfil</h1>
            <p className="text-muted-foreground">
              Gestiona tu información profesional
            </p>
          </div>
          <Button className={cn(
            "flex items-center gap-2",
            isMobile && "w-full"
          )}>
            <FileEdit className="h-4 w-4" />
            Editar Perfil
          </Button>
        </div>
        
        <div className={cn(
          "grid gap-6",
          !isMobile ? "grid-cols-3" : "grid-cols-1"
        )}>
          {/* Profile Card */}
          <Card className="col-span-1">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={professional.avatar} alt={professional.name} />
                  <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{professional.name}</CardTitle>
              <CardDescription className="text-lg font-medium text-escalando-600">
                {professional.specialty}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="truncate">{professional.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{professional.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <span>{professional.specialty}</span>
                </div>
                <div className="flex items-start gap-3 pt-2">
                  <User className="h-5 w-5 text-muted-foreground mt-1" />
                  <p className="text-muted-foreground">{professional.bio}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="pt-2 space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Resumen de Actividad</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">{myPatients.length}</p>
                    <p className="text-xs text-muted-foreground">Pacientes</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">{mySessions.length}</p>
                    <p className="text-xs text-muted-foreground">Sesiones</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className={cn(
                "w-full max-w-md mx-auto mb-6",
                isMobile && "grid grid-cols-3"
              )}>
                <TabsTrigger value="schedule">Horario</TabsTrigger>
                <TabsTrigger value="patients">Pacientes</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Próximas Sesiones</CardTitle>
                    <CardDescription>
                      Revisa tu agenda para los próximos días
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mySessions.slice(0, 3).map((session, index) => {
                        const patient = patients.find(p => p.id === session.patientId);
                        return (
                          <div key={session.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                            <div className="bg-escalando-100 p-2 rounded-full">
                              <Calendar className="h-5 w-5 text-escalando-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <div>
                                  <p className="font-medium">{patient?.name}</p>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-3.5 w-3.5" /> 
                                    {session.date} • {session.time} ({session.duration} min)
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                                  Ver Detalles
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {mySessions.length === 0 && (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No hay sesiones programadas</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Disponibilidad Semanal</CardTitle>
                    <CardDescription>
                      Configura tus horarios de disponibilidad
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((day) => (
                        <div key={day} className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="font-medium">{day}</span>
                          <div className="text-sm text-muted-foreground">
                            9:00 - 17:00
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="patients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mis Pacientes</CardTitle>
                    <CardDescription>
                      Lista de pacientes bajo tu cuidado
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myPatients.map((patient) => (
                        <div key={patient.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                          <div className="bg-escalando-100 p-2 rounded-full">
                            <Users className="h-5 w-5 text-escalando-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                              <div>
                                <p className="font-medium">{patient.name}</p>
                                <div className="flex flex-wrap text-sm text-muted-foreground">
                                  <span>{patient.diagnosis}</span>
                                  {patient.age && (
                                    <>
                                      <span className="mx-2">•</span>
                                      <span>{patient.age} años</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                                Ver Ficha
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {myPatients.length === 0 && (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No tienes pacientes asignados</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Documentos Recientes</CardTitle>
                    <CardDescription>
                      Informes y documentos generados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, index) => (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                          <div className="bg-escalando-100 p-2 rounded-full">
                            <ClipboardList className="h-5 w-5 text-escalando-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                              <div>
                                <p className="font-medium">Informe de Evaluación</p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <span>{myPatients[index % myPatients.length]?.name}</span>
                                  <span className="mx-2">•</span>
                                  <span>23/05/2023</span>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Certificaciones</CardTitle>
                    <CardDescription>
                      Tus certificaciones y credenciales profesionales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        "Licenciatura en Fisioterapia - Universidad de Buenos Aires",
                        "Especialización en Neurodesarrollo Infantil - Instituto Escalando",
                        "Certificación en Terapia de Integración Sensorial"
                      ].map((certification, index) => (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                          <div className="bg-escalando-100 p-2 rounded-full">
                            <Award className="h-5 w-5 text-escalando-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{certification}</p>
                            <p className="text-sm text-muted-foreground">Expedición: 2018</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Profile;
