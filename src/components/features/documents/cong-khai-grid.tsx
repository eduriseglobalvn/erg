'use client';

import { FileText, Lock, Eye } from 'lucide-react';
import type { PublicDocument } from '@/services/documents.service';

interface DocumentCardProps {
  doc: PublicDocument;
  onView: (id: string) => void;
}

function DocumentCard({ doc, onView }: DocumentCardProps) {
  return (
    <button
      onClick={() => onView(doc.id)}
      className="group relative flex flex-col items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left w-full"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
          <FileText className="w-5 h-5 text-red-500" />
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
          PDF
        </span>
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
        {doc.title}
      </h3>

      {doc.description && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{doc.description}</p>
      )}

      <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-gray-50">
        <span className="text-xs text-gray-400">
          {new Date(doc.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
          <Eye className="w-3.5 h-3.5" /> Xem
        </span>
      </div>
    </button>
  );
}

interface CongKhaiGridProps {
  documents: PublicDocument[];
  onViewDocument: (id: string) => void;
  isLoading?: boolean;
}

export function CongKhaiGrid({ documents, onViewDocument, isLoading }: CongKhaiGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100" />
              <div className="w-12 h-5 rounded-full bg-gray-100" />
            </div>
            <div className="h-5 rounded bg-gray-100 mb-2" />
            <div className="h-5 w-3/4 rounded bg-gray-100 mb-4" />
            <div className="h-3 w-1/2 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Lock className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium mb-1">Chưa có tài liệu công khai</p>
        <p className="text-sm text-gray-400">Vui lòng quay lại sau.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} onView={onViewDocument} />
      ))}
    </div>
  );
}
