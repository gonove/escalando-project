
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileEdit } from "lucide-react";
import { professionals } from "@/data/mockData";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import AvailabilityCalendar from "./AvailabilityCalendar";

interface EditProfileDialogProps {
  professionalId: string;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ professionalId }) => {
  const isMobile = useIsMobile();
  
  // Get the professional data
  const professional = professionals.find(p => p.id === professionalId) || professionals[0];
  
  // Form state
  const [formData, setFormData] = useState({
    name: professional.name,
    email: professional.email,
    phone: professional.phone,
    specialty: professional.specialty,
    bio: professional.bio
  });
  
  // Schedule state
  const defaultSchedule = {
    monday: { enabled: true, start: "09:00", end: "17:00" },
    tuesday: { enabled: true, start: "09:00", end: "17:00" },
    wednesday: { enabled: true, start: "09:00", end: "17:00" },
    thursday: { enabled: true, start: "09:00", end: "17:00" },
    friday: { enabled: true, start: "09:00", end: "17:00" },
    saturday: { enabled: false, start: "09:00", end: "13:00" },
    sunday: { enabled: false, start: "", end: "" }
  };
  
  const [schedule, setSchedule] = useState(defaultSchedule);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle schedule changes
  const handleScheduleChange = (day: string, field: 'enabled' | 'start' | 'end', value: any) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: field === 'enabled' ? value : value
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // In a real app, we would save the data to the database
    toast.success("Perfil actualizado correctamente");
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn(
          "flex items-center gap-2",
          isMobile && "w-full"
        )}>
          <FileEdit className="h-4 w-4" />
          Editar Perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil Profesional</DialogTitle>
          <DialogDescription>
            Actualiza tu información profesional y horarios de disponibilidad
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="w-full mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">Información</TabsTrigger>
            <TabsTrigger value="availability" className="flex-1">Disponibilidad</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <Input 
                  id="specialty" 
                  name="specialty" 
                  value={formData.specialty} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía Profesional</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                value={formData.bio} 
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="availability" className="mt-4">
            <AvailabilityCalendar professionalId={professionalId} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={handleSubmit}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
