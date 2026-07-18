import { prisma } from "@/lib/prisma"

export async function SponsorsSection() {
  const sponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  if (sponsors.length === 0) return null

  return (
    <section className="py-16 border-y bg-muted/30">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by leading companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex h-10 items-center text-lg font-semibold text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
            >
              {sponsor.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
