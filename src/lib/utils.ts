import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Tách dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w\-]+/g, "") // Xóa ký tự đặc biệt
    .replace(/\-\-+/g, "-") // Xóa gạch ngang kép
    .replace(/^-+/, "") // Xóa gạch ngang đầu
    .replace(/-+$/, "") // Xóa gạch ngang cuối
}
