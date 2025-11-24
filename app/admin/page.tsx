import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin-header";
import { AdminRequestTable } from "@/components/admin-request-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
} from "lucide-react";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Build query based on filters
  const where: any = {};

  if (params.status && params.status !== "all") {
    where.status = params.status.toUpperCase();
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { location: { contains: params.search, mode: "insensitive" } },
    ];
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allRequests = await prisma.serviceRequest.findMany({
    select: {
      id: true,
      status: true,
    },
  });

  const stats = {
    total: allRequests.length,
    pending: allRequests.filter((r) => r.status === "PENDING").length,
    inProgress: allRequests.filter((r) => r.status === "IN_PROGRESS").length,
    resolved: allRequests.filter((r) => r.status === "RESOLVED").length,
  };

  const usersCount = await prisma.user.count();

  return (
    <div className="min-h-screen bg-muted/50">
      <AdminHeader
        userEmail={session.user.email}
        userName={session.user.name || undefined}
      />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Painel Administrativo</h2>
          <p className="text-muted-foreground">
            Gerencie todas as solicitações de serviços do sistema
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Solicitações</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Aguardando</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Em Progresso
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Processando</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Concluídas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount}</div>
              <p className="text-xs text-muted-foreground">Registrados</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Solicitações</CardTitle>
              <div className="w-full md:w-72">
                <form action="/admin" method="get">
                  <Input
                    name="search"
                    placeholder="Buscar solicitações..."
                    defaultValue={params.search}
                  />
                </form>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={params.status || "all"}>
              <TabsList className="mb-4">
                <TabsTrigger value="all" asChild>
                  <a href="/admin?status=all">Todas</a>
                </TabsTrigger>
                <TabsTrigger value="pending" asChild>
                  <a href="/admin?status=pending">Pendentes</a>
                </TabsTrigger>
                <TabsTrigger value="in_progress" asChild>
                  <a href="/admin?status=in_progress">Em Andamento</a>
                </TabsTrigger>
                <TabsTrigger value="resolved" asChild>
                  <a href="/admin?status=resolved">Resolvidas</a>
                </TabsTrigger>
              </TabsList>
              <TabsContent value={params.status || "all"}>
                {requests.length > 0 ? (
                  <AdminRequestTable requests={requests} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">
                      Nenhuma solicitação encontrada
                    </h3>
                    <p className="text-center text-sm text-muted-foreground">
                      Não há solicitações que correspondam aos filtros atuais
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
