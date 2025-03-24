
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { patients, sessions } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import FileUploader from "@/components/FileUploader";
import { ChevronLeft, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const SessionSummary = () => {
  const { patientId, sessionId } = useParams<{ patientId: string; sessionId: string }>();
  const navigate = useNavigate();
  const patient = patients.find((p) => p.id === patientId);
  const session = sessionId ? sessions.find(s => s.id === sessionId) : null;
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [files, setFiles] = useState<any[]>([]);

  const form = useForm({
    defaultValues: {
      summary: "",
      internalNotes: "",
      keyAchievements: "",
      challengesIdentified: "",
      therapistObservations: "",
    },
  });

  const handleFilesChange = (newFiles: any[]) => {
    setFiles(newFiles);
  };

  const onSubmit = (data: any) => {
    // Aquí iría la lógica para guardar el resumen de sesión
    console.log({ ...data, files, patientId, sessionId });
    
    toast({
      title: "Resumen guardado",
      description: "El resumen de la sesión ha sido guardado con éxito",
    });
    
    // Navegar de vuelta a la página del paciente
    navigate(`/patients/${patientId}`);
  };

  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Paciente no encontrado</h1>
          <Button onClick={() => navigate("/patients")}>Volver a pacientes</Button>
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
            <h1 className="text-2xl font-semibold">Resumen de Sesión</h1>
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
                </>
              )}
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de la Sesión</CardTitle>
                <CardDescription>
                  Registra un resumen para uso interno del equipo terapéutico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resumen general</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Resumen general de lo trabajado en la sesión..."
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
                  name="keyAchievements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logros principales</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Logros y avances destacados de la sesión..."
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
                  name="challengesIdentified"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desafíos identificados</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Dificultades o áreas de oportunidad identificadas..."
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
                  name="therapistObservations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones del terapeuta</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observaciones profesionales sobre comportamientos, respuestas o situaciones específicas..."
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
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas internas (solo para el equipo)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notas confidenciales solo para el equipo terapéutico..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Estas notas son exclusivamente para uso interno y no se incluirán en informes para padres o externos.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4 pt-4">
                  <h3 className="text-sm font-medium">Archivos adjuntos</h3>
                  <p className="text-sm text-muted-foreground">
                    Sube archivos relevantes para compartir con el equipo terapéutico
                  </p>
                  <FileUploader 
                    onFilesChange={handleFilesChange}
                    maxFiles={10}
                    maxSize={20 * 1024 * 1024} // 20MB
                  />
                </div>
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
                  Guardar resumen
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </motion.div>
    </Layout>
  );
};

export default SessionSummary;
