import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

// GET /api/documentos/[id] - Obter documento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const documento = await prisma.documento.findUnique({
      where: { id },
      include: {
        sindicato: {
          select: {
            id: true,
            name: true,
            cnpj: true
          }
        }
      }
    })

    if (!documento) {
      return NextResponse.json(
        { success: false, error: "Documento não encontrado" },
        { status: 404 }
      )
    }

    // Gerar URL assinada para download
    const { data: signedUrl } = await supabase.storage
      .from(documento.tipo === "AVATAR" ? "avatars" : "documentos")
      .createSignedUrl(documento.fileUrl, 3600) // 1 hora

    return NextResponse.json({
      success: true,
      documento: {
        ...documento,
        downloadUrl: signedUrl?.signedUrl || documento.fileUrl
      }
    })

  } catch (error) {
    console.error("Erro ao obter documento:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT /api/documentos/[id] - Atualizar documento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      titulo,
      ativo
    } = body

    // Verificar se documento existe
    const existingDocumento = await prisma.documento.findUnique({
      where: { id }
    })

    if (!existingDocumento) {
      return NextResponse.json(
        { success: false, error: "Documento não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar documento
    const documento = await prisma.documento.update({
      where: { id },
      data: {
        ...(titulo && { titulo }),
        ...(ativo !== undefined && { ativo })
      },
      include: {
        sindicato: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      documento,
      message: "Documento atualizado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar documento:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/documentos/[id] - Excluir documento
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar se documento existe
    const existingDocumento = await prisma.documento.findUnique({
      where: { id }
    })

    if (!existingDocumento) {
      return NextResponse.json(
        { success: false, error: "Documento não encontrado" },
        { status: 404 }
      )
    }

    // Excluir arquivo do Supabase Storage
    try {
      const bucket = existingDocumento.tipo === "AVATAR" ? "avatars" : "documentos"
      await supabase.storage
        .from(bucket)
        .remove([existingDocumento.fileUrl])
    } catch (storageError) {
      console.error("Erro ao excluir arquivo do storage:", storageError)
      // Continuar mesmo se falhar no storage
    }

    // Excluir documento do banco
    await prisma.documento.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Documento excluído com sucesso"
    })

  } catch (error) {
    console.error("Erro ao excluir documento:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
