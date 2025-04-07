
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Session } from "@/types/models";

interface SessionsDataTableProps {
  sessions: any[];
  therapists: any[];
  date: Date;
  time: string;
  onViewDetails?: (session: any) => void;
}

const SessionsDataTable: React.FC<SessionsDataTableProps> = ({
  sessions,
  therapists,
  date,
  time,
  onViewDetails,
}) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No hay sesiones programadas para este horario.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-medium">Sesiones Agendadas</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(date, "EEEE d 'de' MMMM", { locale: es })}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>{time} (45 min)</span>
          </p>
        </div>
        <div className="text-sm font-medium">
          {sessions.length}/3 sesiones
        </div>
      </div>

      <Table>
        {sessions.length === 0 && (
          <TableCaption>No hay sesiones programadas para este horario.</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Terapeuta</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session, index) => {
            const therapist = therapists.find(t => t.id === session.therapistId);
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{session.patientName || session.patient?.name}</TableCell>
                <TableCell>{therapist?.name}</TableCell>
                <TableCell>
                  <span className={
                    session.type === "Evaluación" || session.type === "evaluation"
                      ? "text-orange-600 dark:text-orange-400" 
                      : "text-blue-600 dark:text-blue-400"
                  }>
                    {session.type === "regular" ? "Sesión Regular" : session.type || "Sesión Regular"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewDetails?.(session)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Detalles
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SessionsDataTable;
