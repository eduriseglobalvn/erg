"use client"

import * as React from "react"
import { DisclosureTable } from "@/components/admin/public-disclosure/disclosure-table"
import { DisclosureUploadDialog } from "@/components/admin/public-disclosure/disclosure-upload-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { PUBLIC_DISCLOSURE_SECTIONS } from "@/constants/public-disclosure"
import { FileSearch, ShieldCheck, History } from "lucide-react"

export default function PublicDisclosureAdminPage() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-indigo-600" />
                        Quản lý Hồ sơ Công khai
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Quản lý, import và cấu hình văn bản pháp lý, học phí và kiểm định chất lượng.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <DisclosureUploadDialog />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow cursor-default border-indigo-100 bg-indigo-50/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng số hồ sơ</CardTitle>
                        <FileSearch className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Đã được xác thực & công khai</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow cursor-default border-blue-100 bg-blue-50/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lưu trữ GDrive</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">100%</div>
                        <p className="text-xs text-muted-foreground">Tất cả hồ sơ mới được bảo mật</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-muted/50 p-1">
                        <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">
                            Tất cả
                        </TabsTrigger>
                        {PUBLIC_DISCLOSURE_SECTIONS.map((section) => (
                            <TabsTrigger 
                                key={section.slug} 
                                value={section.slug}
                                className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                {section.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <TabsContent value="all" className="space-y-4">
                    <DisclosureTable />
                </TabsContent>
                
                {PUBLIC_DISCLOSURE_SECTIONS.map((section) => (
                    <TabsContent key={section.slug} value={section.slug} className="space-y-4">
                        <DisclosureTable section={section.slug} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
