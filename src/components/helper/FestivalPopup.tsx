'use client';

import React, { useEffect, useState } from 'react';

// ==============================================
// CẤU HÌNH (USER CHỈNH Ở ĐÂY)
// ==============================================
const CONFIG = {
    THEME: 'xmas' as 'xmas' | 'tet', // Hiện tại tối ưu cho 'xmas'
    IS_ACTIVE: true,                 // Bật/Tắt
    DURATION: 3500,                  // 2.5s (cho dôi ra 0.5s để fade out mượt)
};
// ==============================================

interface Particle {
    id: number;
    x: number;     // Hướng bay X
    y: number;     // Hướng bay Y
    size: number;  // Kích thước
    delay: number; // Độ trễ
}

const FestivalIntro: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (!CONFIG.IS_ACTIVE) return;

        // 1. Tạo danh sách hạt tuyết (Client-side generation)
        const particleCount = 60; // Số lượng bông tuyết nổ ra
        const newParticles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            // Tính toán hướng bay ngẫu nhiên từ tâm (theo góc tròn)
            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 800; // Bay xa từ 100px đến 900px

            newParticles.push({
                id: i,
                x: Math.cos(angle) * velocity,
                y: Math.sin(angle) * velocity,
                size: Math.random() * 20 + 10, // Kích thước to nhỏ 10px - 30px
                delay: Math.random() * 0.2,    // Nổ gần như cùng lúc
            });
        }
        setParticles(newParticles);
        setVisible(true);

        // 2. Tắt component
        const timer = setTimeout(() => {
            setVisible(false);
        }, CONFIG.DURATION);

        return () => clearTimeout(timer);
    }, []);

    if (!visible || !CONFIG.IS_ACTIVE) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none overflow-hidden">

            {/* 1. NỀN FLASH (Chớp sáng nhẹ rồi tắt) */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-green-600/20 animate-bg-flash"></div>

            {/* 2. HIỆU ỨNG TUYẾT NỔ (PARTICLES) */}
            <div className="absolute inset-0 flex items-center justify-center">
                {particles.map((p) => (
                    <div
                        key={p.id}
                        className="absolute text-white opacity-0 animate-snow-blast"
                        style={{
                            fontSize: `${p.size}px`,
                            // Truyền biến vào CSS để hạt bay theo hướng đã tính
                            '--x': `${p.x}px`,
                            '--y': `${p.y}px`,
                            animationDelay: `${p.delay}s`,
                        } as React.CSSProperties}
                    >
                        ❄️
                    </div>
                ))}
            </div>

            {/* 3. CHỮ TEXT (Zoom In mạnh) */}
            <div className="relative z-10 flex flex-col items-center justify-center animate-text-slam">
                <h1 className="text-6xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-300 to-green-500 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] tracking-tighter text-center font-serif leading-none">
                    MERRY <br/> CHRISTMAS
                </h1>
                <p className="mt-4 text-white text-xl md:text-3xl font-bold tracking-[0.5em] uppercase drop-shadow-md animate-fade-up">
                    Edurise Global
                </p>
            </div>

            {/* 4. STYLES ANIMATION */}
            <style jsx>{`
        /* Text đập mạnh vào mặt */
        @keyframes text-slam {
          0% { transform: scale(0.5); opacity: 0; filter: blur(10px); }
          20% { transform: scale(1.2); opacity: 1; filter: blur(0); }
          40% { transform: scale(1); }
          80% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0; transform: scale(1.5); filter: blur(20px); }
        }
        .animate-text-slam {
          animation: text-slam 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Chữ phụ bay lên */
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          30% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fade-up {
          animation: fade-up 2.5s ease-out forwards;
        }

        /* Nền chớp tắt */
        @keyframes bg-flash {
          0% { background-color: rgba(0,0,0,0.8); } /* Tối màn hình lại lúc đầu */
          20% { background-color: rgba(220, 38, 38, 0.1); }
          100% { background-color: transparent; }
        }
        .animate-bg-flash {
          animation: bg-flash 2.5s ease-out forwards;
        }

        /* Tuyết nổ tản ra */
        @keyframes snow-blast {
          0% {
            transform: translate(0, 0) scale(0.5) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), var(--y)) scale(1.2) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-snow-blast {
          animation: snow-blast 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
        </div>
    );
};

export default FestivalIntro;