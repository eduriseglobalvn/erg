import React from 'react';
import { Badge } from "@/components/cms/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface KeywordScoreBadgeProps {
    score: number;
    trend?: 'rising' | 'stable' | 'declining';
    volumeLabel?: string;
    className?: string;
}

export function KeywordScoreBadge({ score, trend, volumeLabel, className = "" }: KeywordScoreBadgeProps) {
    let colorClass = "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
    if (score >= 80) {
        colorClass = "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
    } else if (score >= 50) {
        colorClass = "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
    }

    const renderTrendIcon = () => {
        if (!trend) return null;
        switch (trend) {
            case 'rising':
                return <TrendingUp className="h-3 w-3 ml-1 text-green-600" />;
            case 'declining':
                return <TrendingDown className="h-3 w-3 ml-1 text-red-600" />;
            case 'stable':
            default:
                return <Minus className="h-3 w-3 ml-1 text-slate-400" />;
        }
    };

    return (
        <Badge variant="outline" className={`font-semibold px-2 py-0.5 whitespace-nowrap ${colorClass} ${className}`}>
            {score}/100
            {volumeLabel && <span className="ml-1 opacity-70 border-l border-current pl-1">{volumeLabel}</span>}
            {renderTrendIcon()}
        </Badge>
    );
}
