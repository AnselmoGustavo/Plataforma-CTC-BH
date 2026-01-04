import { jsPDF } from "jspdf";
import logo from "@/assets/logo.png";

export const addPDFHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Logo no canto superior esquerdo
  doc.addImage(logo, 'PNG', 10, 8, 25, 25);
  
  // Título centralizado
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CÍRCULO DE TRABALHADORES CRISTÃOS - BH", pageWidth / 2, 20, { align: "center" });
  
  // CNPJ
  doc.setFontSize(12);
  doc.text("CNPJ: 18.328.971/0001-20", pageWidth / 2, 27, { align: "center" });
  
  // Informações adicionais padrão
  let yPos = 33;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const standardInfo = [
    "87-30-1-99 - Atividades de Assistência Social prestadas em residências coletivas e particulares",
    "94.30-8-00 - Atividades de Associações de Defesa de Direitos Sociais",
    "94.91-0-00 - Atividades de Organizações Religiosas ou Filosóficas",
    "Rua Guarani, 597 Centro - CEP. 30120-045",
    "Cidade de Belo Horizonte - Minas Gerais",
    "Tel: 31 3212-7479 | Email: circulobh@gmail.com"
  ];
  
  standardInfo.forEach((info) => {
    doc.text(info, pageWidth / 2, yPos, { align: "center" });
    yPos += 4;
  });
  
  // Linha separadora
  doc.setLineWidth(0.5);
  doc.line(10, yPos + 2, pageWidth - 10, yPos + 2);
  
  // Título do relatório
  if (title) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, yPos + 12, { align: "center" });
  }
  
  return yPos + 20; // Retorna a posição Y onde o conteúdo pode começar
};

export const addPDFFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }
};
