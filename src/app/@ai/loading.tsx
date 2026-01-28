import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Loading() {
    return (
        <SkeletonTheme baseColor="#f1f5f9" highlightColor="#f8fafc">
            <div className="container mx-auto px-4 pt-24 pb-12 space-y-16">

                {/* Hero Section Simulation */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/2 space-y-4">
                        <Skeleton height={48} width="80%" />
                        <Skeleton height={48} width="60%" />
                        <div className="pt-4 space-y-2">
                            <Skeleton count={3} />
                        </div>
                        <div className="pt-6 flex gap-4">
                            <Skeleton height={40} width={140} borderRadius={30} />
                            <Skeleton height={40} width={140} borderRadius={30} />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <Skeleton height={400} borderRadius={16} />
                    </div>
                </div>

                {/* Features / Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <Skeleton height={220} borderRadius={12} />
                            <Skeleton height={24} width="90%" />
                            <Skeleton height={20} width="40%" />
                        </div>
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    )
}
