import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { read } = body

    const notification = await prisma.notification.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        isRead: read,
      },
    })

    if (notification.count === 0) {
      return NextResponse.json({ error: "Notificação não encontrada" }, { status: 404 })
    }

    const updatedNotification = await prisma.notification.findUnique({
      where: { id },
      include: {
        request: {
          select: {
            title: true,
          },
        },
      },
    })

    return NextResponse.json({ data: updatedNotification })
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Erro ao atualizar notificação" }, { status: 500 })
  }
}
