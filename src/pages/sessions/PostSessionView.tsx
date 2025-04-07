
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Camera, 
  Video, 
  Upload, 
  MessageSquare, 
  Users, 
  Receipt,
  ClipboardCheck,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { patients, sessions, professionals } from "@/data/mockData";
import { Session, Patient } from "@/types/models";

const PostSessionView = () => {
  const { patientId, sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("details");
  const [observations, setObservations] = useState("");
  const [progress, setProgress] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [collaboratorNote, setCollaboratorNote] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  
  // Find the patient and session
  const patient = patients.find(p => p.id === patientId) as Patient;
  const session = sessions.find(s => s.id === sessionId) as Session;
  
  if (!patient || !session) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Recurso no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            La sesión o paciente solicitado no existe o ha sido eliminado.
          </p>
          <Button asChild>
            <button onClick={() => navigate(-1)}>Volver</button>
          </Button>
        </div>
      </Layout>
    );
  }

  // Find the professional
  const professional = professionals.find(p => p.id === session.professionalId);

  const handleSaveProgress = () => {
    toast({
      title: "Progreso guardado",
      description: "La información de la sesión ha sido actualizada correctamente.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No hay archivos seleccionados",
        description: "Por favor selecciona al menos un archivo para subir.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would upload files to your backend here
    toast({
      title: "Archivos subidos",
      description: `${selectedFiles.length} archivos han sido subidos correctamente.`,
    });
    
    setSelectedFiles([]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleSaveCollaboratorNote = () => {
    if (!collaboratorNote.trim()) {
      toast({
        title: "Nota vacía",
        description: "Por favor escribe una nota antes de guardar.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Nota guardada",
      description: "Tu nota de colaboración ha sido guardada.",
    });
    
    setCollaboratorNote("");
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return size + ' bytes';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    else if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Detalles Post-Sesión</h1>
              <p className="text-muted-foreground">
                {patient.name} • {format(new Date(session.date), "d 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleSaveProgress}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Guardar Todo
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Información de la Sesión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p>{format(new Date(session.date), "d 'de' MMMM, yyyy", { locale: es })}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hora</p>
                  <p>{session.time} (45 minutos)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                  <p>{patient.name}</p>
                  <p className="text-xs text-muted-foreground">{patient.age} años • {patient.gender}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Terapeuta</p>
                  <p>{professional?.name}</p>
                  <p className="text-xs text-muted-foreground">{professional?.specialty}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de sesión</p>
                  <p>{session.type || "Terapia regular"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <Tabs 
                defaultValue="details" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 rounded-none border-b">
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                  <TabsTrigger value="progress">Progreso</TabsTrigger>
                  <TabsTrigger value="attachments">Adjuntos</TabsTrigger>
                  <TabsTrigger value="collaboration">Colaboración</TabsTrigger>
                  <TabsTrigger value="billing">Facturación</TabsTrigger>
                </TabsList>
                
                {/* Detalles Tab */}
                <TabsContent value="details" className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="observations" className="text-base font-medium">Observaciones</Label>
                      <Textarea
                        id="observations"
                        placeholder="Escribe tus observaciones sobre la sesión..."
                        className="mt-2 h-32"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="activities" className="text-base font-medium">Actividades realizadas</Label>
                        <Textarea
                          id="activities"
                          placeholder="Actividades realizadas durante la sesión..."
                          className="mt-2 h-24"
                        />
                      </div>
                      <div>
                        <Label htmlFor="patientResponse" className="text-base font-medium">Respuesta del paciente</Label>
                        <Textarea
                          id="patientResponse"
                          placeholder="¿Cómo respondió el paciente a la sesión?..."
                          className="mt-2 h-24"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="recommendations" className="text-base font-medium">Recomendaciones</Label>
                      <Textarea
                        id="recommendations"
                        placeholder="Recomendaciones para la próxima sesión o para el paciente en casa..."
                        className="mt-2 h-24"
                        value={recommendations}
                        onChange={(e) => setRecommendations(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProgress}>
                        Guardar Detalles
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Progreso Tab */}
                <TabsContent value="progress" className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="progress" className="text-base font-medium">Registro de Progreso</Label>
                      <Textarea
                        id="progress"
                        placeholder="Documenta el progreso del paciente en esta sesión..."
                        className="mt-2 h-32"
                        value={progress}
                        onChange={(e) => setProgress(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="achievedMilestones" className="text-base font-medium">Hitos alcanzados</Label>
                        <Textarea
                          id="achievedMilestones"
                          placeholder="Hitos específicos alcanzados durante esta sesión..."
                          className="mt-2 h-24"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nextSteps" className="text-base font-medium">Próximos pasos</Label>
                        <Textarea
                          id="nextSteps"
                          placeholder="Objetivos para la próxima sesión..."
                          className="mt-2 h-24"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProgress}>
                        Guardar Progreso
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Adjuntos Tab */}
                <TabsContent value="attachments" className="p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-base">Archivos subidos</h3>
                      {selectedFiles.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="bg-primary/10 p-1.5 rounded-full">
                                  {file.type.startsWith('image/') ? (
                                    <Camera className="h-4 w-4 text-primary" />
                                  ) : file.type.startsWith('video/') ? (
                                    <Video className="h-4 w-4 text-primary" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                              >
                                Quitar
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-2">No hay archivos subidos</p>
                      )}
                    </div>
                    
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <h3 className="font-medium">Arrastra archivos aquí</h3>
                        <p className="text-sm text-muted-foreground mb-4">o haz clic para seleccionarlos</p>
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          multiple
                          onChange={handleFileChange}
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Seleccionar archivos
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
                        <Upload className="h-4 w-4 mr-2" />
                        Subir archivos
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Colaboración Tab */}
                <TabsContent value="collaboration" className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="collaboratorNote" className="text-base font-medium">Añadir nota de colaboración</Label>
                      <Textarea
                        id="collaboratorNote"
                        placeholder="Escribe una nota para compartir con otros profesionales..."
                        className="mt-2 h-32"
                        value={collaboratorNote}
                        onChange={(e) => setCollaboratorNote(e.target.value)}
                      />
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="isPrivate"
                          checked={isPrivateNote}
                          onChange={(e) => setIsPrivateNote(e.target.checked)}
                          className="mr-2"
                        />
                        <Label htmlFor="isPrivate">Nota privada (solo visible para ti)</Label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveCollaboratorNote}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Guardar Nota
                      </Button>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium text-base flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Notas de colaboración
                      </h3>
                      <div className="bg-muted/30 rounded-md p-4 mt-2">
                        <p className="text-sm text-muted-foreground">No hay notas de colaboración para esta sesión</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Facturación Tab */}
                <TabsContent value="billing" className="p-4">
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-md p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">Estado de facturación</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Estado</Label>
                          <div className="font-medium">Pendiente</div>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Monto</Label>
                          <div className="font-medium">$50.00</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Generar factura</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="invoiceNumber">Número de factura</Label>
                          <Input
                            id="invoiceNumber"
                            placeholder="Ej: INV-001"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="amount">Monto</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="billingNotes">Notas de facturación</Label>
                        <Textarea
                          id="billingNotes"
                          placeholder="Notas o información adicional para la factura..."
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">
                          Vista previa
                        </Button>
                        <Button>
                          <Receipt className="h-4 w-4 mr-2" />
                          Generar factura
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </Layout>
  );
};

export default PostSessionView;
