'use client';

import React, { useEffect, useState } from 'react';

// ==============================================
// TYPE & INTERFACE
// ==============================================
export type FestivalTheme = 'xmas' | 'tet';

interface FestivalPopupProps {
    /** Chủ đề lễ hội: 'xmas' hoặc 'tet' (Mặc định: 'xmas') */
    theme?: FestivalTheme;
    /** Bật/Tắt hiển thị (Mặc định: true) */
    isActive?: boolean;
    /** Thời gian hiệu ứng (ms) (Mặc định: 3000ms) */
    duration?: number;
}

interface Particle {
    id: number;
    // Xmas dùng angle/velocity, Tết dùng targetX/targetY
    angle?: number;
    velocity?: number;
    targetX?: number;
    targetY?: number;
    // Chung
    rotation: number;
    size: number;
    delay: number;
    char: string;
    color?: string;
}

const FestivalPopup: React.FC<FestivalPopupProps> = ({
                                                         theme = 'xmas',
                                                         isActive = true,
                                                         duration = 3500, // Tăng nhẹ thời gian để pháo hoa bay hết
                                                     }) => {
    const [visible, setVisible] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (!isActive) return;

        const newParticles: Particle[] = [];

        // ====================================================
        // LOGIC TẠO HẠT RIÊNG CHO TỪNG THEME
        // ====================================================

        if (theme === 'xmas') {
            // --- XMAS: Nổ bông tuyết ra xung quanh (Radial Blast) ---
            const particleCount = 100;
            const xmasChars = ['❄️', '❅', '❆', '•', '*'];

            for (let i = 0; i < particleCount; i++) {
                newParticles.push({
                    id: i,
                    angle: Math.random() * Math.PI * 2, // Góc bay
                    velocity: 150 + Math.random() * 850, // Lực bay
                    rotation: Math.random() * 360,
                    size: Math.random() * 25 + 10,
                    delay: Math.random() * 0.3,
                    char: xmasChars[Math.floor(Math.random() * xmasChars.length)],
                });
            }
        } else {
            // --- TẾT: Pháo hoa bắn lên (Upward Launch) ---
            const fireworkCount = 80;
            // Màu neon rực rỡ cho pháo hoa
            const fireworkColors = ['#ff0', '#0ff', '#f0f', '#0f0', '#ff4500', '#FFD700'];

            for (let i = 0; i < fireworkCount; i++) {
                // Vị trí đích ngang (phân bố ngẫu nhiên chiều ngang màn hình)
                const targetX = (Math.random() - 0.5) * window.innerWidth;
                // Độ cao bắn lên (ngẫu nhiên từ 40% đến 80% chiều cao màn hình)
                const targetY = - (window.innerHeight * 0.4 + Math.random() * window.innerHeight * 0.4);

                newParticles.push({
                    id: i,
                    targetX: targetX,
                    targetY: targetY,
                    rotation: 0, // Pháo hoa bay thẳng, ít xoay
                    size: Math.random() * 8 + 4, // Hạt nhỏ như tia lửa
                    delay: Math.random() * 1.5, // Bắn rải rác trong 1.5s
                    char: '•', // Dùng chấm tròn hoặc hình thoi '♦'
                    color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
                });
            }
        }

        setParticles(newParticles);
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [isActive, theme, duration]);

    if (!visible || !isActive) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none overflow-hidden font-sans select-none">

            {/* === LỚP NỀN (BACKGROUND) === */}
            {theme === 'xmas' ? (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-transparent to-red-950/40 animate-bg-flash mix-blend-multiply"></div>
            ) : (
                // Nền Tết tối hơn để làm nổi pháo hoa
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-red-900/30 to-black/70 animate-bg-flash"></div>
            )}


            {/* === HỆ THỐNG HẠT (PARTICLES SYSTEM) === */}
            {/* Xmas căn giữa, Tết căn đáy */}
            <div className={`absolute inset-0 flex pointer-events-none ${theme === 'xmas' ? 'items-center justify-center' : 'items-end justify-center'}`}>
                {particles.map((p) => (
                    <div
                        key={p.id}
                        // Chọn animation dựa trên theme
                        className={`absolute font-bold leading-none ${theme === 'xmas' ? 'animate-xmas-blast' : 'animate-firework-launch'}`}
                        style={{
                            fontSize: `${p.size}px`,
                            color: p.color || 'white',
                            textShadow: theme === 'xmas' ? '0 0 5px rgba(255,255,255,0.8)' : `0 0 10px ${p.color}, 0 0 20px ${p.color}`, // Tết thêm glow mạnh

                            // --- CSS Variables cho Xmas ---
                            '--angle': `${p.angle}rad`,
                            '--velocity': `${p.velocity}px`,
                            '--rot': `${p.rotation}deg`,

                            // --- CSS Variables cho Tết ---
                            '--target-x': `${p.targetX}px`,
                            '--target-y': `${p.targetY}px`,

                            // Vị trí xuất phát của pháo hoa (đáy màn hình)
                            bottom: theme === 'tet' ? '-20px' : 'auto',

                            animationDelay: `${p.delay}s`,
                            opacity: 0,
                        } as React.CSSProperties}
                    >
                        {p.char}
                    </div>
                ))}
            </div>


            {/* === NỘI DUNG CHỮ (TEXT CONTENT) === */}
            <div className="relative z-10 flex flex-col items-center justify-center animate-text-slam p-4">

                {theme === 'xmas' ? (
                    // =============== GIAO DIỆN XMAS MỚI ===============
                    <>
                        {/* Ông già Noel nhún nhảy */}
                        <div className="text-7xl md:text-8xl animate-bounce-slow mb-2 drop-shadow-xl">🎅</div>

                        {/* Chữ Ho Ho Ho lượn sóng */}
                        <h2 className="text-4xl md:text-6xl font-black text-red-600 animate-wavy tracking-widest mb-4 drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)] stroke-text-white">
                            HO HO HO!
                        </h2>

                        <h1 className="text-center font-serif leading-[0.9]">
                              <span className="block text-5xl md:text-8xl font-black text-white drop-shadow-[0_5px_5px_rgba(220,38,38,0.8)] stroke-text-red">
                                MERRY
                              </span>
                            <span className="block text-6xl md:text-9xl font-black text-[#ffffe0] drop-shadow-[0_5px_15px_rgba(16,185,129,0.9)] stroke-text-green mt-2">
                                CHRISTMAS
                              </span>
                        </h1>
                        <div className="mt-8 bg-white/90 text-red-700 px-6 py-2 rounded-full font-bold tracking-[0.3em] uppercase shadow-lg animate-fade-up border-2 border-red-600">
                            Edurise Global
                        </div>
                    </>
                ) : (
                    // =============== GIAO DIỆN TẾT MỚI ===============
                    <>
                        {/* Icon lấp lánh */}
                        <div className="text-6xl md:text-8xl mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">✨</div>

                        <h1 className="text-center font-serif leading-tight">
                            {/* HAPPY NEW YEAR STYLE VÀNG KIM */}
                            <span className="block text-5xl md:text-7xl font-bold text-yellow-400 drop-shadow-[0_3px_0_#b45309] stroke-text-red mb-2">
                                 HAPPY
                               </span>
                            <span className="block text-6xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 drop-shadow-[0_5px_25px_rgba(220,38,38,0.9)]">
                                 NEW YEAR
                               </span>
                        </h1>
                        {/* Subtitle */}
                        <div className="mt-8 text-yellow-100 text-xl md:text-2xl font-medium tracking-widest uppercase drop-shadow-md bg-red-700/80 px-10 py-3 rounded-xl border-2 border-yellow-500/50 animate-fade-up">
                            An Khang - Thịnh Vượng
                        </div>
                    </>
                )}

            </div>

            {/* === CSS ANIMATION (GLOBAL STYLES) === */}
            <style jsx global>{`
                /* --- Tiện ích --- */
                .stroke-text-red { -webkit-text-stroke: 2px #991b1b; }
                .stroke-text-green { -webkit-text-stroke: 2px #047857; }
                .stroke-text-white { -webkit-text-stroke: 1px #ffffff; }

                /* --- Animations Chung --- */
                @keyframes text-slam {
                    0% { transform: scale(0.2); opacity: 0; filter: blur(20px); }
                    40% { transform: scale(1.1); opacity: 1; filter: blur(0); }
                    60% { transform: scale(1); }
                    85% { opacity: 1; transform: scale(1.05); }
                    100% { opacity: 0; transform: scale(2); filter: blur(30px); }
                }
                .animate-text-slam { animation: text-slam ${duration/1000}s cubic-bezier(0.2, 1, 0.3, 1) forwards; }

                @keyframes bg-flash {
                    0% { background-color: rgba(0,0,0,0.95); }
                    30% { background-color: rgba(0,0,0,0.5); }
                    100% { background-color: transparent; }
                }
                .animate-bg-flash { animation: bg-flash 2s ease-out forwards; }

                @keyframes fade-up {
                    0% { opacity: 0; transform: translateY(40px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-up { animation: fade-up 1s ease-out 0.5s forwards; opacity: 0; }

                /* --- Animations Xmas --- */
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }

                @keyframes wavy {
                    0%, 100% { transform: rotate(-3deg) translateY(0); }
                    50% { transform: rotate(3deg) translateY(-5px); }
                }
                .animate-wavy { animation: wavy 1.5s ease-in-out infinite; }

                @keyframes xmas-blast {
                    0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
                    15% { opacity: 1; transform: translate(calc(cos(var(--angle)) * var(--velocity) * 0.2), calc(sin(var(--angle)) * var(--velocity) * 0.2)) scale(1.5) rotate(var(--rot)); }
                    100% { transform: translate(calc(cos(var(--angle)) * var(--velocity)), calc(sin(var(--angle)) * var(--velocity))) scale(0) rotate(calc(var(--rot) * 3)); opacity: 0; }
                }
                .animate-xmas-blast { animation: xmas-blast 2.5s ease-out forwards; }

                /* --- Animations Tết (Pháo hoa bắn lên) --- */
                @keyframes firework-launch {
                    0% {
                        transform: translate(0, 0) scale(0.5);
                        opacity: 1;
                    }
                    50% {
                        opacity: 1;
                        transform: translate(var(--target-x), calc(var(--target-y) * 0.8)) scale(1.2); /* Bay lên 80% quãng đường */
                    }
                    70% {
                        opacity: 0.8;
                        /* Đạt đỉnh và lóe sáng */
                        transform: translate(calc(var(--target-x) * 1.1), var(--target-y)) scale(2);
                        box-shadow: 0 0 30px var(--color);
                    }
                    100% {
                        /* Tan biến */
                        transform: translate(calc(var(--target-x) * 1.2), calc(var(--target-y) - 50px)) scale(0);
                        opacity: 0;
                    }
                }
                .animate-firework-launch {
                    animation: firework-launch 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    will-change: transform, opacity;
                }
            `}</style>
        </div>
    );
};

export default FestivalPopup;