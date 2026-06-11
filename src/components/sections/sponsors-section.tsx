import { sponsorNames } from "@/lib/mock-data"

export function SponsorsSection() {
  return (
    <section className="py-16 border-y bg-muted/30">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by leading companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {sponsorNames.map((name) => (
            <div
              key={name}
              className="flex h-10 items-center text-lg font-semibold text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
