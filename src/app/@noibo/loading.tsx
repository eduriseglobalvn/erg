export default function NoiboLoading() {
    return (
        <div className="min-h-[60vh] bg-[#f8fafc]">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-10">
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="space-y-5">
                            <div className="h-8 w-48 rounded-full bg-slate-200" />
                            <div className="h-16 w-full max-w-3xl rounded-[28px] bg-slate-200" />
                            <div className="h-6 w-full max-w-2xl rounded-full bg-slate-200" />
                            <div className="flex gap-4">
                                <div className="h-14 w-52 rounded-2xl bg-slate-200" />
                                <div className="h-14 w-44 rounded-2xl bg-slate-200" />
                            </div>
                        </div>
                        <div className="rounded-[32px] bg-slate-200 p-6">
                            <div className="space-y-4">
                                <div className="h-6 w-36 rounded-full bg-slate-300" />
                                <div className="h-20 rounded-2xl bg-slate-300" />
                                <div className="h-20 rounded-2xl bg-slate-300" />
                                <div className="h-20 rounded-2xl bg-slate-300" />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
                                <div className="h-4 w-24 rounded-full bg-slate-200" />
                                <div className="mt-4 h-8 w-2/3 rounded-full bg-slate-200" />
                                <div className="mt-4 h-20 rounded-[20px] bg-slate-100" />
                                <div className="mt-5 flex gap-2">
                                    <div className="h-8 w-20 rounded-full bg-slate-100" />
                                    <div className="h-8 w-24 rounded-full bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
