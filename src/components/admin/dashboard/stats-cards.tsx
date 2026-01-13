"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"

export function StatsCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Revenue */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                    <span className="text-xs font-medium text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
             <TrendingUp className="h-3 w-3" /> +12.5%
          </span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$1,250.00</div>
                    <p className="text-xs text-muted-foreground mt-1">Trending up this month</p>
                </CardContent>
            </Card>

            {/* Card 2: Customers */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">New Customers</CardTitle>
                    <span className="text-xs font-medium text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
             <TrendingDown className="h-3 w-3" /> -20%
          </span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground mt-1">Down 20% this period</p>
                </CardContent>
            </Card>

            {/* Card 3: Active Accounts */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Accounts</CardTitle>
                    <span className="text-xs font-medium text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
             <TrendingUp className="h-3 w-3" /> +12.5%
          </span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">45,678</div>
                    <p className="text-xs text-muted-foreground mt-1">Strong user retention</p>
                </CardContent>
            </Card>

            {/* Card 4: Growth Rate */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Growth Rate</CardTitle>
                    <span className="text-xs font-medium text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
             <TrendingUp className="h-3 w-3" /> +4.5%
          </span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4.5%</div>
                    <p className="text-xs text-muted-foreground mt-1">Steady performance increase</p>
                </CardContent>
            </Card>
        </div>
    )
}
