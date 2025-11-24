import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Calendar, MapPin, UserIcon, Eye } from "lucide-react"
import { Prisma } from "@/lib/prisma/client"

export type AdminServiceRequest = Prisma.ServiceRequestGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                name: true;
                email: true;
            };
        };
    };
}>;


const categoryLabels: Record<string, string> = {
  iluminacao: "Iluminação",
  pavimentacao: "Pavimentação",
  limpeza: "Limpeza",
  agua: "Água",
  esgoto: "Esgoto",
  outro: "Outro",
}

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  em_analise: "Em Análise",
  em_andamento: "Em Andamento",
  resolvido: "Resolvido",
  rejeitado: "Rejeitado",
}

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  em_analise: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  em_andamento: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  resolvido: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  rejeitado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const priorityColors: Record<string, string> = {
  baixa: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  media: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
  alta: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200",
  urgente: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
}

const priorityLabels: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
}

export function AdminRequestTable({ requests }: { requests: AdminServiceRequest[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                <div className="max-w-[200px]">
                  <p className="truncate">{request.title}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{request.location}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{categoryLabels[request.category]}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <UserIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="truncate max-w-[150px]">
                    {request.user?.name || request.user?.email || "Usuário"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[request.status]}>{statusLabels[request.status]}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={priorityColors[request.priority]}>{priorityLabels[request.priority]}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(request.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/requests/${request.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
