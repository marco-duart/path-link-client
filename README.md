# Path Link - Frontend (React + Vite)

Sistema de Documentação para Equipe de TI - Interface Frontend

## 🚀 Características

- **Autenticação baseada em JWT** - Tokens enviados pelo backend
- **Controle de Acesso baseado em Roles** - Dados vêm do backend, sem constantes locais
- **Tema Dark Moderno** - Cores bem definidas com Stitches CSS
- **Responsivo** - Mobile-first design
- **Componentes Reutilizáveis** - Table, Card, Button e mais
- **React Hook Form** - Gerenciamento de formulários com validação Zod
- **Framer Motion** - Animações suaves
- **Toast Notifications** - Feedbacks visuais

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend rodando em `http://localhost:3000/v1`

## 🔧 Instalação

```bash
# Clone o repositório
cd path-link-client

# Instale as dependências
npm install

# Crie o arquivo .env baseado no template
cp .env.example .env

# Edite .env com as configurações corretas
```

## 🎯 Variáveis de Ambiente

```env
# URL base da API do backend
VITE_API_URL=http://localhost:3000/v1

# Ambiente
VITE_ENV=development
```

## 💻 Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# O app estará disponível em http://localhost:5173
```

## 🏗️ Build para Produção

```bash
# Cria build otimizado
npm run build

# Preview da build
npm run preview
```

## 📁 Estrutura de Pastas

```
src/
├── assets/              # Imagens e estilos
│   └── styles/
│       └── themes/      # Tema dark e config Stitches
├── components/          # Componentes React reutilizáveis
│   ├── base-layout/     # Header, Sidebar, Layout
│   ├── common/          # Table, Card, Button
│   ├── ProtectedRoute.tsx
│   └── ConditionalRender.tsx
├── configs/             # Configurações da aplicação
├── constants/           # Constantes globais (sem roles!)
├── contexts/            # React Contexts
│   └── AuthContext.tsx  # Autenticação global
├── hooks/               # Custom hooks
│   └── usePermission.ts # Verificação de permissões
├── pages/               # Componentes de página
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   └── HomePage.tsx
├── routes/              # Configuração de roteamento
│   └── AppRoutes.tsx
├── schemas/             # Validações com Zod (se necessário)
├── services/            # Integração com API
│   └── api/
│       └── client.ts    # Cliente HTTP configurado
├── utils/               # Funções utilitárias
│   └── roleHelpers.ts   # Helpers para exibição de roles
├── App.tsx              # Componente raiz
└── main.tsx             # Entry point
```

## 🔐 Sistema de Permissões

### ⚠️ Princípio Fundamental

**Nunca valide permissões no frontend!** O backend é a fonte da verdade.

### Como Funciona

1. **Usuário faz login** → Backend retorna:
```typescript
{
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    roleName: string;        // Ex: "analista", "gerente", "admin"
    roleLevel: number;       // Ex: 30, 50, 99
    department?: { id, name };
    team?: { id, name };
  }
}
```

2. **Frontend armazena** o usuário no localStorage e no AuthContext

3. **Frontend usa** apenas para controlar o que **mostrar/esconder** na UI

### Usando o Hook `usePermission`

```typescript
import { usePermission } from '@/hooks/usePermission';

function MyComponent() {
  const { 
    getUserLevel,      // Retorna nível numérico do usuário
    getUserRole,       // Retorna nome do role
    canAccess,         // Verifica se pode acessar (level >= required)
    isAdmin,           // Helper: é admin?
    isManager,         // Helper: é gerente ou superior?
    isAnalyst,         // Helper: é analista ou superior?
  } = usePermission();

  // Usar para MOSTRAR/ESCONDER componentes
  if (getUserLevel() >= 50) {
    return <AdminPanel />;
  }

  return <UserView />;
}
```

### Componente `ConditionalRender`

Renderiza conteúdo condicionalmente baseado em permissões:

```typescript
<ConditionalRender requiredLevel={50}>
  <AdminOnlyButton />
</ConditionalRender>

<ConditionalRender isAdmin={true}>
  <DeleteButton />
</ConditionalRender>
```

### Proteção de Rotas

```typescript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredLevel={99}>
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

## 🎨 Tema e Cores

Arquivo: `src/assets/styles/themes/dark-theme.ts`

### Cores Semânticas

```typescript
semantic: {
  success: '#10b981',    // Verde
  error: '#ef4444',      // Vermelho
  warning: '#f59e0b',    // Âmbar
  info: '#3b82f6',       // Azul
  primary: '#0ea5e9',    // Cyan
  secondary: '#8b5cf6',  // Roxo
}
```

### Cores por Role (apenas exibição visual)

```typescript
roles: {
  auxiliar: '#06b6d4',      // Cyan
  assistente: '#3b82f6',    // Azul
  analista: '#8b5cf6',      // Roxo
  coordenador: '#f59e0b',   // Âmbar
  gerente: '#ef4444',       // Vermelho
  admin: '#ec4899',         // Rosa
}
```

## 🚦 Níveis de Acesso (Backend)

Conforme definido em `path-link-server/src/enums/role.enum.ts`:

```
Auxiliar:     10
Assistente:   20
Analista:     30
Coordenador:  40
Gerente:      50
Admin:        99
```

## 📦 Componentes Disponíveis

### `<Table>`
Tabela genérica e reutilizável com suporte a:
- Customização de colunas
- Rendering customizado de células
- Estados de carregamento e vazio
- Animações com Framer Motion

```typescript
<Table
  columns={[
    { key: 'name', label: 'Nome', width: '200px' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value) => <Badge>{value}</Badge>
    }
  ]}
  data={users}
  rowKey="id"
  loading={isLoading}
  onRowClick={(row) => navigate(`/users/${row.id}`)}
/>
```

### `<Card>`
Componente para exibir conteúdo em um contêiner estruturado

```typescript
<Card
  title="Título"
  subtitle="Subtítulo"
  variant="default|success|warning|error"
  hoverable
  onClick={() => {}}
>
  Conteúdo aqui
</Card>
```

### `<Button>`
Botão reutilizável com múltiplas variações

```typescript
<Button
  variant="primary|secondary|success|warning|error|ghost"
  size="sm|md|lg"
  fullWidth
  loading={isLoading}
  disabled={condition}
>
  Clique-me
</Button>
```

## 🔗 Integração com Backend

O cliente HTTP é configurado automaticamente:

```typescript
import apiClient from '@/services/api/client';

// Login
const { access_token, user } = await apiClient.login(email, password);

// Processos
const processes = await apiClient.getProcesses(userLevel);
const process = await apiClient.getProcess(id);
await apiClient.createProcess(data);

// Qualquer endpoint do backend
const data = await apiClient.request('get', '/custom-endpoint');
```

## 📝 Validações com Zod

Exemplo de schema de validação:

```typescript
import { z } from 'zod';

const processSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  category: z.string(),
  isActive: z.boolean().default(true),
});

type ProcessFormData = z.infer<typeof processSchema>;
```

## 🌐 CORS

O backend deve estar configurado para aceitar requisições do frontend.
Ajuste `path-link-server` conforme necessário.

## 🐛 Debugging

### Verificar Token
```typescript
const token = localStorage.getItem('access_token');
console.log('Token:', token);
```

### Verificar Usuário
```typescript
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('User:', user);
```

### Verificar Permissão
```typescript
const { getPermissionInfo } = usePermission();
console.log(getPermissionInfo());
```

## 📚 Recursos

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Stitches Documentation](https://stitches.dev)
- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [Framer Motion](https://www.framer.com/motion)
- [React Router](https://reactrouter.com)

## 📝 Licença

Propriedade da Equipe de TI

---

**Desenvolvido com ❤️ em React + Vite**

# path-link-client
