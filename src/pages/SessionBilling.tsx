
import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Upload, 
  Download, 
  ChevronDown, 
  Eye, 
  XCircle, 
  Check,
  Calendar,
  Clock,
  User,
  Search
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { patients } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Lista de terapeutas (misma que en SessionScheduler)
const therapists = [
  { id: "th_1", name: "Ana García", specialty: "Terapeuta Ocupacional" },
  { id: "th_2", name: "Carlos Rodríguez", specialty: "Psicólogo Infantil" },
  { id: "th_3", name: "Laura Martínez", specialty: "Logopeda" },
  { id: "th_4", name: "Sofía López", specialty: "Fisioterapeuta" },
];

// Ejemplo de sesiones con estados de facturación
const mockSessions = [
  {
    id: "ses_101",
    patientId: patients[0].id,
    professionalId: "th_1",
    date: "2023-06-15",
    time: "09:00",
    duration: 60,
    type: "regular",
    billingStatus: "completed",
    reportStatus: "completed",
    billingDocuments: [
      {
        id: "doc_1",
        sessionId: "ses_101",
        fileName: "factura_junio_2023.pdf",
        fileUrl: "#",
        uploadDate: "2023-06-16",
        type: "invoice"
      }
    ]
  },
  {
    id: "ses_102",
    patientId: patients[1].id,
    professionalId: "th_2",
    date: "2023-06-22",
    time: "11:30",
    duration: 45,
    type: "follow-up",
    billingStatus: "pending",
    reportStatus: "completed",
    billingDocuments: []
  },
  {
    id: "ses_103",
    patientId: patients[2].id,
    professionalId: "th_3",
    date: "2023-06-28",
    time: "15:00",
    duration: 60,
    type: "regular",
    billingStatus: "completed",
    reportStatus: "pending",
    billingDocuments: [
      {
        id: "doc_2",
        sessionId: "ses_103",
        fileName: "factura_junio_2023_2.pdf",
        fileUrl: "#",
        uploadDate: "2023-06-29",
        type: "invoice"
      }
    ]
  },
  {
    id: "ses_104",
    patientId: patients[0].id,
    professionalId: "th_1",
    date: "2023-07-05",
    time: "09:00",
    duration: 60,
    type: "regular",
    billingStatus: "pending",
    reportStatus: "pending",
    billingDocuments: []
  },
  {
    id: "ses_105",
    patientId: patients[3].id,
    professionalId: "th_4",
    date: "2023-07-12",
    time: "16:30",
    duration: 45,
    type: "evaluation",
    billingStatus: "cancelled",
    reportStatus: "cancelled",
    billingDocuments: []
  }
];

const SessionBilling = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "yyyy-MM"));
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sessions, setSessions] = useState(mockSessions);

  // Dialog states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // Filter sessions based on filters
  const filteredSessions = sessions.filter(session => {
    // Professional filter
    if (selectedProfessional && session.professionalId !== selectedProfessional) {
      return false;
    }

    // Month filter
    const sessionMonth = session.date.substring(0, 7); // Get YYYY-MM format
    if (selectedMonth && sessionMonth !== selectedMonth) {
      return false;
    }

    // Status filter
    if (filter === "pending" && session.billingStatus !== "pending") {
      return false;
    }
    if (filter === "completed" && session.billingStatus !== "completed") {
      return false;
    }
    if (filter === "pendingReports" && session.reportStatus !== "pending") {
      return false;
    }

    // Search by patient name
    if (searchTerm) {
      const patient = patients.find(p => p.id === session.patientId);
      if (!patient || !patient.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  // Handle document upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedFileName(file.name);
    }
  };

  const handleUpload = () => {
    if (!uploadedFile || !selectedSession) {
      toast({
        title: "Error",
        description: "Por favor seleccione un archivo para subir",
        variant: "destructive"
      });
      return;
    }

    // In a real app, here we would upload the file to a server
    // For now, let's just update our local state to simulate this

    const newDocument = {
      id: `doc_${Date.now()}`,
      sessionId: selectedSession.id,
      fileName: uploadedFileName,
      fileUrl: "#", // In a real app, this would be the URL to the uploaded file
      uploadDate: format(new Date(), "yyyy-MM-dd"),
      type: "invoice"
    };

    const updatedSessions = sessions.map(session => {
      if (session.id === selectedSession.id) {
        return {
          ...session,
          billingStatus: "completed",
          billingDocuments: [...(session.billingDocuments || []), newDocument]
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    setUploadDialogOpen(false);
    setUploadedFile(null);
    setUploadedFileName("");

    toast({
      title: "Documento subido",
      description: "El documento ha sido subido correctamente",
    });
  };

  // Open upload dialog for a session
  const openUploadDialog = (session: any) => {
    setSelectedSession(session);
    setUploadDialogOpen(true);
  };

  // Generate months for the select
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = format(date, "yyyy-MM");
      const label = format(date, "MMMM yyyy", { locale: es });
      months.push({ value, label });
    }
    
    return months;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completado</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendiente</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Facturación</h1>
            <p className="text-muted-foreground">
              Gestión de facturas y reportes de sesiones
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtra las sesiones por profesional, mes o estado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professional">Profesional</Label>
                <Select 
                  value={selectedProfessional} 
                  onValueChange={setSelectedProfessional}
                >
                  <SelectTrigger id="professional">
                    <SelectValue placeholder="Todos los profesionales" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los profesionales</SelectItem>
                    {therapists.map((therapist) => (
                      <SelectItem key={therapist.id} value={therapist.id}>
                        {therapist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="month">Mes</Label>
                <Select 
                  value={selectedMonth} 
                  onValueChange={setSelectedMonth}
                >
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Seleccionar mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateMonthOptions().map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter">Estado</Label>
                <Select 
                  value={filter} 
                  onValueChange={setFilter}
                >
                  <SelectTrigger id="filter">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Facturas pendientes</SelectItem>
                    <SelectItem value="completed">Facturas completadas</SelectItem>
                    <SelectItem value="pendingReports">Informes pendientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Buscar paciente</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nombre del paciente"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sesiones</CardTitle>
            <CardDescription>
              {filteredSessions.length} {filteredSessions.length === 1 ? "sesión encontrada" : "sesiones encontradas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Paciente</TableHead>
                    <TableHead>Profesional</TableHead>
                    <TableHead>Fecha y hora</TableHead>
                    <TableHead>Estado de factura</TableHead>
                    <TableHead>Estado de informe</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => {
                    const patient = patients.find(p => p.id === session.patientId);
                    const therapist = therapists.find(t => t.id === session.professionalId);
                    
                    return (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{patient?.name || "Paciente desconocido"}</TableCell>
                        <TableCell>{therapist?.name || "Profesional desconocido"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{format(parseISO(session.date), "d MMM yyyy", { locale: es })}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{session.time} ({session.duration} min)</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(session.billingStatus)}</TableCell>
                        <TableCell>{getStatusBadge(session.reportStatus)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {session.billingStatus === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openUploadDialog(session)}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Subir factura
                              </Button>
                            )}
                            
                            {session.billingStatus === "completed" && session.billingDocuments && session.billingDocuments.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Descarga iniciada",
                                    description: "El documento se está descargando",
                                  });
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Descargar
                              </Button>
                            )}
                            
                            {session.reportStatus === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Here we would navigate to a report creation page
                                  toast({
                                    title: "Crear informe",
                                    description: "Redirigiendo a la página de creación de informes",
                                  });
                                }}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Crear informe
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No se encontraron sesiones con los filtros seleccionados</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload Document Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Subir factura</DialogTitle>
              <DialogDescription>
                Sube la factura de la sesión para el paciente{" "}
                {selectedSession && patients.find(p => p.id === selectedSession.patientId)?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Tipo de documento</Label>
                <Select defaultValue="invoice">
                  <SelectTrigger id="document-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Factura</SelectItem>
                    <SelectItem value="receipt">Recibo</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Documento</Label>
                <div className="grid w-full items-center gap-1.5">
                  <Label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {uploadedFile ? (
                      <div className="flex flex-col items-center">
                        <FileText className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">{uploadedFileName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(uploadedFile.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Haz clic para seleccionar archivo</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, JPG o PNG (máx. 10MB)
                        </p>
                      </div>
                    )}
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpload} disabled={!uploadedFile}>
                Subir documento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </Layout>
  );
};

export default SessionBilling;
