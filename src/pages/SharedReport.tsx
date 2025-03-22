
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Download, Calendar, FileText, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { professionals, patients } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SharedReport = () => {
  const { reportId } = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const isMobile = useIsMobile();
  
  // Mock loading report data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock report data based on reportId
      // In a real app, this would fetch the report from an API
      const mockReportData = {
        id: reportId,
        type: "Evaluación Inicial",
        date: new Date(),
        patient: patients[0],
        professional: professionals[0],
        diagnosis: "Trastorno del Espectro Autista - Nivel 1",
        background: "El paciente presenta dificultades en la interacción social y comunicación desde los 3 años, según reportan los padres. Asiste a terapia ocupacional desde hace 6 meses.",
        evaluation: "Se realizó una evaluación completa utilizando ADOS-2 y ADI-R, además de observación clínica y entrevista con padres.",
        treatmentPlan: "Plan de terapia intensiva de 2 sesiones semanales para trabajar habilidades sociales y autorregulación. Reevaluación en 6 meses.",
        recommendations: "Se recomienda continuar con el apoyo en el entorno escolar, mantener rutinas estructuradas en casa y participar en grupos sociales pequeños y supervisados.",
        goals: [
          "Mejorar habilidades de comunicación social",
          "Desarrollar estrategias de autorregulación emocional",
          "Incrementar la flexibilidad cognitiva ante cambios"
        ]
      };
      
      setReport(mockReportData);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [reportId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-escalando-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando informe...</p>
        </div>
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Informe no encontrado</CardTitle>
            <CardDescription>El informe que buscas no existe o ha expirado</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/">Volver al inicio</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const formattedDate = format(report.date, "d 'de' MMMM 'de' yyyy", { locale: es });
  
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-white border-b py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-escalando-400 flex items-center justify-center">
              <span className="text-black font-bold">E</span>
            </div>
            <h1 className="text-lg font-display font-semibold">Escalando</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Ir a Escalando</Link>
          </Button>
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a Escalando
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{report.type}</h1>
            <p className="text-muted-foreground">Informe compartido • {formattedDate}</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Descargar PDF
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle>{report.patient.name}</CardTitle>
                <CardDescription>
                  {report.patient.age} años • {report.patient.gender} • ID: {report.patient.id.substring(0, 8)}
                </CardDescription>
              </div>
              <div className="px-3 py-1.5 bg-escalando-100 text-escalando-800 rounded-full text-sm font-medium">
                {report.diagnosis}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs defaultValue="report" className="w-full">
              <TabsList className={cn("grid w-full", isMobile ? "grid-cols-2" : "max-w-md grid-cols-3")}>
                <TabsTrigger value="report">Informe</TabsTrigger>
                <TabsTrigger value="professional">Profesional</TabsTrigger>
                {!isMobile && <TabsTrigger value="resources">Recursos</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="report" className="space-y-8 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Antecedentes</h3>
                  <p className="text-muted-foreground">{report.background}</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Evaluación</h3>
                  <p className="text-muted-foreground">{report.evaluation}</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Diagnóstico</h3>
                  <div className="px-4 py-3 bg-escalando-50 text-escalando-800 rounded-md">
                    {report.diagnosis}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Plan de Tratamiento</h3>
                  <p className="text-muted-foreground">{report.treatmentPlan}</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recomendaciones</h3>
                  <p className="text-muted-foreground">{report.recommendations}</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Objetivos Terapéuticos</h3>
                  <ul className="space-y-2">
                    {report.goals.map((goal: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="h-5 w-5 rounded-full bg-escalando-100 text-escalando-800 flex items-center justify-center text-xs mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="professional">
                <div className="py-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={report.professional.avatar} alt={report.professional.name} />
                      <AvatarFallback>{report.professional.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 text-center sm:text-left">
                      <h3 className="text-xl font-semibold">{report.professional.name}</h3>
                      <p className="text-escalando-600 font-medium">{report.professional.specialty}</p>
                      <p className="text-muted-foreground">
                        Especialista en trastornos del neurodesarrollo con más de 8 años de experiencia en evaluación y tratamiento.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                          <User className="h-4 w-4 mr-2 text-escalando-500" />
                          Credenciales
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0">
                        <ul className="space-y-2 text-sm">
                          <li>• Licenciada en Psicología</li>
                          <li>• Maestría en Neuropsicología</li>
                          <li>• Certificación en ADOS-2</li>
                          <li>• Especialista en Intervención Temprana</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-escalando-500" />
                          Contacto
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 space-y-3 text-sm">
                        <p>Email: {report.professional.email}</p>
                        <p>Teléfono: {report.professional.phone}</p>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          Solicitar Cita
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="resources">
                <div className="py-6 space-y-6">
                  <h3 className="text-lg font-medium">Recursos y Materiales</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {title: "Guía para padres", icon: FileText, description: "Estrategias para apoyar el desarrollo en casa"},
                      {title: "Materiales visuales", icon: FileText, description: "Recursos visuales para actividades diarias"},
                      {title: "Información sobre TEA", icon: FileText, description: "Recursos educativos sobre el trastorno"},
                      {title: "Grupos de apoyo", icon: User, description: "Comunidades para padres y cuidadores"},
                    ].map((resource, index) => {
                      const Icon = resource.icon;
                      return (
                        <Card key={index} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-escalando-100 rounded-full flex items-center justify-center">
                                <Icon className="h-4 w-4 text-escalando-700" />
                              </div>
                              <h4 className="font-medium">{resource.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                            <Button variant="outline" size="sm" className="w-full">Acceder</Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-6">
            <div className="text-sm text-muted-foreground">
              <p>Informe generado el {formattedDate}</p>
              <p>ID del informe: {reportId}</p>
            </div>
            <Button variant="outline" size="sm" className="sm:ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SharedReport;
