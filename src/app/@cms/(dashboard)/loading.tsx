import { Skeleton } from "@/components/cms/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cms/ui/card"

export default function DashboardLoading() {
    return (
        <div className="flex flex-1 flex-col gap-6 space-y-2 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-8 w-[200px]" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-[120px]" />
                    <Skeleton className="h-10 w-[70px]" />
                </div>
            </div>

            {/* Hàng 1: Stats Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px] mb-1" />
                            <Skeleton className="h-3 w-[140px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Hàng 2: Visitors Chart Skeleton */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-[150px] mb-2" />
                        <Skeleton className="h-4 w-[200px]" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    </CardContent>
                </Card>
            </div>

            {/* Hàng 3: 3 Charts Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-[120px] mb-2" />
                            <Skeleton className="h-4 w-[180px]" />
                        </CardHeader>
                        <CardContent className="flex justify-center py-6">
                            <Skeleton className="h-[200px] w-[200px] rounded-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
