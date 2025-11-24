import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  try {
    const where: any = {}

    // Regular users can only see their own requests
    if (session.user.role !== "ADMIN") {
      where.userId = session.user.id
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    if (category) {
      where.category = category.toUpperCase()
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ]
    }

    const requests = await prisma.serviceRequest.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ data: requests })
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json({ error: "Erro ao buscar solicitações" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, category, location } = body

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 })
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        title,
        description,
        category: category.toUpperCase(),
        location,
        userId: session.user.id,
        status: "PENDING",
        priority: "MEDIUM",
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
    })

    return NextResponse.json({ data: serviceRequest }, { status: 201 })
  } catch (error) {
    console.error("Error creating request:", error)
    return NextResponse.json({ error: "Erro ao criar solicitação" }, { status: 500 })
  }
}
