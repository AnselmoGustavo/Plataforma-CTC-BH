# Active Context - Contexto Atual do Projeto

## 🎯 Status Atual
**Data**: Janeiro 4, 2026
**Fase**: Desenvolvimento em andamento
**Estado**: Projeto estruturado com frontend e backend definidos

## 📂 Estrutura do Projeto
```
ctcBh_Plataforma/
├── Frontend (Vite + React)
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
├── Backend (.NET)
│   ├── server/Backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   └── ...
├── CursorRIPER/ (Framework de IA)
├── docs/ (Documentação)
└── .cursor/ (Configuração CursorRIPER)
```

## 🔧 Configuração de Desenvolvimento

### Dependências Instaladas
- **Frontend**: npm packages (via package.json)
- **Backend**: NuGet packages (via Backend.csproj)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **Database**: SQL Server Express

### Variáveis de Ambiente Necessárias
- `VITE_API_URL`: URL do backend (ex: https://localhost:7150)
- Connection String do SQL Server
- JWT Secret (se aplicável)
- Credenciais Supabase (se usado)

## 📖 Módulos em Desenvolvimento

### ✅ Implementados
- Estrutura de pastas e arquivos
- Componentes base (Navigation, Footer, HeroSection)
- Context de autenticação
- Páginas principais (Dashboard, Auth, Associates, etc)
- Controllers backend (Associados, Auth, Events, etc)
- Modelos EF Core

### 🔄 Em Andamento / Pendentes
- Integração completa Frontend-Backend
- Testes unitários
- Validações robustas
- Tratamento de erros comprehensive
- Documentação de APIs

## 🚀 Últimas Ações
1. Configuração do CursorRIPER completada
2. Estrutura `.cursor/` com rules criada
3. Memory Bank inicializada

## 🎨 Componentes Principais Existentes
- EventsCalendar.tsx
- Navigation.tsx
- Footer.tsx
- HeroSection.tsx
- ImpactStats.tsx
- FundingTransparency.tsx
- ProtectedRoute.tsx
- Componentes UI (shadcn)

## 🔌 Serviços de API
- `api.ts` - Cliente HTTP base
- `auth.ts` - Autenticação e login
- `associadosData.ts`
- `voluntariosData.ts`
- `eventsData.ts`
- `financialReport.ts`
- `rentalManagement.ts`

## 📱 Páginas Implementadas
- Dashboard.tsx
- Auth.tsx (login)
- Associates.tsx
- Volunteers.tsx
- Events.tsx
- FinancialReport.tsx
- RentalManagement.tsx
- ParticipationReport.tsx
- NotFound.tsx

## 🔐 Autenticação
- JWT baseada
- AuthContext para gerenciar sessão
- ProtectedRoute para rotas privadas
- Supabase integration disponível

## 📊 Banco de Dados
- SQL Server como principal
- EF Core para ORM
- Migrations criadas
- Contextos: AppDbContext, AssociadosContext, VoluntariosContext

## 🎯 Próximas Prioridades
1. [ ] Validar integração Frontend-Backend
2. [ ] Testar fluxo de autenticação
3. [ ] Implementar lógica de cada módulo
4. [ ] Testes automatizados
5. [ ] Deploy/hospedagem

## 📝 Notas Importantes
- Projeto segue arquitetura limpa (Frontend/Backend separados)
- Documentação em `docs/` inclui requisitos e modelagem
- CursorRIPER framework instalado para otimizar desenvolvimento com IA
- Usar conventions em naming e código para manter consistência
