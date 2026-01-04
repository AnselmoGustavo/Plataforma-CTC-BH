# 7 Apêndices

## 7.1 Referências Online e URLs do Projeto

### Sistema de Gestão - PSG-SI-2025-2-P5-TIAS

**Repositório do Projeto:**
- **GitHub:** https://github.com/ICEI-PUCMinas-PSG-SI-TI/psg-si-2025-2-p5-tias-7679101-ctc-team.git
- **Documentação Técnica:** Veja pasta `/docs` para documentação completa

---

## 7.2 Referências do Cliente/Parceiro - CTC BH

### Site Oficial do Círculo de Trabalhadores Cristãos

**Landing Page:**
- **URL:** https://ctcbh.com/
- **Descrição:** Site oficial do CTC BH com informações sobre a organização, missão, atividades e formas de contato

### Redes Sociais

**Instagram:**
- **URL:** https://www.instagram.com/circulobh/
- **Descrição:** Perfil oficial no Instagram com atualizações de eventos, atividades, fotos e notícias do CTC

---

## 7.3 Documentação Técnica de Configuração

### Arquivos Importantes do Projeto

| Arquivo | Localização | Descrição |
|---------|-------------|-----------|
| **SETUP.md** | Raiz do projeto | Guia completo de configuração e execução do projeto |
| **README.md** | Raiz do projeto | Visão geral do projeto e integrantes da equipe |
| **package.json** | Raiz do projeto | Dependências do frontend (React, TypeScript, etc.) |
| **Backend.csproj** | `server/Backend/` | Configuração do projeto .NET Core |
| **appsettings.json** | `server/Backend/` | Configurações de conexão com banco de dados e JWT |
| **vite.config.ts** | Raiz do projeto | Configuração do build tool Vite |
| **tsconfig.json** | Raiz do projeto | Configuração do TypeScript |

### Estrutura de Pastas

```
psg-si-2025-2-p5-tias-7679101-ctc-team/
├── docs/                          # Documentação do projeto
│   ├── 1-Apresentação.md
│   ├── 2-Requisitos.md
│   ├── 3-Modelagem-Diagramas.md
│   ├── 4-Avaliação-Resultados.md
│   ├── 5-Conclusão.md
│   ├── 6-Referências.md
│   └── 7-Apêndices.md
├── src/                           # Frontend (React + TypeScript)
│   ├── pages/                     # 8 páginas principais
│   ├── components/                # Componentes reutilizáveis
│   ├── contexts/                  # Context API (Auth)
│   ├── services/                  # Chamadas API
│   └── lib/                       # Utilitários
├── server/
│   └── Backend/                   # Backend (.NET Core 8.0)
│       ├── Controllers/           # 6 Controllers
│       ├── Services/              # Lógica de negócio
│       ├── Models/                # Entidades
│       ├── Data/                  # DbContexts e Migrations
│       └── DTOs/                  # Data Transfer Objects
├── public/                        # Assets estáticos
├── SETUP.md                       # Guia de configuração
├── README.md                      # Visão geral
├── package.json                   # Dependências npm
├── tsconfig.json                  # Config TypeScript
└── vite.config.ts                 # Config Vite
```

---

## 7.4 Credenciais de Teste (Desenvolvimento)

### Admin Padrão

**Email:** `admin@exemplo.com`
**Senha:** `admin123`

> ⚠️ **IMPORTANTE:** Estas credenciais são apenas para desenvolvimento. Em produção, criar novos usuários com senhas seguras.

---

## 7.5 Requisitos de Sistema

### Pré-requisitos para Desenvolvimento

| Componente | Versão | Link |
|-----------|--------|------|
| **Node.js** | 18+ | https://nodejs.org/ |
| **.NET SDK** | 8.0 | https://dotnet.microsoft.com/download/dotnet/8.0 |
| **SQL Server Express** | Mais recente | https://www.microsoft.com/sql-server/sql-server-downloads |
| **npm** | 9.x (com Node.js) | Incluído com Node.js |
| **Git** | Qualquer versão | https://git-scm.com/ |

### Requisitos para Produção

- **Servidor Web:** IIS, Nginx ou similar
- **Runtime .NET:** .NET 8.0 Runtime
- **Banco de Dados:** PostgreSQL (Supabase) ou SQL Server
- **HTTPS:** Certificado SSL/TLS obrigatório
- **Memória:** Mínimo 2GB RAM
- **CPU:** Processador moderno (2+ cores)
- **Disco:** 10GB para código + dados

---

## 7.6 Principais Funcionalidades por Módulo

### 1. Autenticação (Auth)
- Login com JWT
- Logout
- Proteção de rotas
- RBAC (Role-Based Access Control)

### 2. Dashboard
- Visão geral com estatísticas
- Lembretes de eventos próximos
- Resumo de atividades recentes

### 3. Associados
- CRUD de usuários do sistema
- Gerenciamento de papéis e permissões
- Busca e filtros

### 4. Voluntários
- Cadastro de voluntários
- Histórico de participações
- Busca e filtros

### 5. Eventos
- Calendário de eventos
- CRUD de eventos
- Controle de presença
- Exportação de relatórios

### 6. Relatórios Financeiros
- Registro de receitas e despesas
- Cálculos automáticos de saldo
- Exportação em PDF
- Geração em menos de 5 segundos

### 7. Gestão de Aluguéis
- Cadastro de espaços/vagas
- Controle de reservas
- Gerenciamento de pagamentos
- Histórico de transações

### 8. Relatório de Participação
- Registro de presença em eventos
- Geração de relatórios por evento
- Exportação em PDF/CSV
- Histórico de participação por voluntário

---

## 7.7 Contatos e Referências

### Equipe de Desenvolvimento (CTC Team)

- **Ana Beatriz Costa Viana**
- **Grazielle Sorrentino Santos Souza**
- **Gustavo Anselmo Santos Silva**
- **Gustavo de Assis Vilarino**
- **Karina Oliveira Bichalho de Almeida**
- **Nicole Marie Agnelo Marques**

### Orientação Acadêmica

- **Professor Orientador:** Pedro Alves de Oliveira
- **Instituição:** PUC Minas
- **Curso:** Sistemas de Informação

### Cliente/Parceiro

- **Organização:** Círculo de Trabalhadores Cristãos de Belo Horizonte (CTC BH)
- **Presidente:** Eleniudes
- **Presidente Operacional:** Júnior
- **Site:** https://ctcbh.com/
- **Instagram:** https://www.instagram.com/circulobh/

---

## 7.8 Licença e Uso

Este projeto foi desenvolvido como projeto acadêmico para o Círculo de Trabalhadores Cristãos (CTC BH) e está disponível para uso pela organização.

**Permissões:**
- ✅ Uso interno pela organização
- ✅ Modificação e adaptação
- ✅ Distribuição para terceiros contratados

**Restrições:**
- ❌ Venda comercial sem autorização
- ❌ Uso em outras organizações sem modificação
- ❌ Remoção de créditos de desenvolvimento

---

*Documento de Apêndices compilado em: 19 de Dezembro de 2025*
*Projeto PSG-SI-2025-2-P5-TIAS*
*Equipe: CTC Team*
