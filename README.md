# ECOA - Sistema de Solicitações de Serviços Urbanos

Sistema completo para gerenciar solicitações de serviços públicos urbanos com autenticação, painel de usuário e administração.

## Tecnologias

- **Next.js 16** - Framework React com App Router
- **Prisma** - ORM para banco de dados
- **NextAuth.js** - Autenticação completa
- **Neon** - Banco de dados PostgreSQL serverless
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes de UI
- **TypeScript** - Type safety

## Funcionalidades

### Para Usuários
- Cadastro e login com email/senha
- Dashboard com estatísticas pessoais
- Criar solicitações de serviços urbanos
- Acompanhar status das solicitações
- Visualizar respostas dos administradores
- Sistema de notificações

### Para Administradores
- Painel administrativo completo
- Visualizar todas as solicitações
- Atualizar status e prioridade
- Responder solicitações
- Filtrar e buscar solicitações
- Estatísticas gerais do sistema

## Setup

### 1. Instalar dependências

\`\`\`bash
npm install
\`\`\`

### 2. Configurar banco de dados

O projeto já está configurado com Neon. Execute as migrações:

\`\`\`bash
npx prisma db push
\`\`\`

### 3. (Opcional) Popular banco com dados de exemplo

\`\`\`bash
npm run db:seed
\`\`\`

### 4. Executar em desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

Acesse: http://localhost:3000

## Estrutura do Banco de Dados

### Tabelas

- **users** - Usuários do sistema (USER ou ADMIN)
- **service_requests** - Solicitações de serviços
- **request_responses** - Respostas dos admins às solicitações
- **notifications** - Notificações para usuários

### Categorias de Solicitações

- Iluminação Pública (ILUMINACAO)
- Pavimentação (PAVIMENTACAO)
- Coleta de Lixo (COLETA_LIXO)
- Limpeza (LIMPEZA)
- Sinalização (SINALIZACAO)
- Transporte (TRANSPORTE)
- Outros (OUTROS)

### Status das Solicitações

- PENDING - Aguardando análise
- IN_PROGRESS - Em andamento
- RESOLVED - Resolvida
- REJECTED - Rejeitada

### Prioridades

- LOW - Baixa
- MEDIUM - Média
- HIGH - Alta
- URGENT - Urgente

## Criar Usuário Admin

Para criar um usuário administrador, você pode:

1. Registrar-se normalmente no sistema
2. Atualizar o role no banco de dados:

\`\`\`sql
UPDATE users SET role = 'ADMIN' WHERE email = 'seu@email.com';
\`\`\`

Ou usar o Prisma Studio:

\`\`\`bash
npx prisma studio
\`\`\`

Ou usar os dados de seed:

\`\`\`bash
npm run db:seed
\`\`\`

Credenciais do admin após seed:
- Email: admin@ecoa.com
- Senha: admin123

## Variáveis de Ambiente

O projeto usa as seguintes variáveis de ambiente (já configuradas via integração Neon):

- `NEON_DATABASE_URL` - URL de conexão do banco Neon
- `NEXTAUTH_SECRET` - Secret para NextAuth (gerado automaticamente)
- `NEXTAUTH_URL` - URL da aplicação (http://localhost:3000 em dev)

## Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Executa versão de produção
- `npm run db:push` - Sincroniza schema Prisma com banco
- `npm run db:seed` - Popula banco com dados de exemplo
- `npm run db:studio` - Abre interface visual do Prisma Studio

## API Routes

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/[...nextauth]` - Login/Logout (NextAuth)

### Solicitações
- `GET /api/requests` - Listar solicitações
- `POST /api/requests` - Criar solicitação
- `GET /api/requests/[id]` - Detalhes da solicitação
- `PATCH /api/requests/[id]` - Atualizar solicitação
- `DELETE /api/requests/[id]` - Excluir solicitação

### Respostas
- `GET /api/requests/[id]/responses` - Listar respostas
- `POST /api/requests/[id]/responses` - Criar resposta (admin)

### Notificações
- `GET /api/notifications` - Listar notificações
- `PATCH /api/notifications/[id]` - Marcar como lida

### Estatísticas
- `GET /api/stats` - Obter estatísticas

## Deploy

O projeto está pronto para deploy na Vercel:

1. Conecte seu repositório na Vercel
2. As variáveis de ambiente do Neon serão automaticamente configuradas
3. Adicione `NEXTAUTH_SECRET` nas variáveis de ambiente:
   \`\`\`bash
   openssl rand -base64 32
   \`\`\`
4. Deploy!

## Segurança

- Senhas são hasheadas com bcrypt
- Autenticação via JWT com NextAuth
- Middleware protege rotas privadas
- Validação de roles para ações administrativas
- Queries Prisma com filtros por usuário

## Licença

MIT
