# 🚀 Instruções de Deploy

## Status de Build
✅ **Build Otimizado para Produção**
- Terser minification ativado
- Console.log removido em produção
- Code splitting implementado
- Size: 187.65 kB (gzip: 48.34 kB) para código principal

---

## 📦 Opção 1: Vercel (Recomendado - Mais Fácil)

**Vantagens:**
- Deploy automático a cada push
- Variáveis de ambiente fáceis de gerenciar
- Analytics integrado
- Grátis para projetos pequenos
- Muito rápido e confiável

### Passos:

1. **Criar conta em [vercel.com](https://vercel.com)**
   
2. **Conectar repositório GitHub:**
   ```bash
   git push origin main
   ```

3. **No dashboard do Vercel:**
   - Clicar em "New Project"
   - Selecionar repositório `ctcBh_Plataforma`
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Adicionar Environment Variables:**
   No projeto > Settings > Environment Variables:
   ```
   VITE_SUPABASE_URL=https://ggkvscayvkslccsngacb.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_EasZWqsA3zvi2cbETVa1uQ_p74uXVoI
   VITE_API_URL=https://ggkvscayvkslccsngacb.supabase.co
   ```

5. **Deploy automático! 🎉**
   - Vercel fará build automático a cada push
   - URL: `https://seu-projeto.vercel.app`

---

## 📦 Opção 2: Netlify

**Vantagens:**
- Deploy via Git ou CLI
- Suporta Functions (para serverless)
- Analytics
- Grátis

### Passos:

1. **Criar conta em [netlify.com](https://netlify.com)**

2. **Conectar Git:**
   - New site from Git
   - Selecionar GitHub
   - Escolher repositório
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Adicionar Environment Variables:**
   Site settings > Build & deploy > Environment:
   ```
   VITE_SUPABASE_URL=https://ggkvscayvkslccsngacb.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_EasZWqsA3zvi2cbETVa1uQ_p74uXVoI
   VITE_API_URL=https://ggkvscayvkslccsngacb.supabase.co
   ```

4. **Deploy via CLI (alternativa):**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

---

## 📦 Opção 3: AWS Amplify

**Vantagens:**
- Integração com serviços AWS
- Deploy automático via Git
- CI/CD avançado
- Monitoramento integrado

### Passos:

1. **Criar conta em AWS**

2. **No AWS Amplify:**
   - Create app > Host web app
   - Conectar GitHub
   - Selecionar repositório
   - Build settings:
     ```
     frontend:
       build:
         commands:
           - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
     ```

3. **Adicionar variáveis de ambiente:**
   - Environment variables (mesmo padrão acima)

---

## 📦 Opção 4: Docker + VPS Manual

**Para máximo controle (ex: DigitalOcean, Linode, AWS EC2)**

### Dockerfile:
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
ENV PORT=3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Build e Deploy:
```bash
# Build imagem Docker
docker build -t ctcbh-plataforma .

# Rodar localmente
docker run -p 3000:3000 -e VITE_SUPABASE_URL=... ctcbh-plataforma

# Push para registry (Docker Hub, ECR, etc)
docker tag ctcbh-plataforma seu-usuario/ctcbh-plataforma
docker push seu-usuario/ctcbh-plataforma
```

### Deploy no DigitalOcean App Platform:
1. Conectar repositório GitHub
2. Auto-detect Dockerfile
3. Deploy automático

---

## 🔐 Segurança - Checklist Pré-Deploy

- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ .env e .env.local em .gitignore
- [ ] ✅ Credentials nunca são commitadas
- [ ] ✅ RLS policies ativadas no Supabase
- [ ] ✅ CORS configurado (se necessário)
- [ ] ✅ Supabase auth configurado para produção
- [ ] ✅ Backup automático do banco (Supabase faz isso)

---

## 🌐 Configurar Domínio Customizado

### Vercel:
Settings > Domains > Add Domain
- Apontar DNS para Vercel
- SSL automático

### Netlify:
Domain management > Custom domain
- Instruções de DNS fornecidas

### AWS Amplify:
Domain management > Add custom domain

---

## 📊 Monitoramento Pós-Deploy

### Checklist:
1. **Testes básicos:**
   ```bash
   # Login
   # CRUD em cada módulo
   # Exportação de PDFs
   # Filtros e buscas
   ```

2. **Performance:**
   - Executar Lighthouse (Chrome DevTools)
   - Verificar tempo de carregamento
   - Monitorar bundle size

3. **Erros:**
   - Adicionar Sentry ou LogRocket para tracking
   - Monitorar console errors

4. **Database:**
   - Verificar logs do Supabase
   - Confirmar RLS policies funcionando
   - Backup configurado

---

## 🔄 CI/CD com GitHub Actions (Automático)

Criar `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📝 Resumo Recomendado

| Critério | Melhor Opção |
|----------|-------------|
| **Facilidade** | ⭐ Vercel |
| **Custo** | ⭐ Netlify |
| **Performance** | ⭐ Vercel |
| **Controle** | ⭐ Docker/VPS |
| **Escalabilidade** | ⭐ AWS Amplify |
| **Para Começar** | ⭐ **Vercel** |

---

## 🎯 Próximos Passos Após Deploy

1. **Monitoramento:**
   - [ ] Configurar Sentry para erro tracking
   - [ ] Adicionar Google Analytics
   - [ ] Verificar performance regularmente

2. **Manutenção:**
   - [ ] Update periódico de dependências
   - [ ] Review de RLS policies
   - [ ] Backup do banco de dados

3. **Features:**
   - [ ] Implementar lazy loading
   - [ ] Adicionar notificações push
   - [ ] Melhorar performance de PDFs

---

**Última atualização:** 4 de Janeiro de 2026  
**Status:** ✅ Pronto para Deploy
