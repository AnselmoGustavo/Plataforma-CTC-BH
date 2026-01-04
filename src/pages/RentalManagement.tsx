import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MaskedInput } from "@/components/ui/masked-input";
import { isValidLicensePlate, onlyNumbers } from "@/lib/inputMasks";
import { Pencil, Trash2, Plus, X, CheckCircle, FileDown, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { addPDFHeader, addPDFFooter } from "@/lib/pdfUtils";
import {
  listVeiculosLocacao,
  createVeiculoLocacao,
  updateVeiculoLocacao,
  deleteVeiculoLocacao,
  VeiculoLocacao,
} from "@/services/rentalManagement";

interface PartnerSpot {
  id: number;
  partner_name: string;
  space: string;
  entry_date: string;
  exit_date: string;
  rental_type: "vaga" | "sala"; // Novo campo
  // Campos para Vaga
  spot_number?: string;
  vehicle_type?: string;
  model?: string;
  plate?: string;
  // Campos para Sala
  room_name?: string;
  responsible?: string;
  purpose?: string;
  description?: string;
}

export const RentalMenagement = () => {
  const [partners, setPartners] = useState<PartnerSpot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerSpot | null>(null);

  const [filterStatus, setFilterStatus] = useState<"active" | "inactive" | "all">("active");
  const [search, setSearch] = useState("");
  const [filterRentalType, setFilterRentalType] = useState<"all" | "vaga" | "sala">("all");

  const [formData, setFormData] = useState({
    rental_type: "vaga" as "vaga" | "sala",
    partner_name: "",
    space: "CTCBH - Rua dos Guaranis",
    entry_date: "",
    exit_date: "",
    // Campos de Vaga
    spot_number: "",
    vehicle_type: "",
    model: "",
    plate: "",
    // Campos de Sala
    room_name: "",
    responsible: "",
    purpose: "",
    description: "",
  });

  // Carregar dados da API
  const loadData = async () => {
    try {
      const data = await listVeiculosLocacao({
        status: filterStatus === "all" ? undefined : filterStatus,
        search: search || undefined,
        vehicleType: undefined,
      });
      const mapped: PartnerSpot[] = data.map((v: VeiculoLocacao) => {
        // Detectar se é sala ou vaga baseado no formato do numeroVaga
        const isSala = v.numeroVaga?.startsWith("SALA:");
        
        if (isSala) {
          return {
            id: v.id,
            rental_type: "sala",
            partner_name: v.nomeParceiro,
            space: v.espaco,
            entry_date: v.dataEntrada.substring(0, 10),
            exit_date: v.dataSaida ? v.dataSaida.substring(0, 10) : "",
            room_name: v.numeroVaga.replace("SALA:", ""),
            responsible: v.tipoVeiculo?.replace("RESP:", "") || "",
            purpose: v.modelo || "",
            description: v.placa !== "Sala" ? v.placa : "",
          };
        } else {
          return {
            id: v.id,
            rental_type: "vaga",
            partner_name: v.nomeParceiro,
            space: v.espaco,
            entry_date: v.dataEntrada.substring(0, 10),
            exit_date: v.dataSaida ? v.dataSaida.substring(0, 10) : "",
            spot_number: v.numeroVaga,
            vehicle_type: v.tipoVeiculo,
            model: v.modelo,
            plate: v.placa,
          };
        }
      });
      setPartners(mapped);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar veículos");
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus, search]);

  // Função que detecta se a vaga está ativa
  const isActive = (item: PartnerSpot) => {
    return !item.exit_date || new Date(item.exit_date) > new Date();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações comuns
    if (!formData.partner_name.trim()) {
      toast.error("Nome do parceiro é obrigatório");
      return;
    }

    // Validações específicas para VAGA
    if (formData.rental_type === "vaga") {
      if (!formData.spot_number.trim()) {
        toast.error("Número da vaga é obrigatório");
        return;
      }

      if (!formData.vehicle_type.trim()) {
        toast.error("Tipo de veículo é obrigatório");
        return;
      }

      if (!formData.model.trim()) {
        toast.error("Modelo do veículo é obrigatório");
        return;
      }

      if (!isValidLicensePlate(formData.plate)) {
        toast.error("Placa inválida. Use o formato correto (ex: ABC-1234 ou ABC1D34)");
        return;
      }
    }

    // Validações específicas para SALA
    if (formData.rental_type === "sala") {
      if (!formData.room_name.trim()) {
        toast.error("Nome da sala é obrigatório");
        return;
      }

      if (!formData.responsible.trim()) {
        toast.error("Responsável é obrigatório");
        return;
      }

      if (!formData.purpose.trim()) {
        toast.error("Finalidade é obrigatória");
        return;
      }
    }

    try {
      let payload;
      
      if (formData.rental_type === "vaga") {
        payload = {
          nomeParceiro: formData.partner_name,
          espaco: formData.space,
          dataEntrada: formData.entry_date,
          dataSaida: formData.exit_date || null,
          numeroVaga: formData.spot_number,
          tipoVeiculo: formData.vehicle_type,
          modelo: formData.model,
          placa: formData.plate,
        };
      } else {
        // Para salas, usamos campos de forma diferente
        payload = {
          nomeParceiro: formData.partner_name,
          espaco: formData.space,
          dataEntrada: formData.entry_date,
          dataSaida: formData.exit_date || null,
          numeroVaga: `SALA:${formData.room_name}`, // Marca como sala
          tipoVeiculo: `RESP:${formData.responsible}`, // Armazena responsável
          modelo: formData.purpose, // Armazena finalidade
          placa: formData.description || "Sala", // Armazena descrição
        };
      }

      if (editingPartner) {
        await updateVeiculoLocacao(editingPartner.id, payload);
        toast.success("Registro atualizado com sucesso!");
      } else {
        await createVeiculoLocacao(payload);
        toast.success("Registro criado com sucesso!");
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar registro");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;
    try {
      await deleteVeiculoLocacao(id);
      toast.success("Registro excluído!");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir registro");
    }
  };

  const handleEdit = (item: PartnerSpot) => {
    setEditingPartner(item);
    setFormData({
      rental_type: item.rental_type || "vaga",
      partner_name: item.partner_name,
      space: item.space,
      entry_date: item.entry_date,
      exit_date: item.exit_date,
      spot_number: item.spot_number || "",
      vehicle_type: item.vehicle_type || "",
      model: item.model || "",
      plate: item.plate || "",
      room_name: item.room_name || "",
      responsible: item.responsible || "",
      purpose: item.purpose || "",
      description: item.description || "",
    });
    setShowForm(true);
  };

  const handleFinalize = async (id: number) => {
    const item = partners.find((p) => p.id === id);
    if (!item) return;
    
    try {
      let payload;
      
      if (item.rental_type === "vaga") {
        payload = {
          nomeParceiro: item.partner_name,
          espaco: item.space,
          dataEntrada: item.entry_date,
          dataSaida: new Date().toISOString(),
          numeroVaga: item.spot_number || "",
          tipoVeiculo: item.vehicle_type || "",
          modelo: item.model || "",
          placa: item.plate || "",
        };
      } else {
        payload = {
          nomeParceiro: item.partner_name,
          espaco: item.space,
          dataEntrada: item.entry_date,
          dataSaida: new Date().toISOString(),
          numeroVaga: `SALA:${item.room_name}`,
          tipoVeiculo: `RESP:${item.responsible}`,
          modelo: item.purpose || "",
          placa: item.description || "Sala",
        };
      }
      
      await updateVeiculoLocacao(id, payload);
      toast.success(item.rental_type === "vaga" ? "Vaga finalizada!" : "Sala finalizada!");
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao finalizar");
    }
  };

  const resetForm = () => {
    setFormData({
      rental_type: "vaga",
      partner_name: "",
      space: "CTCBH - Rua dos Guaranis",
      entry_date: "",
      exit_date: "",
      spot_number: "",
      vehicle_type: "",
      model: "",
      plate: "",
      room_name: "",
      responsible: "",
      purpose: "",
      description: "",
    });
    setEditingPartner(null);
    setShowForm(false);
  };

  const generatePDFContent = (doc: jsPDF) => {
    let yPos = addPDFHeader(doc, "Relatório de Gestão de Aluguéis");
    yPos += 10;

    // Preparar dados da tabela
    const tableData = filteredPartners.map((partner) => {
      if (partner.rental_type === "vaga") {
        return [
          partner.partner_name,
          "Vaga " + partner.spot_number,
          partner.vehicle_type || "—",
          partner.model || "—",
          partner.plate || "—",
          new Date(partner.entry_date).toLocaleDateString("pt-BR"),
          partner.exit_date ? new Date(partner.exit_date).toLocaleDateString("pt-BR") : "Ativa",
          isActive(partner) ? "Ativa" : "Finalizada",
        ];
      } else {
        return [
          partner.partner_name,
          partner.room_name || "—",
          partner.responsible || "—",
          partner.purpose || "—",
          "—",
          new Date(partner.entry_date).toLocaleDateString("pt-BR"),
          partner.exit_date ? new Date(partner.exit_date).toLocaleDateString("pt-BR") : "Ativa",
          isActive(partner) ? "Ativa" : "Finalizada",
        ];
      }
    });

    // Gerar tabela
    autoTable(doc, {
      head: [["Parceiro", "Vaga/Sala", "Tipo/Resp.", "Modelo/Finalidade", "Placa", "Entrada", "Saída", "Status"]],
      body: tableData,
      startY: yPos,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Rodapé com contagem
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total de registros: ${filteredPartners.length}`, 15, finalY + 10);

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
      doc.save(`relatorio_alugueis_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar PDF");
    }
  };

  // Filtragem com base no status, pesquisa e tipo de locação
  const filteredPartners = partners
    .filter((p) => {
      if (filterStatus === "active") return isActive(p);
      if (filterStatus === "inactive") return !isActive(p);
      return true;
    })
    .filter((p) => {
      const searchText = `${p.partner_name} ${p.space} ${p.entry_date} ${p.exit_date} 
        ${p.plate || ""} ${p.model || ""} ${p.spot_number || ""} ${p.vehicle_type || ""}
        ${p.room_name || ""} ${p.responsible || ""} ${p.purpose || ""} ${p.description || ""}`
        .toLowerCase();
      return searchText.includes(search.toLowerCase());
    })
    .filter((p) => {
      if (filterRentalType === "all") return true;
      return p.rental_type === filterRentalType;
    })
    .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime());

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Controle de Aluguéis - Parceiros</h1>
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
                {showForm ? "Cancelar" : "Novo Registro"}
              </Button>
            </div>
          </div>

          {/* 🔍 FILTROS */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Input
              placeholder="Pesquisar nome, placa, sala, responsável..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72"
            />

            <select
              className="border rounded p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="active">Ativas</option>
              <option value="inactive">Finalizadas</option>
              <option value="all">Todas</option>
            </select>

            <select
              className="border rounded p-2"
              value={filterRentalType}
              onChange={(e) => setFilterRentalType(e.target.value as any)}
            >
              <option value="all">Todas (Vagas e Salas)</option>
              <option value="vaga">Apenas Vagas</option>
              <option value="sala">Apenas Salas</option>
            </select>
          </div>

          {/* FORMULÁRIO */}
          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingPartner ? "Editar Registro" : "Novo Registro"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* SELETOR DE TIPO */}
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Tipo de Locação</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rental_type"
                          value="vaga"
                          checked={formData.rental_type === "vaga"}
                          onChange={(e) =>
                            setFormData({ ...formData, rental_type: e.target.value as "vaga" | "sala" })
                          }
                          className="w-4 h-4"
                        />
                        <span className="font-medium">Vaga de Estacionamento</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rental_type"
                          value="sala"
                          checked={formData.rental_type === "sala"}
                          onChange={(e) =>
                            setFormData({ ...formData, rental_type: e.target.value as "vaga" | "sala" })
                          }
                          className="w-4 h-4"
                        />
                        <span className="font-medium">Sala/Espaço</span>
                      </label>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold">DADOS DO PARCEIRO</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Parceiro</Label>
                      <Input
                        value={formData.partner_name}
                        onChange={(e) =>
                          setFormData({ ...formData, partner_name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Espaço</Label>
                      <Input
                        value={formData.space}
                        onChange={(e) =>
                          setFormData({ ...formData, space: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Data de Entrada</Label>
                      <Input
                        type="datetime-local"
                        value={formData.entry_date}
                        onChange={(e) =>
                          setFormData({ ...formData, entry_date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Data de Saída</Label>
                      <Input
                        type="datetime-local"
                        value={formData.exit_date}
                        onChange={(e) =>
                          setFormData({ ...formData, exit_date: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* CAMPOS DE VAGA */}
                  {formData.rental_type === "vaga" && (
                    <>
                      <h2 className="text-xl font-semibold">DADOS DA VAGA</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Número da Vaga</Label>
                          <MaskedInput
                            mask="numeric"
                            value={formData.spot_number}
                            onChange={(e) =>
                              setFormData({ ...formData, spot_number: e.target.value })
                            }
                            placeholder="123"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Tipo de Veículo</Label>
                          <select
                            className="border rounded p-2 w-full"
                            value={formData.vehicle_type}
                            onChange={(e) =>
                              setFormData({ ...formData, vehicle_type: e.target.value })
                            }
                            required
                          >
                            <option value="">Selecione</option>
                            <option value="carro">Carro</option>
                            <option value="moto">Moto</option>
                            <option value="caminhonete">Caminhonete</option>
                            <option value="caminhão">Caminhão</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Modelo</Label>
                          <Input
                            value={formData.model}
                            onChange={(e) =>
                              setFormData({ ...formData, model: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Placa</Label>
                          <MaskedInput
                            mask="plate"
                            value={formData.plate}
                            onChange={(e) =>
                              setFormData({ ...formData, plate: e.target.value })
                            }
                            placeholder="ABC-1234"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* CAMPOS DE SALA */}
                  {formData.rental_type === "sala" && (
                    <>
                      <h2 className="text-xl font-semibold">DADOS DA SALA</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nome da Sala</Label>
                          <Input
                            value={formData.room_name}
                            onChange={(e) =>
                              setFormData({ ...formData, room_name: e.target.value })
                            }
                            placeholder="Sala de Reuniões 1"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Responsável</Label>
                          <Input
                            value={formData.responsible}
                            onChange={(e) =>
                              setFormData({ ...formData, responsible: e.target.value })
                            }
                            placeholder="Nome do responsável"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Finalidade</Label>
                          <Input
                            value={formData.purpose}
                            onChange={(e) =>
                              setFormData({ ...formData, purpose: e.target.value })
                            }
                            placeholder="Ex: Escritório, Reuniões, Armazenamento"
                            required
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Descrição da Finalidade</Label>
                          <textarea
                            className="w-full border rounded p-2 min-h-[100px]"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Descreva em detalhes como a sala será utilizada..."
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button type="submit">
                      {editingPartner ? "Atualizar" : "Salvar Registro"}
                    </Button>

                    {editingPartner && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* LISTA DE REGISTROS */}
          <div className="grid gap-4">
            {filteredPartners.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{item.partner_name}</h3>
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-1">
                        {item.rental_type === "vaga" ? "Vaga" : "Sala"}
                      </span>

                      <div className="text-muted-foreground space-y-1 mt-2">
                        <p>🏢 Espaço: {item.space}</p>
                        
                        {/* Dados específicos de VAGA */}
                        {item.rental_type === "vaga" && (
                          <>
                            <p>📍 Vaga Nº {item.spot_number}</p>
                            <p>🚘 {item.vehicle_type} — {item.model}</p>
                            <p>📌 Placa: {item.plate}</p>
                          </>
                        )}

                        {/* Dados específicos de SALA */}
                        {item.rental_type === "sala" && (
                          <>
                            <p>🚪 Sala: {item.room_name}</p>
                            <p>👤 Responsável: {item.responsible}</p>
                            <p>🎯 Finalidade: {item.purpose}</p>
                            {item.description && <p>📝 Descrição: {item.description}</p>}
                          </>
                        )}

                        <p>⏳ Entrada: {item.entry_date ? new Date(item.entry_date).toLocaleString("pt-BR") : "—"}</p>
                        <p>⏱ Saída: {item.exit_date ? new Date(item.exit_date).toLocaleString("pt-BR") : "— Ainda ativa"}</p>
                      </div>
                    </div>

                    <div className="flex flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>

                    {isActive(item) && (
                        <Button
                          variant="default"
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                          onClick={() => handleFinalize(item.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Finalizar {item.rental_type === "vaga" ? "Vaga" : "Sala"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RentalMenagement;
