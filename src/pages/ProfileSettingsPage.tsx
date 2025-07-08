import { useState, useRef, ChangeEvent, FC } from "react";
import { useNavigate } from "react-router-dom";

const ProfileSettingsPage: FC = () => {
  const navigate = useNavigate();

  // 프로필 정보 상태
  const [profileInfo, setProfileInfo] = useState({
    name: "김민지",
    nickname: "쇼핑하는민지",
    email: "minji@example.com",
    phone: "010-1234-5678",
    profileImage:
      "https://readdy.ai/api/search-image?query=casual%20portrait%20photo%20of%20a%20young%20Asian%20woman%20with%20friendly%20smile%20natural%20makeup%20simple%20clean%20background%20high%20quality%20professional%20headshot%20minimalist%20style%20soft%20lighting%20warm%20expression&width=120&height=120&seq=1&orientation=squarish",
    userId: "minji2025",
    level: "GOLD",
    points: 12500,
    coupons: [
      { id: 1, name: "신규 가입 15% 할인", expiry: "2025-07-29", discount: 15 },
      {
        id: 2,
        name: "여름 시즌 10,000원 할인",
        expiry: "2025-08-31",
        minPurchase: 50000,
        discount: 10000,
      },
      { id: 3, name: "VIP 무료배송", expiry: "2025-12-31", type: "shipping" },
    ],
    purchaseAmount: 1250000,
    reviewCount: 25,
    lastLogin: "2025-06-28 15:45:32",
    createdAt: "2024-03-15",
  });

  // 알림 설정 상태
  const [notifications, setNotifications] = useState({
    email: {
      notice: true,
      security: true,
      marketing: false,
    },
    push: {
      chat: true,
      comment: true,
      like: false,
    },
  });

  // 파일 입력 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 변경 여부 상태
  const [isChanged, setIsChanged] = useState(false);

  // 프로필 정보 변경 핸들러
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileInfo({
      ...profileInfo,
      [name]: value,
    });
    setIsChanged(true);
  };

  // 알림 설정 변경 핸들러
  const handleNotificationChange = (
    category: "email" | "push",
    type: string
  ) => {
    setNotifications({
      ...notifications,
      [category]: {
        ...notifications[category],
        [type]:
          !notifications[category][
            type as keyof (typeof notifications)[typeof category]
          ],
      },
    });
    setIsChanged(true);
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileInfo({
          ...profileInfo,
          profileImage: reader.result as string,
        });
        setIsChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 삭제 핸들러
  const handleRemoveProfileImage = () => {
    setProfileInfo({
      ...profileInfo,
      profileImage:
        "https://readdy.ai/api/search-image?query=minimal%20placeholder%20profile%20avatar%20icon%20with%20light%20gray%20background%20simple%20outline%20of%20a%20person%20silhouette%20professional%20clean%20design&width=120&height=120&seq=2&orientation=squarish",
    });
    setIsChanged(true);
  };

  // 저장 핸들러
  const handleSave = () => {
    // 실제 구현에서는 API 호출로 저장
    alert("변경사항이 저장되었습니다.");
    setIsChanged(false);
  };

  // 취소 핸들러
  const handleCancel = () => {
    // 원래 상태로 되돌리기
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 메인 콘텐츠 */}
      <div className="flex flex-1 pt-4">
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* 페이지 헤더 */}
            <div className="mb-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  프로필 설정
                </h1>
              </div>
              <nav className="flex mt-2" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-1 text-sm text-gray-500">
                  <li>
                    <a href="#" className="hover:text-gray-700">
                      홈
                    </a>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-chevron-right text-xs mx-1"></i>
                    <span className="text-gray-700">프로필 설정</span>
                  </li>
                </ol>
              </nav>
            </div>

            {/* 프로필 정보 섹션 */}
            <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  프로필 정보
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  계정의 기본 정보를 관리합니다.
                </p>
              </div>
              <div className="px-6 py-5">
                <div className="flex flex-col md:flex-row">
                  {/* 프로필 이미지 영역 */}
                  <div className="flex flex-col items-center md:w-1/3 mb-6 md:mb-0">
                    <div className="relative">
                      <div
                        className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg cursor-pointer"
                        onClick={handleProfileImageClick}
                      >
                        <img
                          src={profileInfo.profileImage}
                          alt="프로필 이미지"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <button
                        className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-md hover:bg-blue-600 transition-colors cursor-pointer"
                        onClick={handleProfileImageClick}
                      >
                        <i className="fas fa-camera"></i>
                      </button>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                        onClick={handleProfileImageClick}
                      >
                        이미지 변경
                      </button>
                      <button
                        className="bg-gray-50 text-gray-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={handleRemoveProfileImage}
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  {/* 기본 정보 입력 폼 */}
                  <div className="md:w-2/3 md:pl-8">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          이름
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={profileInfo.name}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="nickname"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          닉네임
                        </label>
                        <input
                          type="text"
                          id="nickname"
                          name="nickname"
                          value={profileInfo.nickname}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          이메일
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileInfo.email}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-50 text-gray-500 text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          이메일은 변경할 수 없습니다.
                        </p>
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          연락처
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profileInfo.phone}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 멤버십 정보 섹션 */}
            <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  멤버십 정보
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  회원 등급 및 혜택 정보입니다.
                </p>
              </div>
              <div className="px-6 py-5">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  {/* 등급 및 포인트 정보 */}
                  <div className="w-full md:w-1/2">
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600">현재 등급</p>
                          <h3 className="text-2xl font-bold text-yellow-700">
                            {profileInfo.level}
                          </h3>
                        </div>
                        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                          <i className="fas fa-crown text-3xl text-white"></i>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            누적 구매금액
                          </span>
                          <span className="text-sm font-medium">
                            {profileInfo.purchaseAmount.toLocaleString()}원
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            작성 리뷰
                          </span>
                          <span className="text-sm font-medium">
                            {profileInfo.reviewCount}개
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600">보유 포인트</p>
                          <h3 className="text-2xl font-bold text-blue-600">
                            {profileInfo.points.toLocaleString()}P
                          </h3>
                        </div>
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                          <i className="fas fa-coins text-3xl text-white"></i>
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                        포인트 내역 보기
                      </button>
                    </div>
                  </div>

                  {/* 보유 쿠폰 */}
                  <div className="w-full md:w-1/2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        보유 쿠폰
                      </h3>
                      <button className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        전체 쿠폰 보기
                      </button>
                    </div>
                    <div className="space-y-4">
                      {profileInfo.coupons.map((coupon) => (
                        <div
                          key={coupon.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-md font-medium text-gray-900">
                                {coupon.name}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {coupon.type === "shipping"
                                  ? "무료배송"
                                  : coupon.discount && coupon.discount > 100
                                  ? `${coupon.discount.toLocaleString()}원 할인`
                                  : coupon.discount
                                  ? `${coupon.discount}% 할인`
                                  : "할인"}
                              </p>
                              {coupon.minPurchase && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {coupon.minPurchase.toLocaleString()}원 이상
                                  구매시
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">유효기간</p>
                              <p className="text-sm text-gray-700">
                                {coupon.expiry}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 계정 정보 섹션 */}
            <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">계정 정보</h2>
                <p className="mt-1 text-sm text-gray-500">
                  기본 계정 정보입니다.
                </p>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">
                        아이디
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {profileInfo.userId}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">
                        닉네임
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {profileInfo.nickname}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">
                        마지막 로그인
                      </span>
                      <span className="text-sm text-gray-900">
                        {profileInfo.lastLogin}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-500">
                        가입일
                      </span>
                      <span className="text-sm text-gray-900">
                        {profileInfo.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 알림 설정 섹션 */}
            <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">알림 설정</h2>
                <p className="mt-1 text-sm text-gray-500">
                  알림 수신 방법을 설정합니다.
                </p>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 이메일 알림 설정 */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      이메일 알림
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            공지사항 알림
                          </p>
                          <p className="text-xs text-gray-500">
                            새로운 공지사항이 등록되면 알림을 받습니다.
                          </p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="notice-toggle"
                            checked={notifications.email.notice}
                            onChange={() =>
                              handleNotificationChange("email", "notice")
                            }
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="notice-toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notifications.email.notice
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            보안 알림
                          </p>
                          <p className="text-xs text-gray-500">
                            계정 보안 관련 변경사항을 알립니다.
                          </p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="security-toggle"
                            checked={notifications.email.security}
                            onChange={() =>
                              handleNotificationChange("email", "security")
                            }
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="security-toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notifications.email.security
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            마케팅 알림
                          </p>
                          <p className="text-xs text-gray-500">
                            새로운 기능 및 이벤트 정보를 받습니다.
                          </p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="marketing-toggle"
                            checked={notifications.email.marketing}
                            onChange={() =>
                              handleNotificationChange("email", "marketing")
                            }
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="marketing-toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notifications.email.marketing
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 푸시 알림 설정 */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      푸시 알림
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            채팅 메시지 알림
                          </p>
                          <p className="text-xs text-gray-500">
                            새로운 채팅 메시지를 받으면 알립니다.
                          </p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="chat-toggle"
                            checked={notifications.push.chat}
                            onChange={() =>
                              handleNotificationChange("push", "chat")
                            }
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="chat-toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notifications.push.chat
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            댓글 알림
                          </p>
                          <p className="text-xs text-gray-500">
                            내 게시글에 새 댓글이 달리면 알립니다.
                          </p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="comment-toggle"
                            checked={notifications.push.comment}
                            onChange={() =>
                              handleNotificationChange("push", "comment")
                            }
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="comment-toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notifications.push.comment
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            좋아요 알림
                          </p>
                          <p className="text-xs text-gray-500">
                            내 게시글에 좋아요를 받으면 알립니다.
                          </p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="like-toggle"
                            checked={notifications.push.like}
                            onChange={() =>
                              handleNotificationChange("push", "like")
                            }
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                          />
                          <label
                            htmlFor="like-toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notifications.push.like
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                          ></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="flex justify-end space-x-4 mb-8">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={!isChanged}
                className={`px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
                  isChanged
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300 cursor-not-allowed"
                }`}
              >
                변경사항 저장
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* 푸터 */}
      <footer className="bg-white shadow-inner mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                © 2025 E-Commerce + 커뮤니티 채팅 서비스. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                이용약관
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                개인정보처리방침
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
                고객센터
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 토글 스위치 스타일 */}
      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #ffffff;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #e5e7eb;
          transition: all 0.3s;
        }
        .toggle-label {
          transition: background-color 0.3s;
        }
      `}</style>
    </div>
  );
};

export default ProfileSettingsPage;
