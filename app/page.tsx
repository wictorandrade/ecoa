import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, Bell, BarChart3, Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">ECOA</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Criar Conta</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center gap-8 px-4 py-12 md:py-24">
        <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Sistema de Solicitações de Serviços Urbanos
          </h2>
          <p className="text-balance text-lg text-muted-foreground sm:text-xl">
            Plataforma completa para gerenciar e acompanhar solicitações de
            serviços públicos com eficiência e transparência.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Acessar Sistema</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-12 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold">Funcionalidades</h3>
            <p className="mt-2 text-muted-foreground">
              Tudo que você precisa para gerenciar serviços urbanos
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Criar Solicitações</h4>
                <p className="text-sm text-muted-foreground">
                  Registre facilmente solicitações de serviços com descrição,
                  categoria e localização
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Notificações</h4>
                <p className="text-sm text-muted-foreground">
                  Receba notificações em tempo real sobre atualizações em suas
                  solicitações
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Visualize estatísticas e acompanhe o status de todas as suas
                  solicitações
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">Painel Admin</h4>
                <p className="text-sm text-muted-foreground">
                  Gerenciamento completo com controle de status, prioridades e
                  respostas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ECOA. Sistema de Solicitações de Serviços Urbanos.</p>
        </div>
      </footer>
    </div>
  );
}
