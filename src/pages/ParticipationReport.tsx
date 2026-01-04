import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MaskedInput } from "@/components/ui/masked-input";
import { isValidPhoneNumber, isValidEmail } from "@/lib/inputMasks";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Upload, X, FileText, Plus, Trash2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { addPDFHeader, addPDFFooter } from "@/lib/pdfUtils";

interface Participant {
  id: number;
  name: string;
  phone: string;
  email: string;
}

const ParticipationReport = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [reportTitle, setReportTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [signatures, setSignatures] = useState({
    president: "",
    eventResponsible: "",
  });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addParticipant = () => {
    if (!newParticipant.name) {
      toast.error("Digite o nome do participante");
      return;
    }

    if (newParticipant.phone && !isValidPhoneNumber(newParticipant.phone.replace(/\D/g, ""))) {
      toast.error("Telefone deve ter 11 dígitos (XX) XXXXX-XXXX");
      return;
    }

    if (newParticipant.email && !isValidEmail(newParticipant.email)) {
      toast.error("Email inválido");
      return;
    }
    
    const participant: Participant = {
      id: Date.now(),
      ...newParticipant,
    };
    
    setParticipants((prev) => [...prev, participant]);
    setNewParticipant({ name: "", phone: "", email: "" });
    toast.success("Participante adicionado");
  };

  const removeParticipant = (id: number) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    toast.success("Participante removido");
  };

  const previewReport = () => {
    if (!reportTitle) {
      toast.error("Adicione um título ao relatório");
      return;
    }
    if (!eventDate) {
      toast.error("Adicione a data do evento");
      return;
    }

    const doc = new jsPDF();
    const pdfBlob = generatePDFContent(doc);
    
    // Abrir PDF em nova aba para prévia
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl, '_blank');
    toast.success("Prévia aberta em nova aba");
  };

  const generatePDFContent = (doc: jsPDF) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Cabeçalho padrão
    let yPos = addPDFHeader(doc, reportTitle);
    yPos += 5;
    
    // Data do evento
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const formattedDate = new Date(eventDate).toLocaleDateString("pt-BR");
    doc.text(`Data do Evento: ${formattedDate}`, 15, yPos);
    yPos += 10;
    
    // Descrição do evento
    if (eventDescription) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Descrição do Evento:", 15, yPos);
      yPos += 7;
      doc.setFont("helvetica", "normal");
      const descriptionLines = doc.splitTextToSize(eventDescription, pageWidth - 30);
      doc.text(descriptionLines, 15, yPos);
      yPos += descriptionLines.length * 5 + 5;
    }
    
    // Assinaturas
    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Responsáveis:", 15, yPos);
    yPos += 7;
    doc.setFont("helvetica", "normal");
    doc.text(`Presidente: ${signatures.president || "___________________________"}`, 15, yPos);
    yPos += 7;
    doc.text(`Responsável pelo Evento: ${signatures.eventResponsible || "___________________________"}`, 15, yPos);
    yPos += 12;
    
    // Tabela de participantes
    if (participants.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Lista de Participantes", 15, yPos);
      yPos += 5;
      
      const tableData = participants.map((p) => [
        p.name,
        p.phone || "-",
        p.email || "-",
      ]);
      
      autoTable(doc, {
        head: [["Nome", "Telefone", "Email"]],
        body: tableData,
        startY: yPos,
        styles: {
          fontSize: 9,
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
      
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }
    
    // Imagens anexadas
    if (uploadedImages.length > 0) {
      // Verificar se precisa de nova página
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Imagens do Evento", 15, yPos);
      yPos += 10;
      
      const imgWidth = 80;
      const imgHeight = 60;
      const marginBetween = 10;
      let xPos = 15;
      
      uploadedImages.forEach((image, index) => {
        // Verificar se precisa de nova página
        if (yPos + imgHeight > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPos = 20;
          xPos = 15;
        }
        
        // Verificar se precisa quebrar linha (2 imagens por linha)
        if (index > 0 && index % 2 === 0) {
          yPos += imgHeight + marginBetween;
          xPos = 15;
          
          // Verificar novamente se precisa de nova página após quebra de linha
          if (yPos + imgHeight > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            yPos = 20;
            xPos = 15;
          }
        }
        
        try {
          doc.addImage(image, 'JPEG', xPos, yPos, imgWidth, imgHeight);
          xPos += imgWidth + marginBetween;
        } catch (error) {
          console.error("Erro ao adicionar imagem:", error);
        }
      });
      
      yPos += imgHeight + 15;
    }
    
    // Rodapé padrão
    addPDFFooter(doc);
    
    return doc.output('blob');
  };

  const generateReport = () => {
    if (!reportTitle) {
      toast.error("Adicione um título ao relatório");
      return;
    }
    if (!eventDate) {
      toast.error("Adicione a data do evento");
      return;
    }

    const doc = new jsPDF();
    generatePDFContent(doc);
    
    // Salvar PDF
    const fileName = `relatorio_participacao_${reportTitle.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
    toast.success("Relatório gerado com sucesso!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Relatório de Participação</h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Relatório</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reportTitle">Título do Relatório</Label>
                  <Input
                    id="reportTitle"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Ex: Relatório de Atividades - Janeiro 2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Data do Evento</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDescription">Descrição do Evento</Label>
                  <Textarea
                    id="eventDescription"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Descreva os detalhes e objetivos do evento..."
                    rows={4}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="president">Nome do Presidente</Label>
                    <Input
                      id="president"
                      value={signatures.president}
                      onChange={(e) => setSignatures({ ...signatures, president: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventResponsible">Responsável pelo Evento</Label>
                    <Input
                      id="eventResponsible"
                      value={signatures.eventResponsible}
                      onChange={(e) => setSignatures({ ...signatures, eventResponsible: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Participantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="participantName">Nome</Label>
                      <Input
                        id="participantName"
                        value={newParticipant.name}
                        onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                        placeholder="Nome do participante"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participantPhone">Telefone</Label>
                      <MaskedInput
                        id="participantPhone"
                        mask="phone"
                        value={newParticipant.phone}
                        onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participantEmail">Email</Label>
                      <Input
                        id="participantEmail"
                        type="email"
                        value={newParticipant.email}
                        onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                  </div>
                  <Button onClick={addParticipant} className="w-full md:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Participante
                  </Button>

                  {participants.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <h3 className="font-semibold mb-3">Lista de Participantes ({participants.length})</h3>
                      <div className="border rounded-lg divide-y">
                        {participants.map((participant) => (
                          <div key={participant.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                            <div className="flex-1 grid md:grid-cols-3 gap-4">
                              <div>
                                <p className="font-medium">{participant.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">{participant.phone || "-"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">{participant.email || "-"}</p>
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => removeParticipant(participant.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload de Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="fileUpload"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <Label
                      htmlFor="fileUpload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-12 h-12 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Clique para fazer upload de imagens do relatório físico
                      </span>
                    </Label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={previewReport}>
                <FileText className="w-4 h-4 mr-2" />
                Visualizar Prévia
              </Button>
              <Button onClick={generateReport}>
                Gerar Relatório PDF
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ParticipationReport;
