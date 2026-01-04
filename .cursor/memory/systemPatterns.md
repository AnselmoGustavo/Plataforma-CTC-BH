# System Patterns - Padrões e Convenções

## 📐 Padrões de Arquitetura

### Frontend Patterns

#### 1. Componentes React
- **Componentes Funcionais**: Usar sempre
- **Hooks**: useContext, useState, useEffect
- **Custom Hooks**: Encapsular lógica reutilizável
- **Props Destructuring**: Sempre destructurar

```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
  disabled?: boolean;
}

export function MyComponent({ title, onAction, disabled }: ComponentProps) {
  // código
}
```

#### 2. Services Pattern
Arquivos em `src/services/` encapsulam chamadas API:
- `api.ts` - Cliente HTTP base
- `auth.ts` - Autenticação
- `associadosData.ts` - Dados de associados
- `eventsData.ts` - Dados de eventos
- etc.

#### 3. Context para Estado Global
- `AuthContext.tsx` - Gerencia autenticação
- Usar para estado compartilhado entre múltiplas páginas

#### 4. Roteamento
- Páginas em `src/pages/`
- ProtectedRoute para rotas autenticadas
- NotFound para rotas inválidas

### Backend Patterns

#### 1. Architecture Pattern
- **DTOs**: Para transferência de dados entre camadas
- **Models**: Entidades do banco de dados
- **Controllers**: Endpoints REST
- **Services**: Lógica de negócio (se necessário)
- **DbContext**: Acesso a dados

#### 2. API Endpoints
RESTful com recursos:
```
GET    /api/associados           - Listar
GET    /api/associados/{id}      - Detalhe
POST   /api/associados           - Criar
PUT    /api/associados/{id}      - Atualizar
DELETE /api/associados/{id}      - Deletar
```

#### 3. Autenticação
- Baseada em JWT
- Token no header: `Authorization: Bearer {token}`
- Validação em controllers com `[Authorize]`

#### 4. Tratamento de Erros
```csharp
try {
  // lógica
  return Ok(resultado);
} catch (Exception ex) {
  return BadRequest(new { error = ex.Message });
}
```

## 🎨 Padrões de UI

### Tailwind CSS
- Utility-first CSS
- Configuração em `tailwind.config.ts`
- Classes de resposta: sm:, md:, lg:, xl:

### Shadcn/ui Components
- Pre-built components em `src/components/ui/`
- Integração com Tailwind
- Customização via props

## 📝 Naming Conventions

### Frontend
- **Arquivos de Componentes**: PascalCase (MyComponent.tsx)
- **Arquivos de Hooks**: camelCase (useAuth.ts)
- **Páginas**: PascalCase (Dashboard.tsx)
- **Variáveis/Funções**: camelCase
- **Interfaces/Types**: PascalCase

### Backend
- **Classes**: PascalCase
- **Métodos**: PascalCase
- **Propriedades**: PascalCase
- **Variáveis Privadas**: _camelCase
- **Constantes**: UPPER_SNAKE_CASE

## 🔄 Fluxo de Dados

### Frontend → Backend
```
React Component
  ↓
Service (chamada API)
  ↓
Backend Controller
  ↓
Service/Logic
  ↓
EF Core + SQL Server
```

### Resposta
```
SQL Server
  ↓
EF Core Entity
  ↓
DTO (serializado para JSON)
  ↓
Service JavaScript
  ↓
React Component (renderizar)
```

## 🛡️ Padrões de Segurança

- **JWT Token**: Autenticação stateless
- **CORS**: Configurado no backend
- **SQL Injection Prevention**: EF Core com parâmetros
- **Password Hashing**: BCrypt ou Identity API
- **Protected Routes**: Validação no frontend e backend

## 📊 Padrões de Dados

### DTO Pattern
Exemplo: `AssociadosDto.cs`
```csharp
public class AssociadosDto {
  public int Id { get; set; }
  public string Nome { get; set; }
  // apenas campos necessários
}
```

### Validation
- Atributos de validação em Models/DTOs
- Validação no controller antes de processar
- Feedback claro de erros ao frontend

## 🔄 Estado em React
- **Props**: Para comunicação pai-filho
- **State (useState)**: Estado local
- **Context**: Estado global (autenticação)
- **Services**: Chamadas de dados externas
