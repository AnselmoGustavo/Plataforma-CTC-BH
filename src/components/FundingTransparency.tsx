import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Building, HandHeart } from "lucide-react";

const fundingData = [
  { name: "Serviços de Programa", value: 72, color: "hsl(var(--primary))" },
  { name: "Administrativo", value: 15, color: "hsl(var(--accent))" },
  { name: "Arrecadação", value: 13, color: "hsl(var(--muted))" },
];

const sources = [
  {
    icon: Building,
    title: "Subsídios Governamentais",
    amount: "R$ 450.000",
    percentage: "45%",
  },
  {
    icon: HandHeart,
    title: "Doações Individuais",
    amount: "R$ 350.000",
    percentage: "35%",
  },
  {
    icon: DollarSign,
    title: "Parcerias Corporativas",
    amount: "R$ 200.000",
    percentage: "20%",
  },
];

const FundingTransparency = () => {
  return (
    <section id="funding" className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Transparência Financeira
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acreditamos em transparência total. Veja como suas contribuições fazem impacto.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Como Usamos os Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={fundingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fundingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground text-center mt-4">
                72% de cada real vai diretamente para serviços de programa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fontes de Financiamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sources.map((source, index) => {
                  const Icon = source.icon;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-foreground">
                            {source.title}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {source.percentage}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            {source.amount}
                          </span>
                        </div>
                        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: source.percentage }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground text-center mt-6">
                Orçamento Anual Total: R$ 1.000.000
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                Cada Contribuição Importa
              </h3>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-6">
                Seu apoio nos permite continuar nossa missão de transformar vidas. 
                Junte-se a nós na criação de mudanças duradouras em nossa comunidade.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-primary-foreground text-primary px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity">
                  Fazer uma Doação
                </button>
                <button className="border-2 border-primary-foreground text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary-foreground/10 transition-colors">
                  Ver Relatório Anual
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FundingTransparency;
