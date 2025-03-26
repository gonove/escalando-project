
import React, { useState } from "react";
import { PlusCircle, Trash2, Edit, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DevelopmentalMilestone } from "@/types/models";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";

type DevelopmentalMilestonesProps = {
  patientId: string;
  initialMilestones?: DevelopmentalMilestone[];
};

const categoryColors = {
  motor: "bg-blue-100 text-blue-800",
  cognitive: "bg-purple-100 text-purple-800",
  language: "bg-green-100 text-green-800",
  social: "bg-amber-100 text-amber-800",
  other: "bg-gray-100 text-gray-800",
};

const categoryLabels = {
  motor: "Motor",
  cognitive: "Cognitivo",
  language: "Lenguaje",
  social: "Social",
  other: "Otro",
};

const DevelopmentalMilestones = ({
  patientId,
  initialMilestones = [],
}: DevelopmentalMilestonesProps) => {
  const [milestones, setMilestones] = useState<DevelopmentalMilestone[]>(
    initialMilestones
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [newMilestone, setNewMilestone] = useState<Partial<DevelopmentalMilestone>>({
    patientId,
    category: "motor",
    date: format(new Date(), "yyyy-MM-dd"),
    ageMonths: 0,
  });

  const handleAddMilestone = () => {
    if (!newMilestone.milestone?.trim()) return;

    const milestone: DevelopmentalMilestone = {
      id: `milestone-${Date.now()}`,
      patientId,
      ageMonths: newMilestone.ageMonths || 0,
      date: newMilestone.date || format(new Date(), "yyyy-MM-dd"),
      milestone: newMilestone.milestone || "",
      category: newMilestone.category as any || "motor",
      notes: newMilestone.notes,
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({
      patientId,
      category: "motor",
      date: format(new Date(), "yyyy-MM-dd"),
      ageMonths: 0,
    });
    setShowForm(false);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleUpdateMilestone = (updatedMilestone: DevelopmentalMilestone) => {
    setMilestones(
      milestones.map((m) =>
        m.id === updatedMilestone.id ? updatedMilestone : m
      )
    );
    setEditing(null);
  };

  // Group milestones by age in months
  const groupedMilestones = milestones.reduce<Record<number, DevelopmentalMilestone[]>>(
    (groups, milestone) => {
      const ageGroup = milestone.ageMonths;
      if (!groups[ageGroup]) {
        groups[ageGroup] = [];
      }
      groups[ageGroup].push(milestone);
      return groups;
    },
    {}
  );

  // Sort age groups
  const sortedAgeGroups = Object.keys(groupedMilestones)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Hitos del Desarrollo</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Agregar Hito
        </Button>
      </div>

      {showForm && (
        <Card className="border-dashed border-2 bg-muted/50">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Edad (meses)</label>
                <Input
                  type="number"
                  value={newMilestone.ageMonths}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      ageMonths: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Categoría</label>
                <Select
                  value={newMilestone.category}
                  onValueChange={(value) =>
                    setNewMilestone({
                      ...newMilestone,
                      category: value as any,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motor">Motor</SelectItem>
                    <SelectItem value="cognitive">Cognitivo</SelectItem>
                    <SelectItem value="language">Lenguaje</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium">Fecha</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newMilestone.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newMilestone.date ? (
                      format(new Date(newMilestone.date), "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newMilestone.date ? new Date(newMilestone.date) : undefined}
                    onSelect={(date) =>
                      setNewMilestone({
                        ...newMilestone,
                        date: date ? format(date, "yyyy-MM-dd") : undefined,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium">Descripción del Hito</label>
              <Textarea
                value={newMilestone.milestone}
                onChange={(e) =>
                  setNewMilestone({
                    ...newMilestone,
                    milestone: e.target.value,
                  })
                }
                placeholder="Ejemplo: Fija la mirada en rostros o luces"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium">Notas adicionales</label>
              <Textarea
                value={newMilestone.notes || ""}
                onChange={(e) =>
                  setNewMilestone({
                    ...newMilestone,
                    notes: e.target.value,
                  })
                }
                placeholder="Observaciones o detalles adicionales"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddMilestone}>Guardar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sortedAgeGroups.length > 0 ? (
        <div className="space-y-4">
          {sortedAgeGroups.map((ageMonths) => (
            <Card key={ageMonths} className="overflow-hidden">
              <CardHeader className="bg-muted/30 py-3">
                <CardTitle className="text-md font-medium">
                  {ageMonths === 0
                    ? "Recién nacido"
                    : ageMonths === 1
                    ? "1 mes"
                    : `${ageMonths} meses`}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {groupedMilestones[ageMonths].map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-3 border rounded-md bg-white relative group"
                    >
                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEditing(milestone.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDeleteMilestone(milestone.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {editing === milestone.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm font-medium block mb-1">
                                Categoría
                              </label>
                              <Select
                                value={milestone.category}
                                onValueChange={(value) =>
                                  handleUpdateMilestone({
                                    ...milestone,
                                    category: value as any,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="motor">Motor</SelectItem>
                                  <SelectItem value="cognitive">Cognitivo</SelectItem>
                                  <SelectItem value="language">Lenguaje</SelectItem>
                                  <SelectItem value="social">Social</SelectItem>
                                  <SelectItem value="other">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium block mb-1">
                                Fecha
                              </label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(new Date(milestone.date), "PPP", { locale: es })}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={new Date(milestone.date)}
                                    onSelect={(date) =>
                                      handleUpdateMilestone({
                                        ...milestone,
                                        date: date
                                          ? format(date, "yyyy-MM-dd")
                                          : milestone.date,
                                      })
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium block mb-1">
                              Descripción
                            </label>
                            <Textarea
                              value={milestone.milestone}
                              onChange={(e) =>
                                handleUpdateMilestone({
                                  ...milestone,
                                  milestone: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium block mb-1">
                              Notas
                            </label>
                            <Textarea
                              value={milestone.notes || ""}
                              onChange={(e) =>
                                handleUpdateMilestone({
                                  ...milestone,
                                  notes: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditing(null)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setEditing(null)}
                            >
                              Guardar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <Badge
                              className={cn(
                                "font-normal",
                                categoryColors[milestone.category]
                              )}
                            >
                              {categoryLabels[milestone.category]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(milestone.date), "dd/MM/yyyy")}
                            </span>
                          </div>
                          <p className="text-sm">{milestone.milestone}</p>
                          {milestone.notes && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <p>{milestone.notes}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            No hay hitos registrados aún. Agrega el primer hito del desarrollo.
          </p>
        </div>
      )}
    </div>
  );
};

export default DevelopmentalMilestones;
