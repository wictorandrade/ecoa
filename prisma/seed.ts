import { hash } from "bcryptjs"
import {prisma} from "../lib/prisma";


async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Criar usuário admin
  const adminPassword = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@ecoa.com" },
    update: {},
    create: {
      email: "admin@ecoa.com",
      name: "Administrador",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  console.log("✅ Admin criado:", admin.email)

  // Criar usuário normal
  const userPassword = await hash("user123", 12)
  const user = await prisma.user.upsert({
    where: { email: "usuario@ecoa.com" },
    update: {},
    create: {
      email: "usuario@ecoa.com",
      name: "João Silva",
      password: userPassword,
      role: "USER",
    },
  })

  console.log("✅ Usuário criado:", user.email)

  // Criar algumas solicitações de exemplo
  const requests = await prisma.serviceRequest.createMany({
    data: [
      {
        title: "Lâmpada queimada na Rua Principal",
        description: "A lâmpada do poste 123 está queimada há uma semana",
        category: "ILUMINACAO",
        status: "PENDING",
        priority: "MEDIUM",
        location: "Rua Principal, 123",
        userId: user.id,
      },
      {
        title: "Buraco na pista",
        description: "Grande buraco na Avenida Central causando risco aos motoristas",
        category: "PAVIMENTACAO",
        status: "IN_PROGRESS",
        priority: "HIGH",
        location: "Avenida Central, altura do 500",
        userId: user.id,
      },
      {
        title: "Lixo não coletado",
        description: "O lixo não foi coletado nos últimos 3 dias",
        category: "COLETA_LIXO",
        status: "RESOLVED",
        priority: "URGENT",
        location: "Rua das Flores, 45",
        userId: user.id,
      },
    ],
  })

  console.log(`✅ ${requests.count} solicitações criadas`)

  console.log("\n🎉 Seed concluído com sucesso!")
  console.log("\n📝 Credenciais de acesso:")
  console.log("Admin:")
  console.log("  Email: admin@ecoa.com")
  console.log("  Senha: admin123")
  console.log("\nUsuário:")
  console.log("  Email: usuario@ecoa.com")
  console.log("  Senha: user123")
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
