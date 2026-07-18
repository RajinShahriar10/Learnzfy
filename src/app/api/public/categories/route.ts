import { prisma } from "@/lib/prisma"
import { ok } from "@/lib/api-helpers"

export async function GET() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  })
  return ok(categories)
}
