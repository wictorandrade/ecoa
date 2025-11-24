import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      request: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-muted/50">
      <DashboardHeader
        userEmail={session.user.email}
        userName={session.user.name || undefined}
        unreadCount={unreadCount}
      />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Notificações</h2>
            <p className="text-muted-foreground">
              Acompanhe as atualizações das suas solicitações
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={notification.isRead ? "opacity-60" : ""}
              >
                <CardContent className="flex items-start gap-4 p-6">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      notification.isRead ? "bg-muted" : "bg-primary/10"
                    }`}
                  >
                    {notification.isRead ? (
                      <Check className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Bell className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    {notification.request && (
                      <p className="text-xs text-muted-foreground">
                        Solicitação: {notification.request.title}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  {notification.requestId && (
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/dashboard/requests/${notification.requestId}`}
                      >
                        Ver Detalhes
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  Nenhuma notificação
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                  Você não tem notificações no momento
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
