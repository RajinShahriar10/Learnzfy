import { Mail, MapPin, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getSiteContent } from "@/lib/cms/content"
import { ContactForm } from "./contact-form"

const infoIcons = [Mail, MapPin, MessageSquare]

export default async function ContactPage() {
  const content = await getSiteContent()
  const { contact } = content

  return (
    <div className="min-h-screen">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold tracking-tight">{contact.hero.title}</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">{contact.hero.subtext}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ContactForm content={contact.form} />
            </div>

            <div className="space-y-6">
              {contact.info.map((info, index) => {
                const Icon = infoIcons[index % infoIcons.length]
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{info.heading}</h3>
                          {info.lines.map((line, lineIndex) => (
                            <p key={lineIndex} className="text-sm text-muted-foreground">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}