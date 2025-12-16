
export default function IC3Page() {
  return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-orange-50">
        <div className="p-10 border-4 border-orange-500 rounded-xl bg-white shadow-xl">
          <h1 className="text-5xl font-bold text-orange-600 mb-4">
            IC3 CERTIFICATION
          </h1>
          <p className="text-xl text-gray-700 text-center">
            Đây là trang dành riêng cho chứng chỉ IC3.
            <br />
            Domain hiện tại: <strong>ic3.erg.edu.local</strong>
          </p>
          <button className="mt-6 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            Đăng ký thi ngay
          </button>
        </div>
      </div>
  );
}