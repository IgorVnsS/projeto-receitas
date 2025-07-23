// Nota de atualização: A aplicação está com erro na conexão com o MongoDB. Estou tentando corrigir.

## Iniciando

Primeiro, instale os módulos necessários:

```bash
npm install
```
Em seguida, inicie o cliente Prisma:

```bash
npx prisma generate
```
Agora, sincronize o schema Prisma com o banco MongoDB:
```
npx prisma db push
```

Abra [http://localhost:3000](http://localhost:3000) para ver a visualização web do site!

### Feito por Igor, TADS 5

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Resumo Completo do App SuperReceitas

## ️ **Arquitetura Geral**

O app é uma **aplicação Next.js 15** com **App Router** que combina diferentes estratégias de renderização para otimizar performance e experiência do usuário.

## **Estratégias de Renderização**

### **🖥️ Server-Side Rendering (SSR)**

```typescript
// Páginas que usam SSR (dados dinâmicos por usuário)
app/dashboard/page.tsx          // ✅ SSR - dados do usuário logado
app/favorites/page.tsx          // ✅ SSR - favoritos específicos do usuário  
app/recipes/[id]/page.tsx       // ✅ SSR - receita específica + dados do usuário
app/categories/[slug]/page.tsx  // ✅ SSR - receitas da categoria
```

**Por que SSR?**

- Dados dependem do usuário autenticado (`getSession()`)
- Conteúdo personalizado (favoritos, receitas do usuário)
- SEO + dados dinâmicos


### **🌐 Static Site Generation (SSG)**

```typescript
// Páginas que usam SSG (conteúdo estático)
app/page.tsx                    // ✅ SSG - homepage estática
app/login/page.tsx              // ✅ SSG - formulário de login
app/register/page.tsx           // ✅ SSG - formulário de registro
app/not-found.tsx               // ✅ SSG - página 404
```

**Por que SSG?**

- Conteúdo não muda por usuário
- Performance máxima (servido do CDN)
- Não precisa de dados do servidor


### **🔄 Client-Side Rendering (CSR)**

```typescript
// Componentes que usam CSR (interatividade)
components/Header.tsx           // ✅ CSR - estado de autenticação
components/FavoriteButton.tsx   // ✅ CSR - toggle de favoritos
components/RecipeForm.tsx       // ✅ CSR - formulários interativos
app/recipes/page.tsx            // ✅ CSR - filtros e busca
```

**Por que CSR?**

- Interações do usuário (cliques, formulários)
- Estados que mudam frequentemente
- Filtros e buscas em tempo real


## ️ **Banco de Dados & ORM**

### **MongoDB + Prisma ORM**

```typescript
// Schema do Prisma
prisma/schema.prisma
├── User (usuários)
├── Category (categorias)  
├── Recipe (receitas)
└── Favorite (favoritos)

// Cliente Prisma
lib/mongodb.ts
└── Conexão singleton com cache global
```

**Vantagens:**

- **Prisma**: Type-safety, auto-complete, migrações
- **MongoDB**: Flexibilidade, escalabilidade, JSON nativo
- **Cache**: Reutiliza conexões, evita overhead


## **Sistema de Autenticação**

### **JWT + Cookies**

```typescript
lib/auth.ts
├── hashPassword()     // Bcrypt para senhas
├── verifyPassword()   // Verificação segura
├── encrypt()          // JWT com HS256
├── decrypt()          // Decodificação JWT
├── createSession()    // Cookie httpOnly
├── getSession()       // Verificação de sessão
└── deleteSession()    // Logout
```

**Fluxo de Autenticação:**

1. **Login/Register** → Hash da senha → JWT → Cookie httpOnly
2. **Middleware** → Verifica JWT → Protege rotas
3. **getSession()** → Decodifica JWT → Dados do usuário


## ️ **Roteamento & Middleware**

### **App Router (Next.js 15)**

```plaintext
app/
├── page.tsx                    # Homepage (/)
├── login/page.tsx              # Login (/login)
├── register/page.tsx           # Registro (/register)
├── dashboard/page.tsx          # Dashboard (/dashboard)
├── recipes/
│   ├── page.tsx               # Lista (/recipes)
│   ├── [id]/page.tsx          # Receita (/recipes/123)
│   ├── create/page.tsx        # Criar (/recipes/create)
│   └── edit/[id]/page.tsx     # Editar (/recipes/edit/123)
├── categories/
│   ├── page.tsx               # Lista (/categories)
│   └── [slug]/page.tsx        # Categoria (/categories/doces)
├── favorites/page.tsx          # Favoritos (/favorites)
└── api/                       # API Routes
    ├── auth/
    ├── recipes/
    ├── categories/
    └── favorites/
```

### **Middleware de Proteção**

```typescript
middleware.ts
├── Rotas protegidas: ["/dashboard", "/recipes/create", "/favorites"]
├── Rotas de auth: ["/login", "/register"]
├── Verificação JWT automática
└── Redirecionamentos inteligentes
```

## **UI & Styling**

### **Design System**

```typescript
// Shadcn/UI + Tailwind CSS
components/ui/
├── button.tsx
├── card.tsx
├── input.tsx
├── badge.tsx
└── ...

// Componentes Customizados
components/
├── Header.tsx              # Navegação principal
├── RecipeCard.tsx          # Card de receita
├── RecipeForm.tsx          # Formulário de receita
├── FavoriteButton.tsx      # Botão de favoritar
├── BackButton.tsx          # Navegação voltar
└── CategoryFilter.tsx      # Filtros de categoria
```

**Características:**

- **Responsive**: Mobile-first design
- **Acessibilidade**: ARIA labels, semantic HTML
- **Consistência**: Design system unificado
- **Performance**: CSS otimizado, tree-shaking


## **API Routes**

### **RESTful API**

```typescript
app/api/
├── auth/
│   ├── login/route.ts         # POST /api/auth/login
│   ├── register/route.ts      # POST /api/auth/register
│   ├── logout/route.ts        # POST /api/auth/logout
│   └── me/route.ts           # GET /api/auth/me
├── recipes/
│   ├── route.ts              # GET/POST /api/recipes
│   └── [id]/route.ts         # GET/PUT/DELETE /api/recipes/[id]
├── categories/
│   ├── route.ts              # GET /api/categories
│   └── [id]/recipes/route.ts # GET /api/categories/[id]/recipes
└── favorites/
    ├── route.ts              # GET/POST/DELETE /api/favorites
    └── check/[recipeId]/route.ts # GET /api/favorites/check/[id]
```

## **Fluxo de Dados**

### **Exemplo: Criar Receita**

```mermaid
Usuário preenche formulárioRecipeForm.tsx - Estado localonSubmit - POST /api/recipesMiddleware verifica authPrisma salva no MongoDBRetorna receita criadaRedirect para receita
```

## **Performance & Otimizações**

### **Estratégias Implementadas**

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Componentes lazy-loaded
- **Database Connection**: Singleton pattern com cache
- **Static Assets**: CDN-ready
- **Bundle Optimization**: Tree-shaking automático


### **Caching Strategy**

```typescript
// Prisma Connection Cache
const globalForPrisma = globalThis as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Next.js Automatic Caching
// - Static pages cached indefinitely
// - API routes cached based on headers
// - Images optimized and cached
```

## **Segurança**

### **Medidas Implementadas**

- **Password Hashing**: Bcrypt com salt rounds
- **JWT Secure**: HttpOnly cookies, secure flags
- **Input Validation**: Prisma schema validation
- **CORS**: Next.js built-in protection
- **XSS Protection**: React automatic escaping
- **Route Protection**: Middleware authentication


## **Responsividade**

### **Breakpoints Tailwind**

```css
sm: 640px   /* Tablet portrait */
md: 768px   /* Tablet landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### **Layout Adaptativo**

- **Mobile**: Stack vertical, menu hamburger
- **Tablet**: Grid 2 colunas, navegação expandida
- **Desktop**: Grid 3 colunas, sidebar fixa


## **Deploy & Produção**

### **Vercel Deployment**

```json
// Configuração automática
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### **Environment Variables**

```shellscript
DATABASE_URL="mongodb+srv://..."
JWT_SECRET="super-secret-key"
NEXTAUTH_URL="https://app.vercel.app"
```

---

## **Resumo das Tecnologias**

| Tecnologia | Uso | Benefício
|-----|-----|-----
| **Next.js 15** | Framework React | SSR/SSG, App Router, Performance
| **Prisma ORM** | Database ORM | Type-safety, Migrations, Dev Experience
| **MongoDB** | Database | Flexibilidade, Escalabilidade, JSON
| **Tailwind CSS** | Styling | Utility-first, Responsive, Consistent
| **Shadcn/UI** | Components | Accessible, Customizable, Modern
| **JWT** | Authentication | Stateless, Secure, Scalable
| **TypeScript** | Language | Type Safety, Better DX, Fewer Bugs


O app combina o melhor de **performance** (SSG/SSR), **experiência do usuário** (CSR interativo), **segurança** (JWT + validação) e **escalabilidade** (MongoDB + Prisma) em uma arquitetura moderna e maintível!
