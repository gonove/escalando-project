
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  ChevronRight,
  Edit,
  Clock,
  CalendarDays,
  Filter
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { professionals, patients, getSessionsByPatient } from "@/data/mockData";
import { useIsMobile, useIsTablet, useIsMobileOrTablet } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// For demonstration purposes
const currentProfessional = professionals[1];
const myPatients = patients.filter(
  (patient) => patient.professionalId === currentProfessional.id
);

console.log(myPatients)

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(myPatients);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMobileOrTablet = useIsMobileOrTablet();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredPatients(myPatients);
      return;
    }

    const filtered = myPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.diagnosis?.toLowerCase().includes(query) ||
        (patient.parentName && patient.parentName.toLowerCase().includes(query))
    );

    setFilteredPatients(filtered);
  };

  // Calculate patient age
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 1) {
      // For babies less than 1 year old, show age in months
      const ageInMonths = today.getMonth() - birthDate.getMonth() +
        (today.getFullYear() - birthDate.getFullYear()) * 12;
      return `${ageInMonths} meses`;
    }

    return `${age} años`;
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 sm:space-y-6"
      >
        <div className={cn(
          "flex flex-col space-y-4",
          !isMobile && "md:flex-row md:items-center md:justify-between md:space-y-0"
        )}>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">Pacientes</h1>
            <p className="text-muted-foreground text-sm">
              Gestiona la información de tus pacientes
            </p>
          </div>
          <Link to="/patients/new" className={isMobile ? "w-full" : ""}>
            <Button className={isMobile ? "w-full" : ""}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Paciente
            </Button>
          </Link>
        </div>

        <div className={cn(
          "flex flex-col space-y-3",
          !isMobile && "md:flex-row md:items-center md:space-y-0 md:space-x-4"
        )}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar pacientes..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn(
                "flex items-center",
                isMobile ? "w-full" : ""
              )}>
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isMobile ? "end" : "start"}>
              <DropdownMenuItem>Todos los pacientes</DropdownMenuItem>
              <DropdownMenuItem>Pacientes activos</DropdownMenuItem>
              <DropdownMenuItem>Ordenar por nombre</DropdownMenuItem>
              <DropdownMenuItem>Ordenar por fecha</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPatients.map((patient, index) => {
            const patientSessions = getSessionsByPatient(patient.id);
            const lastSession = patientSessions.length > 0
              ? patientSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
              : null;

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Card className="h-full transition-all duration-200 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <Link to={`/patients/${patient.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <CardDescription className="flex items-center flex-wrap">
                      {calculateAge(patient.dateOfBirth)}
                      {patient.diagnosis && (
                        <>
                          <span className="mx-2">•</span>
                          {patient.diagnosis}
                        </>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Responsable:
                        </div>
                        <div className="truncate">{patient.parentName || "No especificado"}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                          Contacto:
                        </div>
                        <div className="truncate">{patient.contactNumber || patient.phone}</div>
                      </div>
                      {lastSession && (
                        <div className="pt-2">
                          <div className="flex items-center text-sm font-medium text-muted-foreground mb-1">
                            <Clock className="mr-1 h-3 w-3" />
                            Última sesión:
                          </div>
                          <div className="flex items-center">
                            <CalendarDays className="mr-2 h-4 w-4 text-escalando-600" />
                            {new Date(lastSession.date).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-4">
                    <Link to={`/patients/${patient.id}`} className="w-full">
                      <Button variant="outline" className="w-full group">
                        <span className="flex-1 text-left">Ver Detalles</span>
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-lg text-muted-foreground">
              No se encontraron pacientes con tu búsqueda.
            </p>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Patients;
