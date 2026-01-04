# Tech Context - Arquitetura Técnica

## 🏗️ Arquitetura Geral
**Frontend-Backend Split**: Frontend React em Vite, Backend em .NET 8

```
Frontend (React + TypeScript + Vite)
         ↓
         API Gateway
         ↓
Backend (.NET 8)
         ↓
SQL Server + Supabase
```

## 💻 Frontend Stack
- **Framework**: React 18+ com TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: Shadcn/ui (via components.json)
- **Authentication**: JWT Token + Context API
- **HTTP Client**: Axios/Fetch
- **State Management**: React Context
- **Hooks Customizados**: use-mobile, use-toast

### Estrutura Frontend
```
src/
├── components/        # Componentes reutilizáveis
│   └── ui/           # Componentes UI (shadcn/ui)
├── contexts/         # Auth Context, etc
├── hooks/            # Hooks customizados
├── pages/            # Páginas/rotas principais
├── services/         # API calls e lógica de dados
├── lib/              # Utilitários (inputMasks, pdfUtils, etc)
└── assets/           # Imagens, fontes, etc
```

## 🖥️ Backend Stack
- **Runtime**: .NET 8.0
- **Framework**: ASP.NET Core
- **ORM**: Entity Framework Core
- **Database**: SQL Server
- **Authentication**: JWT
- **API**: RESTful

### Estrutura Backend
```
server/Backend/
├── Controllers/      # Endpoints API
├── Models/          # Entidades do BD
├── DTOs/            # Data Transfer Objects
├── Services/        # Lógica de negócio
├── Data/            # DbContext e configurações
├── Migrations/      # EF Core Migrations
└── appsettings.json # Configurações
```

## 🗄️ Banco de Dados
- **SQL Server Express** (development)
- **Windows Authentication** (default)
- **EF Core Migrations** para versionamento

### Principais Tabelas
- Associados
- Voluntários
- Events
- FinancialReports
- VeiculosLocacao
- AspNetUsers (Identity)

## 🔗 Integração Supabase
- Autenticação opcional
- Real-time capabilities (se implementado)
- Armazenamento de arquivos

## 📦 Dependências Críticas
- `package.json`: npm packages (frontend)
- `Backend.csproj`: NuGet packages (.NET)
- `bun.lockb`: Lock file do Bun (alternativa a npm)

## 🚀 Portas Padrão
- **Frontend**: http://localhost:5173 (Vite)
- **Backend**: https://localhost:7150 (.NET)
- **SQL Server**: localhost (default)

## 🔧 Configurações Importantes
- `.env` para variáveis de ambiente
- `appsettings.json` para configurações backend
- `tailwind.config.ts` para customização de estilos
- `tsconfig.json` para configuração TypeScript

## 📝 Padrões de Desenvolvimento
- **API**: Controllers com injeção de dependência
- **Frontend**: Componentes funcionais com hooks
- **Dados**: Services encapsulam chamadas API
- **Autenticação**: JWT em localStorage + Context
