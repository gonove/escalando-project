import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { patients } from "@/data/mockData";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import FileUploader from "@/components/FileUploader";
import { ChevronLeft, User, Calendar, Clock, CreditCard } from "lucide-react";

const simulatedPatient = {
  id: "simulated-patient",
  name: "Paciente de Demostración",
  age: 8,
  gender: "Masculino",
  diagnosis: "Diagnóstico de ejemplo",
  phone: "+56 9 1234 5678",
  email: "paciente@ejemplo.com",
  status: "active",
  location: "Santiago, Chile",
};

const simulatedSession = {
  id: "simulated-session",
  patientId: "simulated-patient",
  professionalId: "prof1",
  date: new Date().toISOString(),
  time: "15:00",
  type: "Sesión de terapia",
  duration: 60,
};

const paymentMethods = [
  { id: "cash", name: "Efectivo" },
  { id: "credit_card", name: "Tarjeta de Crédito" },
  { id: "debit_card", name: "Tarjeta de Débito" },
  { id: "transfer", name: "Transferencia Bancaria" },
  { id: "insurance", name: "Seguro Médico" }
];

const SessionBilling = () => {
  const { patientId, sessionId } = useParams<{ patientId: string, sessionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const patient = patients.find(p => p.id === patientId) || simulatedPatient;
  const session = simulatedSession;
  
  const [invoiceFiles, setInvoiceFiles] = useState<File[]>([]);
  const [receiptFiles, setReceiptFiles] = useState<File[]>([]);
  
  const form = useForm({
    defaultValues: {
      amount: "",
      paymentMethod: "",
      paymentDate: "",
      invoiceNumber: "",
      insuranceCoverage: "0",
      patientPayment: "",
      notes: ""
    }
  });
  
  const onSubmit = (data: any) => {
    console.log({
      ...data,
      invoiceFiles,
      receiptFiles,
      patientId,
      sessionId,
      sessionDate: session.date,
      sessionTime: session.time
    });
    
    toast({
      title: "Facturación guardada",
      description: "La información de facturación ha sido guardada correctamente",
    });
    
    navigate(`/patients/${patientId}`);
  };
  
  const handleInvoiceFilesChange = (files: File[]) => {
    setInvoiceFiles(files);
  };
  
  const handleReceiptFilesChange = (files: File[]) => {
    setReceiptFiles(files);
  };
  
  const uploadInvoiceFiles = async (sessionId: string) => {
    console.log('Uploading invoice files for session:', sessionId, invoiceFiles);
    return invoiceFiles.map(file => file.name).join(',');
  };
  
  const uploadReceiptFiles = async (sessionId: string) => {
    console.log('Uploading receipt files for session:', sessionId, receiptFiles);
    return receiptFiles.map(file => file.name).join(',');
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
            <h1 className="text-2xl font-semibold">Facturación de Sesión</h1>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{patient.name}</span>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Información de Facturación</CardTitle>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg space-y-2 dark:bg-muted/10">
                  <h3 className="font-medium">Detalles de la Sesión</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Fecha</p>
                        <p className="text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Hora</p>
                        <p className="text-muted-foreground">{session.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Paciente</p>
                        <p className="text-muted-foreground">{patient.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Tipo de Sesión</p>
                        <p className="text-muted-foreground">{session.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto Total</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <Input 
                              {...field} 
                              placeholder="0.00" 
                              className="pl-7" 
                              type="number"
                            />
                          </div>
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
                        <FormLabel>Método de Pago</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar método de pago" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentMethods.map((method) => (
                              <SelectItem key={method.id} value={method.id}>
                                {method.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Pago</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Factura/Boleta</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ej: F-123456" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="insuranceCoverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cobertura de Seguro</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                            <Input 
                              {...field} 
                              placeholder="0" 
                              className="pr-7" 
                              type="number"
                              min="0"
                              max="100"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Porcentaje cubierto por seguro médico
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="patientPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pago del Paciente</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <Input 
                              {...field} 
                              placeholder="0.00" 
                              className="pl-7" 
                              type="number"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Monto pagado directamente por el paciente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas Adicionales</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Cualquier información adicional relevante" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <div>
                    <FormLabel>Factura/Boleta (Imagen)</FormLabel>
                    <FormDescription className="mb-2">
                      Suba una imagen de la factura o boleta emitida
                    </FormDescription>
                    <FileUploader 
                      onFilesChange={handleInvoiceFilesChange}
                      maxFiles={1}
                      accept="image/*"
                      maxSize={5 * 1024 * 1024} // 5MB
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Comprobante de Pago (Opcional)</FormLabel>
                    <FormDescription className="mb-2">
                      Suba un comprobante de pago si está disponible
                    </FormDescription>
                    <FileUploader 
                      onFilesChange={handleReceiptFilesChange}
                      maxFiles={1}
                      accept="image/*"
                      maxSize={5 * 1024 * 1024} // 5MB
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate(`/patients/${patientId}`)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Información de Pago</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default SessionBilling;
