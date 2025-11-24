import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin-header";
import { UpdateRequestForm } from "@/components/update-request-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  AlertCircle,
  MessageSquare,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const categoryLabels: Record<string, string> = {
  ILUMINACAO: "Iluminação",
  PAVIMENTACAO: "Pavimentação",
  COLETA_LIXO: "Coleta de Lixo",
  LIMPEZA: "Limpeza",
  SINALIZACAO: "Sinalização",
  TRANSPORTE: "Transporte",
  OUTROS: "Outros",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em Andamento",
  RESOLVED: "Resolvido",
  REJECTED: "Rejeitado",
};

const statusColors: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const priorityLabels: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  MEDIUM: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
  HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200",
  URGENT: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
};

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id },
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
          createdAt: "asc",
        },
      },
    },
  });

  if (!request) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <AdminHeader
        userEmail={session.user.email}
        userName={session.user.name || undefined}
      />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-2xl">{request.title}</CardTitle>
                  <Badge className={statusColors[request.status]}>
                    {statusLabels[request.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Descrição</h3>
                  <p className="text-muted-foreground">{request.description}</p>
                </div>
                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Localização</p>
                      <p className="text-sm text-muted-foreground">
                        {request.location || "Não especificado"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Data de Criação</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <UserIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Solicitante</p>
                      <p className="text-sm text-muted-foreground">
                        {request.user.name || "Sem nome"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {request.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {request.responses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Histórico de Respostas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.responses.map((response) => (
                    <div
                      key={response.id}
                      className="rounded-lg border bg-muted/50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {response.user.name || "Administrador"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(response.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {response.message}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detalhes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Categoria</p>
                  <Badge variant="outline" className="mt-1">
                    {categoryLabels[request.category]}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium">Prioridade</p>
                  <Badge className={`mt-1 ${priorityColors[request.priority]}`}>
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {priorityLabels[request.priority]}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium">Última Atualização</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(request.updatedAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <UpdateRequestForm
              requestId={id}
              currentStatus={request.status}
              currentPriority={request.priority}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
