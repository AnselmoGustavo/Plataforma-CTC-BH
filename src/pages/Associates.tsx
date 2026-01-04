import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MaskedInput } from "@/components/ui/masked-input";
import { formatPhoneNumber, isValidPhoneNumber, isValidEmail, formatCurrency, onlyNumbers } from "@/lib/inputMasks";
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
  listAssociados,
  createAssociado,
  updateAssociado,
  deleteAssociado,
  AssociadoDto,
} from "@/services/associadosData";
import { AssociadoRecord } from "@/services/associadosData";

const Associates = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingAssociate, setEditingAssociate] = useState<AssociadoRecord | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date_of_birth: "",
    membership_date: "",
    role: "",
    phoneNumber: "",
    monthly_fee: null, 
    active: true,
  });

  const resetForm = () => {
  setFormData({
    name: "",
    email: "",
    date_of_birth: "",
    membership_date: "",
    role: "",
    phoneNumber: "",
    monthly_fee: null,
    active: true,
  });
  setEditingAssociate(null);
  setShowForm(false);
};

  //mutations
  const { data: associates = [], isLoading } = useQuery<AssociadoRecord[]>({
    queryKey: ["associados"],
    queryFn: listAssociados,
  });

  const createMutation = useMutation({
  mutationFn: (payload: AssociadoDto) => createAssociado(payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["associados"] });
    toast.success("Associado criado com sucesso!");
    resetForm();
    },
  });

  const updateMutation = useMutation({
  mutationFn: ({ id, payload }: { id: string; payload: AssociadoDto }) =>
    updateAssociado(id, payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["associados"] });
    toast.success("Associado atualizado com sucesso!");
    resetForm();
    },
  });

  const deleteMutation = useMutation({
  mutationFn: deleteAssociado,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["associados"] });
    toast.success("Associado excluído com sucesso!");
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

  if (!formData.monthly_fee || formData.monthly_fee <= 0) {
    toast.error("Taxa mensal deve ser maior que 0");
    return;
  }

  const payload: AssociadoDto = {
    name: formData.name,
    email: formData.email,
    date_of_birth: formData.date_of_birth,
    membership_date: formData.membership_date,
    role: formData.role,
    phoneNumber: formData.phoneNumber,
    monthly_fee: formData.monthly_fee!,
    active: formData.active,
  };

  if (editingAssociate) {
    updateMutation.mutate({
      id: editingAssociate.id,
      payload,
    });
  } else {
    createMutation.mutate(payload);
  }
};

const handleDelete = (id: string) => {
  if (!confirm("Tem certeza que deseja excluir este associado?")) return;
  deleteMutation.mutate(id);
};

const handleEdit = (associate: AssociadoRecord) => {
  setEditingAssociate(associate);
  
  // Converter datas ISO para formato YYYY-MM-DD para o input type="date"
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  setFormData({
    name: associate.name,
    email: associate.email,
    date_of_birth: formatDateForInput(associate.date_of_birth),
    membership_date: formatDateForInput(associate.membership_date),
    role: associate.role,
    phoneNumber: associate.phoneNumber,
    monthly_fee: associate.monthly_fee,
    active: associate.active,
  });
  setShowForm(true);
};

const generatePDFContent = (doc: jsPDF) => {
  let yPos = addPDFHeader(doc, "Relatório de Associados");
  yPos += 10;

  const tableData = associates.map((a) => [
    a.name,
    a.email,
    a.phoneNumber,
    new Date(a.date_of_birth).toLocaleDateString("pt-BR"),
    a.role,
    a.active ? "Ativo" : "Inativo",
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Nome", "Email", "Telefone", "Nascimento", "Função", "Status"]],
    body: tableData,
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  const finalY = (doc as any).lastAutoTable.finalY || yPos;
  doc.setFontSize(10);
  doc.text(`Total de associados: ${associates.length}`, 15, finalY + 10);

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
    doc.save(`relatorio_associados_${new Date().toISOString().split("T")[0]}.pdf`);
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

          {/* Título e Botão */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Associados</h1>
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
                {showForm ? "Cancelar" : "Adicionar Associado"}
              </Button>
            </div>
          </div>

          {/* Formulário */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {editingAssociate ? "Editar Associado" : "Novo Associado"}
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

                    <div className="space-y-2">
                      <Label htmlFor="membership_date">Data de Associação</Label>
                      <Input
                        id="membership_date"
                        type="date"
                        value={formData.membership_date}
                        onChange={(e) =>
                          setFormData({ ...formData, membership_date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthly_fee">Mensalidade (R$)</Label>
                      <Input
                        id="monthly_fee"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.monthly_fee || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, monthly_fee: e.target.value ? Number(e.target.value) : null })
                        }
                        placeholder="0,00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Função na Associação</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                      />
                    </div>

                    {editingAssociate && (
                                          <div className="space-y-2">
                      <Label htmlFor="active">Status</Label>
                      <select
                        id="active"
                        className="border rounded p-2 w-full"
                        value={formData.active ? "true" : "false"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            active: e.target.value === "true", 
                          })
                        }
                        required
                      >
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>
                      </select>
                    </div>
                  
                  )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingAssociate ? "Atualizar" : "Criar"} Associado
                    </Button>

                    {editingAssociate && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de Associados */}
          {isLoading ? (
              <p>Carregando associados...</p>
            ) : (
              <div className="grid gap-4">
                {associates.map((associate) => (
                  <Card key={associate.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">
                            {associate.name}
                          </h3>

                          <div className="space-y-1 text-muted-foreground">
                            <p>📧 {associate.email}</p>

                            <p>
                              🎂{" "}
                              {format(new Date(associate.date_of_birth), "dd/MM/yyyy", {
                                locale: ptBR,
                              })}{" "}
                              ({calculateAge(associate.date_of_birth)} anos)
                            </p>

                            <p>
                              📅 Associado desde{" "}
                              {format(new Date(associate.membership_date), "dd/MM/yyyy", {
                                locale: ptBR,
                              })}
                            </p>

                            <p>💼 {associate.role}</p>
                            <p>📞 {associate.phoneNumber}</p>
                            <p>💸 {Number(associate.monthly_fee).toFixed(2)}</p>
                            <p>{associate.active ? "🟢 Ativo" : "🔴 Inativo"}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(associate)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(associate.id)}
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

export default Associates;
