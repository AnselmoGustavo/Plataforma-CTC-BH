import { Heart, Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = () => {
  return (
    <section id="mission" className="pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Transformando Vidas Através da Compaixão
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dedicado a criar mudanças positivas duradouras em nossa comunidade através de 
            programas de educação, apoio e desenvolvimento sustentável.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Nossa Missão</h3>
                <p className="text-muted-foreground">
                  Capacitar indivíduos e comunidades através de programas de apoio abrangentes 
                  que atendem necessidades imediatas enquanto constroem resiliência a longo prazo.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Comunidade em Primeiro Lugar</h3>
                <p className="text-muted-foreground">
                  Acreditamos no poder de iniciativas impulsionadas pela comunidade e trabalhamos 
                  de mãos dadas com líderes locais para criar impacto significativo.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Nossos Valores</h3>
                <p className="text-muted-foreground">
                  Transparência, responsabilidade e respeito guiam cada decisão que tomamos, 
                  garantindo que cada contribuição crie impacto máximo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
