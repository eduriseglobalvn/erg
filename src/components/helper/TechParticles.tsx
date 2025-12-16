'use client';

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const TechParticles = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            className="absolute inset-0 z-0" // z-0 để nằm dưới nội dung
            options={{
                background: {
                    color: { value: "transparent" },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "grab" },
                        resize: { enable: true } // Tự động scale khi màn hình to
                    },
                    modes: {
                        grab: { distance: 140, links: { opacity: 1 } },
                    },
                },
                particles: {
                    color: { value: "#64748b" }, // Slate-500: Đậm hơn xíu để dễ thấy trên nền trắng
                    links: {
                        color: "#94a3b8", // Slate-400
                        distance: 150,
                        enable: true,
                        opacity: 0.4,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 1, // Tốc độ chậm
                    },
                    number: {
                        density: { enable: true },
                        value: 100, // Tăng số lượng hạt để phủ kín 2 bên lề
                    },
                    opacity: { value: 0.5 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 3 } },
                },
                detectRetina: true,
                fullScreen: { enable: false }, // QUAN TRỌNG: Tắt fullscreen để nó chỉ nằm trong section cha
            }}
        />
    );
};

export default TechParticles;