import React from "react";

const EventCreatePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">이벤트 생성 페이지</h1>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ EventCreatePage 모듈이 성공적으로 로드되었습니다!
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCreatePage;
