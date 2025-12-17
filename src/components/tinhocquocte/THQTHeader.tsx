'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Facebook, Youtube, ChevronDown, Search, Globe } from 'lucide-react';

// Import Menu từ file constants
import { THQT_MENU_ITEMS } from '@/constants/MenuItem';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Đóng menu khi chuyển trang
        setIsMobileMenuOpen(false);
        setMobileSubmenuOpen(null);
        setIsSearchOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const toggleMobileSubmenu = (label: string) => {
        setMobileSubmenuOpen(mobileSubmenuOpen === label ? null : label);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        bg-white border-b border-gray-100 shadow-sm py-2
        lg:border-none
        ${isScrolled
                    ? 'lg:bg-white lg:shadow-md lg:py-2'
                    : 'lg:bg-white/95 lg:backdrop-blur-md lg:shadow-sm lg:py-4'
                }`}
            >
                <div className="container mx-auto px-4 md:px-6">

                    {/* --- TOP BAR --- */}
                    <div className={`hidden lg:flex justify-between items-center text-xs font-medium text-gray-500 mb-2 border-b border-gray-100 pb-2 transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden mb-0 pb-0' : 'opacity-100'}`}>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                                <Phone size={14} className="text-highlight" /> Hotline: 0766.144.888
                            </span>
                            <span className="hover:text-primary transition-colors cursor-pointer">
                                Email: info.eduerg@gmail.com
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex gap-3 border-r border-gray-200 pr-4">
                                <a href="https://www.facebook.com/eduriseerg" className="hover:text-primary transition-colors"><Facebook size={16} /></a>
                                <a href="#" className="hover:text-highlight transition-colors"><Youtube size={16} /></a>
                            </div>

                            <div className="flex items-center gap-1 cursor-pointer hover:text-primary group relative">
                                <Globe size={14} />
                                <span>VN</span>
                                <ChevronDown size={12} />
                                <div className="absolute top-full right-0 mt-1 w-24 bg-white shadow-lg rounded border border-gray-100 hidden group-hover:block z-50">
                                    <div className="py-1">
                                        <div className="px-3 py-1 hover:bg-gray-50 text-highlight font-bold cursor-pointer">Tiếng Việt</div>
                                        <div className="px-3 py-1 hover:bg-gray-50 hover:text-primary cursor-pointer">English</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex-shrink-0">
                                <Image
                                    src="/erg.png"
                                    alt="ERG Logo"
                                    width={110}
                                    height={60}
                                    className="object-contain w-auto h-[55px] md:h-[64px]"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl md:text-2xl font-extrabold leading-none tracking-tight text-primary">
                                    EDURISE GLOBAL
                                </h1>
                                <p className="text-[10px] md:text-xs font-semibold tracking-widest text-gray-500 uppercase mt-1">
                                    Learn today, Lead tomorrow
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
                            {THQT_MENU_ITEMS.map((item) => {
                                const hasSubmenu = item.children && item.children.length > 0;
                                const isActive = pathname === item.path || (hasSubmenu && item.children?.some(sub => sub.path === pathname));

                                return (
                                    <div key={item.label} className="relative group py-4">
                                        {hasSubmenu ? (
                                            // SỬA ĐỔI: Dùng Link thay vì button để click được vào trang cha
                                            <Link
                                                href={item.path}
                                                className={`flex items-center gap-1 text-lg font-bold uppercase tracking-wide transition-colors duration-300
                                                    ${isActive ? 'text-highlight' : 'text-primary'}
                                                    group-hover:text-highlight
                                                `}
                                            >
                                                {item.label}
                                                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-300" strokeWidth={3} />
                                            </Link>
                                        ) : (
                                            <Link
                                                href={item.path}
                                                className={`text-lg font-bold uppercase tracking-wide transition-all duration-300 relative
                                                    ${isActive ? 'text-highlight' : 'text-primary hover:text-highlight'}
                                                    after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[3px] 
                                                    after:bg-highlight after:transition-all after:duration-300 group-hover:after:w-full
                                                `}
                                            >
                                                {item.label}
                                            </Link>
                                        )}

                                        {hasSubmenu && (
                                            <div className="absolute top-full left-0 pt-3 w-72 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out z-50">
                                                <div className="bg-white rounded-lg shadow-xl overflow-hidden ring-1 ring-black/5">
                                                    <ul className="py-2">
                                                        {item.children?.map((subItem) => (
                                                            <li key={subItem.path}>
                                                                <Link
                                                                    href={subItem.path}
                                                                    className="block px-6 py-3.5 text-base font-medium text-gray-600 hover:text-primary hover:bg-slate-50 transition-colors"
                                                                >
                                                                    {subItem.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* --- SEARCH --- */}
                            <div className="flex items-center ml-2 relative">
                                <div
                                    className={`
                                        flex items-center overflow-hidden transition-all duration-300 ease-in-out
                                        ${isSearchOpen ? 'w-60 opacity-100 mr-2' : 'w-0 opacity-0 mr-0'}
                                    `}
                                >
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gray-300 text-sm text-gray-700 bg-gray-50"
                                    />
                                </div>

                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={`p-2 rounded-full transition-colors duration-300 hover:bg-gray-100
                                        ${isSearchOpen ? 'text-primary bg-gray-100' : 'text-primary'}
                                    `}
                                    aria-label="Tìm kiếm"
                                >
                                    {isSearchOpen ? <X size={24} /> : <Search size={24} />}
                                </button>
                            </div>

                        </nav>

                        {/* Mobile Toggle Button */}
                        <button
                            className="lg:hidden p-2 text-primary"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* --- Mobile Menu Drawer --- */}
            <div
                className={`fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                } lg:hidden`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                        <span className="text-xl font-bold text-primary">MENU</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white rounded-full shadow-sm text-gray-500">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="mb-6 relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-200"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>

                        <nav className="flex flex-col gap-3">
                            {THQT_MENU_ITEMS.map((item) => {
                                const hasSubmenu = item.children && item.children.length > 0;
                                const isOpen = mobileSubmenuOpen === item.label;

                                return (
                                    <div key={item.label} className="border-b border-gray-50 last:border-none">
                                        {hasSubmenu ? (
                                            <>
                                                {/* SỬA ĐỔI: Tách Link (Chữ) và Button (Mũi tên) riêng biệt */}
                                                <div className="flex items-center justify-between w-full py-4">
                                                    {/* Phần chữ: Click vào để chuyển trang */}
                                                    <Link
                                                        href={item.path}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`text-lg font-bold uppercase transition-colors flex-1 ${isOpen ? 'text-highlight' : 'text-primary'
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </Link>

                                                    {/* Phần mũi tên: Click vào để sổ menu */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Ngăn chặn sự kiện click lan ra ngoài
                                                            toggleMobileSubmenu(item.label);
                                                        }}
                                                        className={`p-2 transition-colors ${isOpen ? 'text-highlight' : 'text-primary'}`}
                                                    >
                                                        <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>

                                                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className="bg-gray-50 rounded-lg mb-4 p-2 space-y-1">
                                                        {item.children?.map(sub => (
                                                            <Link
                                                                key={sub.path}
                                                                href={sub.path}
                                                                className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-primary hover:bg-white rounded-md transition-colors"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {sub.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.path}
                                                className="block py-4 text-lg font-bold uppercase text-primary hover:text-highlight transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <span className="text-gray-500 font-medium">Ngôn ngữ:</span>
                                <div className="flex items-center gap-2">
                                    <button className="text-highlight font-bold">VN</button>
                                    <span className="text-gray-300">|</span>
                                    <button className="text-gray-500 hover:text-primary">EN</button>
                                </div>
                            </div>

                            <div className="flex justify-center gap-8">
                                <a href="#" className="text-primary hover:scale-110 transition-transform"><Facebook size={32} /></a>
                                <a href="#" className="text-highlight hover:scale-110 transition-transform"><Youtube size={32} /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
};

export default Header;