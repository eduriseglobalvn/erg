'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Facebook, Youtube, ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { SchemaScript } from '@/components/seo/schema-script';

// Import Menu mặc định
import { MAIN_MENU_ITEMS } from '@/constants/MenuItem';

// --- TYPE DEFINITIONS ---
export interface MenuItemType {
  label: string;
  path: string;
  children?: MenuItemType[];
}

interface HeaderProps {
  menuData?: MenuItemType[];
  hideTopBar?: boolean;
}

const Header: React.FC<HeaderProps> = ({ menuData = MAIN_MENU_ITEMS, hideTopBar = false }) => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(menuData);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('vi');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Read locale from cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (match) setCurrentLocale(match[1]);
  }, []);


  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Đóng mobile menu khi chuyển trang
    setIsMobileMenuOpen(false);
    setMobileSubmenuOpen(null);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const tc = useTranslations('common.Header');

  // Vercel Best Practice: Use stable lookups and hoist mapping logic where possible
  const translateLabel = (label: string) => {
    const keyMap: Record<string, string> = {
      'GIỚI THIỆU': 'menu.introduction',
      'LĨNH VỰC ĐÀO TẠO': 'menu.training_programs',
      'TIN TỨC': 'menu.news',
      'CƠ HỘI NGHỀ NGHIỆP': 'menu.careers',
      'LIÊN HỆ': 'menu.contact',
      'TUYỂN DỤNG': 'menu.recruitment',
      'VĂN HÓA': 'menu.culture',
      'CHÍNH SÁCH NHÂN SỰ': 'menu.policy',
      'Trang Chủ': 'home',
    };
    const key = keyMap[label];
    return key ? tc(key as any) : label;
  };

  const toggleMobileSubmenu = (label: string) => {
    setMobileSubmenuOpen(prev => prev === label ? null : label);
  };

  return (
    <>
      {/* Cấu trúc Header Mặc Định - Add Navigation Schema cho SEO */}
      <SchemaScript type="SiteNavigationElement" data={menuItems} />

      {/* --- HEADER DESKTOP (Giữ nguyên) --- */}
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
          {/* ... (Phần Top Bar và Logo giữ nguyên code cũ) ... */}
          <div className={`hidden lg:flex justify-between items-center text-xs font-medium text-gray-500 mb-2 border-b border-gray-100 pb-2 transition-all duration-300 ${hideTopBar || isScrolled ? 'h-0 opacity-0 overflow-hidden mb-0 pb-0' : 'opacity-100'}`}>
            <div className="flex gap-4">
              <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                <Phone size={14} className="text-highlight" /> Hotline: 0766.144.888
              </span>
              <span className="hover:text-primary transition-colors cursor-pointer">
                Email: info@erg.edu.vn
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-3 border-r border-gray-200 pr-4">
                <a href="https://www.facebook.com/eduriseerg" className="hover:text-primary transition-colors"><Facebook size={16} /></a>
                <a href="#" className="hover:text-highlight transition-colors"><Youtube size={16} /></a>
              </div>

              <LanguageSwitcher currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex-shrink-0">
                <Image
                  src="https://media.erg.edu.vn/logo/erg.png"
                  alt="ERG Logo"
                  width={117}
                  height={64}
                  className="object-contain w-[100px] md:w-[117px]"
                  style={{ width: 'auto', height: 'auto' }}
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
              {menuItems.map((item) => {
                const hasSubmenu = item.children && item.children.length > 0;
                const isActive = pathname === item.path || (hasSubmenu && item.children?.some(sub => sub.path === pathname));

                return (
                  <div key={item.label} className="relative group py-4">
                    <Link
                      href={item.path}
                      onClick={(e) => {
                        if (item.path.startsWith('#')) {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent('open-elearning-modal', { detail: item.path.substring(1) }));
                        }
                      }}
                      className={`flex items-center gap-1 text-lg font-bold uppercase tracking-wide transition-all duration-300 relative
                                ${isActive ? 'text-highlight' : 'text-primary hover:text-highlight'}
                                ${!hasSubmenu ? "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[3px] after:bg-highlight after:transition-all after:duration-300 group-hover:after:w-full" : ''}
                            `}
                    >
                      {translateLabel(item.label)}
                      {hasSubmenu && (
                        <ChevronDown
                          size={16}
                          className="group-hover:rotate-180 transition-transform duration-300"
                          strokeWidth={3}
                        />
                      )}
                    </Link>
                    {hasSubmenu && (
                      <div className="absolute top-full left-0 pt-3 w-72 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out z-50">
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden ring-1 ring-black/5">
                          <ul className="py-2">
                            {item.children?.map((subItem) => {
                              const isExternal = subItem.path.startsWith('http');
                              return (
                                <li key={subItem.path}>
                                  <Link
                                    href={subItem.path}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    className="block px-6 py-3.5 text-base font-medium text-gray-600 hover:text-primary hover:bg-slate-50 transition-colors"
                                  >
                                    {translateLabel(subItem.label)}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Search Desktop */}
              <div className="flex items-center ml-2 relative">
                <div className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-60 opacity-100 mr-2' : 'w-0 opacity-0 mr-0'}`}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={`${tc('search')}...`}
                    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-gray-300 text-sm text-gray-700 bg-gray-50"
                  />
                </div>
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`p-2 rounded-full transition-colors duration-300 hover:bg-gray-100 ${isSearchOpen ? 'text-primary bg-gray-100' : 'text-primary'}`}>
                  {isSearchOpen ? <X size={24} /> : <Search size={24} />}
                </button>
              </div>
            </nav>

            {/* Mobile Toggle Button (Menu Icon) */}
            <button className="lg:hidden p-2 text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU DRAWER (CẬP NHẬT) --- */}
      <div
        className={`fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } lg:hidden`}
      >
        <div className="flex flex-col h-full relative">

          {/* 1. Nút Close (X) được đặt absolute ở góc phải trên.
               Không còn thanh header xám chiếm chỗ nữa.
            */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-red-500 transition-colors bg-white/80 rounded-full"
          >
            <X size={28} />
          </button>

          <div className="flex-1 overflow-y-auto p-6 pt-16">
            {/* pt-16 để nội dung không bị đè lên bởi nút X */}

            {/* Mobile Search */}
            <div className="mb-6 relative">
              <input type="text" placeholder={`${tc('search')}...`} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-200" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            <nav className="flex flex-col gap-3">
              {menuItems.map((item) => {
                const hasSubmenu = item.children && item.children.length > 0;
                const isOpen = mobileSubmenuOpen === item.label;

                return (
                  <div key={item.label} className="border-b border-gray-50 last:border-none">
                    {hasSubmenu ? (
                      <>
                        <button
                          onClick={() => toggleMobileSubmenu(item.label)}
                          className={`flex items-center justify-between w-full py-4 text-left text-lg font-bold uppercase transition-colors ${isOpen ? 'text-highlight' : 'text-primary'
                            }`}
                        >
                          {translateLabel(item.label)}
                          <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="bg-gray-50 rounded-lg mb-4 p-2 space-y-1">
                            {item.children?.map(sub => {
                              const isExternal = sub.path.startsWith('http');
                              return (
                                <Link
                                  key={sub.path}
                                  href={sub.path}
                                  target={isExternal ? "_blank" : undefined}
                                  rel={isExternal ? "noopener noreferrer" : undefined}
                                  className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-primary hover:bg-white rounded-md transition-colors"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {translateLabel(sub.label)}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.path}
                        className="block py-4 text-lg font-bold uppercase text-primary hover:text-highlight transition-colors"
                        onClick={(e) => {
                          if (item.path.startsWith('#')) {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent('open-elearning-modal', { detail: item.path.substring(1) }));
                            setIsMobileMenuOpen(false);
                          } else {
                            setIsMobileMenuOpen(false);
                          }
                        }}
                      >
                        {translateLabel(item.label)}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-6 px-2 bg-slate-50/50 p-2 rounded-xl">
                <span className="text-[#00008b] font-bold text-sm tracking-wide">{tc('language')}:</span>
                <LanguageSwitcher currentLocale={currentLocale} />
              </div>
              <div className="flex justify-center gap-8">
                <a href="#" className="text-primary hover:scale-110 transition-transform"><Facebook size={32} /></a>
                <a href="#" className="text-highlight hover:scale-110 transition-transform"><Youtube size={32} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BACKDROP (CLICK OUTSIDE TO CLOSE) --- */}
      {/* Lớp này phủ kín màn hình (fixed inset-0).
            Khi click vào đây (vùng đen mờ), hàm setIsMobileMenuOpen(false) sẽ chạy.
        */}
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