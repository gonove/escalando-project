
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { patients } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import FileUploader from "@/components/FileUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InitialEvaluation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = patients.find((p) => p.id === id);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [files, setFiles] = useState<any[]>([]);

  const form = useForm({
    defaultValues: {
      patientHistory: "",
      familyInfo: "",
      medicalHistory: "",
      currentDevelopment: "",
      initialObservations: "",
      preliminaryDiagnosis: "",
      recommendedApproach: "",
      evaluationDate: new Date().toISOString().slice(0, 10),
    },
  });

  const handleFilesChange = (newFiles: any[]) => {
    setFiles(newFiles);
  };

  const onSubmit = (data: any) => {
    // Aquí iría la lógica para guardar la evaluación inicial
    console.log({ ...data, files });
    
    toast({
      title: "Evaluación guardada",
      description: "La evaluación inicial ha sido guardada con éxito",
    });
    
    // Navegar de vuelta a la página del paciente
    navigate(`/patients/${id}`);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Evaluación Inicial</h1>
            <p className="text-muted-foreground">
              {patient.name} • {patient.age} años
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(`/patients/${id}`)}>
            Volver al perfil
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <Tabs defaultValue="general" className="w-full">
                <CardHeader>
                  <CardTitle>Evaluación Inicial</CardTitle>
                  <CardDescription>
                    Completa la información de evaluación inicial para {patient.name}
                  </CardDescription>
                  <TabsList className="grid grid-cols-2 sm:grid-cols-4 mt-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="development">Desarrollo</TabsTrigger>
                    <TabsTrigger value="diagnosis">Diagnóstico</TabsTrigger>
                    <TabsTrigger value="attachments">Archivos</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent>
                  <TabsContent value="general" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="evaluationDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de evaluación</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="patientHistory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Historia del paciente</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Información principal sobre el historial del paciente..."
                                  className="min-h-[120px]"
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
                          name="familyInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Información familiar</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Información sobre la estructura familiar, dinámica y apoyo..."
                                  className="min-h-[120px]"
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
                          name="medicalHistory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Antecedentes médicos</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Historial médico relevante, medicamentos, tratamientos previos..."
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

                  <TabsContent value="development" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="currentDevelopment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado actual de desarrollo</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descripción del desarrollo físico, cognitivo, emocional y social actual..."
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="initialObservations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observaciones iniciales</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Observaciones durante la evaluación inicial..."
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="diagnosis" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="preliminaryDiagnosis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diagnóstico preliminar</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Diagnóstico inicial basado en la evaluación..."
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
                      name="recommendedApproach"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enfoque recomendado</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Recomendaciones para el tratamiento y enfoque terapéutico..."
                              className="min-h-[150px]"
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
                        Sube imágenes, videos, PDFs u otros archivos relevantes para la evaluación
                      </p>
                      <FileUploader 
                        onFilesChange={handleFilesChange}
                        maxFiles={10}
                        maxSize={20 * 1024 * 1024} // 20MB
                      />
                    </div>
                  </TabsContent>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/patients/${id}`)}
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

export default InitialEvaluation;
