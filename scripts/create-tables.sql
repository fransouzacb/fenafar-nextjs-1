-- Script SQL para criar tabelas no Supabase
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar enum para roles de usuário
CREATE TYPE "UserRole" AS ENUM ('FENAFAR_ADMIN', 'SINDICATO_ADMIN', 'MEMBER');

-- Criar enum para tipos de documento
CREATE TYPE "DocumentoTipo" AS ENUM ('ESTATUTO', 'ATA', 'RELATORIO', 'OUTRO');

-- Tabela de usuários
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sindicatos
CREATE TABLE "Sindicato" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL UNIQUE,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sindicato_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabela de membros
CREATE TABLE "Membro" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "sindicatoId" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Membro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membro_sindicatoId_fkey" FOREIGN KEY ("sindicatoId") REFERENCES "Sindicato"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membro_userId_sindicatoId_key" UNIQUE ("userId", "sindicatoId")
);

-- Tabela de documentos
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "tipo" "DocumentoTipo" NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sindicatoId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Documento_sindicatoId_fkey" FOREIGN KEY ("sindicatoId") REFERENCES "Sindicato"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabela de convites
CREATE TABLE "Convite" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "sindicatoId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Convite_sindicatoId_fkey" FOREIGN KEY ("sindicatoId") REFERENCES "Sindicato"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Convite_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Criar índices para performance
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "Sindicato_cnpj_idx" ON "Sindicato"("cnpj");
CREATE INDEX "Sindicato_adminId_idx" ON "Sindicato"("adminId");
CREATE INDEX "Membro_userId_idx" ON "Membro"("userId");
CREATE INDEX "Membro_sindicatoId_idx" ON "Membro"("sindicatoId");
CREATE INDEX "Documento_sindicatoId_idx" ON "Documento"("sindicatoId");
CREATE INDEX "Convite_email_idx" ON "Convite"("email");
CREATE INDEX "Convite_sindicatoId_idx" ON "Convite"("sindicatoId");

-- Comentários nas tabelas
COMMENT ON TABLE "User" IS 'Usuários do sistema FENAFAR';
COMMENT ON TABLE "Sindicato" IS 'Sindicatos filiados à FENAFAR';
COMMENT ON TABLE "Membro" IS 'Membros dos sindicatos';
COMMENT ON TABLE "Documento" IS 'Documentos dos sindicatos';
COMMENT ON TABLE "Convite" IS 'Convites para novos membros';

-- Comentários nas colunas importantes
COMMENT ON COLUMN "User"."role" IS 'Role do usuário: FENAFAR_ADMIN, SINDICATO_ADMIN, MEMBER';
COMMENT ON COLUMN "Sindicato"."adminId" IS 'ID do usuário administrador do sindicato';
COMMENT ON COLUMN "Membro"."registrationNumber" IS 'Número de registro do membro no sindicato';
COMMENT ON COLUMN "Documento"."tipo" IS 'Tipo do documento: ESTATUTO, ATA, RELATORIO, OUTRO';
COMMENT ON COLUMN "Convite"."expiresAt" IS 'Data de expiração do convite';
