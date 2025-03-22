
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  FilePlus, 
  Download, 
  Calendar, 
  ChevronRight, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink 
} from "lucide-react";
import { patients } from "@/data/mockData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useIsMobile, useIsTablet, useIsMobileOrTablet } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const ReportGenerator = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = useIsMobileOrTablet();
  const currentDate = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock function to generate a unique report ID
  const generateReportId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  // Function to generate a shareable link for a report
  const generateShareableLink = (reportId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/reports/shared/${reportId}`;
  };
  
  // Function to handle share button click
  const handleShare = (reportId: string) => {
    const newShareLink = generateShareableLink(reportId);
    setShareLink(newShareLink);
    setCopied(false);
  };
  
  // Function to handle copy link button click
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast({
      title: "¡Enlace copiado!",
      description: "El enlace del informe ha sido copiado al portapapeles",
    });
  };
  
  // Function to view shared report
  const handleViewSharedReport = () => {
    // Extract the report ID from the share link
    const reportId = shareLink.split('/').pop();
    navigate(`/reports/shared/${reportId}`);
  };
  
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
            <h1 className="text-2xl font-semibold">Generador de Informes</h1>
            <p className="text-muted-foreground">
              Crea y gestiona informes para tus pacientes
            </p>
          </div>
          <Button className={cn("flex items-center gap-2", isMobile && "w-full")}>
            <FilePlus className="h-4 w-4" />
            Nuevo Informe
          </Button>
        </div>

        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="new">Nuevo Informe</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Crear Informe de Evaluación</CardTitle>
                <CardDescription>
                  Complete los datos para generar un informe personalizado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Paciente</Label>
                    <Select>
                      <SelectTrigger id="patient">
                        <SelectValue placeholder="Seleccionar paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Tipo de Informe</Label>
                    <Select defaultValue="evaluation">
                      <SelectTrigger id="report-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="evaluation">Evaluación Inicial</SelectItem>
                        <SelectItem value="progress">Progreso Terapéutico</SelectItem>
                        <SelectItem value="discharge">Alta de Tratamiento</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-date">Fecha del Informe</Label>
                  <Input id="report-date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} />
                </div>
                
                <div className="space-y-2">
                  <Label>Secciones a incluir</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="section-background" defaultChecked />
                      <Label htmlFor="section-background" className="cursor-pointer">Antecedentes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="section-evaluation" defaultChecked />
                      <Label htmlFor="section-evaluation" className="cursor-pointer">Evaluación</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="section-diagnosis" defaultChecked />
                      <Label htmlFor="section-diagnosis" className="cursor-pointer">Diagnóstico</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="section-plan" defaultChecked />
                      <Label htmlFor="section-plan" className="cursor-pointer">Plan de Tratamiento</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="section-recommendations" defaultChecked />
                      <Label htmlFor="section-recommendations" className="cursor-pointer">Recomendaciones</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="section-goals" defaultChecked />
                      <Label htmlFor="section-goals" className="cursor-pointer">Objetivos y Metas</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Observaciones Adicionales</Label>
                  <Textarea id="notes" placeholder="Ingrese información adicional relevante para el informe..." className="min-h-[100px]" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <Button variant="outline" className={isMobile ? "w-full" : ""}>Vista Previa</Button>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button variant="outline" className="w-full">Guardar como Borrador</Button>
                  <Button className="w-full">Generar Informe</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plantillas de Informes</CardTitle>
                <CardDescription>
                  Utilice y personalice plantillas predefinidas para agilizar la creación de informes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Informe de Evaluación Inicial",
                      description: "Evaluación completa para nuevos pacientes",
                      icon: FileText
                    },
                    {
                      title: "Reporte de Progreso Mensual",
                      description: "Seguimiento mensual de avances",
                      icon: Calendar
                    },
                    {
                      title: "Informe de Alta",
                      description: "Documentación para finalizar tratamiento",
                      icon: FileText
                    },
                  ].map((template, index) => {
                    const Icon = template.icon;
                    return (
                      <Card key={index} className="overflow-hidden border-0 shadow-sm">
                        <div className="p-6">
                          <div className="w-10 h-10 bg-escalando-100 rounded-full flex items-center justify-center mb-4">
                            <Icon className="h-5 w-5 text-escalando-700" />
                          </div>
                          <h3 className="font-medium text-base mb-1">{template.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                          <Button variant="outline" size="sm" className="w-full">
                            Usar Plantilla
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informes Recientes</CardTitle>
            <CardDescription>
              Informes generados en los últimos 30 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={cn(
              "grid gap-4",
              isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"
            )}>
              {[1, 2, 3].map((_, index) => {
                // Generate a unique mock report ID for each report
                const reportId = generateReportId();
                
                return (
                  <Card key={index} className="overflow-hidden border border-muted">
                    <div className="bg-muted p-2 flex justify-between items-center">
                      <span className="font-medium text-sm">Informe de Evaluación</span>
                      <span className="text-xs text-muted-foreground">{currentDate}</span>
                    </div>
                    <CardContent className="pt-4">
                      <p className="font-medium">{patients[index].name}</p>
                      <p className="text-sm text-muted-foreground mb-3">Evaluación inicial de neurodesarrollo</p>
                      <div className="flex flex-wrap justify-between mt-4 gap-2">
                        <Button variant="ghost" size="sm" className="h-8">
                          Ver
                        </Button>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8"
                                onClick={() => handleShare(reportId)}
                              >
                                <Share2 className="h-3.5 w-3.5 mr-1" />
                                Compartir
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Compartir Informe</DialogTitle>
                                <DialogDescription>
                                  Comparte este enlace con los padres o tutores del paciente para que puedan ver el informe.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex items-center space-x-2 mt-4">
                                <div className="grid flex-1 gap-2">
                                  <Label htmlFor="link" className="sr-only">Link</Label>
                                  <Input
                                    id="link"
                                    value={shareLink}
                                    readOnly
                                    className="font-mono text-sm"
                                  />
                                </div>
                                <Button 
                                  type="button" 
                                  size="sm" 
                                  className="px-3"
                                  onClick={handleCopyLink}
                                >
                                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                  <span className="sr-only">Copiar</span>
                                </Button>
                              </div>
                              <DialogFooter className="sm:justify-start mt-4 flex-col sm:flex-row gap-2">
                                <Button 
                                  type="button"
                                  variant="secondary"
                                  className="sm:w-auto w-full"
                                  onClick={handleViewSharedReport}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Previsualizar
                                </Button>
                                <DialogClose asChild>
                                  <Button 
                                    type="button" 
                                    variant="outline"
                                    className="sm:w-auto w-full"
                                  >
                                    Cerrar
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="outline" className="h-8">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default ReportGenerator;
