import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const BecomeSellerPage: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: "",
    businessNumber: "",
    phoneNumber: "",
    address: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({
        type: "success",
        text: "판매자 신청이 성공적으로 제출되었습니다!",
      });
      setTimeout(() => navigate("/seller-mypage"), 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "신청서 제출 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
            판매자 되기
          </h1>
          <p className="text-xl text-gray-400">
            저희 마켓플레이스에 입점하여 전 세계 고객에게 상품을 판매하세요.
          </p>
        </header>

        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">왜 저희와 함께해야 할까요?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4">
                  <i className="fas fa-store text-3xl"></i>
                </div>
                <h3 className="text-lg font-semibold">상품 관리</h3>
                <p className="text-gray-400 text-sm">상품을 쉽게 등록, 관리 및 추적하세요.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4">
                  <i className="fas fa-chart-line text-3xl"></i>
                </div>
                <h3 className="text-lg font-semibold">판매 분석</h3>
                <p className="text-gray-400 text-sm">강력한 분석 대시보드로 통찰력을 얻으세요.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4">
                  <i className="fas fa-users text-3xl"></i>
                </div>
                <h3 className="text-lg font-semibold">고객 참여</h3>
                <p className="text-gray-400 text-sm">리뷰와 메시지를 통해 고객과 소통하세요.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4">
                  <i className="fas fa-truck text-3xl"></i>
                </div>
                <h3 className="text-lg font-semibold">배송 지원</h3>
                <p className="text-gray-400 text-sm">배송 및 주문 처리를 간소화하세요.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">판매자 신청서</h2>
          {message && (
            <div
              className={`p-4 rounded-md mb-6 text-center font-medium ${
                message.type === "success"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-400 mb-1">
                  상점명 *
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  placeholder="멋진 상점"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label htmlFor="businessNumber" className="block text-sm font-medium text-gray-400 mb-1">
                  사업자 등록번호 *
                </label>
                <input
                  type="text"
                  id="businessNumber"
                  name="businessNumber"
                  value={formData.businessNumber}
                  onChange={handleInputChange}
                  placeholder="000-00-00000"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-400 mb-1">
                  연락처 *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-1">
                  주소 *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="사업장 주소"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                상점 설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="상점과 판매 상품에 대해 알려주세요."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex items-center justify-center space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 border border-gray-600 rounded-lg text-gray-300 font-semibold hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 border border-transparent rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? "제출 중..." : "신청서 제출"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeSellerPage;