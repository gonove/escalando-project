
import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon, 
  Copy, 
  Save,
  Clock,
  Check,
} from "lucide-react";
import { getProfessionalAvailability, updateProfessionalAvailability, AvailabilityData, WeeklyTemplate, ExceptionData, TimeSlot } from "@/api/professional";

interface AvailabilityCalendarProps {
  professionalId: string;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ professionalId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState<string>("weekly");
  const [selectedDay, setSelectedDay] = useState<keyof WeeklyTemplate>("monday");
  const [showWeekends, setShowWeekends] = useState<boolean>(false);
  
  // Load availability data
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const data = await getProfessionalAvailability(professionalId);
        setAvailabilityData(data);
      } catch (error) {
        console.error("Error loading availability:", error);
        toast.error("No se pudo cargar la disponibilidad");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailability();
  }, [professionalId]);
  
  // Save availability data
  const handleSave = async () => {
    if (!availabilityData) return;
    
    try {
      toast.loading("Guardando cambios...");
      await updateProfessionalAvailability(professionalId, availabilityData);
      toast.dismiss();
      toast.success("Disponibilidad actualizada correctamente");
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.dismiss();
      toast.error("Error al guardar la disponibilidad");
    }
  };
  
  // Handle day toggle in weekly template
  const handleDayToggle = (day: keyof WeeklyTemplate) => {
    if (!availabilityData) return;
    
    setAvailabilityData({
      ...availabilityData,
      weeklyTemplate: {
        ...availabilityData.weeklyTemplate,
        [day]: {
          ...availabilityData.weeklyTemplate[day],
          enabled: !availabilityData.weeklyTemplate[day].enabled,
        },
      },
    });
  };
  
  // Handle time slot toggle
  const handleSlotToggle = (day: keyof WeeklyTemplate, slotIndex: number) => {
    if (!availabilityData) return;
    
    const updatedSlots = [...availabilityData.weeklyTemplate[day].slots];
    updatedSlots[slotIndex] = {
      ...updatedSlots[slotIndex],
      available: !updatedSlots[slotIndex].available,
    };
    
    setAvailabilityData({
      ...availabilityData,
      weeklyTemplate: {
        ...availabilityData.weeklyTemplate,
        [day]: {
          ...availabilityData.weeklyTemplate[day],
          slots: updatedSlots,
        },
      },
    });
  };
  
  // Handle select all slots for a day
  const handleSelectAllDay = (day: keyof WeeklyTemplate) => {
    if (!availabilityData) return;
    
    const updatedSlots = availabilityData.weeklyTemplate[day].slots.map(slot => ({
      ...slot,
      available: true,
    }));
    
    setAvailabilityData({
      ...availabilityData,
      weeklyTemplate: {
        ...availabilityData.weeklyTemplate,
        [day]: {
          ...availabilityData.weeklyTemplate[day],
          enabled: true,
          slots: updatedSlots,
        },
      },
    });
  };
  
  // Handle deselect all slots for a day
  const handleDeselectAllDay = (day: keyof WeeklyTemplate) => {
    if (!availabilityData) return;
    
    const updatedSlots = availabilityData.weeklyTemplate[day].slots.map(slot => ({
      ...slot,
      available: false,
    }));
    
    setAvailabilityData({
      ...availabilityData,
      weeklyTemplate: {
        ...availabilityData.weeklyTemplate,
        [day]: {
          ...availabilityData.weeklyTemplate[day],
          enabled: true,
          slots: updatedSlots,
        },
      },
    });
  };
  
  // Handle copy settings from one day to another
  const handleCopyDay = (fromDay: keyof WeeklyTemplate, toDay: keyof WeeklyTemplate) => {
    if (!availabilityData) return;
    
    setAvailabilityData({
      ...availabilityData,
      weeklyTemplate: {
        ...availabilityData.weeklyTemplate,
        [toDay]: {
          ...availabilityData.weeklyTemplate[toDay],
          enabled: availabilityData.weeklyTemplate[fromDay].enabled,
          slots: [...availabilityData.weeklyTemplate[fromDay].slots],
        },
      },
    });
    
    toast.success(`Configuración copiada de ${getDayName(fromDay)} a ${getDayName(toDay)}`);
  };
  
  // Helper to get day name in Spanish
  const getDayName = (day: keyof WeeklyTemplate): string => {
    const dayNames: Record<keyof WeeklyTemplate, string> = {
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
    };
    
    return dayNames[day];
  };
  
  // Helper to get time slot label (e.g., "9:00 - 9:45")
  const getTimeSlotLabel = (timeStart: string): string => {
    const [hours, minutes] = timeStart.split(":").map(Number);
    let endMinutes = minutes + 45;
    let endHours = hours;
    
    if (endMinutes >= 60) {
      endMinutes -= 60;
      endHours += 1;
    }
    
    return `${timeStart} - ${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
  };
  
  // Helper to check if a date has an exception
  const hasException = (date: Date): ExceptionData | undefined => {
    if (!availabilityData) return undefined;
    
    const dateString = format(date, "yyyy-MM-dd");
    return availabilityData.exceptions.find(ex => ex.date === dateString);
  };
  
  // Helper to get calendar day class based on exceptions and availability
  const getDayClassName = (date: Date): string => {
    if (!availabilityData) return "";
    
    const exception = hasException(date);
    if (exception) {
      return exception.type === "unavailable" ? "bg-red-100" : "bg-blue-100";
    }
    
    const dayOfWeek = getDay(date);
    // Convert JS day (0 = Sunday) to our day keys (monday, tuesday, etc.)
    const dayKeys: Record<number, keyof WeeklyTemplate> = {
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
      0: "sunday",
    };
    
    const day = dayKeys[dayOfWeek];
    if (!availabilityData.weeklyTemplate[day].enabled) {
      return "bg-gray-100";
    }
    
    const hasAvailableSlots = availabilityData.weeklyTemplate[day].slots.some(slot => slot.available);
    return hasAvailableSlots ? "bg-green-100" : "bg-gray-100";
  };
  
  // Create an array of weekday names in the correct order
  const weekdayNames = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;
  const weekendNames = ["saturday", "sunday"] as const;
  
  // Create a combined array based on showWeekends setting
  const daysToShow = [
    ...weekdayNames,
    ...(showWeekends ? weekendNames : []),
  ] as const;
  
  if (loading || !availabilityData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Disponibilidad</CardTitle>
          <CardDescription>Cargando datos de disponibilidad...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-pulse flex flex-col space-y-4 w-full">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-40 bg-gray-200 rounded w-full"></div>
            <div className="h-40 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Configuración de Disponibilidad</CardTitle>
            <CardDescription>Administra tus horarios disponibles para atención</CardDescription>
          </div>
          <Button onClick={handleSave} className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            Guardar Cambios
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="weekly" className="flex-1">Plantilla Semanal</TabsTrigger>
              <TabsTrigger value="calendar" className="flex-1">Vista de Calendario</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="show-weekends"
                    checked={showWeekends}
                    onCheckedChange={setShowWeekends}
                  />
                  <Label htmlFor="show-weekends">Mostrar fines de semana</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Días de la semana</h3>
                    <div className="space-y-3">
                      {daysToShow.map((day) => (
                        <div key={day} className="flex items-center justify-between">
                          <Label htmlFor={`day-${day}`} className="font-normal">
                            {getDayName(day)}
                          </Label>
                          <Switch
                            id={`day-${day}`}
                            checked={availabilityData.weeklyTemplate[day].enabled}
                            onCheckedChange={() => handleDayToggle(day)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Día seleccionado</h3>
                    <div className="space-y-3">
                      <ToggleGroup type="single" value={selectedDay} onValueChange={(value) => value && setSelectedDay(value as keyof WeeklyTemplate)}>
                        {daysToShow.map((day) => (
                          <ToggleGroupItem key={day} value={day} aria-label={getDayName(day)}>
                            {getDayName(day).substring(0, 3)}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                      
                      <div className="flex flex-col gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSelectAllDay(selectedDay)}
                          disabled={!availabilityData.weeklyTemplate[selectedDay].enabled}
                          className="justify-start"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Seleccionar Todo
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeselectAllDay(selectedDay)}
                          disabled={!availabilityData.weeklyTemplate[selectedDay].enabled}
                          className="justify-start"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Deseleccionar Todo
                        </Button>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Copiar a otro día:</h4>
                        {daysToShow.filter(day => day !== selectedDay).map((day) => (
                          <Button 
                            key={day}
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCopyDay(selectedDay, day)}
                            className="w-full justify-start mb-1"
                          >
                            <Copy className="h-3.5 w-3.5 mr-2" />
                            {getDayName(day)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {getDayName(selectedDay)}
                      </CardTitle>
                      <CardDescription>
                        {availabilityData.weeklyTemplate[selectedDay].enabled
                          ? "Configura los horarios disponibles"
                          : "Este día no está habilitado para atención"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {availabilityData.weeklyTemplate[selectedDay].enabled ? (
                        <div className="w-full overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-48">Horario</TableHead>
                                <TableHead>Disponibilidad</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {availabilityData.weeklyTemplate[selectedDay].slots.map((slot, index) => (
                                <TableRow key={`${selectedDay}-${slot.time}`}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                      {getTimeSlotLabel(slot.time)}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <Switch
                                        checked={slot.available}
                                        onCheckedChange={() => handleSlotToggle(selectedDay, index)}
                                      />
                                      <span className="ml-2">
                                        {slot.available ? "Disponible" : "No disponible"}
                                      </span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-muted-foreground mb-4">
                            Este día no está habilitado para atención
                          </p>
                          <Button 
                            variant="outline"
                            onClick={() => handleDayToggle(selectedDay)}
                          >
                            Habilitar este día
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <Card className="border-0 shadow-none">
                    <CardContent className="pt-6">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="border rounded-md pointer-events-auto"
                        locale={es}
                        modifiers={{
                          dayWithException: (date) => Boolean(hasException(date)),
                        }}
                        modifiersClassNames={{
                          dayWithException: "font-bold",
                        }}
                        styles={{
                          day: (date) => ({
                            backgroundColor: getDayClassName(date),
                          }),
                        }}
                      />
                      
                      <div className="mt-6 space-y-2">
                        <h3 className="font-medium text-sm">Leyenda:</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-100"></div>
                            <span className="text-sm">Disponible</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-100"></div>
                            <span className="text-sm">No disponible</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-100"></div>
                            <span className="text-sm">Excepción personalizada</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-100"></div>
                            <span className="text-sm">Día no disponible</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-3">
                  {selectedDate && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5" />
                          {format(selectedDate, "EEEE dd 'de' MMMM, yyyy", { locale: es })}
                        </CardTitle>
                        {hasException(selectedDate) ? (
                          <CardDescription>
                            Este día tiene una configuración especial
                          </CardDescription>
                        ) : (
                          <CardDescription>
                            Configuración según la plantilla de {getDayName(
                              weekdayNames[getDay(selectedDate) === 0 ? 6 : getDay(selectedDate) - 1] as keyof WeeklyTemplate
                            )}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        {/* Aquí iría la vista detallada del día seleccionado */}
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            Aquí puedes ver y editar la disponibilidad para este día específico.
                          </p>
                          
                          <Button variant="outline">
                            {hasException(selectedDate) 
                              ? "Editar excepción" 
                              : "Crear excepción para este día"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityCalendar;
