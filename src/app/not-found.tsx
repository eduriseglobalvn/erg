// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 p-4 text-center">
            {/* Nền họa tiết - Dùng var(--erg-blue) trực tiếp */}
            <div className="absolute inset-0 z-0 opacity-5"
                 style={{
                     backgroundImage: 'radial-gradient(circle at 2px 2px, var(--erg-blue) 1px, transparent 0)',
                     backgroundSize: '40px 40px'
                 }}>
            </div>

            <div className="z-10 flex flex-col items-center max-w-2xl">
                {/* --- ROBOT --- */}
                {/* Lưu ý: Nếu animate-bounce-slow không chạy vì thiếu config, mình đổi tạm về animate-bounce có sẵn */}
                <div className="mb-8 animate-bounce relative">
                    <svg
                        width="320" height="320" viewBox="0 0 400 400" fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-72 w-auto sm:h-96"
                    >
                        {/* Sách: Dùng fill-[var(--erg-blue)] */}
                        <g transform="translate(0, 50)">
                            <rect x="50" y="280" width="300" height="40" rx="4" className="fill-[var(--erg-blue)]" opacity="0.8" />
                            <rect x="60" y="285" width="280" height="30" rx="2" fill="white" opacity="0.2" />
                            <text x="200" y="305" fill="white" fontSize="14" fontFamily="sans-serif" textAnchor="middle" opacity="0.7">KHO TÀNG TRI THỨC</text>

                            <rect x="70" y="240" width="260" height="40" rx="4" className="fill-[var(--erg-blue)]" opacity="0.9" />
                            <rect x="80" y="245" width="240" height="30" rx="2" fill="white" opacity="0.2" />

                            <rect x="90" y="200" width="220" height="40" rx="4" className="fill-[var(--erg-blue)]" />
                            <rect x="100" y="205" width="200" height="30" rx="2" fill="white" opacity="0.3" />
                        </g>

                        {/* Robot */}
                        <g transform="translate(150, 80)">
                            <path d="M20 120 L10 150 L90 150 L80 120 Z" className="fill-[var(--erg-blue)]" />

                            <rect x="15" y="50" width="70" height="80" rx="10" className="fill-[var(--erg-blue)]" />
                            <rect x="25" y="60" width="50" height="60" rx="5" fill="white" opacity="0.9" />
                            {/* Logo ngực áo */}
                            <path d="M35 80 H65 V90 H35 Z" className="fill-[var(--erg-blue)]" opacity="0.3"/>
                            <path d="M35 95 H55 V105 H35 Z" className="fill-[var(--erg-blue)]" opacity="0.3"/>

                            <rect x="10" y="0" width="80" height="50" rx="12" className="fill-[var(--erg-blue)]" />
                            <circle cx="35" cy="25" r="10" fill="white" />
                            <circle cx="65" cy="25" r="10" fill="white" />
                            <circle cx="35" cy="25" r="4" className="fill-[var(--erg-blue)]" />
                            <circle cx="65" cy="25" r="4" className="fill-[var(--erg-blue)]" />

                            <path d="M85 70 C 110 70, 120 90, 130 110" className="stroke-[var(--erg-blue)]" strokeWidth="8" strokeLinecap="round" fill="none"/>
                        </g>

                        {/* Mũ cử nhân (Màu đỏ - var(--erg-red)) */}
                        <g transform="translate(160, 50) rotate(-10)">
                            <polygon points="50,0 100,20 50,40 0,20" className="fill-[var(--erg-red)]" />
                            <rect x="45" y="35" width="10" height="15" className="fill-[var(--erg-red)]" />
                            <circle cx="100" cy="20" r="5" className="fill-[var(--erg-red)]" />
                            <path d="M100 20 Q 110 40, 105 60" className="stroke-[var(--erg-red)]" strokeWidth="3" />
                        </g>

                        {/* Kính lúp & Lỗi 404 */}
                        <g transform="translate(260, 180) rotate(20)">
                            <circle cx="0" cy="0" r="40" className="stroke-[var(--erg-blue)]" strokeWidth="6" fill="white" opacity="0.5"/>
                            <rect x="-5" y="38" width="10" height="40" className="fill-[var(--erg-blue)]" rx="2" />

                            <g className="animate-pulse">
                                <text x="-25" y="10" className="fill-[var(--erg-red)]" fontSize="24" fontWeight="bold" fontFamily="monospace">404</text>
                                <text x="15" y="-15" className="fill-[var(--erg-red)]" fontSize="30" fontWeight="bold">?</text>
                                <text x="-20" y="-30" className="fill-[var(--erg-red)]" fontSize="20" fontWeight="bold" opacity="0.7">?</text>
                            </g>
                        </g>
                    </svg>
                </div>

                {/* --- TEXT --- */}
                <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-[var(--erg-blue)] sm:text-5xl">
                    Oops! Trang kiến thức này đang "vắng mặt".
                </h1>
                <h2 className="text-xl font-semibold text-[var(--erg-blue)]/80">
                    Lỗi 404 - Không tìm thấy tài liệu
                </h2>

                <p className="mb-8 mt-4 text-lg text-slate-600 max-w-lg">
                    Có vẻ như đường dẫn bạn đang tìm kiếm không tồn tại trong thư viện của ERG. Robot trợ giảng của chúng tôi đã lục tung chồng sách nhưng không thấy kết quả.
                </p>

                {/* --- BUTTON --- */}
                <Link
                    href="/"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--erg-red)] px-8 py-3 font-bold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[var(--erg-red)]/50"
                    style={{ boxShadow: `0 4px 15px -3px rgba(204, 0, 34, 0.5)` }}
                >
          <span className="mr-2 transition-transform group-hover:-translate-x-1 text-xl">
            📚
          </span>
                    Quay về Trang chủ ERG
                    <div className="absolute inset-0 -z-10 h-full w-full scale-0 rounded-full bg-white/20 transition-transform duration-300 group-hover:scale-150"></div>
                </Link>
            </div>
        </div>
    )
}