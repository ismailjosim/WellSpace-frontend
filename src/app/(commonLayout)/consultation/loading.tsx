import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ConsultationLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* AI Suggestion Box Skeleton */}
      <Card className="border p-6 rounded-2xl bg-muted/20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </Card>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-4 rounded-xl border bg-card">
        <Skeleton className="h-10 w-72 rounded-lg" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Doctor Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            className="rounded-2xl border border-border/70 overflow-hidden"
          >
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/40">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-28 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
