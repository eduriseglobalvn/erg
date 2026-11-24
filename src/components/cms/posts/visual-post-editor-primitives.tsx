import type { ReactNode } from "react"

export function SectionCard({
    title,
    description,
    children,
}: {
    title: string
    description?: string
    children: ReactNode
}) {
    return (
        <section className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-4">
                <h3 className="text-sm font-bold text-zinc-950">{title}</h3>
                {description && <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>}
            </div>
            {children}
        </section>
    )
}

export function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border bg-zinc-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">{label}</p>
            <p className="mt-1 truncate text-sm font-black text-zinc-950">{value}</p>
        </div>
    )
}
