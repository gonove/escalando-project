
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Save, UserPlus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PatientFormData {
  firstName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  document: string;
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  diagnosis: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  initialEvaluation: string;
}

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [activeTab, setActiveTab] = useState("personal");
  
  // Check if there's a draft in localStorage
  const getDraftFromStorage = (): PatientFormData | null => {
    const draft = localStorage.getItem("patientRegistrationDraft");
    return draft ? JSON.parse(draft) : null;
  };
  
  const initialFormState: PatientFormData = {
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
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    initialEvaluation: "",
  };
  
  const [formData, setFormData] = useState<PatientFormData>(getDraftFromStorage() || initialFormState);
  
  // Save draft to localStorage whenever form data changes
  useEffect(() => {
    localStorage.setItem("patientRegistrationDraft", JSON.stringify(formData));
  }, [formData]);
  
  const handleChange = (field: keyof PatientFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      toast({
        title: "Error de validación",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally send data to your backend
    // For mock purposes, just show success toast
    
    toast({
      title: "Paciente registrado",
      description: "El paciente ha sido registrado exitosamente",
    });
    
    // Clear draft from local storage
    localStorage.removeItem("patientRegistrationDraft");
    
    // Navigate back to patients list
    navigate("/patients");
  };
  
  const clearDraft = () => {
    localStorage.removeItem("patientRegistrationDraft");
    setFormData(initialFormState);
    toast({
      title: "Borrador eliminado",
      description: "Se ha eliminado el borrador del formulario",
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
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild className="h-8 w-8">
              <Link to="/patients">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Registrar Nuevo Paciente</h1>
          </div>
          
          {getDraftFromStorage() && (
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-destructive"
              onClick={clearDraft}
            >
              <Trash2 className="h-4 w-4" />
              Borrar borrador
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={cn(
              "grid w-full",
              isMobile ? "grid-cols-2" : "grid-cols-3"
            )}>
              <TabsTrigger value="personal">Datos Personales</TabsTrigger>
              <TabsTrigger value="medical">Historial Médico</TabsTrigger>
              <TabsTrigger value="evaluation">Evaluación Inicial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Personal</CardTitle>
                  <CardDescription>
                    Ingrese los datos básicos de identificación del paciente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre <span className="text-destructive">*</span></Label>
                      <Input 
                        id="firstName" 
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido <span className="text-destructive">*</span></Label>
                      <Input 
                        id="lastName" 
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Femenino</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="document">Documento de Identidad</Label>
                    <Input 
                      id="document" 
                      value={formData.document}
                      onChange={(e) => handleChange("document", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información de Contacto</CardTitle>
                  <CardDescription>
                    Datos de contacto del paciente o responsable
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Textarea 
                      id="address" 
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Nombre de Contacto de Emergencia</Label>
                      <Input 
                        id="emergencyContactName" 
                        value={formData.emergencyContactName}
                        onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone">Teléfono de Emergencia</Label>
                      <Input 
                        id="emergencyContactPhone" 
                        value={formData.emergencyContactPhone}
                        onChange={(e) => handleChange("emergencyContactPhone", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setActiveTab("medical")}
                  className="flex items-center gap-2"
                >
                  Siguiente
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Historial Médico</CardTitle>
                  <CardDescription>
                    Información relevante sobre la condición médica del paciente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnóstico</Label>
                    <Input 
                      id="diagnosis" 
                      value={formData.diagnosis}
                      onChange={(e) => handleChange("diagnosis", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Antecedentes Médicos</Label>
                    <Textarea 
                      id="medicalHistory" 
                      value={formData.medicalHistory}
                      onChange={(e) => handleChange("medicalHistory", e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentMedications">Medicación Actual</Label>
                    <Textarea 
                      id="currentMedications" 
                      value={formData.currentMedications}
                      onChange={(e) => handleChange("currentMedications", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Alergias</Label>
                    <Textarea 
                      id="allergies" 
                      value={formData.allergies}
                      onChange={(e) => handleChange("allergies", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setActiveTab("personal")}
                >
                  Anterior
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setActiveTab("evaluation")}
                >
                  Siguiente
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="evaluation" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evaluación Inicial</CardTitle>
                  <CardDescription>
                    Observaciones iniciales y plan de tratamiento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialEvaluation">Evaluación Inicial</Label>
                    <Textarea 
                      id="initialEvaluation" 
                      value={formData.initialEvaluation}
                      onChange={(e) => handleChange("initialEvaluation", e.target.value)}
                      className="min-h-[200px]"
                      placeholder="Detalle aquí las observaciones iniciales, características del comportamiento, habilidades motoras, etc."
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setActiveTab("medical")}
                >
                  Anterior
                </Button>
                <Button 
                  type="submit"
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Registrar Paciente
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </motion.div>
    </Layout>
  );
};

export default PatientRegistration;
