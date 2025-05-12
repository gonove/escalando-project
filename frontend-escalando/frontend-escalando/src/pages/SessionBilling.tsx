import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, FileText, Receipt } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import Layout from '@/components/layout/Layout';

const patients = [
  { id: "pat1", name: "Juan Pérez", diagnosis: "TDAH" },
  { id: "pat2", name: "María García", diagnosis: "Dislexia" },
  { id: "pat3", name: "Carlos López", diagnosis: "Autismo" },
  { id: "pat4", name: "Ana Martínez", diagnosis: "Retraso del lenguaje" },
];

const therapists = [
  { id: "prof1", name: "Ana García", specialty: "Terapeuta Ocupacional" },
  { id: "prof2", name: "Carlos Rodríguez", specialty: "Psicólogo Infantil" },
  { id: "prof3", name: "Laura Martínez", specialty: "Logopeda" },
  { id: "prof4", name: "Sofía López", specialty: "Fisioterapeuta" },
];

const cptCodesData = [
  { code: "97110", description: "Terapia de ejercicios" },
  { code: "97530", description: "Actividades terapéuticas" },
  { code: "97112", description: "Reeducación neuromuscular" },
  { code: "97150", description: "Terapia de grupo" },
];

const icdCodesData = [
  { code: "F80.0", description: "Trastorno específico de la pronunciación" },
  { code: "F80.1", description: "Trastorno expresivo del lenguaje" },
  { code: "F80.2", description: "Trastorno mixto del lenguaje receptivo-expresivo" },
  { code: "F80.81", description: "Trastorno de la comunicación social (pragmático)" },
];

const SessionBilling = () => {
  const navigate = useNavigate();
  const { patientId, sessionId } = useParams();
  const { toast } = useToast();

  const [patient, setPatient] = useState(null);
  const [therapist, setTherapist] = useState(null);
  const [session, setSession] = useState(null);
  const [billingDate, setBillingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState("");
  const [cptCodes, setCptCodes] = useState({} as Record<string, string[]>);
  const [icdCodes, setIcdCodes] = useState({} as Record<string, string[]>);
  const [amount, setAmount] = useState("50.00");

  useEffect(() => {
    // Mock data loading
    const loadedPatient = patients.find(p => p.id === patientId);
    const loadedTherapist = therapists.find(t => t.id === "prof1"); // Assuming a default therapist
    const loadedSession = {
      id: sessionId,
      date: new Date(),
      time: "10:00",
      duration: 60,
    };

    setPatient(loadedPatient);
    setTherapist(loadedTherapist);
    setSession(loadedSession);
  }, [patientId, sessionId]);

  const handleCptCodeChange = (code: string, checked: boolean) => {
    setCptCodes(prev => {
      const newCodes = { ...prev };
      if (checked) {
        newCodes[code] = [cptCodesData.find(c => c.code === code)?.description || ""];
      } else {
        delete newCodes[code];
      }
      return newCodes;
    });
  };

  const handleIcdCodeChange = (code: string, checked: boolean) => {
    setIcdCodes(prev => {
      const newCodes = { ...prev };
      if (checked) {
        newCodes[code] = [icdCodesData.find(i => i.code === code)?.description || ""];
      } else {
        delete newCodes[code];
      }
      return newCodes;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const billingData = {
      patientId,
      sessionId,
      billingDate,
      cptCodes,
      icdCodes,
      amount,
      notes,
    };

    console.log("Billing Data:", billingData);

    toast({
      title: "Facturación Creada",
      description: "La información de facturación ha sido guardada.",
    });

    navigate(`/sessions/summary/${patientId}/${sessionId}`);
  };

  if (!patient || !therapist || !session) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Crear Facturación</CardTitle>
            <CardDescription>
              Ingrese la información de facturación para la sesión.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Paciente</Label>
                <Input type="text" value={patient.name} readOnly />
              </div>
              <div>
                <Label>Terapeuta</Label>
                <Input type="text" value={therapist.name} readOnly />
              </div>
              <div>
                <Label>Fecha de la Sesión</Label>
                <Input type="text" value={format(session.date, "EEEE d 'de' MMMM, yyyy", { locale: es })} readOnly />
              </div>
              <div>
                <Label>Hora de la Sesión</Label>
                <Input type="text" value={session.time} readOnly />
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="billingDate">Fecha de Facturación</Label>
              <Input
                type="date"
                id="billingDate"
                value={billingDate}
                onChange={(e) => setBillingDate(e.target.value)}
              />
            </div>

            <div>
              <Label>Códigos CPT</Label>
              <ul className="border rounded-md">
                {cptCodesData.map((code) => (
                  <li key={code.code} className="flex items-center justify-between p-2">
                    <label htmlFor={`cpt-${code.code}`} className="cursor-pointer">
                      {code.code} - {code.description}
                    </label>
                    <input
                      type="checkbox"
                      id={`cpt-${code.code}`}
                      checked={!!cptCodes[code.code]}
                      onChange={(e) => handleCptCodeChange(code.code, e.target.checked)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label>Códigos ICD</Label>
              <ul className="border rounded-md">
                {icdCodesData.map((code) => (
                  <li key={code.code} className="flex items-center justify-between p-2">
                    <label htmlFor={`icd-${code.code}`} className="cursor-pointer">
                      {code.code} - {code.description}
                    </label>
                    <input
                      type="checkbox"
                      id={`icd-${code.code}`}
                      checked={!!icdCodes[code.code]}
                      onChange={(e) => handleIcdCodeChange(code.code, e.target.checked)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label htmlFor="amount">Monto</Label>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                placeholder="Información adicional"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit}>
                <Receipt className="h-4 w-4 mr-2" />
                Generar Factura
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SessionBilling;
