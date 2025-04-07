
import React from 'react'
import { Button } from '../ui/button'
import { format, isSameDay, addDays } from "date-fns";
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import { es } from 'date-fns/locale';


interface WeeklyWithHoursProps {
    weekDays: Date[]
    selectedDate: Date | null
    setSelectedDate: (date: Date) => void
    isMobile: boolean
    getFilteredSessions: () => any[]
    therapists: any[]
    viewAll: boolean
    selectedTherapist: string
    patients: any[]
}

export const WeeklyTimeView: React.FC<WeeklyWithHoursProps> = ({
    weekDays,
    selectedDate,
    setSelectedDate,
    isMobile,
    getFilteredSessions,
    therapists,
    viewAll,
    selectedTherapist,
    patients

}) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, i) => (
                    <div key={i} className="text-center">
                        <p className="text-xs text-muted-foreground uppercase">
                            {format(day, isMobile ? "EEE" : "EEEE", { locale: es })}
                        </p>
                        <Button
                            variant={isSameDay(day, selectedDate || new Date()) ? "default" : "ghost"}
                            className={cn(
                                "w-full rounded-full font-normal",
                                isSameDay(day, new Date()) && !isSameDay(day, selectedDate || new Date()) && "bg-escalando-100 text-escalando-900 hover:bg-escalando-200 hover:text-escalando-900"
                            )}
                            onClick={() => setSelectedDate(day)}
                        >
                            {format(day, "d")}
                        </Button>
                    </div>
                ))}
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                        Sesiones programadas
                        {selectedDate && (
                            <span className="ml-2 text-muted-foreground">
                                ({format(selectedDate, "d 'de' MMMM", { locale: es })})
                            </span>
                        )}
                    </h3>
                </div>

                <div className="bg-muted/30 rounded-md p-4">
                    <div className="text-sm font-medium mb-4">
                        {viewAll ? "Horario: Todos los terapeutas" : `Horario: ${therapists.find(t => t.id === selectedTherapist)?.name}`}
                    </div>
                    <div className="space-y-2">
                        {getFilteredSessions().length > 0 ? (
                            getFilteredSessions().map((session, i) => {
                                const patient = patients.find(p => p.id === session.patientId);
                                const therapist = therapists.find(t => t.id === session.therapistId);

                                return (
                                    <Card
                                        key={i}
                                        className="overflow-hidden border border-muted shadow-sm"
                                    >
                                        <div className="p-3 flex items-center gap-3">
                                            <div className="w-2 h-10 rounded-full bg-escalando-400" />
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                                    <div>
                                                        <p className="font-medium">{patient?.name}</p>
                                                        <div className="flex items-center text-sm text-muted-foreground flex-wrap">
                                                            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                                            <span>{format(session.date, "EEEE d 'de' MMMM", { locale: es })}</span>
                                                        </div>
                                                        {viewAll && (
                                                            <div className="text-sm text-muted-foreground mt-1">
                                                                <span className="font-medium">Terapeuta:</span> {therapist?.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center text-sm font-medium mt-1 sm:mt-0">
                                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                                        <span>{session.time} (45 min)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No hay sesiones programadas{selectedDate ? ` para ${format(selectedDate, "d 'de' MMMM", { locale: es })}` : ""}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
