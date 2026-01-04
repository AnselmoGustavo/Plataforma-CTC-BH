# 🚀 Guia de Configuração do Projeto - CTC BH

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - https://nodejs.org/
- **.NET SDK 8.0** - https://dotnet.microsoft.com/download/dotnet/8.0
- **SQL Server Express** (ou SQL Server completo) - https://www.microsoft.com/sql-server/sql-server-downloads
- **npm** (vem com Node.js)
- **Git** (opcional, mas recomendado)

---

## 🔧 Configuração Inicial

### 1️⃣ Instalar Dependências do Frontend

Abra o terminal na raiz do projeto e execute:

```powershell
npm install
```

### 2️⃣ Restaurar Pacotes do Backend (.NET)

Navegue até a pasta do backend:

```powershell
cd server\Backend
```

Restaure os pacotes NuGet:

```powershell
dotnet restore
```

---

### 3️⃣ Configurar o Banco de Dados

Por padrão o backend usa uma connection string em `server/Backend/appsettings.json`.
Edite esse arquivo para apontar para sua instância do SQL Server caso necessário.

Exemplo de configuração (Windows Authentication):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=LoginDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

> Se você usa usuário/senha, utilize: `Server=SEU_SERVIDOR;Database=LoginDb;User Id=USUARIO;Password=SENHA;TrustServerCertificate=True;`

---

### 4️⃣ Criar o Banco de Dados (EF Migrations)

Ainda na pasta `server\Backend`, execute as migrations para criar o banco de dados:

```powershell
dotnet ef database update
```

Se o comando `dotnet ef` não estiver disponível, instale a ferramenta globalmente:

```powershell
dotnet tool install --global dotnet-ef
```

Em seguida execute novamente `dotnet ef database update`.

---

## ▶️ Executar o Projeto

### 🎯 Rodar Backend (.NET)

No terminal:

```powershell
cd server\Backend
dotnet run
```

O backend iniciará na porta configurada (ex.: https://localhost:7150). Verifique o console para a URL exata.

### 🎯 Rodar Frontend (React + Vite)

Na raiz do projeto:

```powershell
npm run dev
```

Por padrão o Vite abre em `http://localhost:5173` (pode mudar para outra porta se já estiver em uso).

---

## 🧪 Testar a Aplicação

1. Abra o navegador em `http://localhost:5173`
2. Acesse as telas e funcionalidades (eventos, voluntários, relatórios, controle de vagas/salas)

> Credenciais de exemplo (se existentes no banco de dados de desenvolvimento): `admin@exemplo.com` / `admin123`.

---

## 🛠️ Scripts Úteis

### Frontend (npm)

```powershell
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend (dotnet)

```powershell
dotnet run
dotnet build
dotnet watch run
dotnet ef database update
```

---

## ❗ Problemas Comuns

- Erro: "Cannot find module 'react'" — execute `npm install` na raiz.
- Erro: "dotnet ef not found" — execute `dotnet tool install --global dotnet-ef`.
- Erro de conexão com SQL Server — verifique se o serviço está ativo e a connection string.

---

## 📦 Observações

- O frontend e o backend são executados separadamente durante o desenvolvimento.
- Se precisar alterar portas, ajuste `vite.config.ts` (frontend) e `server/Backend/Properties/launchSettings.json` (backend).

---

**Desenvolvido para o Círculo de Trabalhadores Cristãos BH**
