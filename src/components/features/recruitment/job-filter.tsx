'use client';

import React, { useState, useMemo } from 'react';
import {
    Filter, Search, MapPin, DollarSign, Clock, Calendar,
    Users, Briefcase, CheckSquare, Square, Flame, Zap, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import { JobCard } from '@/components/cards/job-card';
import { useQuery } from '@tanstack/react-query';
import { recruitmentApi } from '@/services/recruitment.api';

export default function JobFilter() {
    // --- STATE QUẢN LÝ BỘ LỌC ---
    const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");

    // Custom hook useDebounce (if doesn't exist, we will use inline, but assuming we can do simple timeout or let's just use simple state for now since we don't know if useDebounce exists. Let's use a local effect)

    const salaryOptions = ["Thỏa thuận", "Dưới 10 triệu", "10 - 20 triệu", "Trên 20 triệu"];
    const typeOptions = ["Toàn thời gian", "Bán thời gian", "Thực tập", "Freelance"];
    const locationOptions = ["TP Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];

    // Use a simple local debounce for search
    const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1); // reset page on search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchInput]);

    // Handle filter toggle
    const toggleFilter = (item: string, selectedItems: string[], setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(i => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
        setPage(1); // Reset page on filter change
    };

    // --- FETCH DATA ---
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['public-jobs', { debouncedSearch, selectedSalaries, selectedTypes, selectedLocations, sort, page }],
        queryFn: () => recruitmentApi.getJobs({
            search: debouncedSearch,
            salary: selectedSalaries,
            workType: selectedTypes,
            location: selectedLocations,
            sort,
            page,
            limit: 6 // 6 items per page for better UI grid
        }).then(res => res.data)
    });

    const jobs = Array.isArray(data) ? data : (data?.items || []);
    const meta = data?.meta || { total: jobs.length, page: 1, limit: 6, totalPages: 1 };

    return (
        <React.Fragment>
            {/* --- HERO SECTION --- */}
            <section className="relative bg-[#00008b] text-white py-16 md:py-24 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block mb-8">
                        <span className="py-2 px-6 rounded-full border border-white/20 bg-white/5 text-xs md:text-sm font-bold uppercase tracking-widest text-yellow-400 backdrop-blur-sm">
                            Tuyển dụng Giáo dục & CNTT
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight flex flex-col md:block items-center justify-center gap-3 md:gap-4">
                        <span>Kiến Tạo</span>
                        <span className="inline-block md:ml-4 bg-white text-[#cc0022] px-4 py-1 md:px-6 md:py-2 rounded-lg transform -rotate-3 shadow-xl">
                            Tương Lai Số
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-12 font-light leading-relaxed opacity-90">
                        Gia nhập ERG để cùng mang chuẩn Tin học Quốc tế đến hàng triệu học sinh Việt Nam.
                    </p>

                    <div className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-2xl flex items-center transform hover:scale-[1.01] transition-transform duration-300 border-4 border-white/10 bg-clip-padding">
                        <Search className="ml-4 md:ml-6 text-gray-400 shrink-0" size={24} />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Nhập vị trí (VD: Giáo viên tin học, IT...)"
                            className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-base md:text-lg"
                        />
                        <button
                            className="bg-[#cc0022] hover:bg-red-700 text-white rounded-full px-8 md:px-12 py-3 md:py-4 font-bold transition-all shrink-0 shadow-lg shadow-red-900/20 whitespace-nowrap text-base md:text-lg"
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </section>

            {/* --- BODY CONTENT --- */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR BỘ LỌC --- */}
                    <aside className="w-full lg:w-1/4 shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-4">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                <h3 className="font-bold text-lg flex items-center gap-2 text-[#00008b]"><Filter size={20} /> Bộ lọc</h3>
                                <button
                                    onClick={() => { setSelectedSalaries([]); setSelectedTypes([]); setSelectedLocations([]); setPage(1); }}
                                    className="text-xs text-gray-500 hover:text-[#cc0022] hover:underline"
                                >
                                    Xóa tất cả
                                </button>
                            </div>

                            {/* Mức lương */}
                            <div className="mb-6">
                                <h4 className="font-bold text-xs uppercase text-gray-500 mb-3 tracking-wider">Mức lương</h4>
                                <div className="space-y-2">
                                    {salaryOptions.map((option) => (
                                        <label key={option} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors">
                                            <div className="relative flex items-center">
                                                <input type="checkbox" className="peer sr-only" checked={selectedSalaries.includes(option)} onChange={() => toggleFilter(option, selectedSalaries, setSelectedSalaries)} />
                                                {selectedSalaries.includes(option) ? <CheckSquare size={18} className="text-[#00008b]" /> : <Square size={18} className="text-gray-300 group-hover:text-gray-400" />}
                                            </div>
                                            <span className="text-sm text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Hình thức */}
                            <div className="mb-6">
                                <h4 className="font-bold text-xs uppercase text-gray-500 mb-3 tracking-wider">Hình thức</h4>
                                <div className="space-y-2">
                                    {typeOptions.map((option) => (
                                        <label key={option} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors">
                                            <div className="relative flex items-center">
                                                <input type="checkbox" className="peer sr-only" checked={selectedTypes.includes(option)} onChange={() => toggleFilter(option, selectedTypes, setSelectedTypes)} />
                                                {selectedTypes.includes(option) ? <CheckSquare size={18} className="text-[#00008b]" /> : <Square size={18} className="text-gray-300 group-hover:text-gray-400" />}
                                            </div>
                                            <span className="text-sm text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Địa điểm */}
                            <div>
                                <h4 className="font-bold text-xs uppercase text-gray-500 mb-3 tracking-wider">Địa điểm</h4>
                                <div className="space-y-2">
                                    {locationOptions.map((option) => (
                                        <label key={option} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors">
                                            <div className="relative flex items-center">
                                                <input type="checkbox" className="peer sr-only" checked={selectedLocations.includes(option)} onChange={() => toggleFilter(option, selectedLocations, setSelectedLocations)} />
                                                {selectedLocations.includes(option) ? <CheckSquare size={18} className="text-[#00008b]" /> : <Square size={18} className="text-gray-300 group-hover:text-gray-400" />}
                                            </div>
                                            <span className="text-sm text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <div className="w-full lg:w-3/4">

                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <p className="text-gray-600 text-sm mb-2 sm:mb-0">
                                Tìm thấy <span className="font-bold text-[#00008b] text-base">{meta.total}</span> việc làm
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Sắp xếp:</span>
                                <select
                                    className="bg-gray-50 border border-gray-200 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-[#00008b] cursor-pointer"
                                    value={sort}
                                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="oldest">Cũ nhất</option>
                                </select>
                            </div>
                        </div>

                        {/* --- GRID VIEW: NGANG 3 --- */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-xl"></div>
                                ))
                            ) : jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        {...job}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Không tìm thấy công việc phù hợp.</p>
                                    <button
                                        onClick={() => { setSelectedSalaries([]); setSelectedTypes([]); setSelectedLocations([]); setSearchInput(""); setPage(1); }}
                                        className="mt-2 text-[#cc0022] font-bold text-sm hover:underline"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {meta.totalPages > 1 && (
                            <div className="mt-10 flex justify-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 text-sm"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from({ length: meta.totalPages }).map((_, idx) => {
                                    const pageNum = idx + 1;
                                    const isActive = pageNum === page;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-8 h-8 rounded flex items-center justify-center font-medium text-sm transition-colors ${isActive
                                                ? 'bg-[#00008b] text-white shadow-sm font-bold'
                                                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                    disabled={page === meta.totalPages}
                                    className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 text-sm"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
