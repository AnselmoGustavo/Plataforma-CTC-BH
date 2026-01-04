import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();

  const navigationLinks = [
    { label: "Eventos", path: "/events" },
    { label: "Voluntários", path: "/volunteers" },
    { label: "Associados", path: "/associates" },
    { label: "Relatório de Participação", path: "/participation-report" },
    { label: "Relatório Financeiro", path: "/financial-report" },
    { label: "Gestão de Alugueis", path: "/rental-management" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Conteúdo Principal */}
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Painel Administrativo</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-all hover:shadow-lg"
              >
                <p className="text-lg font-semibold text-foreground">{link.label}</p>
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
