
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Save, FileText, Phone, Mail, Home, Calendar, UserCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const DRAFT_STORAGE_KEY = "patient_registration_draft";

const PatientRegistration = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    gender: "",
    document: "",
    phone: "",
    email: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    diagnosis: "",
    diagnosisDate: "",
    referringProfessional: "",
    specialty: "",
    medicalHistory: "",
    medications: "",
    allergies: "",
    // Campos adicionales para los otros tabs
  });

  // Cargar borrador al iniciar
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
        toast({
          title: "Borrador cargado",
          description: "Se ha cargado un borrador guardado previamente",
        });
      } catch (error) {
        console.error("Error al cargar el borrador:", error);
      }
    }
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
    toast({
      title: "Borrador guardado",
      description: "Los datos han sido guardados como borrador"
    });
  };

  const handleSubmit = () => {
    // Aquí iría la lógica para guardar el paciente
    toast({
      title: "Paciente registrado",
      description: "El paciente ha sido registrado exitosamente"
    });
    
    // Limpiar el borrador después de guardar
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    
    // Navegar a la lista de pacientes
    navigate("/patients");
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
            <h1 className="text-2xl font-semibold">Registro de Paciente</h1>
            <p className="text-muted-foreground">
              Ingrese los datos del nuevo paciente
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleSaveDraft}
            >
              <Save className="h-4 w-4" />
              Guardar Borrador
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={handleSubmit}
            >
              <UserPlus className="h-4 w-4" />
              Registrar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className={cn(
            "grid w-full",
            isMobile ? "grid-cols-2" : "grid-cols-4 max-w-2xl"
          )}>
            <TabsTrigger value="personal">Datos Personales</TabsTrigger>
            <TabsTrigger value="medical">Historial Médico</TabsTrigger>
            {!isMobile && <TabsTrigger value="evaluation">Evaluación Inicial</TabsTrigger>}
            {!isMobile && <TabsTrigger value="attachments">Documentos</TabsTrigger>}
          </TabsList>
          
          {isMobile && (
            <TabsList className="grid grid-cols-2 w-full mt-2">
              <TabsTrigger value="evaluation">Evaluación Inicial</TabsTrigger>
              <TabsTrigger value="attachments">Documentos</TabsTrigger>
            </TabsList>
          )}
          
          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Personal</CardTitle>
                <CardDescription>
                  Datos básicos de identificación del paciente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={cn(
                  "flex items-center gap-4",
                  isMobile ? "flex-col items-center" : "flex-row items-start"
                )}>
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-muted">
                      <UserCircle className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <Button size="sm" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Nombres</Label>
                      <Input 
                        id="first-name" 
                        placeholder="Nombres del paciente" 
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Apellidos</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Apellidos del paciente" 
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Fecha de Nacimiento</Label>
                    <Input 
                      id="birthdate" 
                      type="date" 
                      value={formData.birthdate}
                      onChange={(e) => handleChange("birthdate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select 
                      value={formData.gender}
                      onValueChange={(value) => handleChange("gender", value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Seleccione el género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Femenino</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="document">Documento de Identidad</Label>
                    <Input 
                      id="document" 
                      placeholder="DNI / Pasaporte" 
                      value={formData.document}
                      onChange={(e) => handleChange("document", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Información de Contacto</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="phone">Teléfono</Label>
                      </div>
                      <Input 
                        id="phone" 
                        placeholder="Número de teléfono" 
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="email">Correo Electrónico</Label>
                      </div>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="correo@ejemplo.com" 
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="address">Dirección</Label>
                  </div>
                  <Textarea 
                    id="address" 
                    placeholder="Dirección completa del paciente" 
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Contacto de Emergencia</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <Input 
                      id="emergency-contact-name" 
                      placeholder="Nombre del contacto" 
                      value={formData.emergencyContactName}
                      onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                    />
                    <Input 
                      id="emergency-contact-phone" 
                      placeholder="Teléfono del contacto" 
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="medical" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historial Médico</CardTitle>
                <CardDescription>
                  Información sobre diagnósticos y condiciones médicas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnóstico Principal</Label>
                  <Input 
                    id="diagnosis" 
                    placeholder="Ej: Trastorno del Espectro Autista" 
                    value={formData.diagnosis}
                    onChange={(e) => handleChange("diagnosis", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="diagnosis-date">Fecha de Diagnóstico</Label>
                  <Input 
                    id="diagnosis-date" 
                    type="date" 
                    value={formData.diagnosisDate}
                    onChange={(e) => handleChange("diagnosisDate", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referring-professional">Profesional que Refiere</Label>
                    <Input 
                      id="referring-professional" 
                      placeholder="Nombre del profesional" 
                      value={formData.referringProfessional}
                      onChange={(e) => handleChange("referringProfessional", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidad</Label>
                    <Select 
                      value={formData.specialty}
                      onValueChange={(value) => handleChange("specialty", value)}
                    >
                      <SelectTrigger id="specialty">
                        <SelectValue placeholder="Seleccione especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neurology">Neurología</SelectItem>
                        <SelectItem value="pediatrics">Pediatría</SelectItem>
                        <SelectItem value="psychiatry">Psiquiatría</SelectItem>
                        <SelectItem value="psychology">Psicología</SelectItem>
                        <SelectItem value="other">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medical-history">Antecedentes Médicos</Label>
                  <Textarea 
                    id="medical-history" 
                    placeholder="Detalles sobre historial médico relevante" 
                    className="min-h-[100px]" 
                    value={formData.medicalHistory}
                    onChange={(e) => handleChange("medicalHistory", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medications">Medicamentos Actuales</Label>
                  <Textarea 
                    id="medications" 
                    placeholder="Lista de medicamentos y dosis" 
                    value={formData.medications}
                    onChange={(e) => handleChange("medications", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Alergias</Label>
                  <Textarea 
                    id="allergies" 
                    placeholder="Alergias conocidas" 
                    value={formData.allergies}
                    onChange={(e) => handleChange("allergies", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="evaluation" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evaluación Inicial</CardTitle>
                <CardDescription>
                  Objetivos y estrategias terapéuticas iniciales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="treatment-goals">Objetivos Generales</Label>
                  <Textarea 
                    id="treatment-goals" 
                    placeholder="Objetivos principales de la evaluación" 
                    className="min-h-[100px]" 
                    value={formData.treatmentGoals}
                    onChange={(e) => handleChange("treatmentGoals", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="treatment-plan">Plan de Intervención</Label>
                  <Textarea 
                    id="treatment-plan" 
                    placeholder="Estrategias y actividades a implementar" 
                    className="min-h-[100px]" 
                    value={formData.treatmentPlan}
                    onChange={(e) => handleChange("treatmentPlan", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-frequency">Frecuencia de Sesiones</Label>
                    <Select 
                      defaultValue="weekly"
                      value={formData.sessionFrequency}
                      onValueChange={(value) => handleChange("sessionFrequency", value)}
                    >
                      <SelectTrigger id="session-frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diaria</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="biweekly">Quincenal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimated-duration">Duración Estimada</Label>
                    <Select 
                      defaultValue="3-months"
                      value={formData.estimatedDuration}
                      onValueChange={(value) => handleChange("estimatedDuration", value)}
                    >
                      <SelectTrigger id="estimated-duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-month">1 mes</SelectItem>
                        <SelectItem value="3-months">3 meses</SelectItem>
                        <SelectItem value="6-months">6 meses</SelectItem>
                        <SelectItem value="1-year">1 año</SelectItem>
                        <SelectItem value="ongoing">Continuo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="progress-indicators">Indicadores de Progreso</Label>
                  <Textarea 
                    id="progress-indicators" 
                    placeholder="Cómo se medirá el progreso del paciente" 
                    value={formData.progressIndicators}
                    onChange={(e) => handleChange("progressIndicators", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additional-recommendations">Recomendaciones Adicionales</Label>
                  <Textarea 
                    id="additional-recommendations" 
                    placeholder="Otras indicaciones o sugerencias para el paciente o familia" 
                    value={formData.additionalRecommendations}
                    onChange={(e) => handleChange("additionalRecommendations", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attachments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentos</CardTitle>
                <CardDescription>
                  Adjunte informes, evaluaciones y otros documentos relevantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Arrastre archivos aquí</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    O haga clic para seleccionar archivos desde su dispositivo
                  </p>
                  <Button variant="outline">Seleccionar Archivos</Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Documentos Requeridos</Label>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Informes médicos previos</li>
                    <li>Evaluaciones neuropsicológicas</li>
                    <li>Informes escolares</li>
                    <li>Consentimiento informado</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Documentos Adjuntos</h3>
                  <p className="text-sm text-muted-foreground">No hay documentos adjuntos</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Continuar sin Documentos</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default PatientRegistration;
