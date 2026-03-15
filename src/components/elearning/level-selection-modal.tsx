"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, GraduationCap } from 'lucide-react';
import { ElearningCategory, ElearningLevel } from '@/constants/elearning.constants';
import { useRouter } from 'next/navigation';

interface LevelSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: ElearningCategory | null;
}

export function LevelSelectionModal({ isOpen, onClose, category }: LevelSelectionModalProps) {
    const router = useRouter();

    if (!category) return null;

    const handleSelectLevel = (level: ElearningLevel) => {
        router.push(`/level/${category.id}/${level.id}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Chương Trình {category.id === 'primary' ? 'Tiểu Học' : 'THCS'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Chọn cấp độ để bắt đầu lộ trình</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {category.levels.map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => handleSelectLevel(level)}
                                    className="w-full flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                            <GraduationCap size={24} />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-gray-900 text-lg">{level.title}</h4>
                                            <p className="text-sm text-gray-500">{level.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>

                        <div className="p-4 bg-gray-50 text-center text-xs text-gray-400">
                            Hệ thống ôn luyện trực tuyến EduRise Global
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
