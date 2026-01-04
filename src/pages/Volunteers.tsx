import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MaskedInput } from "@/components/ui/masked-input";
import { formatPhoneNumber, isValidPhoneNumber, isValidEmail } from "@/lib/inputMasks";
import { Pencil, Trash2, Plus, X, FileDown, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { addPDFHeader, addPDFFooter } from "@/lib/pdfUtils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { calculateAge } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listVoluntarios,
  createVoluntario,
  updateVoluntario,
  deleteVoluntario,
  VoluntarioRecord,
  VoluntarioDto,
} from "@/services/voluntariosData";

const Volunteers = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<VoluntarioRecord | null>(null);

  
  const { data: volunteers = [], isLoading } = useQuery({
    queryKey: ["voluntarios"],
    queryFn: listVoluntarios,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date_of_birth: "",
    phoneNumber: ""
  });

  //mutations
  const createMutation = useMutation({
    mutationFn: (payload: VoluntarioDto) => createVoluntario(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voluntarios"] });
      toast.success("Voluntário criado com sucesso!");
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VoluntarioDto }) =>
      updateVoluntario(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voluntarios"] });
      toast.success("Voluntário atualizado com sucesso!");
      resetForm();
    },
  });

  const deleteMutation = useMutation({
  mutationFn: deleteVoluntario,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["voluntarios"] });
    toast.success("Voluntário excluído com sucesso!");
    },
  });

  //handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Email inválido");
      return;
    }

    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber.replace(/\D/g, ""))) {
      toast.error("Telefone deve ter 11 dígitos (XX) XXXXX-XXXX");
      return;
    }

    const payload: VoluntarioDto = {
      name: formData.name,
      email: formData.email,
      date_of_birth: formData.date_of_birth,
      phoneNumber: formData.phoneNumber,
    };

    if (editingVolunteer) {
      updateMutation.mutate({
        id: editingVolunteer.id,
        payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
  if (!confirm("Tem certeza que deseja excluir este voluntário?")) return;
    deleteMutation.mutate(id);
  };

  const handleEdit = (volunteer: VoluntarioRecord) => {
    setEditingVolunteer(volunteer);
    
    // Converter datas ISO para formato YYYY-MM-DD para o input type="date"
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setFormData({
      name: volunteer.name,
      email: volunteer.email,
      date_of_birth: formatDateForInput(volunteer.date_of_birth),
      phoneNumber: volunteer.phoneNumber
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      date_of_birth: "",
      phoneNumber: "",
    });
    setEditingVolunteer(null);
    setShowForm(false);
  };

  const generatePDFContent = (doc: jsPDF) => {
    let yPos = addPDFHeader(doc, "Relatório de Voluntários");
    yPos += 10;

    const tableData = volunteers.map((v) => [
      v.name,
      v.email,
      v.phoneNumber,
      new Date(v.date_of_birth).toLocaleDateString("pt-BR"),
      calculateAge(v.date_of_birth) + " anos",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Nome", "Email", "Telefone", "Nascimento", "Idade"]],
      body: tableData,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || yPos;
    doc.setFontSize(10);
    doc.text(`Total de voluntários: ${volunteers.length}`, 15, finalY + 10);

    addPDFFooter(doc);
    return doc.output('blob');
  };

  const previewPDF = () => {
    try {
      const doc = new jsPDF();
      const pdfBlob = generatePDFContent(doc);
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, '_blank');
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
      doc.save(`relatorio_voluntarios_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar PDF");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Título e botão */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Voluntários</h1>
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
                {showForm ? "Cancelar" : "Adicionar Voluntário"}
              </Button>
            </div>
          </div>

          {/* Formulário */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {editingVolunteer ? "Editar Voluntário" : "Novo Voluntário"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="exemplo@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Data de Nascimento</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) =>
                          setFormData({ ...formData, date_of_birth: e.target.value })
                        }
                        required
                      />
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Telefone</Label>
                      <MaskedInput
                        id="phoneNumber"
                        mask="phone"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        placeholder="(11) 99999-9999"
                        />
                  </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingVolunteer ? "Atualizar" : "Criar"} Voluntário
                    </Button>

                    {editingVolunteer && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de voluntários */}
          {isLoading ? (
            <p>Carregando voluntários...</p>
          ) : (
            <div className="grid gap-4">
              {volunteers.map((volunteer) => (
                <Card key={volunteer.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {volunteer.name}
                        </h3>

                        <div className="space-y-1 text-muted-foreground">
                          <p>📧 {volunteer.email}</p>
                          <p>📞 {volunteer.phoneNumber}</p>
                          <p>
                            🎂{" "}
                            {format(new Date(volunteer.date_of_birth), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}{" "}
                            ({calculateAge(volunteer.date_of_birth)} anos)
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(volunteer)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(volunteer.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Volunteers;
