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
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FilePlus,
  Download,
  Calendar,
  ChevronRight,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Grid,
  List,
  Eye,
  Trash2,
  MoreHorizontal
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const mockReports = [
  {
    id: "rep_1",
    type: "Evaluación Inicial",
    title: "Evaluación inicial de neurodesarrollo",
    patientId: "pat_1",
    date: new Date(),
    status: "Completado",
    tags: ["TEA", "Nivel 1"],
    diagnosis: "Trastorno del Espectro Autista - Nivel 1"
  },
  {
    id: "rep_2",
    type: "Informe de Progreso",
    title: "Informe trimestral de avances",
    patientId: "pat_2",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    status: "Completado",
    tags: ["TEA", "Avance"],
    diagnosis: "Trastorno del Espectro Autista - Nivel 2"
  },
  {
    id: "rep_3",
    type: "Plan de Tratamiento",
    title: "Plan de intervención terapéutica",
    patientId: "pat_3",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    status: "Borrador",
    tags: ["TDAH", "Plan"],
    diagnosis: "Trastorno por Déficit de Atención"
  },
  {
    id: "rep_4",
    type: "Evaluación de Seguimiento",
    title: "Evaluación semestral",
    patientId: "pat_1",
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
    status: "Completado",
    tags: ["TEA", "Seguimiento"],
    diagnosis: "Trastorno del Espectro Autista - Nivel 1"
  }
];

const ReportGenerator = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = useIsMobileOrTablet();
  const currentDate = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateReportId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const generateShareableLink = (reportId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/patient-links/${reportId}`;
  };

  const handleShare = (reportId: string) => {
    const newShareLink = generateShareableLink(reportId);
    setShareLink(newShareLink);
    setCopied(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast({
      title: "¡Enlace copiado!",
      description: "El enlace del informe ha sido copiado al portapapeles",
    });
  };

  const handleViewSharedReport = () => {
    const reportId = shareLink.split('/').pop();
    navigate(`/patient-links/${reportId}`);
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : "Paciente Desconocido";
  };

  const formatDate = (date: Date) => {
    return format(date, "d MMM yyyy", { locale: es });
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  const handleDeleteReport = (reportId: string) => {
    toast({
      title: "Informe eliminado",
      description: "El informe ha sido eliminado correctamente",
    });
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
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-escalando-500" />
                  <span>Informes Recientes</span>
                </CardTitle>
                <CardDescription>
                  Informes generados en los últimos 30 días
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-muted rounded-md p-1 flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 px-3 rounded-sm",
                      viewMode === "grid" && "bg-background shadow-sm"
                    )}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 px-3 rounded-sm",
                      viewMode === "list" && "bg-background shadow-sm"
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filtrar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="complete">Completados</SelectItem>
                    <SelectItem value="draft">Borradores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {viewMode === "grid" ? (
              <div className={cn(
                "grid gap-4",
                isMobile ? "grid-cols-1" : isTablet ? "grid-cols-2" : "grid-cols-3"
              )}>
                {mockReports.map((report) => {
                  const reportId = report.id;

                  return (
                    <Card key={reportId} className="overflow-hidden border border-muted">
                      <div className="bg-muted p-2 flex justify-between items-center">
                        <Badge variant={report.status === "Completado" ? "default" : "outline"}>
                          {report.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(report.date)}</span>
                      </div>
                      <CardContent className="p-4">
                        <div className="mb-2">
                          <p className="text-xs text-muted-foreground uppercase font-medium">
                            {report.type}
                          </p>
                          <p className="font-medium">{getPatientName(report.patientId)}</p>
                          <p className="text-sm text-muted-foreground mb-2">{report.title}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {report.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-between mt-4 gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8"
                            onClick={() => handleViewReport(reportId)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Ver
                          </Button>
                          <div className="flex gap-1">
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
                            <Button size="sm" variant="outline" className="h-8 px-2">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_200px_auto] gap-4 p-3 font-medium text-sm text-muted-foreground border-b bg-muted/50">
                  <div>Paciente / Informe</div>
                  <div className="hidden sm:block">Fecha</div>
                  <div className="hidden sm:block">Estado</div>
                  <div className="text-right">Acciones</div>
                </div>
                <div className="divide-y">
                  {mockReports.map((report) => (
                    <div
                      key={report.id}
                      className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_200px_auto] gap-4 p-4 items-center hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <div className="font-medium">{getPatientName(report.patientId)}</div>
                        <div className="text-sm text-muted-foreground">{report.title}</div>
                        <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
                          {report.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-right sm:text-left">
                        {formatDate(report.date)}
                        <div className="sm:hidden text-muted-foreground">
                          {report.status}
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2">
                        <Badge variant={report.status === "Completado" ? "default" : "outline"}>
                          {report.status}
                        </Badge>
                        <div className="flex flex-wrap gap-1">
                          {report.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hidden sm:flex h-8"
                          onClick={() => handleViewReport(report.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="hidden sm:flex h-8"
                              onClick={() => handleShare(report.id)}
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
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
}

export default ReportGenerator;
