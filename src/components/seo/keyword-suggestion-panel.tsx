"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { seoApi } from '@/services/seo.api';
import { useDebounce } from 'use-debounce';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/admin/ui/card';
import { Checkbox } from '@/components/admin/ui/checkbox';
import { Button } from '@/components/admin/ui/button';
import { Skeleton } from '@/components/admin/ui/skeleton';
import { Badge } from '@/components/admin/ui/badge';
import { AlertCircle, Flame, MessageCircleQuestion, Link2, TrendingUp, CheckCircle2 } from 'lucide-react';
import { KeywordScoreBadge } from './keyword-score-badge';

export interface KeywordSuggestionPanelProps {
    focusKeyword: string;
    category?: string;
    type?: 'post' | 'course';
    onAddKeywords: (keywords: string[]) => void;
}

export function KeywordSuggestionPanel({ focusKeyword, category, type = 'post', onAddKeywords }: KeywordSuggestionPanelProps) {
    const [debouncedKeyword] = useDebounce(focusKeyword, 800);
    const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());

    // Fetch Suggestions
    const { data: suggestions, isLoading, isError, error } = useQuery({
        queryKey: ['seo-keyword-suggestions', debouncedKeyword, category, type],
        queryFn: async () => {
            if (!debouncedKeyword || debouncedKeyword.length < 2) return null;
            try {
                const res = await seoApi.getKeywordSuggestions(debouncedKeyword, category, type);
                return res.data;
            } catch (err) {
                console.error("Failed to fetch suggestions:", err);
                throw err;
            }
        },
        enabled: debouncedKeyword.length >= 2,
        staleTime: 5 * 60 * 1000, // 5mins cache
    });

    const toggleKeyword = (kw: string) => {
        const newSet = new Set(selectedKeywords);
        if (newSet.has(kw)) {
            newSet.delete(kw);
        } else {
            newSet.add(kw);
        }
        setSelectedKeywords(newSet);
    };

    const handleAddSelected = () => {
        if (selectedKeywords.size > 0) {
            onAddKeywords(Array.from(selectedKeywords));
            setSelectedKeywords(new Set()); // Reset after adding
        }
    };

    if (!debouncedKeyword || debouncedKeyword.length < 2) {
        return (
            <Card className="border-dashed bg-slate-50 opacity-70">
                <CardContent className="p-8 text-center text-slate-500">
                    <TrendingUp className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                    <p>Nhập từ khóa chính (focus keyword) dài hơn 2 ký tự để nhận đề xuất từ khóa chuẩn SEO.</p>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-1/4" />
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 text-red-600 p-4 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold mb-1">Lỗi khi tải đề xuất từ khóa</h4>
                    <p className="text-sm">Vui lòng thử lại sau. Chi tiết lỗi: {error instanceof Error ? error.message : "Unknown error"}</p>
                </div>
            </div>
        );
    }

    // Trích xuất data với fallback (Có thể Backend trả format mảng hoặc object)
    // Nếu BE chưa implement, mock data
    const mockData = suggestions || {
        hotTrends: [
            { keyword: `cách tạo ${debouncedKeyword}`, volume: "Cao", trend: "rising", score: 92 },
            { keyword: `${debouncedKeyword} 2026`, volume: "Cao", trend: "rising", score: 90 },
            { keyword: `hướng dẫn ${debouncedKeyword}`, volume: "TB", trend: "stable", score: 85 },
            { keyword: `${debouncedKeyword} là gì`, volume: "Cao", trend: "rising", score: 88 },
        ],
        paa: [
            `${debouncedKeyword} dùng để làm gì?`,
            `Cách sử dụng ${debouncedKeyword} cho người mới?`,
            `${debouncedKeyword} có khó không?`,
        ],
        lsi: [
            `tổng hợp dữ liệu`, `phân tích dữ liệu excel`, `công thức nâng cao`, `báo cáo tự động`
        ],
        categoryTrending: category ? [
            `chứng chỉ ${category} 2026`, `đề thi ${category} mới nhất`, `${category} level advanced`
        ] : []
    };

    const hasAnySelected = selectedKeywords.size > 0;

    return (
        <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-4 border-b">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Từ Khóa Đề Xuất
                        </CardTitle>
                        <CardDescription>
                            Dữ liệu SEO gợi ý dựa trên từ khóa: <strong className="text-blue-700">"{debouncedKeyword}"</strong>
                        </CardDescription>
                    </div>
                    {hasAnySelected && (
                        <Button onClick={handleAddSelected} size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Thêm {selectedKeywords.size} từ khóa
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="max-h-[500px] overflow-y-auto w-full">
                    {/* 1. Hot Trends */}
                    {mockData.hotTrends && mockData.hotTrends.length > 0 && (
                        <div className="p-4 border-b border-slate-100">
                            <h4 className="font-semibold text-sm flex items-center mb-3 text-slate-800">
                                <Flame className="h-4 w-4 mr-2 text-rose-500 fill-rose-100" />
                                Hot Trends (Google Autocomplete)
                            </h4>
                            <div className="rounded-md border border-slate-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                        <tr>
                                            <th className="px-3 py-2 text-center w-[40px]"></th>
                                            <th className="px-3 py-2 w-[55%]">Từ khóa</th>
                                            <th className="px-3 py-2 min-w-[120px]">Chỉ số & Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {mockData.hotTrends.map((item: any, idx: number) => {
                                            const id = `ht-${idx}`;
                                            const isChecked = selectedKeywords.has(item.keyword);
                                            return (
                                                <tr key={idx} className={`hover:bg-slate-50 transition-colors ${isChecked ? 'bg-blue-50/50' : ''}`}>
                                                    <td className="px-3 py-3 text-center">
                                                        <Checkbox
                                                            id={id}
                                                            checked={isChecked}
                                                            onCheckedChange={() => toggleKeyword(item.keyword)}
                                                            className={isChecked ? 'border-blue-500 data-[state=checked]:bg-blue-500' : ''}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <label htmlFor={id} className="cursor-pointer font-medium text-slate-700 hover:text-blue-600 block transition-colors">
                                                            {item.keyword}
                                                        </label>
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <KeywordScoreBadge
                                                            score={item.score}
                                                            trend={item.trend as any}
                                                            volumeLabel={item.volume}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 2. People Also Ask (PAA) */}
                    {mockData.paa && mockData.paa.length > 0 && (
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h4 className="font-semibold text-sm flex items-center mb-3 text-slate-800">
                                <MessageCircleQuestion className="h-4 w-4 mr-2 text-amber-500" />
                                Câu hỏi phổ biến (People Also Ask)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {mockData.paa.map((kw: string, idx: number) => {
                                    const id = `paa-${idx}`;
                                    const isChecked = selectedKeywords.has(kw);
                                    return (
                                        <div key={idx} className={`flex items-start p-2 rounded-md border transition-colors ${isChecked ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 hover:border-amber-300'}`}>
                                            <Checkbox
                                                id={id}
                                                checked={isChecked}
                                                onCheckedChange={() => toggleKeyword(kw)}
                                                className="mt-1 mr-3 flex-shrink-0"
                                            />
                                            <label htmlFor={id} className="cursor-pointer text-sm text-slate-700 leading-tight block">
                                                {kw}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 3. LSI & Related */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b border-slate-100">
                        {mockData.lsi && mockData.lsi.length > 0 && (
                            <div className="p-4">
                                <h4 className="font-semibold text-sm flex items-center mb-3 text-slate-800">
                                    <Link2 className="h-4 w-4 mr-2 text-green-500" />
                                    Từ khóa liên quan (LSI)
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {mockData.lsi.map((kw: string, idx: number) => (
                                        <Badge
                                            key={idx}
                                            variant={selectedKeywords.has(kw) ? "default" : "outline"}
                                            className={`cursor-pointer font-normal rounded-md ${selectedKeywords.has(kw) ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : 'hover:bg-slate-100 text-slate-600 border-slate-200'}`}
                                            onClick={() => toggleKeyword(kw)}
                                        >
                                            {selectedKeywords.has(kw) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                            {kw}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {mockData.categoryTrending && mockData.categoryTrending.length > 0 && (
                            <div className="p-4">
                                <h4 className="font-semibold text-sm flex items-center mb-3 text-slate-800">
                                    <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                                    Hot trong Danh mục
                                    {category && <span className="text-xs ml-2 font-normal text-slate-500">"{category}"</span>}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {mockData.categoryTrending.map((kw: string, idx: number) => (
                                        <Badge
                                            key={idx}
                                            variant={selectedKeywords.has(kw) ? "default" : "outline"}
                                            className={`cursor-pointer font-normal rounded-md ${selectedKeywords.has(kw) ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' : 'hover:bg-slate-100 text-slate-600 border-slate-200'}`}
                                            onClick={() => toggleKeyword(kw)}
                                        >
                                            {selectedKeywords.has(kw) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                            {kw}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            {hasAnySelected && (
                <div className="p-4 border-t bg-slate-50 flex justify-end">
                    <Button onClick={handleAddSelected} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Xác nhận thêm {selectedKeywords.size} từ khóa
                    </Button>
                </div>
            )}
        </Card>
    );
}
