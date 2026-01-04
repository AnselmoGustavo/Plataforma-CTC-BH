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

  
  const { data: volunteers = [], isLoading } = useQuery<VoluntarioRecord[]>({
    queryKey: ["voluntarios"],
    queryFn: listVoluntarios,
  });

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    especialidade: "",
    endereco: "",
    status: "ativo",
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
    mutationFn: ({ id, payload }: { id: number; payload: VoluntarioDto }) =>
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
    if (!formData.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Email inválido");
      return;
    }

    if (formData.telefone && !isValidPhoneNumber(formData.telefone.replace(/\D/g, ""))) {
      toast.error("Telefone deve ter 11 dígitos (XX) XXXXX-XXXX");
      return;
    }

    const payload: VoluntarioDto = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      especialidade: formData.especialidade,
      endereco: formData.endereco,
      status: formData.status,
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

  const handleDelete = (id: number) => {
  if (!confirm("Tem certeza que deseja excluir este voluntário?")) return;
    deleteMutation.mutate(id);
  };

  const handleEdit = (volunteer: VoluntarioRecord) => {
    setEditingVolunteer(volunteer);

    setFormData({
      nome: volunteer.nome,
      email: volunteer.email,
      telefone: volunteer.telefone || "",
      especialidade: volunteer.especialidade || "",
      endereco: volunteer.endereco || "",
      status: volunteer.status || "ativo",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      especialidade: "",
      endereco: "",
      status: "ativo",
    });
    setEditingVolunteer(null);
    setShowForm(false);
  };

  const generatePDFContent = (doc: jsPDF) => {
    let yPos = addPDFHeader(doc, "Relatório de Voluntários");
    yPos += 10;

    const tableData = volunteers.map((v) => [
      v.nome,
      v.email,
      v.telefone || "-",
      v.especialidade || "-",
      v.status === "ativo" ? "Ativo" : "Inativo",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Nome", "Email", "Telefone", "Especialidade", "Status"]],
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
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
                      <Label htmlFor="telefone">Telefone</Label>
                      <MaskedInput
                        id="telefone"
                        mask="phone"
                        value={formData.telefone}
                        onChange={(e) =>
                          setFormData({ ...formData, telefone: e.target.value })
                        }
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="especialidade">Especialidade</Label>
                      <Input
                        id="especialidade"
                        value={formData.especialidade}
                        onChange={(e) =>
                          setFormData({ ...formData, especialidade: e.target.value })
                        }
                        placeholder="Ex: Educação, Saúde, etc"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={formData.endereco}
                        onChange={(e) =>
                          setFormData({ ...formData, endereco: e.target.value })
                        }
                        placeholder="Rua, número, bairro"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        className="border rounded p-2 w-full"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        required
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </select>
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
                          {volunteer.nome}
                        </h3>

                        <div className="space-y-1 text-muted-foreground">
                          <p>📧 {volunteer.email}</p>
                          <p>📞 {volunteer.telefone || "Não informado"}</p>
                          {volunteer.especialidade && <p>💼 {volunteer.especialidade}</p>}
                          <p>📍 {volunteer.endereco || "Não informado"}</p>
                          <p>
                            📅 Cadastrado em{" "}
                            {volunteer.data_inscricao ? format(new Date(volunteer.data_inscricao), "dd/MM/yyyy", {
                              locale: ptBR,
                            }) : "Não informado"}
                          </p>
                          <p>{volunteer.status === "ativo" ? "🟢 Ativo" : "🔴 Inativo"}</p>
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
