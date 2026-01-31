
'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
const PHONE_NUMBER = "0766144888";

const FloatingContact: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Nút GỌI ĐIỆN THOẠI (CALL) */}
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="group flex items-center justify-center w-12 h-12 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 animate-bounce-slow relative"
        title="Gọi Điện"
        data-analytics="click_contact_phone"
        data-analytics-metadata='{"number": "0766144888"}'
      >
        <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Gọi ngay {PHONE_NUMBER}
        </span>
        <Phone className="text-white" size={24} />
      </a>
      {/* Nút Zalo */}
      <a
        href="https://zalo.me/0766144888"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 animate-bounce-slow relative"
        title="Chat Zalo"
        data-analytics="click_contact_zalo"
      >
        <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat Zalo
        </span>
        <span className="font-bold text-white text-xs">Zalo</span>
      </a>

      {/* Nút Messenger */}
      <a
        href="https://m.me/1599144906818434"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-blue-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-pulse-slow relative"
        title="Chat Messenger"
        data-analytics="click_contact_messenger"
      >
        <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Messenger
        </span>
        <MessageCircle className="text-white" size={24} />
      </a>
    </div>
  );
};

export default FloatingContact;
