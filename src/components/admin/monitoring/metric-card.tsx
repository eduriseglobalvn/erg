import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
    className?: string;
}

export function MetricCard({ title, value, description, icon: Icon, trend, className }: MetricCardProps) {
    return (
        <Card className={cn("shadow-sm", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-tight">{title}</CardTitle>
                {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <div className="flex items-center gap-2 mt-1">
                        {trend && (
                            <span className={cn(
                                "text-xs font-medium px-1 rounded",
                                trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            )}>
                                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                            </span>
                        )}
                        {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
