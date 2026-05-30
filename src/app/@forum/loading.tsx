export default function ForumLoading() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-20">
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="h-10 w-72 animate-pulse rounded bg-slate-200" />
                <div className="grid gap-4 md:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-36 animate-pulse rounded-2xl bg-white shadow-sm" />
                    ))}
                </div>
            </div>
        </div>
    );
}
