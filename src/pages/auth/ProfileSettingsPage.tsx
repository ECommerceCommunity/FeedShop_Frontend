import { useState, useRef, ChangeEvent, FC } from "react";

const ProfileSettingsPage: FC = () => {
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChanged, setIsChanged] = useState(false);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileInfo({ ...profileInfo, [name]: value });
    setIsChanged(true);
  };

  const handleNotificationChange = <
    T extends keyof typeof notifications,
    K extends keyof (typeof notifications)[T]
  >(
    category: T,
    type: K
  ) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
    setIsChanged(true);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileInfo({ ...profileInfo, profileImage: reader.result as string });
        setIsChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileInfo({
      ...profileInfo,
      profileImage:
        "https://readdy.ai/api/search-image?query=minimal%20placeholder%20profile%20avatar%20icon%20with%20light%20gray%20background%20simple%20outline%20of%20a%20person%20silhouette%20professional%20clean%20design&width=120&height=120&seq=2&orientation=squarish",
    });
    setIsChanged(true);
  };

  const handleSave = () => {
    alert("변경사항이 저장되었습니다.");
    setIsChanged(false);
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
            프로필 설정
          </h1>
          <p className="text-xl text-gray-400">
            계정 및 환경설정을 관리하여 경험을 개인화하세요.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <img
                    src={profileInfo.profileImage}
                    alt="프로필"
                    className="w-full h-full rounded-full object-cover border-4 border-gray-700 shadow-md"
                  />
                  <button
                    onClick={handleProfileImageClick}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition-transform transform hover:scale-110"
                  >
                    <i className="fas fa-camera"></i>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <h2 className="text-2xl font-bold text-white">{profileInfo.name}</h2>
                <p className="text-gray-400">@{profileInfo.nickname}</p>
                <button
                  onClick={handleRemoveProfileImage}
                  className="mt-4 text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  사진 삭제
                </button>
              </div>
            </section>

            <section className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">멤버십</h2>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">{profileInfo.level} 등급</span>
                  <i className="fas fa-crown text-2xl"></i>
                </div>
                <div className="text-sm opacity-80">
                  <p>누적 구매 금액: ₩{profileInfo.purchaseAmount.toLocaleString()}</p>
                  <p>리뷰 수: {profileInfo.reviewCount}</p>
                </div>
              </div>
              <div className="bg-gray-700 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">포인트</span>
                  <span className="text-2xl font-bold text-orange-400">{profileInfo.points.toLocaleString()}P</span>
                </div>
                <button className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  포인트 내역 보기
                </button>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">계정 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                    이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileInfo.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-400 mb-1">
                    닉네임
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={profileInfo.nickname}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileInfo.email}
                    readOnly
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                    연락처
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileInfo.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </section>

            <section className="bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">알림 설정</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">이메일 알림</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">공지</span>
                      <button
                        onClick={() => handleNotificationChange("email", "notice")}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications.email.notice ? 'bg-orange-500' : 'bg-gray-600'}`}>
                        <span className={`block w-6 h-6 rounded-full bg-white transform transition-transform ${notifications.email.notice ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">보안</span>
                      <button
                        onClick={() => handleNotificationChange("email", "security")}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications.email.security ? 'bg-orange-500' : 'bg-gray-600'}`}>
                        <span className={`block w-6 h-6 rounded-full bg-white transform transition-transform ${notifications.email.security ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">마케팅</span>
                      <button
                        onClick={() => handleNotificationChange("email", "marketing")}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications.email.marketing ? 'bg-orange-500' : 'bg-gray-600'}`}>
                        <span className={`block w-6 h-6 rounded-full bg-white transform transition-transform ${notifications.email.marketing ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">푸시 알림</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">채팅</span>
                      <button
                        onClick={() => handleNotificationChange("push", "chat")}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications.push.chat ? 'bg-orange-500' : 'bg-gray-600'}`}>
                        <span className={`block w-6 h-6 rounded-full bg-white transform transition-transform ${notifications.push.chat ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">댓글</span>
                      <button
                        onClick={() => handleNotificationChange("push", "comment")}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications.push.comment ? 'bg-orange-500' : 'bg-gray-600'}`}>
                        <span className={`block w-6 h-6 rounded-full bg-white transform transition-transform ${notifications.push.comment ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">좋아요</span>
                      <button
                        onClick={() => handleNotificationChange("push", "like")}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications.push.like ? 'bg-orange-500' : 'bg-gray-600'}`}>
                        <span className={`block w-6 h-6 rounded-full bg-white transform transition-transform ${notifications.push.like ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">내 쿠폰</h2>
              <div className="space-y-4">
                {profileInfo.coupons.map((coupon) => (
                  <div key={coupon.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-white">{coupon.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {coupon.type === "shipping"
                          ? "무료 배송"
                          : coupon.discount !== undefined
                          ? `${coupon.discount > 100 ? '₩' : ''}${coupon.discount.toLocaleString()}${coupon.discount <= 100 ? '%' : ''} 할인`
                          : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">만료일</p>
                      <p className="text-sm text-gray-300">{coupon.expiry}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-orange-400 hover:underline">
                모든 쿠폰 보기
              </button>
            </section>
          </div>
        </div>

        <footer className="mt-12 flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 font-semibold hover:bg-gray-700 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!isChanged}
            className="px-6 py-3 border border-transparent rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            변경사항 저장
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;