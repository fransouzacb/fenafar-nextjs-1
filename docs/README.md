# 📚 Documentação do Sistema FENAFAR

## 🚀 [Diretrizes de Desenvolvimento](./DEVELOPMENT_GUIDELINES.md)

**⚠️ IMPORTANTE**: Leia as [Diretrizes de Desenvolvimento](./DEVELOPMENT_GUIDELINES.md) antes de começar a desenvolver. Elas definem os padrões e práticas obrigatórias do projeto.

## 📋 Visão Geral

Sistema de gestão para sindicatos e membros da FENAFAR (Federação Nacional dos Farmacêuticos), desenvolvido com tecnologias modernas e arquitetura escalável.

## 🗂️ Estrutura da Documentação

### 📖 [Especificações Técnicas](./specs/)
- [Stack Tecnológica](./specs/tech-stack.md)
- [Arquitetura do Sistema](./specs/architecture.md)
- [Schema do Banco de Dados](./specs/database-schema.md)
- [Sistema de Autenticação](./specs/authentication.md)
- [Sistema de Uploads](./specs/upload-system.md)
- [Sistema de Convites](./specs/invitation-system.md)

### 🗺️ [Roadmap de Desenvolvimento](./roadmap/)
- [Cronograma Detalhado](./roadmap/timeline.md)
- [Fases de Desenvolvimento](./roadmap/phases.md)
- [Critérios de Aceitação](./roadmap/acceptance-criteria.md)

### 🏗️ [Arquitetura](./architecture/)
- [Estrutura de Pastas](./architecture/folder-structure.md)
- [Fluxo de Dados](./architecture/data-flow.md)
- [Padrões de Código](./architecture/coding-patterns.md)

### 🔌 [API](./api/)
- [Endpoints de Autenticação](./api/auth-endpoints.md)
- [Endpoints de Sindicatos](./api/sindicatos-endpoints.md)
- [Endpoints de Membros](./api/membros-endpoints.md)
- [Endpoints de Documentos](./api/documentos-endpoints.md)
- [Endpoints de Convites](./api/convites-endpoints.md)

## 🎯 Objetivos do Sistema

1. **Gestão de Sindicatos**: Cadastro e administração de sindicatos filiados
2. **Gestão de Membros**: Controle de membros por sindicato
3. **Gestão de Documentos**: Upload e versionamento de documentos (CCT, ACT, etc.)
4. **Sistema de Convites**: Convites para novos membros
5. **Dashboard Administrativo**: Visão geral e relatórios

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS v4, Chadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## 📞 Contato

Para dúvidas sobre a documentação ou desenvolvimento, consulte os arquivos específicos em cada seção.
