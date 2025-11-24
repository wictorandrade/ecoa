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
    // Verify user has access to this request
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!serviceRequest) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
    }

    // Check if user has permission to view responses
    if (session.user.role !== "ADMIN" && serviceRequest.userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    const responses = await prisma.requestResponse.findMany({
      where: { requestId: id },
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
        createdAt: "asc",
      },
    })

    return NextResponse.json({ data: responses })
  } catch (error) {
    console.error("Error fetching responses:", error)
    return NextResponse.json({ error: "Erro ao buscar respostas" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    // Only admins can add responses
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Apenas administradores podem responder" }, { status: 403 })
    }

    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: "Mensagem é obrigatória" }, { status: 400 })
    }

    // Verify request exists
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      select: { id: true, userId: true },
    })

    if (!serviceRequest) {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 })
    }

    // Create response and notification in a transaction
    const [response] = await prisma.$transaction([
      prisma.requestResponse.create({
        data: {
          requestId: id,
          userId: session.user.id,
          message,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.notification.create({
        data: {
          userId: serviceRequest.userId,
          requestId: id,
          title: "Nova resposta",
          message: `Um administrador respondeu sua solicitação: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`,
        },
      }),
    ])

    return NextResponse.json({ data: response }, { status: 201 })
  } catch (error) {
    console.error("Error creating response:", error)
    return NextResponse.json({ error: "Erro ao criar resposta" }, { status: 500 })
  }
}
