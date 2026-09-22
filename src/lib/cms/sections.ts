export type CmsFieldDef =
  | { kind: "text"; path: string; label: string; multiline?: boolean; placeholder?: string }
  | { kind: "object"; path: string; label: string; fields: CmsFieldDef[] }
  | { kind: "list"; path: string; label: string; itemLabel: string; fields: CmsFieldDef[] }

export interface CmsSectionDef {
  id: string
  label: string
  description: string
  fields: CmsFieldDef[]
}

const linkFields: CmsFieldDef[] = [
  { kind: "text", path: "label", label: "Label" },
  { kind: "text", path: "href", label: "Link URL", placeholder: "https://... or /path" },
]

const headingFields: CmsFieldDef[] = [
  { kind: "text", path: "heading", label: "Heading", placeholder: "Leave empty to hide" },
  { kind: "text", path: "subtext", label: "Subtext", multiline: true },
]

export const CMS_SECTIONS: CmsSectionDef[] = [
  {
    id: "branding",
    label: "Branding & SEO",
    description: "Site name shown in the navbar, footer, and browser tabs.",
    fields: [
      { kind: "text", path: "siteName", label: "Site Name" },
      { kind: "text", path: "tagline", label: "Tagline", multiline: true },
      { kind: "text", path: "metaTitle", label: "SEO Title" },
      { kind: "text", path: "metaDescription", label: "SEO Description", multiline: true },
      { kind: "text", path: "metaKeywords", label: "SEO Keywords", multiline: true },
    ],
  },
  {
    id: "nav",
    label: "Navigation",
    description: "Links shown in the top navigation bar (desktop & mobile).",
    fields: [
      {
        kind: "list",
        path: "links",
        label: "Navbar Links",
        itemLabel: "Link",
        fields: linkFields,
      },
    ],
  },
  {
    id: "hero",
    label: "Homepage Hero",
    description: "The first, large banner on the homepage.",
    fields: [
      { kind: "text", path: "badge", label: "Badge Text" },
      { kind: "text", path: "title", label: "Title" },
      {
        kind: "text",
        path: "highlight",
        label: "Highlighted Text (gradient)",
        placeholder: "Leave empty to show only the title",
      },
      { kind: "text", path: "subtitle", label: "Subtitle", multiline: true },
      {
        kind: "object",
        path: "primaryCta",
        label: "Primary Button",
        fields: linkFields,
      },
      {
        kind: "object",
        path: "secondaryCta",
        label: "Secondary Button",
        fields: linkFields,
      },
      {
        kind: "list",
        path: "stats",
        label: "Hero Stats",
        itemLabel: "Stat",
        fields: [
          { kind: "text", path: "value", label: "Value", placeholder: "10,000+" },
          { kind: "text", path: "label", label: "Label", placeholder: "students" },
        ],
      },
    ],
  },
  {
    id: "featured",
    label: "Featured Courses",
    description: "Heading above the latest published courses on the homepage.",
    fields: headingFields,
  },
  {
    id: "statistics",
    label: "Statistics Labels",
    description: "Labels under the live platform counters.",
    fields: [
      {
        kind: "object",
        path: "labels",
        label: "Stat Labels",
        fields: [
          { kind: "text", path: "students", label: "Students Label" },
          { kind: "text", path: "courses", label: "Courses Label" },
          { kind: "text", path: "teachers", label: "Teachers Label" },
          { kind: "text", path: "satisfaction", label: "Satisfaction Label" },
        ],
      },
    ],
  },
  {
    id: "topTeachers",
    label: "Top Teachers",
    description: "Heading above the featured teachers block.",
    fields: headingFields,
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    description: "Heading above the top-learners preview.",
    fields: headingFields,
  },
  {
    id: "achievements",
    label: "Student Achievements",
    description: "The four achievement cards on the homepage.",
    fields: [
      { kind: "text", path: "heading", label: "Heading", placeholder: "Leave empty to hide" },
      { kind: "text", path: "subtext", label: "Subtext", multiline: true },
      {
        kind: "list",
        path: "items",
        label: "Achievement Cards",
        itemLabel: "Card",
        fields: [
          { kind: "text", path: "title", label: "Title" },
          { kind: "text", path: "description", label: "Description", multiline: true },
        ],
      },
    ],
  },
  {
    id: "testimonials",
    label: "Testimonials",
    description: "Heading above the rotating student reviews.",
    fields: headingFields,
  },
  {
    id: "sponsors",
    label: "Sponsors",
    description: "Small caption above the sponsor logos.",
    fields: [{ kind: "text", path: "subtext", label: "Caption" }],
  },
  {
    id: "cta",
    label: "Call To Action",
    description: "The gradient banner near the bottom of the homepage.",
    fields: [
      { kind: "text", path: "heading", label: "Heading" },
      { kind: "text", path: "subtext", label: "Subtext", multiline: true },
      {
        kind: "object",
        path: "primaryCta",
        label: "Primary Button",
        fields: linkFields,
      },
      {
        kind: "object",
        path: "secondaryCta",
        label: "Secondary Button",
        fields: linkFields,
      },
    ],
  },
  {
    id: "about",
    label: "About Page",
    description: "Mission, values, and team content on /about.",
    fields: [
      {
        kind: "object",
        path: "hero",
        label: "Page Header",
        fields: [
          { kind: "text", path: "title", label: "Title" },
          { kind: "text", path: "subtitle", label: "Subtitle", multiline: true },
          { kind: "text", path: "paragraph", label: "Intro Paragraph", multiline: true },
        ],
      },
      {
        kind: "object",
        path: "mission",
        label: "Mission",
        fields: [
          { kind: "text", path: "heading", label: "Heading" },
          { kind: "text", path: "text", label: "Text", multiline: true },
        ],
      },
      {
        kind: "object",
        path: "values",
        label: "Values",
        fields: [
          ...headingFields,
          {
            kind: "list",
            path: "items",
            label: "Value Cards",
            itemLabel: "Value",
            fields: [
              { kind: "text", path: "title", label: "Title" },
              { kind: "text", path: "description", label: "Description", multiline: true },
            ],
          },
        ],
      },
      {
        kind: "object",
        path: "team",
        label: "Team",
        fields: [
          ...headingFields,
          {
            kind: "list",
            path: "items",
            label: "Team Members",
            itemLabel: "Member",
            fields: [
              { kind: "text", path: "name", label: "Name" },
              { kind: "text", path: "role", label: "Role" },
              { kind: "text", path: "bio", label: "Bio", multiline: true },
            ],
          },
        ],
      },
      {
        kind: "object",
        path: "cta",
        label: "Bottom CTA",
        fields: [
          { kind: "text", path: "heading", label: "Heading" },
          { kind: "text", path: "text", label: "Text", multiline: true },
          { kind: "text", path: "buttonLabel", label: "Button Label" },
          { kind: "text", path: "buttonHref", label: "Button Link" },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact Page",
    description: "Header, form text, and contact info cards on /contact.",
    fields: [
      {
        kind: "object",
        path: "hero",
        label: "Page Header",
        fields: [
          { kind: "text", path: "title", label: "Title" },
          { kind: "text", path: "subtext", label: "Subtext", multiline: true },
        ],
      },
      {
        kind: "object",
        path: "form",
        label: "Contact Form",
        fields: [
          { kind: "text", path: "heading", label: "Heading" },
          { kind: "text", path: "description", label: "Description", multiline: true },
          { kind: "text", path: "buttonLabel", label: "Button Label" },
          { kind: "text", path: "successHeading", label: "Success Heading" },
          { kind: "text", path: "successText", label: "Success Text", multiline: true },
        ],
      },
      {
        kind: "list",
        path: "info",
        label: "Contact Info Cards",
        itemLabel: "Card",
        fields: [
          { kind: "text", path: "heading", label: "Heading" },
          {
            kind: "list",
            path: "lines",
            label: "Lines",
            itemLabel: "Line",
            fields: [{ kind: "text", path: "$", label: "Line" }],
          },
        ],
      },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    description: "Tagline, link columns, socials, and copyright shown site-wide.",
    fields: [
      { kind: "text", path: "tagline", label: "Tagline", multiline: true },
      { kind: "text", path: "copyright", label: "Copyright Text" },
      {
        kind: "list",
        path: "columns",
        label: "Link Columns",
        itemLabel: "Column",
        fields: [
          { kind: "text", path: "heading", label: "Column Heading" },
          {
            kind: "list",
            path: "links",
            label: "Links",
            itemLabel: "Link",
            fields: linkFields,
          },
        ],
      },
      {
        kind: "list",
        path: "socials",
        label: "Social Links",
        itemLabel: "Social Link",
        fields: linkFields,
      },
    ],
  },
]