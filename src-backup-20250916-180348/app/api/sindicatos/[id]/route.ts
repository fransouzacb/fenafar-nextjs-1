import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/sindicatos/[id] - Obter sindicato específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const sindicato = await prisma.sindicato.findUnique({
      where: { id },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        documentos: {
          select: {
            id: true,
            name: true,
            tipo: true,
            fileUrl: true,
            active: true,
            createdAt: true
          }
        }
      }
    })

    if (!sindicato) {
      return NextResponse.json(
        { success: false, error: "Sindicato não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      sindicato
    })

  } catch (error) {
    console.error("Erro ao obter sindicato:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT /api/sindicatos/[id] - Atualizar sindicato
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      nome,
      email,
      telefone,
      endereco,
      cidade,
      estado,
      cep,
      ativo
    } = body

    // Verificar se sindicato existe
    const existingSindicato = await prisma.sindicato.findUnique({
      where: { id }
    })

    if (!existingSindicato) {
      return NextResponse.json(
        { success: false, error: "Sindicato não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar sindicato
    const sindicato = await prisma.sindicato.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(email && { email }),
        ...(telefone !== undefined && { telefone }),
        ...(endereco !== undefined && { endereco }),
        ...(cidade && { cidade }),
        ...(estado && { estado }),
        ...(cep !== undefined && { cep }),
        ...(ativo !== undefined && { ativo })
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      sindicato,
      message: "Sindicato atualizado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar sindicato:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/sindicatos/[id] - Excluir sindicato
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar se sindicato existe
    const existingSindicato = await prisma.sindicato.findUnique({
      where: { id }
    })

    if (!existingSindicato) {
      return NextResponse.json(
        { success: false, error: "Sindicato não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se há documentos vinculados
    const documentosCount = await prisma.documento.count({
      where: { sindicatoId: id }
    })
    
    if (documentosCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Não é possível excluir sindicato com documentos associados" 
        },
        { status: 400 }
      )
    }

    // Excluir sindicato
    await prisma.sindicato.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Sindicato excluído com sucesso"
    })

  } catch (error) {
    console.error("Erro ao excluir sindicato:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
