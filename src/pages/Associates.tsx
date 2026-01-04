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
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    data_nascimento: "",
    funcao: "",
    mensalidade: "",
    status: "ativo",
  });

  const resetForm = () => {
  setFormData({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    data_nascimento: "",
    funcao: "",
    mensalidade: "",
    status: "ativo",
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
  mutationFn: (payload: AssociadoDto) => {
    console.log("🚀 Enviando para Supabase:", payload);
    return createAssociado(payload);
  },
  onSuccess: (data) => {
    console.log("✅ Sucesso! Dados retornados:", data);
    queryClient.invalidateQueries({ queryKey: ["associados"] });
    toast.success("Associado criado com sucesso!");
    resetForm();
  },
  onError: (error: any) => {
    console.error("❌ Erro ao criar:", error);
    toast.error(error?.message || "Erro ao criar associado");
  },
  });

  const updateMutation = useMutation({
  mutationFn: ({ id, payload }: { id: number; payload: AssociadoDto }) =>
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

  console.log("🔵 handleSubmit chamado");
  console.log("📝 formData:", formData);

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

  const payload: AssociadoDto = {
    nome: formData.nome,
    email: formData.email,
    telefone: formData.telefone,
    endereco: formData.endereco,
    data_nascimento: formData.data_nascimento,
    funcao: formData.funcao,
    mensalidade: formData.mensalidade ? Number(formData.mensalidade) : undefined,
    status: formData.status,
  };

  console.log("📦 payload:", payload);

  if (editingAssociate) {
    console.log("✏️ Editando associado:", editingAssociate.id);
    updateMutation.mutate({
      id: editingAssociate.id,
      payload,
    });
  } else {
    console.log("➕ Criando novo associado");
    createMutation.mutate(payload);
  }
};

const handleDelete = (id: number) => {
  if (!confirm("Tem certeza que deseja excluir este associado?")) return;
  deleteMutation.mutate(id);
};

const handleEdit = (associate: AssociadoRecord) => {
  setEditingAssociate(associate);

  setFormData({
    nome: associate.nome,
    data_nascimento: associate.data_nascimento || "",
    funcao: associate.funcao || "",
    mensalidade: associate.mensalidade?.toString() || "",
    email: associate.email,
    telefone: associate.telefone || "",
    endereco: associate.endereco || "",
    status: associate.status || "ativo",
  });
  setShowForm(true);
};

const generatePDFContent = (doc: jsPDF) => {
  let yPos = addPDFHeader(doc, "Relatório de Associados");
  yPos += 10;

  const tableData = associates.map((a) => [
    a.nome,
    a.email,
    a.telefone || "-",
    a.funcao || "-",
    a.mensalidade ? `R$ ${Number(a.mensalidade).toFixed(2)}` : "-",
    a.status === "ativo" ? "Ativo" : "Inativo",
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Nome", "Email", "Telefone", "Função", "Mensalidade", "Status"]],
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
                      <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                      <Input
                        id="data_nascimento"
                        type="date"
                        value={formData.data_nascimento}
                        onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
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
                      <Label htmlFor="funcao">Função na Associação</Label>
                      <Input
                        id="funcao"
                        value={formData.funcao}
                        onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                        placeholder="Ex: Membro, Coordenador"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensalidade">Mensalidade (R$)</Label>
                      <Input
                        id="mensalidade"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.mensalidade}
                        onChange={(e) => setFormData({ ...formData, mensalidade: e.target.value })}
                        placeholder="0,00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        className="border rounded p-2 w-full"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value, 
                          })
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
                            {associate.nome}
                          </h3>

                          <div className="space-y-1 text-muted-foreground">
                            <p>📧 {associate.email}</p>
                            <p>📞 {associate.telefone || "Não informado"}</p>
                            <p>📍 {associate.endereco || "Não informado"}</p>
                            {associate.data_nascimento && (
                              <p>
                                🎂 {format(new Date(associate.data_nascimento), "dd/MM/yyyy", { locale: ptBR })}
                                {" "}({calculateAge(associate.data_nascimento)} anos)
                              </p>
                            )}
                            <p>
                              📅 Cadastrado em{" "}
                              {associate.data_associacao ? format(new Date(associate.data_associacao), "dd/MM/yyyy", {
                                locale: ptBR,
                              }) : "Não informado"}
                            </p>
                            {associate.funcao && <p>💼 {associate.funcao}</p>}
                            {associate.mensalidade && <p>💸 R$ {Number(associate.mensalidade).toFixed(2)}</p>}
                            <p>{associate.status === "ativo" ? "🟢 Ativo" : "🔴 Inativo"}</p>
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
