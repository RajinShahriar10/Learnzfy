import type { Role } from "@/config/routes"

export type { Role }

export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: string
  label?: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export interface UserProfile {
  id: string
  name: string | null
  email: string
  role: Role
  image: string | null
  bio: string | null
}
