import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const where: any = { id }

    // Regular users can only see their own requests
    if (session.user.role !== "ADMIN") {
      where.userId = session.user.id
    }

    const serviceRequest = await prisma.serviceRequest.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        responses: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!serviceRequest) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ data: serviceRequest })
  } catch (error) {
    console.error("Error fetching request:", error)
    return NextResponse.json({ error: "Erro ao buscar solicitação" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status, priority, title, description, category, location } = body

    // Build update object based on user role
    const updates: any = {}

    if (session.user.role === "ADMIN") {
      // Admins can update status and priority
      if (status) updates.status = status.toUpperCase()
      if (priority) updates.priority = priority.toUpperCase()
      if (title) updates.title = title
      if (description) updates.description = description
      if (category) updates.category = category.toUpperCase()
      if (location !== undefined) updates.location = location
    } else {
      // Users can only update their own request details if status is PENDING
      if (title) updates.title = title
      if (description) updates.description = description
      if (category) updates.category = category.toUpperCase()
      if (location !== undefined) updates.location = location
    }

    const where: any = { id }

    // Regular users can only update their own pending requests
    if (session.user.role !== "ADMIN") {
      where.userId = session.user.id
      where.status = "PENDING"
    }

    const serviceRequest = await prisma.serviceRequest.updateMany({
      where,
      data: updates,
    })

    if (serviceRequest.count === 0) {
      return NextResponse.json({ error: "Solicitação não encontrada ou não pode ser atualizada" }, { status: 404 })
    }

    // Fetch the updated request
    const updatedRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ data: updatedRequest })
  } catch (error) {
    console.error("Error updating request:", error)
    return NextResponse.json({ error: "Erro ao atualizar solicitação" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const where: any = { id }

    // Regular users can only delete their own pending requests
    if (session.user.role !== "ADMIN") {
      where.userId = session.user.id
      where.status = "PENDING"
    }

    const deletedRequest = await prisma.serviceRequest.deleteMany({
      where,
    })

    if (deletedRequest.count === 0) {
      return NextResponse.json({ error: "Solicitação não encontrada ou não pode ser excluída" }, { status: 404 })
    }

    return NextResponse.json({ message: "Solicitação excluída com sucesso" })
  } catch (error) {
    console.error("Error deleting request:", error)
    return NextResponse.json({ error: "Erro ao excluir solicitação" }, { status: 500 })
  }
}
