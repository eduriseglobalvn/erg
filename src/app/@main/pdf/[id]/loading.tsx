import { Skeleton } from '@/components/cms/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto py-6 px-4 space-y-4">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-4 w-48" />

      {/* Toolbar skeleton */}
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="w-px h-5 bg-border" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      {/* PDF area skeleton */}
      <div className="relative rounded-md border h-[calc(100vh-12rem)] min-h-[500px] bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="size-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
}
