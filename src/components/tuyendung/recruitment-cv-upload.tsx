"use client";

import React, { useState } from 'react';
import { FileText, UploadCloud } from 'lucide-react';

export function RecruitmentCvUpload() {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFileName(file?.name ?? null);
    };

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">
                CV / Hồ sơ năng lực <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input
                    type="file"
                    id="cv-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                />
                <label
                    htmlFor="cv-upload"
                    className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group ${
                        fileName ? 'border-[#00008b] bg-blue-50/50' : 'border-gray-300 hover:border-[#00008b] hover:bg-gray-50'
                    }`}
                >
                    {fileName ? (
                        <>
                            <FileText size={32} className="text-[#00008b] mb-2" />
                            <span className="text-sm font-bold text-gray-900">{fileName}</span>
                            <span className="text-xs text-blue-600 mt-1">Nhấn để thay đổi file</span>
                        </>
                    ) : (
                        <>
                            <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                                <UploadCloud size={24} className="text-gray-500 group-hover:text-[#00008b]" />
                            </div>
                            <p className="text-sm text-gray-600 font-medium">
                                <span className="text-[#00008b] font-bold">Tải lên CV</span> hoặc kéo thả vào đây
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Hỗ trợ PDF, DOC, DOCX (Tối đa 5MB)</p>
                        </>
                    )}
                </label>
            </div>
        </div>
    );
}
