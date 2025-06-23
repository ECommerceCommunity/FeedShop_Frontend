import { useState, FC } from "react";
import { StarIcon } from '@heroicons/react/20/solid'
import reviews from "../../pages/data/reviews/reviews.json";
import brands from "../../pages/data/products/brands.json";
import RegisterStoreModal from "../../pages/stores/registerStores/RegisterStoreModal";
import EditStoreModal from "pages/stores/editStores/EditStoreModal";

const StoreHomePage: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleToggleReviews = () => setShowAllReviews((prev) => !prev);
  return (
    <>
      {showRegisterModal && (
        <RegisterStoreModal onClose={() => setShowRegisterModal(false)} />
      )}
      {showEditModal && (
        <EditStoreModal
          onClose={() => setShowEditModal(false)}
          storeData={selectedStore}
        />
      )}
      <div className="min-h-screen flex flex-col bg-slate-50">
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMobileMenu}
          ></div>
        )}

        <main className="pt-[60px] min-h-[calc(100vh-60px)] transition-all ml-0 md:ml-[60px]">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
              <div className="flex gap-2">
                <button className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 whitespace-nowrap">
                  <i className="fas fa-sync-alt mr-2"></i>새로고침
                </button>
                <button
                  className="bg-gradient-to-r from-sky-300 to-sky-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
                  onClick={() => setShowRegisterModal(true)}
                >
                  <i className="fas fa-plus mr-2"></i>새 상점 등록
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* 오늘 주문 */}
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500 mb-1">오늘 주문</p>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-100 mr-2"></div>
                  <h3 className="text-xl font-bold text-gray-800">32</h3>
                </div>
                <p className="text-xs text-green-500 mt-1">12% 증가</p>
              </div>

              {/* 오늘 매출 */}
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500 mb-1">오늘 매출</p>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-100 mr-2"></div>
                  <h3 className="text-xl font-bold text-gray-800">487,000원</h3>
                </div>
                <p className="text-xs text-green-500 mt-1">8% 증가</p>
              </div>

              {/* 방문자 */}
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500 mb-1">방문자</p>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-orange-100 mr-2"></div>
                  <h3 className="text-xl font-bold text-gray-800">1,248</h3>
                </div>
                <p className="text-xs text-red-500 mt-1">3% 감소</p>
              </div>

              {/* 평균 평점 */}
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500 mb-1">평균 평점</p>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-100 mr-2"></div>
                  <h3 className="text-xl font-bold text-gray-800">4.8/5</h3>
                </div>
                <p className="text-xs text-green-500 mt-1">0.2 증가</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">최근 주문</h2>
                  <button
                    type="button"
                    className="text-sm text-sky-400 hover:underline bg-transparent border-none p-0 m-0 cursor-pointer"
                    onClick={() => {/* TODO: handle '모두 보기' action */ }}
                  >
                    모두 보기
                  </button>
                </div>
                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-sm text-gray-700">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 text-left">주문 번호</th>
                        <th className="pb-3 text-left">메뉴</th>
                        <th className="pb-3 text-left">금액</th>
                        <th className="pb-3 text-left">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b last:border-0">
                        <td className="py-3">#ORD-7895</td>
                        <td className="py-3">불고기 버거 세트</td>
                        <td className="py-3">12,500원</td>
                        <td className="py-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">배달 완료</span>
                        </td>
                      </tr>
                      {/** 다른 주문들도 반복 구성 */}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">인기 메뉴</h2>
                  <button
                    type="button"
                    className="text-sm text-sky-400 hover:underline bg-transparent border-none p-0 m-0 cursor-pointer"
                    onClick={() => {/* TODO: handle '모두 보기' action */ }}
                  >
                    모두 보기
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                      <img src="https://via.placeholder.com/48" alt="menu" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">불고기 버거</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="text-yellow-400 mr-1">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star-half-alt"></i>
                          </div>
                          <span>4.5 (128)</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">8,500원</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {brands.map((brand) => (
                <div key={brand.store_id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <img src={brand.brand_logo_url} alt={brand.store_name} className="w-12 h-12 mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{brand.store_name}</h3>
                      <p className="text-sm text-gray-500">{brand.brand_likes.toLocaleString()} likes</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{brand.brand_info}</p>
                  <button
                    className="text-sm text-sky-500 hover:underline"
                    onClick={() => {
                      setSelectedStore(brand);
                      setShowEditModal(true);
                    }}
                  >
                    수정
                  </button>
                </div>
              ))}
            </div>

            {/* 최근 리뷰 */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">최근 리뷰</h2>
                <button
                  type="button"
                  className="text-sm text-sky-400 hover:underline bg-transparent border-none p-0 m-0 cursor-pointer"
                  onClick={handleToggleReviews}
                >
                  {showAllReviews ? "접기" : "모두 보기"}
                </button>
              </div>

              <div className="p-6 space-y-6">
                {(showAllReviews ? reviews : reviews.slice(0, 10)).map((review) => (
                  <div
                    key={review.id}
                    className="-mx-6 px-6 border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          <img src={review.userImage} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-800">{review.userName}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <div className="flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <span className="ml-2">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                        {review.product_id}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">{review.content}</p>
                    <div className="mt-3 flex gap-4 text-xs text-gray-500">
                      <button className="flex items-center hover:text-sky-400">
                        <i className="fas fa-reply mr-1"></i>답글 달기
                      </button>
                      <button className="flex items-center hover:text-sky-400">
                        <i className="fas fa-heart mr-1"></i>감사 표시
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 카드 3개 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">빠른 작업</h2>
                  <i className="fas fa-bolt text-sky-400"></i>
                </div>
                <div className="space-y-3">
                  <button
                    type="button"
                    className="flex items-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 w-full text-left"
                  >
                    <i className="fas fa-plus-circle text-emerald-500 mr-3"></i>
                    <span className="text-gray-700">새 메뉴 추가</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">공지사항</h2>
                  <i className="fas fa-bullhorn text-sky-400"></i>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">6월 프로모션 안내</h3>
                    <p className="text-xs text-gray-500">2025-06-01</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">도움말</h2>
                  <i className="fas fa-question-circle text-sky-400"></i>
                </div>
                <div className="space-y-3">
                  <button
                    type="button"
                    className="flex items-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 w-full text-left"
                  >
                    <i className="fas fa-book text-teal-500 mr-3"></i>
                    <span className="text-gray-700">사용자 가이드</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <div
          className={`fixed top-20 right-4 max-w-xs bg-white rounded-lg shadow-lg p-4 flex items-start z-50 transform transition-transform duration-300 ${showToast ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <i className="fas fa-check text-green-500"></i>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-800">성공!</h3>
            <p className="text-xs text-gray-600 mt-1">최신 데이터로 업데이트되었습니다.</p>
          </div>
          <button
            className="ml-4 text-gray-400 hover:text-gray-600"
            onClick={() => setShowToast(false)}
            title="닫기"
            aria-label="닫기"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </>
  );
};
export default StoreHomePage;