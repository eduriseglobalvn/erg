// src/app/@elearning/ho-tro/page.tsx
"use client";
import React from 'react';

export default function ElearningSupportPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Hỗ trợ học viên</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình học tập
                </p>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Liên hệ hỗ trợ</h3>
                        <div className="space-y-3">
                            <p><span className="font-medium">Email:</span> support@elearning.erg.edu.vn</p>
                            <p><span className="font-medium">Điện thoại:</span> 1900 1234</p>
                            <p><span className="font-medium">Thời gian làm việc:</span> Thứ 2 - Thứ 6, 8:00 - 17:00</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Câu hỏi thường gặp</h3>
                        <div className="space-y-2 text-gray-600">
                            <p>• Làm thế nào để đăng ký khóa học?</p>
                            <p>• Tôi có thể học thử miễn phí không?</p>
                            <p>• Làm thế nào để nhận chứng chỉ sau khóa học?</p>
                            <p>• Tôi quên mật khẩu, làm thế nào để khôi phục?</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                            Gửi yêu cầu hỗ trợ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}