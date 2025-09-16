# 🗄️ Schema do Banco de Dados

## Visão Geral

O banco de dados utiliza PostgreSQL via Supabase com Prisma ORM. O schema foi projetado para suportar a hierarquia FENAFAR > Sindicatos > Membros com controle de acesso baseado em roles.

## Entidades Principais

### 👤 User (Usuários)
Tabela principal de usuários, integrada com Supabase Auth.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      UserRole @default(MEMBER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relacionamentos
  membro    Membro?
  sindicato Sindicato? @relation("SindicatoAdmin")
  
  @@map("users")
}
```

**Campos:**
- `id`: Identificador único (CUID)
- `email`: Email único do usuário
- `name`: Nome completo (opcional)
- `role`: Papel do usuário no sistema
- `createdAt/updatedAt`: Timestamps automáticos

### 🏢 Sindicato (Sindicatos)
Representa os sindicatos filiados à FENAFAR.

```prisma
model Sindicato {
  id          String   @id @default(cuid())
  nome        String
  cnpj        String   @unique
  email       String
  telefone    String?
  endereco    String?
  cidade      String?
  estado      String?
  cep         String?
  ativo       Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relacionamentos
  adminId     String   @unique
  admin       User     @relation("SindicatoAdmin", fields: [adminId], references: [id])
  membros     Membro[]
  documentos  Documento[]
  
  @@map("sindicatos")
}
```

**Campos:**
- `nome`: Nome oficial do sindicato
- `cnpj`: CNPJ único (validação de formato)
- `email`: Email de contato principal
- `telefone`: Telefone de contato (opcional)
- `endereco`: Endereço completo (opcional)
- `cidade/estado/cep`: Dados de localização
- `ativo`: Status do sindicato no sistema

### 👥 Membro (Membros)
Membros dos sindicatos, vinculados a usuários.

```prisma
model Membro {
  id          String   @id @default(cuid())
  nome        String
  cpf         String   @unique
  email       String
  telefone    String?
  cargo       String?
  ativo       Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relacionamentos
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  sindicatoId String
  sindicato   Sindicato @relation(fields: [sindicatoId], references: [id])
  documentos  Documento[]
  
  @@map("membros")
}
```

**Campos:**
- `nome`: Nome completo do membro
- `cpf`: CPF único (validação de formato)
- `email`: Email pessoal
- `telefone`: Telefone pessoal (opcional)
- `cargo`: Cargo/função no sindicato (opcional)
- `ativo`: Status do membro no sistema

### 📄 Documento (Documentos)
Documentos do sistema (CCT, ACT, avatares, etc.).

```prisma
model Documento {
  id          String        @id @default(cuid())
  titulo      String
  tipo        DocumentoTipo
  arquivo     String        // URL do Supabase Storage
  tamanho     Int?
  mimeType    String?
  versao      String        @default("1.0")
  ativo       Boolean       @default(true)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  // Relacionamentos
  sindicatoId String
  sindicato   Sindicato @relation(fields: [sindicatoId], references: [id])
  membroId    String?
  membro      Membro?   @relation(fields: [membroId], references: [id])
  
  @@map("documentos")
}
```

**Campos:**
- `titulo`: Título descritivo do documento
- `tipo`: Tipo do documento (enum)
- `arquivo`: URL do arquivo no Supabase Storage
- `tamanho`: Tamanho em bytes (opcional)
- `mimeType`: Tipo MIME do arquivo (opcional)
- `versao`: Versão do documento (versionamento)
- `ativo`: Status do documento no sistema

### 📧 Convite (Convites)
Sistema de convites para novos sindicatos e administradores.

```prisma
model Convite {
  id          String   @id @default(cuid())
  email       String
  token       String   @unique
  role        UserRole @default(SINDICATO_ADMIN) // Só para sindicatos
  expiresAt   DateTime
  usado       Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relacionamentos
  sindicatoId String?
  sindicato   Sindicato? @relation(fields: [sindicatoId], references: [id])
  criadoPorId String
  criadoPor   User     @relation(fields: [criadoPorId], references: [id])
  
  @@map("convites")
}
```

## Enums

### UserRole
```prisma
enum UserRole {
  FENAFAR_ADMIN    // Administrador da FENAFAR
  SINDICATO_ADMIN  // Administrador do sindicato
  MEMBER           // Membro comum
}
```

### DocumentoTipo
```prisma
enum DocumentoTipo {
  CCT      // Convenção Coletiva de Trabalho
  ACT      // Acordo Coletivo de Trabalho
  AVATAR   // Foto de perfil
  OUTRO    // Outros documentos
}
```

## Relacionamentos

### Hierarquia
```
FENAFAR_ADMIN
    ↓
SINDICATO_ADMIN (por sindicato)
    ↓
MEMBER (por sindicato)
```

### Relacionamentos Principais
- **User ↔ Membro**: 1:1 (um usuário = um membro)
- **User ↔ Sindicato**: 1:1 (um admin = um sindicato)
- **Sindicato ↔ Membro**: 1:N (um sindicato = muitos membros)
- **Sindicato ↔ Documento**: 1:N (um sindicato = muitos documentos)
- **Membro ↔ Documento**: 1:N (um membro = muitos documentos)
- **FENAFAR_ADMIN ↔ Convite**: 1:N (admin cria convites para sindicatos)

## Índices e Constraints

### Índices Únicos
- `users.email` (único)
- `sindicatos.cnpj` (único)
- `membros.cpf` (único)
- `convites.token` (único)

### Índices de Performance
- `membros.sindicatoId` (busca por sindicato)
- `documentos.sindicatoId` (busca por sindicato)
- `documentos.membroId` (busca por membro)
- `convites.email` (busca por email)

## Políticas de Segurança (RLS)

### Row Level Security
- **Users**: Acesso apenas ao próprio registro
- **Sindicatos**: Admins veem apenas seu sindicato
- **Membros**: Admins veem membros do seu sindicato
- **Documentos**: Acesso baseado no sindicato
- **Convites**: Admins veem convites do seu sindicato

## Migrações

### Estratégia
1. **Desenvolvimento**: `prisma db push` (desenvolvimento)
2. **Produção**: `prisma migrate deploy` (produção)
3. **Versionamento**: Cada mudança = nova migração

### Backup
- **Automático**: Supabase backup diário
- **Manual**: Export via Prisma quando necessário
