import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const where: any = {}

    // Regular users can only see stats for their own requests
    if (session.user.role !== "ADMIN") {
      where.userId = session.user.id
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      select: {
        id: true,
        status: true,
        category: true,
        priority: true,
      },
    })

    const stats = {
      total: requests.length,
      by_status: {
        PENDING: requests.filter((r) => r.status === "PENDING").length,
        IN_PROGRESS: requests.filter((r) => r.status === "IN_PROGRESS").length,
        RESOLVED: requests.filter((r) => r.status === "RESOLVED").length,
        REJECTED: requests.filter((r) => r.status === "REJECTED").length,
      },
      by_category: {
        ILUMINACAO: requests.filter((r) => r.category === "ILUMINACAO").length,
        PAVIMENTACAO: requests.filter((r) => r.category === "PAVIMENTACAO").length,
        COLETA_LIXO: requests.filter((r) => r.category === "COLETA_LIXO").length,
        LIMPEZA: requests.filter((r) => r.category === "LIMPEZA").length,
        SINALIZACAO: requests.filter((r) => r.category === "SINALIZACAO").length,
        TRANSPORTE: requests.filter((r) => r.category === "TRANSPORTE").length,
        OUTROS: requests.filter((r) => r.category === "OUTROS").length,
      },
      by_priority: {
        LOW: requests.filter((r) => r.priority === "LOW").length,
        MEDIUM: requests.filter((r) => r.priority === "MEDIUM").length,
        HIGH: requests.filter((r) => r.priority === "HIGH").length,
        URGENT: requests.filter((r) => r.priority === "URGENT").length,
      },
    }

    // If admin, also get user count
    if (session.user.role === "ADMIN") {
      const userCount = await prisma.user.count()
      return NextResponse.json({ stats: { ...stats, total_users: userCount } })
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}
