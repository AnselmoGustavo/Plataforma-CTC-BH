import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, X, FileDown, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { addPDFHeader, addPDFFooter } from "@/lib/pdfUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  FinancialReportRecord,
  createFinancialReport,
  deleteFinancialReport,
  listFinancialReports,
} from "@/services/financialReport";

type FinancialEntry =
  | {
      id: number;
      type: "income";
      description: string;
      amount: number;
      date: string;
    }
  | {
      id: number;
      type: "expense";
      description: string;
      amount: number;
      date: string;
    };

const FinancialReport = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
    useEffect(() => {
      const load = async () => {
        try {
          const data = await listFinancialReports();
          const mapped: FinancialEntry[] = data.flatMap((r: FinancialReportRecord) => {
            const arr: FinancialEntry[] = [];
            if (r.entrada) {
              arr.push({
                id: r.id,
                type: "income",
                description: r.entrada,
                amount: Number(r.valorEntrada || 0),
                date: (r.dataEntrada || "").toString().substring(0, 10),
              });
            }
            if (r.despesa) {
              arr.push({
                id: r.id,
                type: "expense",
                description: r.despesa,
                amount: Number(r.valorDespesa || 0),
                date: (r.dataDespesa || "").toString().substring(0, 10),
              });
            }
            return arr;
          });
          setEntries(mapped);
        } catch (e) {
          console.error(e);
          toast.error("Erro ao carregar relatório financeiro");
        }
      };
      load();
    }, []);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [incomeForm, setIncomeForm] = useState({ description: "", amount: "", date: "" });
  const [expenseForm, setExpenseForm] = useState({ description: "", amount: "", date: "" });

  const addIncome = () => {
    if (!incomeForm.description || !incomeForm.amount || !incomeForm.date) {
      toast.error("Preencha todos os campos");
      return;
    }
    const payload = {
      entrada: incomeForm.description,
      dataEntrada: incomeForm.date,
      valorEntrada: parseFloat(incomeForm.amount),
      despesa: null,
      dataDespesa: null,
      valorDespesa: null,
    };
    createFinancialReport(payload)
      .then(async () => {
        toast.success("Receita adicionada");
        const data = await listFinancialReports();
        const mapped: FinancialEntry[] = data.flatMap((r) => {
          const arr: FinancialEntry[] = [];
          if (r.entrada) arr.push({ id: r.id, type: "income", description: r.entrada!, amount: Number(r.valorEntrada || 0), date: (r.dataEntrada || "").toString().substring(0, 10) });
          if (r.despesa) arr.push({ id: r.id, type: "expense", description: r.despesa!, amount: Number(r.valorDespesa || 0), date: (r.dataDespesa || "").toString().substring(0, 10) });
          return arr;
        });
        setEntries(mapped);
      })
      .catch(() => toast.error("Erro ao salvar receita"));
    setIncomeForm({ description: "", amount: "", date: "" });
    setShowIncomeForm(false);
  };

  const addExpense = () => {
    if (!expenseForm.description || !expenseForm.amount || !expenseForm.date) {
      toast.error("Preencha todos os campos");
      return;
    }
    const payload = {
      entrada: null,
      dataEntrada: null,
      valorEntrada: null,
      despesa: expenseForm.description,
      dataDespesa: expenseForm.date,
      valorDespesa: parseFloat(expenseForm.amount),
    };
    createFinancialReport(payload)
      .then(async () => {
        toast.success("Despesa adicionada");
        const data = await listFinancialReports();
        const mapped: FinancialEntry[] = data.flatMap((r) => {
          const arr: FinancialEntry[] = [];
          if (r.entrada) arr.push({ id: r.id, type: "income", description: r.entrada!, amount: Number(r.valorEntrada || 0), date: (r.dataEntrada || "").toString().substring(0, 10) });
          if (r.despesa) arr.push({ id: r.id, type: "expense", description: r.despesa!, amount: Number(r.valorDespesa || 0), date: (r.dataDespesa || "").toString().substring(0, 10) });
          return arr;
        });
        setEntries(mapped);
      })
      .catch(() => toast.error("Erro ao salvar despesa"));
    setExpenseForm({ description: "", amount: "", date: "" });
    setShowExpenseForm(false);
  };

  const removeEntry = (id: number) => {
    deleteFinancialReport(id)
      .then(async () => {
        const data = await listFinancialReports();
        const mapped: FinancialEntry[] = data.flatMap((r) => {
          const arr: FinancialEntry[] = [];
          if (r.entrada) arr.push({ id: r.id, type: "income", description: r.entrada!, amount: Number(r.valorEntrada || 0), date: (r.dataEntrada || "").toString().substring(0, 10) });
          if (r.despesa) arr.push({ id: r.id, type: "expense", description: r.despesa!, amount: Number(r.valorDespesa || 0), date: (r.dataDespesa || "").toString().substring(0, 10) });
          return arr;
        });
        setEntries(mapped);
      })
      .catch(() => toast.error("Erro ao remover registro"));
  };

  const totalIncome = entries
    .filter((entry) => entry.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = entries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpenses;

  const generatePDFContent = (doc: jsPDF) => {
    let yPos = addPDFHeader(doc, "Relatório Financeiro");
    yPos += 10;

    // Resumo financeiro
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Resumo Financeiro", 15, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 128, 0);
    doc.text(`Total de Receitas: R$ ${totalIncome.toFixed(2).replace(".", ",")}`, 15, yPos);
    yPos += 6;
    doc.setTextColor(255, 0, 0);
    doc.text(`Total de Despesas: R$ ${totalExpenses.toFixed(2).replace(".", ",")}`, 15, yPos);
    yPos += 6;
    doc.setTextColor(balance >= 0 ? 0 : 255, balance >= 0 ? 0 : 0, balance >= 0 ? 255 : 0);
    doc.text(`Saldo: R$ ${balance.toFixed(2).replace(".", ",")}`, 15, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += 12;

    // Tabela de receitas
    const incomes = entries.filter((e) => e.type === "income");
    if (incomes.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Receitas", 15, yPos);
      yPos += 5;

      autoTable(doc, {
        startY: yPos,
        head: [["Data", "Descrição", "Valor"]],
        body: incomes.map((e) => [
          new Date(e.date).toLocaleDateString("pt-BR"),
          e.description,
          `R$ ${e.amount.toFixed(2).replace(".", ",")}`,
        ]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: "bold" },
      });
      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tabela de despesas
    const expenses = entries.filter((e) => e.type === "expense");
    if (expenses.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Despesas", 15, yPos);
      yPos += 5;

      autoTable(doc, {
        startY: yPos,
        head: [["Data", "Descrição", "Valor"]],
        body: expenses.map((e) => [
          new Date(e.date).toLocaleDateString("pt-BR"),
          e.description,
          `R$ ${e.amount.toFixed(2).replace(".", ",")}`,
        ]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [255, 0, 0], textColor: 255, fontStyle: "bold" },
      });
    }

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
      console.error("Erro ao gerar prévia:", error);
      toast.error("Erro ao gerar prévia");
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      generatePDFContent(doc);
      doc.save(`relatorio_financeiro_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Relatório Financeiro</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={previewPDF} className="gap-2">
                <FileText className="w-4 h-4" />
                Visualizar Prévia
              </Button>
              <Button onClick={generatePDF} className="gap-2">
                <FileDown className="w-4 h-4" />
                Gerar Relatório PDF
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Total Receitas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  R$ {totalIncome.toFixed(2).replace(".", ",")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Total Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  R$ {totalExpenses.toFixed(2).replace(".", ",")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className={balance >= 0 ? "text-blue-600" : "text-red-600"}>
                  Saldo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  R$ {balance.toFixed(2).replace(".", ",")}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Income Form */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Adicionar Receita</CardTitle>
                  <Button size="sm" onClick={() => setShowIncomeForm(!showIncomeForm)}>
                    {showIncomeForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showIncomeForm && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Descrição/Nome</Label>
                    <Input
                      placeholder="Ex: Doação, Venda de produto..."
                      value={incomeForm.description}
                      onChange={(e) =>
                        setIncomeForm({ ...incomeForm, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={incomeForm.amount}
                      onChange={(e) =>
                        setIncomeForm({ ...incomeForm, amount: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data da Entrada</Label>
                    <Input
                      type="date"
                      value={incomeForm.date}
                      onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                    />
                  </div>
                  <Button onClick={addIncome} className="w-full">
                    Adicionar Receita
                  </Button>
                </CardContent>
              )}
            </Card>

            {/* Expense Form */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Adicionar Despesa</CardTitle>
                  <Button size="sm" onClick={() => setShowExpenseForm(!showExpenseForm)}>
                    {showExpenseForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showExpenseForm && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Descrição/Nome</Label>
                    <Input
                      placeholder="Ex: Aluguel, Fornecedores..."
                      value={expenseForm.description}
                      onChange={(e) =>
                        setExpenseForm({ ...expenseForm, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={expenseForm.amount}
                      onChange={(e) =>
                        setExpenseForm({ ...expenseForm, amount: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data da Despesa</Label>
                    <Input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    />
                  </div>
                  <Button onClick={addExpense} className="w-full">
                    Adicionar Despesa
                  </Button>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Unified Financial Table */}
          <Card>
            <CardHeader>
              <CardTitle>Tabela de Movimentações Financeiras</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={tableRef} className="overflow-x-auto bg-white p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[15%]">Entrada</TableHead>
                      <TableHead className="w-[15%]">Data Entrada</TableHead>
                      <TableHead className="w-[15%]">Valor Entrada</TableHead>
                      <TableHead className="w-[15%]">Despesa</TableHead>
                      <TableHead className="w-[15%]">Data Despesa</TableHead>
                      <TableHead className="w-[15%]">Valor Despesa</TableHead>
                      <TableHead className="w-[10%]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhuma movimentação registrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      entries.map((entry) => (
                        <TableRow key={entry.id}>
                          {entry.type === "income" ? (
                            <>
                              <TableCell className="font-medium text-green-600">
                                {entry.description}
                              </TableCell>
                              <TableCell>{entry.date}</TableCell>
                              <TableCell className="font-bold text-green-600">
                                R$ {entry.amount.toFixed(2).replace(".", ",")}
                              </TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => removeEntry(entry.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>-</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>-</TableCell>
                              <TableCell className="font-medium text-red-600">
                                {entry.description}
                              </TableCell>
                              <TableCell>{entry.date}</TableCell>
                              <TableCell className="font-bold text-red-600">
                                R$ {entry.amount.toFixed(2).replace(".", ",")}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => removeEntry(entry.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))
                    )}
                    {/* Summary Row */}
                    <TableRow className="bg-muted font-bold border-t-2">
                      <TableCell>
                        <span className="text-green-600">Total Entrada</span>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-green-600">
                        R$ {totalIncome.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600">Total Despesa</span>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-red-600">
                        R$ {totalExpenses.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    {/* Balance Row */}
                    <TableRow className="bg-slate-100 font-bold">
                      <TableCell colSpan={5} className="text-right">
                        <span className={balance >= 0 ? "text-blue-600" : "text-red-600"}>
                          Saldo
                        </span>
                      </TableCell>
                      <TableCell colSpan={2} className={balance >= 0 ? "text-blue-600" : "text-red-600"}>
                        R$ {balance.toFixed(2).replace(".", ",")}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FinancialReport;
