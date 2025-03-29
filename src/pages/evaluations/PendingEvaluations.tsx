
import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import {
  ChevronLeft,
  Calendar,
  ClipboardCheck,
  User,
  Search,
  ClipboardList,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { professionals, patients, sessions } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Get the first professional for demo purposes
const currentProfessional = professionals[1];

const PendingEvaluations = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get pending evaluations (sessions that have already happened but need reports)
  const pendingEvaluations = sessions
    .filter((session) => {
      const sessionDateTime = new Date(session.date);
      sessionDateTime.setHours(parseInt(session.time.split(':')[0]), parseInt(session.time.split(':')[1]));
      
      return (
        session.professionalId === currentProfessional.id &&
        sessionDateTime < new Date() && // Session already happened
        (!session.reportStatus || session.reportStatus === 'pending') // Report is pending
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Oldest first

  // Filter sessions based on search query
  const filteredEvaluations = pendingEvaluations.filter((session) => {
    const patient = patients.find(p => p.id === session.patientId);
    const patientName = patient?.name.toLowerCase() || "";
    const sessionDate = format(new Date(session.date), "d 'de' MMMM, yyyy", { locale: es }).toLowerCase();
    const sessionType = session.type.toLowerCase();
    
    return (
      patientName.includes(searchQuery.toLowerCase()) ||
      sessionDate.includes(searchQuery.toLowerCase()) ||
      sessionType.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate("/")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">Evaluaciones Pendientes</h1>
              <p className="text-muted-foreground">
                Sesiones que requieren tu evaluación
              </p>
            </div>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar evaluaciones..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-therapy-600" />
              <span>Evaluaciones ({filteredEvaluations.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEvaluations.length > 0 ? (
              <div className="space-y-4">
                {filteredEvaluations.map((session) => {
                  const patient = patients.find(p => p.id === session.patientId);
                  const sessionDate = new Date(session.date);
                  const formattedDate = format(sessionDate, "d 'de' MMMM, yyyy", { locale: es });
                  
                  // Calculate how many days ago the session happened
                  const today = new Date();
                  const diffTime = Math.abs(today.getTime() - sessionDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div 
                      key={session.id}
                      className="bg-white border rounded-lg overflow-hidden shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "p-2 rounded-full",
                            diffDays > 7 
                              ? "bg-red-100 text-red-700" 
                              : diffDays > 3 
                                ? "bg-amber-100 text-amber-700" 
                                : "bg-therapy-100 text-therapy-700"
                          )}>
                            <Calendar className="h-5 w-5" />
                          </div>
                          
                          <div>
                            <div className="font-medium">{formattedDate}</div>
                            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <User className="h-3.5 w-3.5 mr-1" />
                                {patient?.name}
                              </span>
                              <span className="hidden xs:inline">•</span>
                              <span>{session.time} ({session.duration} min)</span>
                              <span className="hidden xs:inline">•</span>
                              <span>{session.type}</span>
                            </div>
                            <div className={cn(
                              "mt-2 text-xs px-2 py-1 rounded-full w-fit",
                              diffDays > 7 
                                ? "bg-red-100 text-red-700" 
                                : diffDays > 3 
                                  ? "bg-amber-100 text-amber-700" 
                                  : "bg-therapy-100 text-therapy-700"
                            )}>
                              {diffDays > 7 
                                ? `Pendiente por ${diffDays} días` 
                                : diffDays > 3 
                                  ? `Pendiente por ${diffDays} días` 
                                  : `Reciente (${diffDays} ${diffDays === 1 ? 'día' : 'días'})`}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Link to={`/sessions/summary/${patient?.id}/${session.id}`}>
                            <Button 
                              className={cn("gap-2", isMobile && "w-full")}
                            >
                              <ClipboardCheck className="h-4 w-4" />
                              Completar Evaluación
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <ClipboardCheck className="h-8 w-8 text-muted-foreground" />
                </div>
                {searchQuery ? (
                  <>
                    <h3 className="text-lg font-medium">No se encontraron resultados</h3>
                    <p className="text-muted-foreground mt-1">
                      No hay evaluaciones que coincidan con "{searchQuery}"
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery("")}
                    >
                      Mostrar todas las evaluaciones
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium">No hay evaluaciones pendientes</h3>
                    <p className="text-muted-foreground mt-1">
                      ¡Todas las sesiones han sido evaluadas!
                    </p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default PendingEvaluations;
