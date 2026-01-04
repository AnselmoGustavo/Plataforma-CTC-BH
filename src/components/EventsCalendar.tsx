import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const events = [
  {
    id: 1,
    title: "Campanha de Arrecadação de Alimentos",
    date: "15 de março de 2025",
    time: "10:00 - 16:00",
    location: "Praça Central da Cidade",
    type: "Arrecadação",
  },
  {
    id: 2,
    title: "Workshop de Educação para Jovens",
    date: "22 de março de 2025",
    time: "14:00 - 17:00",
    location: "Centro Comunitário",
    type: "Educação",
  },
  {
    id: 3,
    title: "Feira de Saúde e Bem-estar",
    date: "5 de abril de 2025",
    time: "09:00 - 15:00",
    location: "Parque Municipal",
    type: "Saúde",
  },
  {
    id: 4,
    title: "Gala Beneficente Anual",
    date: "18 de abril de 2025",
    time: "18:00 - 22:00",
    location: "Salão de Bailes do Grande Hotel",
    type: "Arrecadação",
  },
  {
    id: 5,
    title: "Programa de Treinamento de Habilidades",
    date: "3 de maio de 2025",
    time: "13:00 - 18:00",
    location: "Centro de Treinamento",
    type: "Educação",
  },
  {
    id: 6,
    title: "Dia de Limpeza Ambiental",
    date: "20 de maio de 2025",
    time: "08:00 - 14:00",
    location: "Parque da Ribeira",
    type: "Comunidade",
  },
];

const EventsCalendar = () => {
  return (
    <section id="events" className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Eventos Futuros
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Junte-se a nós em fazer a diferença. Confira nossos eventos futuros e encontre maneiras de se envolver.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <Badge variant="secondary">{event.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{event.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsCalendar;
