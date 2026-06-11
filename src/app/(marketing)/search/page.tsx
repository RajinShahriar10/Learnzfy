import { Suspense } from "react"
import { SearchResultsContent } from "./search-results-content"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Search - Learnzfy",
  description: "Search courses, teachers, lessons, and more on Learnzfy",
}

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchResultsContent />
      </Suspense>
    </div>
  )
}

function SearchPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-10 w-full max-w-xl mx-auto" />
      <div className="flex gap-8">
        <div className="hidden lg:block w-64 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex-1 space-y-6">
          <Skeleton className="h-6 w-48" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
