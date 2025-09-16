import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/membros/[id] - Obter membro específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const membro = await prisma.user.findUnique({
      where: { 
        id,
        role: "MEMBER"
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

    if (!membro) {
      return NextResponse.json(
        { success: false, error: "Membro não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      membro
    })

  } catch (error) {
    console.error("Erro ao obter membro:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT /api/membros/[id] - Atualizar membro
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      nome,
      telefone,
      cargo,
      ativo
    } = body

    // Verificar se membro existe
    const existingMembro = await prisma.user.findUnique({
      where: { 
        id,
        role: "MEMBER"
      }
    })

    if (!existingMembro) {
      return NextResponse.json(
        { success: false, error: "Membro não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar membro
    const membro = await prisma.user.update({
      where: { id },
      data: {
        ...(nome && { name: nome }),
        ...(telefone !== undefined && { telefone }),
        ...(cargo !== undefined && { cargo }),
        ...(ativo !== undefined && { ativo })
      },
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

    return NextResponse.json({
      success: true,
      membro,
      message: "Membro atualizado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar membro:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/membros/[id] - Excluir membro
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar se membro existe
    const existingMembro = await prisma.user.findUnique({
      where: { 
        id,
        role: "MEMBER"
      }
    })

    if (!existingMembro) {
      return NextResponse.json(
        { success: false, error: "Membro não encontrado" },
        { status: 404 }
      )
    }

    // Excluir membro
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Membro excluído com sucesso"
    })

  } catch (error) {
    console.error("Erro ao excluir membro:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
