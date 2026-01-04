import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X, FileDown, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { addPDFHeader, addPDFFooter } from "@/lib/pdfUtils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  EventDto,
  EventRecord,
} from "@/services/eventsData";

const Events = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "past">("all");

  const [formData, setFormData] = useState({
    title: "",
    event_date: "",
    event_time: "",
    location: "Rua dos Guaranis, 597 - Centro, Belo Horizonte - MG, 30120-040",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      event_date: "",
      event_time: "",
      location: "Rua dos Guaranis, 597 - Centro, Belo Horizonte - MG, 30120-040",
      description: "",
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  // Queries e Mutations
  const { data: events = [], isLoading } = useQuery<EventRecord[]>({
    queryKey: ["events"],
    queryFn: listEvents,
  });

  const createMutation = useMutation({
    mutationFn: (payload: EventDto) => createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento criado com sucesso!");
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao criar evento");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: EventDto }) =>
      updateEvent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento atualizado com sucesso!");
      resetForm();
    },
    onError: () => {
      toast.error("Erro ao atualizar evento");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento excluído com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao excluir evento");
    },
  });

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    const payload: EventDto = {
      title: formData.title,
      event_date: formData.event_date,
      event_time: formData.event_time,
      location: formData.location,
      description: formData.description,
    };

    if (editingEvent) {
      updateMutation.mutate({
        id: editingEvent.id,
        payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    deleteMutation.mutate(id);
  };

  const handleEdit = (event: EventRecord) => {
    setEditingEvent(event);

    setFormData({
      title: event.title,
      event_date: event.event_date,
      event_time: event.event_time,
      location: event.location || "Rua dos Guaranis, 597 - Centro, Belo Horizonte - MG, 30120-040",
      description: event.description || "",
    });
    setShowForm(true);
  };

  // Filtros
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!event.event_date) return false;
      
      const eventDate = new Date(`${event.event_date}T${event.event_time}`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Filtro de ano
      if (filterYear && eventDate.getFullYear().toString() !== filterYear) {
        return false;
      }

      // Filtro de mês
      if (
        filterMonth &&
        eventDate.getMonth() + 1 !== parseInt(filterMonth)
      ) {
        return false;
      }

      // Filtro de status (passado/futuro)
      if (filterStatus === "upcoming" && eventDate < today) {
        return false;
      }
      if (filterStatus === "past" && eventDate >= today) {
        return false;
      }

      return true;
    });
  }, [events, filterYear, filterMonth, filterStatus]);

  // PDF
  const generatePDFContent = (doc: jsPDF) => {
    let yPos = addPDFHeader(doc, "Relatório de Eventos");
    yPos += 10;

    const tableData = filteredEvents.map((e) => [
      e.title,
      e.event_date ? format(new Date(`${e.event_date}T${e.event_time}`), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-",
      e.location || "-",
      (e.description || "").substring(0, 30) + ((e.description || "").length > 30 ? "..." : ""),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Evento", "Início", "Local", "Descrição"]],
      body: tableData,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || yPos;
    doc.setFontSize(10);
    doc.text(`Total de eventos: ${filteredEvents.length}`, 15, finalY + 10);

    addPDFFooter(doc);
    return doc.output("blob");
  };

  const previewPDF = () => {
    try {
      const doc = new jsPDF();
      const pdfBlob = generatePDFContent(doc);
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, "_blank");
      toast.success("Prévia aberta em nova aba");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar prévia");
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      generatePDFContent(doc);
      doc.save(`relatorio_eventos_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar PDF");
    }
  };

  const currentYear = new Date().getFullYear();
  
  // Extrair anos únicos dos eventos e ordenar em ordem decrescente
  const years = useMemo(() => {
    const yearsSet = new Set(events.map(e => new Date(`${e.event_date}T${e.event_time}`).getFullYear()));
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [events]);
  const months = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Título e Botões */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Eventos</h1>
            <div className="flex gap-2">
              <Button onClick={previewPDF} variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Visualizar Prévia
              </Button>
              <Button onClick={generatePDF} variant="outline" className="gap-2">
                <FileDown className="w-4 h-4" />
                Gerar Relatório PDF
              </Button>
              <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showForm ? "Cancelar" : "Adicionar Evento"}
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filterYear">Ano</Label>
                <select
                  id="filterYear"
                  className="border rounded p-2 w-full"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <option value="">Todos os anos</option>
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filterMonth">Mês</Label>
                <select
                  id="filterMonth"
                  className="border rounded p-2 w-full"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  <option value="">Todos os meses</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filterStatus">Status</Label>
                <select
                  id="filterStatus"
                  className="border rounded p-2 w-full"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as "all" | "upcoming" | "past")}
                >
                  <option value="all">Todos</option>
                  <option value="upcoming">Próximos</option>
                  <option value="past">Passados</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setFilterYear("");
                    setFilterMonth("");
                    setFilterStatus("all");
                  }}
                >
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Formulário */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {editingEvent ? "Editar Evento" : "Novo Evento"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Nome do Evento</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Endereço</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event_date">Data</Label>
                      <Input
                        id="event_date"
                        type="date"
                        value={formData.event_date}
                        onChange={(e) =>
                          setFormData({ ...formData, event_date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event_time">Hora</Label>
                      <Input
                        id="event_time"
                        type="time"
                        value={formData.event_time}
                        onChange={(e) =>
                          setFormData({ ...formData, event_time: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingEvent ? "Atualizar" : "Criar"} Evento
                    </Button>

                    {editingEvent && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de Eventos */}
          {isLoading ? (
            <p>Carregando eventos...</p>
          ) : (
            <div className="grid gap-4">
              {filteredEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum evento encontrado
                </p>
              ) : (
                filteredEvents.map((event) => {
                  const eventStartDate = new Date(`${event.event_date}T${event.event_time}`);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPast = eventStartDate < today;

                  return (
                    <Card key={event.id} className={isPast ? "opacity-70" : ""}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold">
                                {event.title}
                              </h3>
                              {isPast && (
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                  Passado
                                </span>
                              )}
                              {!isPast && (
                                <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded">
                                  Próximo
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 text-muted-foreground">
                              <p>
                                📅 Início:{" "}
                                {event.event_date
                                  ? format(
                                      new Date(`${event.event_date}T${event.event_time}`),
                                      "dd/MM/yyyy 'às' HH:mm",
                                      { locale: ptBR }
                                    )
                                  : "Data não informada"}
                              </p>
                              <p>📍 {event.location || "Local não informado"}</p>
                              {event.description && (
                                <p className="mt-2">
                                  <strong>📋 Descrição: </strong>
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(event)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(event.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Events;
