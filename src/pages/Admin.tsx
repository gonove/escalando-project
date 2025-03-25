
import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  UserCheck, 
  UserPlus, 
  Settings, 
  Users, 
  Shield, 
  FileText, 
  Upload,
  Search,
  MoreVertical,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { professionals } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProfessionals, setFilteredProfessionals] = useState(professionals);
  const { toast } = useToast();
  
  // Filter professionals based on search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredProfessionals(professionals);
    } else {
      const filtered = professionals.filter(
        prof => prof.name.toLowerCase().includes(term.toLowerCase()) || 
                prof.specialty.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProfessionals(filtered);
    }
  };
  
  // Handle adding a new professional
  const handleAddProfessional = () => {
    toast({
      title: "Profesional agregado",
      description: "El profesional ha sido agregado correctamente",
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
            <h1 className="text-2xl font-semibold">Panel de Administración</h1>
            <p className="text-muted-foreground">
              Gestiona profesionales, permisos y configuraciones de la plataforma
            </p>
          </div>
        </div>

        <Tabs defaultValue="professionals" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="professionals">Profesionales</TabsTrigger>
            <TabsTrigger value="permissions">Permisos</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="professionals" className="space-y-4 mt-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-escalando-500" />
                      <span>Profesionales</span>
                    </div>
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Nuevo Profesional
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Profesional</DialogTitle>
                        <DialogDescription>
                          Ingresa los datos del nuevo profesional
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nombre Completo</Label>
                          <Input id="name" placeholder="Nombre y apellido" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Correo Electrónico</Label>
                          <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="specialty">Especialidad</Label>
                          <Select>
                            <SelectTrigger id="specialty">
                              <SelectValue placeholder="Selecciona especialidad" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="psychology">Psicología</SelectItem>
                              <SelectItem value="speech">Fonoaudiología</SelectItem>
                              <SelectItem value="occupational">Terapia Ocupacional</SelectItem>
                              <SelectItem value="physical">Fisioterapia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="role">Rol</Label>
                          <Select defaultValue="therapist">
                            <SelectTrigger id="role">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="therapist">Terapeuta</SelectItem>
                              <SelectItem value="assistant">Asistente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="avatar">Foto de Perfil</Label>
                          <div className="flex-1">
                            <Input id="avatar" type="file" className="cursor-pointer" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleAddProfessional}>Agregar Profesional</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar profesionales..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="space-y-4">
                  {filteredProfessionals.map((professional, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage src={professional.avatar} />
                            <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{professional.name}</p>
                            <p className="text-sm text-muted-foreground">{professional.specialty}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                                <span className="text-xs text-green-600 font-medium">Activo</span>
                              </div>
                              <Separator orientation="vertical" className="h-4 mx-2" />
                              <span className="text-xs text-muted-foreground">
                                {professional.email}
                              </span>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Gestionar Profesional</DialogTitle>
                                <DialogDescription>
                                  Modifica los permisos y datos del profesional
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Permisos</h4>
                                  <div className="space-y-3">
                                    {["Ver informes", "Editar informes", "Gestionar pacientes", "Acceso a facturación"].map((permission, i) => (
                                      <div key={i} className="flex items-center justify-between">
                                        <Label htmlFor={`permission-${i}`} className="cursor-pointer flex items-center gap-2">
                                          {permission}
                                        </Label>
                                        <Switch id={`permission-${i}`} defaultChecked={i < 2} />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                  <h4 className="font-medium">Acciones</h4>
                                  <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start">
                                      <Shield className="h-4 w-4 mr-2" />
                                      Cambiar rol
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                      <Settings className="h-4 w-4 mr-2" />
                                      Editar perfil
                                    </Button>
                                    <Button variant="destructive" className="w-full justify-start">
                                      Desactivar cuenta
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-escalando-500" />
                  <span>Permisos y Roles</span>
                </CardTitle>
                <CardDescription>
                  Configura los permisos para cada rol en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="admin">
                  <TabsList className="grid grid-cols-3 w-full max-w-md">
                    <TabsTrigger value="admin">Administrador</TabsTrigger>
                    <TabsTrigger value="therapist">Terapeuta</TabsTrigger>
                    <TabsTrigger value="assistant">Asistente</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="admin" className="pt-4 space-y-4">
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <p className="text-sm font-medium">
                        Los administradores tienen acceso completo a todas las funciones de la plataforma.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        "Gestión de usuarios",
                        "Creación y edición de informes",
                        "Acceso a facturación",
                        "Configuración del sistema",
                        "Administración de permisos",
                        "Gestión de pacientes"
                      ].map((permission, i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-2">
                          <Label htmlFor={`admin-${i}`} className="cursor-pointer">
                            {permission}
                          </Label>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="therapist" className="pt-4 space-y-4">
                    <div className="bg-secondary/30 rounded-lg p-4">
                      <p className="text-sm font-medium">
                        Los terapeutas tienen acceso a sus pacientes e informes asignados.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        "Ver pacientes asignados",
                        "Crear y editar informes propios",
                        "Programar sesiones",
                        "Ver facturación propia",
                        "Compartir informes con padres",
                        "Subir archivos de terapia"
                      ].map((permission, i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-2">
                          <Label htmlFor={`therapist-${i}`} className="cursor-pointer">
                            {permission}
                          </Label>
                          <Switch id={`therapist-${i}`} defaultChecked={i < 5} />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="assistant" className="pt-4 space-y-4">
                    {/* Similar content for assistant role */}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Guardar Cambios</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-escalando-500" />
                  <span>Configuración de la Plataforma</span>
                </CardTitle>
                <CardDescription>
                  Personaliza la configuración general de Escalando
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Información Básica</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nombre de la Organización</Label>
                      <Input id="company-name" defaultValue="Escalando" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email de Contacto</Label>
                      <Input id="contact-email" defaultValue="contacto@escalando.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input id="website" defaultValue="www.escalando.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Zona Horaria</Label>
                      <Select defaultValue="america_santiago">
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america_santiago">América/Santiago (GMT-4)</SelectItem>
                          <SelectItem value="america_buenos_aires">América/Buenos Aires (GMT-3)</SelectItem>
                          <SelectItem value="america_bogota">América/Bogotá (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Apariencia</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo</Label>
                      <Input id="logo" type="file" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Color Principal</Label>
                      <Input id="primary-color" type="color" defaultValue="#eab308" className="h-10" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Configuración de Informes</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="report-watermark" className="cursor-pointer">Añadir marca de agua a informes</Label>
                      <Switch id="report-watermark" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="report-expiry" className="cursor-pointer">Establecer caducidad para enlaces compartidos</Label>
                      <Switch id="report-expiry" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="report-notification" className="cursor-pointer">Notificar al compartir informes</Label>
                      <Switch id="report-notification" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-2">Cancelar</Button>
                <Button>Guardar Cambios</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Admin;
