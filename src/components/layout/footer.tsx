import Link from "next/link"
import type { CmsBranding, CmsFooter } from "@/lib/cms/types"

interface FooterProps {
  branding: CmsBranding
  content: CmsFooter
}

export function Footer({ branding, content }: FooterProps) {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-lg font-bold text-primary">{branding.siteName}</span>
            <p className="text-sm text-muted-foreground">{content.tagline}</p>
          </div>
          {content.columns.map((column) => (
            <div key={column.heading} className="space-y-4">
              <h4 className="text-sm font-semibold">{column.heading}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Connect</h4>
            <ul className="space-y-2">
              {content.socials.map((social) => (
                <li key={social.href}>
                  <Link
                    href={social.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {social.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {content.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}