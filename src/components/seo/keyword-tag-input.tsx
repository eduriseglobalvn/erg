'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/admin/ui/input';
import { Badge } from '@/components/admin/ui/badge';

interface KeywordTagInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    onFetchAutocomplete?: (q: string) => Promise<string[]>;
}

export function KeywordTagInput({ value, onChange, placeholder = "Nhập từ khóa và ấn Enter...", onFetchAutocomplete }: KeywordTagInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = inputValue.trim();
            if (val && !value.includes(val)) {
                onChange([...value, val]);
                setInputValue("");
                setSuggestions([]);
            }
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

    const handleRemove = (kw: string) => {
        onChange(value.filter(item => item !== kw));
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const keywords = paste.split(/[,;\n]/).map(k => k.trim()).filter(Boolean);
        if (keywords.length > 0) {
            const newKeywords = Array.from(new Set([...value, ...keywords]));
            onChange(newKeywords);
        }
    };

    useEffect(() => {
        if (!onFetchAutocomplete || !inputValue) {
            setSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            onFetchAutocomplete(inputValue).then((data) => {
                if (data && data.length > 0) {
                    setSuggestions(data.filter(s => !value.includes(s)));
                } else {
                    setSuggestions([]);
                }
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [inputValue, onFetchAutocomplete, value]);

    // Handle clicks outside container to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddSuggestion = (kw: string) => {
        if (!value.includes(kw)) {
            onChange([...value, kw]);
            setInputValue("");
            setSuggestions([]);
            setIsFocused(false);
        }
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md max-w-full bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                {value.map(kw => (
                    <Badge key={kw} variant="secondary" className="px-2 py-1 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1">
                        {kw}
                        <button
                            type="button"
                            className="text-slate-500 hover:text-red-500 focus:outline-none"
                            onClick={() => handleRemove(kw)}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                <Input
                    className="flex-1 outline-none min-w-[120px] h-7 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-1 placeholder:text-muted-foreground w-auto"
                    placeholder={value.length === 0 ? placeholder : "Thêm..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onFocus={() => setIsFocused(true)}
                />
            </div>

            {/* Suggestions Dropdown */}
            {isFocused && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg overflow-hidden py-1">
                    {suggestions.map((s, idx) => (
                        <div
                            key={idx}
                            className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer transition-colors"
                            onMouseDown={(e) => {
                                e.preventDefault(); // Prevent input onBlur from firing before click
                                handleAddSuggestion(s);
                            }}
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
