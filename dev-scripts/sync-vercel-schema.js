const { PrismaClient } = require('@prisma/client');

async function syncSchema() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Sincronizando schema do Vercel...');
    
    // Verificar se os campos existem
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'convites'
    `;
    
    console.log('📋 Campos existentes na tabela convites:', tableInfo.map(col => col.column_name));
    
    // Adicionar campo 'usado' se não existir
    try {
      await prisma.$executeRaw`
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name = 'convites' AND column_name = 'usado') THEN
                ALTER TABLE "convites" ADD COLUMN "usado" BOOLEAN NOT NULL DEFAULT false;
            END IF;
        END $$;
      `;
      console.log('✅ Campo "usado" adicionado/verificado');
    } catch (error) {
      console.log('⚠️ Campo "usado" já existe ou erro:', error.message);
    }
    
    // Adicionar campo 'maxMembers' se não existir
    try {
      await prisma.$executeRaw`
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name = 'convites' AND column_name = 'maxMembers') THEN
                ALTER TABLE "convites" ADD COLUMN "maxMembers" INTEGER;
            END IF;
        END $$;
      `;
      console.log('✅ Campo "maxMembers" adicionado/verificado');
    } catch (error) {
      console.log('⚠️ Campo "maxMembers" já existe ou erro:', error.message);
    }
    
    // Adicionar campo 'token' se não existir
    try {
      await prisma.$executeRaw`
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                           WHERE table_name = 'convites' AND column_name = 'token') THEN
                ALTER TABLE "convites" ADD COLUMN "token" TEXT;
                CREATE UNIQUE INDEX IF NOT EXISTS "convites_token_key" ON "convites"("token");
            END IF;
        END $$;
      `;
      console.log('✅ Campo "token" adicionado/verificado');
    } catch (error) {
      console.log('⚠️ Campo "token" já existe ou erro:', error.message);
    }
    
    console.log('🎉 Sincronização concluída!');
    
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncSchema();
