import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { patients } from "@/data/mockData";
import { Patient } from "@/types/models";
import { ChevronLeft, Save, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getPatientById, updatePatientById } from "@/api/patient";

const PatientEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [patient, setPatient] = useState<Patient | null>(null);

  const [loading, setLoading] = useState(true);

  const { isLoading, data, error } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => getPatientById(id)
  });

  useEffect(() => {

    if (isLoading) {
      setLoading(true);
    }

    if (data) {
      setPatient(data);
      setLoading(false);
    }
  }, [data, isLoading,]);



  const handleChange = (field: keyof Patient, value: string | number) => {
    if (patient) {
      setPatient({ ...patient, [field]: value });
    }
  };

  const handleSubmit = async () => {
    if (!patient) return;

    const { id, fullName, createdAt, updatedAt, deletedAt, ...patientToUpdate } = patient;

    await updatePatientById(id, patientToUpdate);
    toast({
      title: "Paciente actualizado",
      description: "Los datos del paciente han sido actualizados exitosamente",
    });

    navigate(`/patients/${id}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Cargando información del paciente...</p>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Paciente no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            El paciente que buscas no existe o ha sido eliminado.
          </p>
          <Button asChild>
            <Link to="/patients">Volver a Pacientes</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };


  console.log(patient)
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
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-8 w-8"
            >
              <Link to={`/patients/${id}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Editar Paciente</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <div className="flex items-center gap-2 mr-2">
                <Label htmlFor="patient-status" className="text-sm">Estado:</Label>
                <Select
                  value={patient.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger id="patient-status" className="w-[130px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500 text-white">Activo</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-gray-500 text-white">Inactivo</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Guardar Cambios
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
            {!isMobile && <TabsTrigger value="contact">Contacto</TabsTrigger>}
            {!isMobile && <TabsTrigger value="notes">Notas</TabsTrigger>}
          </TabsList>

          {isMobile && (
            <TabsList className="grid grid-cols-2 w-full mt-2">
              <TabsTrigger value="contact">Contacto</TabsTrigger>
              <TabsTrigger value="notes">Notas</TabsTrigger>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={patient.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={patient.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Edad</Label>
                    <Input
                      id="age"
                      type="number"
                      value={calculateAge(patient.dateOfBirth)}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Género</Label>
                    <Select
                      value={patient.gender}
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
                    <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={patient.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
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
                  <Label htmlFor="diagnosis">Diagnóstico</Label>
                  <Input
                    id="diagnosis"
                    value={patient.diagnosis}
                    onChange={(e) => handleChange("diagnosis", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas Médicas</Label>
                  <Textarea
                    id="notes"
                    className="min-h-[100px]"
                    value={patient.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={patient.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Seleccione el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información de Contacto</CardTitle>
                <CardDescription>
                  Datos de contacto del paciente y sus responsables
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patient.contacts[0].email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Teléfono</Label>
                    <Input
                      id="contactNumber"
                      value={patient.contacts[0].phone}
                      onChange={(e) => handleChange("contactNumber", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    value={patient.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Nombre del Responsable</Label>
                    <Input
                      id="parentName"
                      value={patient.contacts[0].firstName + " " + patient.contacts[0].lastName}
                      onChange={(e) => handleChange("parentName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Número de Contacto Alternativo</Label>
                    <Input
                      id="contactNumber"
                      value={patient.contacts[1].phone}
                      onChange={(e) => handleChange("contactNumber", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notas Adicionales</CardTitle>
                <CardDescription>
                  Observaciones y comentarios sobre el paciente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Notas</Label>
                  <Textarea
                    id="additionalNotes"
                    className="min-h-[200px]"
                    value={patient.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default PatientEdit;
