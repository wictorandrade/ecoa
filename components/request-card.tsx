import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, AlertCircle } from "lucide-react"
import Link from "next/link"
import { ServiceRequest } from "@/lib/prisma/client"

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

const priorityLabels: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
}

const priorityColors: Record<string, string> = {
  baixa: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  media: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
  alta: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200",
  urgente: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
}

export function RequestCard({ request }: { request: ServiceRequest }) {
  return (
    <Link href={`/dashboard/requests/${request.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg">{request.title}</CardTitle>
            <Badge className={statusColors[request.status]}>{statusLabels[request.status]}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{categoryLabels[request.category]}</Badge>
            <Badge className={priorityColors[request.priority]}>
              <AlertCircle className="mr-1 h-3 w-3" />
              {priorityLabels[request.priority]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{request.description}</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{request.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(request.createdAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
