import { prisma } from "@/lib/prisma"
import { ok } from "@/lib/api-helpers"

export async function GET() {
  const sponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
    select: { id: true, name: true, logoUrl: true, websiteUrl: true },
    orderBy: { name: "asc" },
  })
  return ok(sponsors)
}
