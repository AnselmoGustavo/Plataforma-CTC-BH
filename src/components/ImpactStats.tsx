import { useEffect, useState } from "react";
import { Users, Heart, Globe, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 15000,
    label: "Pessoas Impactadas",
    suffix: "+",
  },
  {
    icon: Heart,
    value: 2500,
    label: "Famílias Apoiadas",
    suffix: "+",
  },
  {
    icon: Globe,
    value: 45,
    label: "Comunidades Atendidas",
    suffix: "",
  },
  {
    icon: TrendingUp,
    value: 98,
    label: "Taxa de Sucesso",
    suffix: "%",
  },
];

const AnimatedCounter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const ImpactStats = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("impact");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="impact" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nosso Impacto
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Números reais, mudança real. Veja como estamos fazendo diferença em nossa comunidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {isVisible ? <AnimatedCounter end={stat.value} /> : "0"}
                  {stat.suffix}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
