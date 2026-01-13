"use client"

import { MoreHorizontal, GripVertical, Plus } from "lucide-react"
import { Badge } from "@/components/admin/ui/badge"
import { Button } from "@/components/admin/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table"
import { Card, CardContent, CardHeader } from "@/components/admin/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"

const invoices = [
    {
        header: "Cover page",
        type: "Cover page",
        status: "In Process",
        target: 18,
        limit: 5,
        reviewer: "Eddie Lake",
    },
    {
        header: "Table of contents",
        type: "Table of contents",
        status: "Done",
        target: 29,
        limit: 24,
        reviewer: "Eddie Lake",
    },
    {
        header: "Executive summary",
        type: "Narrative",
        status: "Done",
        target: 10,
        limit: 13,
        reviewer: "Eddie Lake",
    },
    {
        header: "Technical approach",
        type: "Narrative",
        status: "Done",
        target: 27,
        limit: 23,
        reviewer: "Jamik Tashpulatov",
    },
    {
        header: "Design",
        type: "Narrative",
        status: "In Process",
        target: 2,
        limit: 16,
        reviewer: "Jamik Tashpulatov",
    },
]

export function ProjectTable() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
                <Tabs defaultValue="outline" className="w-full">
                    <div className="flex items-center justify-between">
                        <TabsList className="bg-transparent p-0">
                            <TabsTrigger value="outline" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-full px-4">Outline</TabsTrigger>
                            <TabsTrigger value="past" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-full px-4">Past Performance <Badge variant="secondary" className="ml-2 h-5 px-1.5 rounded-full">3</Badge></TabsTrigger>
                            <TabsTrigger value="personnel" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-full px-4">Key Personnel <Badge variant="secondary" className="ml-2 h-5 px-1.5 rounded-full">2</Badge></TabsTrigger>
                            <TabsTrigger value="docs" className="data-[state=active]:bg-muted data-[state=active]:shadow-none rounded-full px-4">Focus Documents</TabsTrigger>
                        </TabsList>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm"><Plus className="mr-2 h-4 w-4"/> Add Section</Button>
                        </div>
                    </div>
                </Tabs>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Header</TableHead>
                            <TableHead>Section Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Target</TableHead>
                            <TableHead className="text-right">Limit</TableHead>
                            <TableHead>Reviewer</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice, i) => (
                            <TableRow key={i}>
                                <TableCell><GripVertical className="h-4 w-4 text-muted-foreground/50" /></TableCell>
                                <TableCell><input type="checkbox" className="accent-primary h-4 w-4 rounded border-gray-300" /></TableCell>
                                <TableCell className="font-medium">{invoice.header}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="rounded-md font-normal text-muted-foreground">
                                        {invoice.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={invoice.status === "Done" ? "default" : "secondary"} className={invoice.status === "Done" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none" : "bg-gray-100 text-gray-700 hover:bg-gray-100 border-none shadow-none"}>
                                        {invoice.status === "Done" ? "Done" : "In Process"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{invoice.target}</TableCell>
                                <TableCell className="text-right">{invoice.limit}</TableCell>
                                <TableCell>{invoice.reviewer}</TableCell>
                                <TableCell><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}