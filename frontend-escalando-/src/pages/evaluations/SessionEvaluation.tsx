
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { patients, sessions } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import FileUploader from "@/components/FileUploader";
import { Calendar, ChevronLeft, User, Clock, FileText, ReceiptIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const developmentAreas = [
  { value: "motor", label: "Desarrollo Motor" },
  { value: "language", label: "Lenguaje y Comunicación" },
  { value: "cognitive", label: "Desarrollo Cognitivo" },
  { value: "socioemotional", label: "Desarrollo Socioemocional" },
  { value: "adaptive", label: "Habilidades Adaptativas" }
];

// Simulated data - Will use this if no patient is found
const simulatedPatient = {
  id: "simulated-patient",
  name: "Paciente de Demostración",
  age: 8,
  gender: "Masculino",
  diagnosis: "Diagnóstico de ejemplo",
  phone: "+56 9 1234 5678",
  email: "paciente@ejemplo.com",
  status: "active",
  location: "Santiago, Chile"
};

const simulatedSession = {
  id: "simulated-session",
  patientId: "simulated-patient",
  date: new Date().toISOString(),
  time: "15:00",
  duration: 45, // Updated to 45 minutes
  type: "Sesión de terapia",
  progress: "Progreso satisfactorio en las actividades realizadas."
};

const SessionEvaluation = () => {
  const { patientId, sessionId } = useParams<{ patientId: string; sessionId: string }>();
  const navigate = useNavigate();
  const patient = patients.find((p) => p.id === patientId) || simulatedPatient;
  const session = sessionId 
    ? sessions.find(s => s.id === sessionId) || simulatedSession 
    : simulatedSession;
    
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [files, setFiles] = useState<any[]>([]);
  const [billingSwitchEnabled, setBillingSwitchEnabled] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      sessionDate: new Date().toISOString().slice(0, 10),
      duration: "45", // Updated to 45 minutes default
      developmentArea: "",
      objectives: "",
      activities: "",
      patientResponse: "",
      observations: "",
      achievedMilestones: "",
      nextSteps: "",
      recommendations: "",
      // Billing information
      billingStatus: "pending",
      invoiceNumber: "",
      paymentMethod: "",
      paymentAmount: "",
    },
  });

  const handleFilesChange = (newFiles: any[]) => {
    setFiles(newFiles);
  };

  const onSubmit = (data: any) => {
    // Aquí iría la lógica para guardar la evaluación de sesión
    console.log({ ...data, files, patientId });
    
    toast({
      title: "Evaluación guardada",
      description: "La evaluación de sesión ha sido guardada con éxito",
    });
    
    // Navegar de vuelta a la página del paciente
    navigate(`/patients/${patientId}`);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-8 w-8"
          >
            <div onClick={() => navigate(`/patients/${patientId}`)}>
              <ChevronLeft className="h-4 w-4" />
            </div>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Evaluación de Sesión</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{patient.name}</span>
              </div>
              {session && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(session.date), "d 'de' MMMM, yyyy", { locale: es })}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{session.time} • 45 min</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <Tabs defaultValue="session" className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Detalles de la Sesión</CardTitle>
                  <CardDescription>
                    Registra la información sobre esta sesión de terapia
                  </CardDescription>
                  <TabsList className="grid grid-cols-2 sm:grid-cols-5 mt-6">
                    <TabsTrigger value="session">Sesión</TabsTrigger>
                    <TabsTrigger value="evaluation">Evaluación</TabsTrigger>
                    <TabsTrigger value="progress">Avances</TabsTrigger>
                    <TabsTrigger value="attachments">Archivos</TabsTrigger>
                    <TabsTrigger value="billing">Facturación</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
                  <TabsContent value="session" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="sessionDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de sesión</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duración (minutos)</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona la duración" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="30">30 minutos</SelectItem>
                                <SelectItem value="45">45 minutos</SelectItem>
                                <SelectItem value="60">60 minutos</SelectItem>
                                <SelectItem value="90">90 minutos</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="developmentArea"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Área de desarrollo</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un área de desarrollo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {developmentAreas.map(area => (
                                    <SelectItem key={area.value} value={area.value}>
                                      {area.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="objectives"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Objetivos de la sesión</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Objetivos específicos para esta sesión..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="activities"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Actividades realizadas</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descripción de actividades y técnicas utilizadas..."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="evaluation" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="patientResponse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Respuesta del paciente</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Cómo respondió el paciente a las actividades propuestas..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="observations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observaciones clínicas</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Observaciones relevantes durante la sesión..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="progress" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="achievedMilestones"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hitos alcanzados</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Logros y avances observados en esta sesión..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="nextSteps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Próximos pasos</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Pasos a seguir en las próximas sesiones..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="recommendations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recomendaciones para casa</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Actividades o ejercicios para realizar en casa..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="attachments">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Adjuntar archivos</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sube imágenes, videos, PDFs o otros archivos relevantes de la sesión
                      </p>
                      <FileUploader 
                        onFilesChange={handleFilesChange}
                        maxFiles={10}
                        maxSize={20 * 1024 * 1024} // 20MB
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="billing">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <ReceiptIcon className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Información de facturación</h3>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="billingStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado de pago</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Estado de pago" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pending">Pendiente</SelectItem>
                                  <SelectItem value="completed">Completado</SelectItem>
                                  <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="invoiceNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número de factura/boleta</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej. 001234" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Método de pago</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el método de pago" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="cash">Efectivo</SelectItem>
                                  <SelectItem value="transfer">Transferencia</SelectItem>
                                  <SelectItem value="credit_card">Tarjeta de crédito</SelectItem>
                                  <SelectItem value="debit_card">Tarjeta de débito</SelectItem>
                                  <SelectItem value="insurance">Seguro médico</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="paymentAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monto pagado</FormLabel>
                              <FormControl>
                                <Input placeholder="Ej. 45000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm font-medium mb-2">Documentos de facturación</p>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" className="gap-2 w-full sm:w-fit">
                            <FileText className="h-4 w-4" />
                            Subir factura o boleta
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 w-full sm:w-fit">
                            <FileText className="h-4 w-4" />
                            Subir comprobante de pago
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/patients/${patientId}`)}
                    className={cn(isMobile && "w-full")}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className={cn(isMobile && "w-full")}
                  >
                    Guardar evaluación
                  </Button>
                </CardFooter>
              </Tabs>
            </Card>
          </form>
        </Form>
      </motion.div>
    </Layout>
  );
};

export default SessionEvaluation;
