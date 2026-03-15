"use client";

import React, { useState, useEffect } from 'react';
import { ELEARNING_DATA, ElearningCategory } from '@/constants/elearning.constants';
import { LevelSelectionModal } from '@/components/elearning/level-selection-modal';

export function ElearningModalManager() {
    const [selectedCategory, setSelectedCategory] = useState<ElearningCategory | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleOpenModal = (event: any) => {
            const categoryId = event.detail;
            const category = ELEARNING_DATA.find(c => c.id === categoryId);
            if (category) {
                setSelectedCategory(category);
                setIsModalOpen(true);
            }
        };

        window.addEventListener('open-elearning-modal', handleOpenModal);

        // Cũng trigger modal nếu URL có hash khi load trang
        const hash = window.location.hash.replace('#', '');
        if (hash === 'primary' || hash === 'secondary') {
            const category = ELEARNING_DATA.find(c => c.id === hash);
            if (category) {
                setSelectedCategory(category);
                setIsModalOpen(true);
            }
        }

        return () => {
            window.removeEventListener('open-elearning-modal', handleOpenModal);
        };
    }, []);

    return (
        <LevelSelectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            category={selectedCategory}
        />
    );
}
