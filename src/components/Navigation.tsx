import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fakeAdmin = localStorage.getItem("fake_admin") === "true";
    setIsAuthenticated(!!user || !!token || fakeAdmin);
  }, [user]);

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    // clear dev-only local flag
    localStorage.removeItem("fake_admin");
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-12 w-12" />
            <span className="font-bold text-lg text-foreground">Círculo de Trabalhadores Cristãos BH</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isHomePage ? (
              <>
                <button
                  onClick={() => scrollToSection("mission")}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Missão
                </button>
                <button
                  onClick={() => scrollToSection("events")}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Eventos
                </button>
                <button
                  onClick={() => scrollToSection("impact")}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Impacto
                </button>
                <button
                  onClick={() => scrollToSection("funding")}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Financeiro
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-foreground hover:text-primary transition-colors">
                  Início
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/events" className="text-foreground hover:text-primary transition-colors">
                      Eventos
                    </Link>
                    <Link to="/volunteers" className="text-foreground hover:text-primary transition-colors">
                      Voluntários
                    </Link>
                    <Link to="/associates" className="text-foreground hover:text-primary transition-colors">
                      Associados
                    </Link>
                    <Link to="/participation-report" className="text-foreground hover:text-primary transition-colors">
                      Relatório de Participação
                    </Link>
                    <Link to="/financial-report" className="text-foreground hover:text-primary transition-colors">
                      Relatório Financeiro
                    </Link>
                    <Link to="/rental-management" className="text-foreground hover:text-primary transition-colors">
                      Gestão de Alugueis
                    </Link>
                  </>
                )}
              </>
            )}
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="default" size="sm">
                Admin
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            {isHomePage ? (
              <>
                <button
                  onClick={() => scrollToSection("mission")}
                  className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                >
                  Missão
                </button>
                <button
                  onClick={() => scrollToSection("events")}
                  className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                >
                  Eventos
                </button>
                <button
                  onClick={() => scrollToSection("impact")}
                  className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                >
                  Impacto
                </button>
                <button
                  onClick={() => scrollToSection("funding")}
                  className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                >
                  Financeiro
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors">
                  Início
                </Link>
                {isAuthenticated && (
                  <>
                    <Link to="/events" className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors">
                      Eventos
                    </Link>
                    <Link to="/volunteers" className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors">
                      Voluntários
                    </Link>
                    <Link to="/associates" className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors">
                      Associados
                    </Link>
                    <Link to="/participation-report" className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors">
                      Relatório de Participação
                    </Link>
                    <Link to="/financial-report" className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors">
                      Relatório Financeiro
                    </Link>
                    <Link to="/rental-management" className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors">
                      Gestão de Locação
                    </Link>
                  </>
                )}
              </>
            )}
            {isAuthenticated ? (
              <Button onClick={handleLogout} variant="outline" size="sm" className="w-full gap-2">
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="default" size="sm" className="w-full">
                Admin
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
