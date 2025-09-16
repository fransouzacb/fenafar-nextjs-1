# 🌱 Sistema de Seeds e Dados de Teste

## Visão Geral

Este documento descreve o sistema de seeds implementado para o Sistema FENAFAR, permitindo testes com dados reais e consistentes.

## 🗄️ Estrutura do Banco

### Tabelas Criadas
- **User**: Usuários do sistema
- **Sindicato**: Sindicatos filiados à FENAFAR
- **Membro**: Membros dos sindicatos
- **Documento**: Documentos dos sindicatos
- **Convite**: Convites para novos membros

### Relacionamentos
- Um usuário pode ser admin de múltiplos sindicatos
- Um usuário pode ser membro de múltiplos sindicatos
- Cada sindicato tem um admin principal
- Documentos pertencem a um sindicato
- Convites são criados por admins para novos membros

## 🔑 Credenciais de Teste

### Administrador FENAFAR
- **Email**: `admin@fenafar.com.br`
- **Senha**: `admin123`
- **Role**: `FENAFAR_ADMIN`
- **Acesso**: Dashboard administrativo completo

### Administradores de Sindicato

#### Sindicato 1 - São Paulo
- **Email**: `sindicato1@teste.com`
- **Senha**: `sindicato123`
- **Role**: `SINDICATO_ADMIN`
- **Sindicato**: Sindicato dos Farmacêuticos de São Paulo

#### Sindicato 2 - Rio de Janeiro
- **Email**: `sindicato2@teste.com`
- **Senha**: `sindicato123`
- **Role**: `SINDICATO_ADMIN`
- **Sindicato**: Sindicato dos Farmacêuticos do Rio de Janeiro

### Membros

#### Membro 1
- **Email**: `membro1@teste.com`
- **Senha**: `membro123`
- **Role**: `MEMBER`
- **Sindicato**: São Paulo

#### Membro 2
- **Email**: `membro2@teste.com`
- **Senha**: `membro123`
- **Role**: `MEMBER`
- **Sindicato**: Rio de Janeiro

## 📊 Dados de Teste Criados

### Usuários (5)
- 1 Administrador FENAFAR
- 2 Administradores de Sindicato
- 2 Membros

### Sindicatos (2)
- Sindicato dos Farmacêuticos de São Paulo
- Sindicato dos Farmacêuticos do Rio de Janeiro

### Membros (2)
- Carlos Oliveira (São Paulo)
- Ana Costa (Rio de Janeiro)

### Documentos (6)
- Estatuto do Sindicato (2)
- Ata de Assembleia Geral (2)
- Relatório Financeiro 2024 (2)

### Convites (3)
- convidado1@teste.com
- convidado2@teste.com
- convidado3@teste.com

## 🛠️ Scripts Disponíveis

### Comandos NPM
```bash
# Teste de conexão e criação de tabelas
npm run db:test

# Execução dos seeds
npm run db:seed

# Setup completo (tabelas + seeds)
npm run db:reset

# Interface visual do Prisma
npm run db:studio

# Migrations do Prisma
npm run db:migrate

# Gerar cliente Prisma
npm run db:generate
```

### Scripts Individuais
```bash
# Teste de conexão
tsx scripts/test-connection.ts

# Execução dos seeds
tsx scripts/seed.ts

# Setup do banco
tsx scripts/setup-database.ts
```

## 🔄 Fluxo de Execução

### 1. Setup Inicial
```bash
npm run db:test
```
- Verifica conexão com Supabase
- Cria tabelas se não existirem
- Cria enums necessários

### 2. Seeds
```bash
npm run db:seed
```
- Limpa dados existentes
- Cria usuários no Supabase Auth
- Cria registros no banco de dados
- Associa usuários aos sindicatos

### 3. Validação
```bash
npm run db:studio
```
- Abre interface visual do Prisma
- Permite visualizar dados criados
- Facilita debug e validação

## 🧪 Cenários de Teste

### Autenticação
1. **Login Admin FENAFAR**: Redireciona para `/admin`
2. **Login Admin Sindicato**: Redireciona para `/sindicato`
3. **Login Membro**: Redireciona para `/sindicato`
4. **Email não confirmado**: Redireciona para `/primeiro-login`

### Autorização
1. **Admin FENAFAR**: Acesso total ao sistema
2. **Admin Sindicato**: Acesso apenas ao seu sindicato
3. **Membro**: Acesso limitado ao seu sindicato

### Dados Relacionais
1. **Sindicatos**: Têm admin associado
2. **Membros**: Associados a sindicatos específicos
3. **Documentos**: Pertencem a sindicatos
4. **Convites**: Criados por admins para sindicatos

## 🔧 Personalização

### Adicionar Novos Usuários
Edite o array `testUsers` em `scripts/seed.ts`:

```typescript
const testUsers = [
  // ... usuários existentes
  {
    email: 'novo@teste.com',
    password: 'senha123',
    role: 'MEMBER' as UserRole,
    name: 'Novo Usuário',
    phone: '(11) 99999-9999'
  }
]
```

### Adicionar Novos Sindicatos
Edite o array `testSindicatos` em `scripts/seed.ts`:

```typescript
const testSindicatos = [
  // ... sindicatos existentes
  {
    name: 'Novo Sindicato',
    cnpj: '11.222.333/0001-44',
    // ... outros campos
  }
]
```

### Adicionar Novos Documentos
Edite o array `testDocumentos` em `scripts/seed.ts`:

```typescript
const testDocumentos = [
  // ... documentos existentes
  {
    name: 'Novo Documento',
    tipo: 'OUTRO' as DocumentoTipo,
    description: 'Descrição do documento',
    fileUrl: 'https://example.com/documento.pdf',
    fileSize: 1024000,
    mimeType: 'application/pdf'
  }
]
```

## 🚨 Importante

### ⚠️ Cuidados
- **Nunca execute seeds em produção** sem revisão
- **Sempre faça backup** antes de limpar dados
- **Verifique as credenciais** antes de compartilhar

### 🔒 Segurança
- Senhas de teste são simples para facilitar testes
- Em produção, use senhas complexas
- Considere usar variáveis de ambiente para credenciais

### 📝 Logs
- Todos os scripts geram logs detalhados
- Verifique a saída para identificar erros
- Use `console.log` para debug adicional

## 🎯 Próximos Passos

1. **Testar autenticação** com as credenciais criadas
2. **Validar redirecionamentos** baseados em roles
3. **Implementar CRUDs** usando dados reais
4. **Criar novos seeds** conforme necessário
5. **Documentar novos cenários** de teste

---

**Última atualização**: $(date)
**Versão**: 1.0.0
