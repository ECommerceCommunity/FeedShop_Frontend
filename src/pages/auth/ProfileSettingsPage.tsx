import { useState, useRef, ChangeEvent, FC, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  UserProfileService,
  UserProfileData,
  UpdateUserProfileRequest,
} from "../../api/userProfileService";
import { convertMockUrlToCdnUrl } from "../../utils/common/images";

const ProfileSettingsPage: FC = () => {
  const { user, handleUnauthorized } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [profileInfo, setProfileInfo] = useState<UserProfileData>({
    name: user?.name || "",
    nickname: user?.nickname || "",
    phone: "",
    birthDate: "",
    gender: "MALE",
    height: undefined,
    weight: undefined,
    footWidth: "NORMAL",
    footSize: undefined,
    profileImageUrl: "",
  });

  const [originalProfile, setOriginalProfile] =
    useState<UserProfileData | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 프로필 정보 로드
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        console.log("사용자 정보 없음: 로그인 페이지로 리다이렉트");
        window.location.href = "/login";
        return;
      }

      try {
        setLoading(true);
        const profileData = await UserProfileService.getUserProfile();
        console.log("로드된 프로필 데이터:", profileData);
        console.log("프로필 이미지 URL:", profileData.profileImageUrl);
        setProfileInfo(profileData);
        setOriginalProfile(profileData);
        setImageLoadError(false); // 새 프로필 로드 시 이미지 에러 상태 초기화
      } catch (err: any) {
        console.error("프로필 로드 실패:", err);

        // 401 에러 시 자동 로그아웃 처리
        if (err.response?.status === 401) {
          console.log("프로필 로드 중 401 에러: 자동 로그아웃 처리");
          handleUnauthorized();
          return;
        }

        // 더 구체적인 에러 메시지 표시
        if (err.response?.status === 500) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError("프로필 정보를 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, handleUnauthorized]);

  // 변경사항 감지
  const hasChanges = () => {
    if (!originalProfile) return false;

    return (
      profileInfo.name !== originalProfile.name ||
      profileInfo.nickname !== originalProfile.nickname ||
      profileInfo.phone !== originalProfile.phone ||
      profileInfo.birthDate !== originalProfile.birthDate ||
      profileInfo.gender !== originalProfile.gender ||
      profileInfo.height !== originalProfile.height ||
      profileInfo.footSize !== originalProfile.footSize ||
      profileInfo.profileImageUrl !== originalProfile.profileImageUrl
    );
  };

  const handleProfileChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileInfo((prev: UserProfileData) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? undefined : parseInt(value);
    setProfileInfo((prev: UserProfileData) => ({ ...prev, [name]: numValue }));
  };

  // 데이터 검증 함수 추가
  const validateProfileData = (
    data: UserProfileData
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // 필수 필드 검증
    if (!data.name || data.name.trim().length < 2) {
      errors.push("이름은 2자 이상 입력해주세요.");
    }

    if (!data.nickname || data.nickname.trim().length < 2) {
      errors.push("닉네임은 2자 이상 입력해주세요.");
    }

    if (
      !data.phone ||
      !/^[0-9-]{10,11}$/.test(data.phone.replace(/[^0-9-]/g, ""))
    ) {
      errors.push("전화번호는 10-11자리 숫자로 입력해주세요.");
    }

    // 신체 정보 범위 검증
    if (data.height && (data.height < 100 || data.height > 250)) {
      errors.push("키는 100cm ~ 250cm 범위로 입력해주세요.");
    }

    if (data.weight && (data.weight < 30 || data.weight > 200)) {
      errors.push("몸무게는 30kg ~ 200kg 범위로 입력해주세요.");
    }

    if (data.footSize && (data.footSize < 200 || data.footSize > 350)) {
      errors.push("발 사이즈는 200mm ~ 350mm 범위로 입력해주세요.");
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await UserProfileService.uploadProfileImage(file);
      console.log("업로드된 이미지 URL:", result.profileImageUrl);

      setProfileInfo((prev: UserProfileData) => ({
        ...prev,
        profileImageUrl: convertMockUrlToCdnUrl(result.profileImageUrl),
      }));
      setImageLoadError(false); // 새 이미지 업로드 시 에러 상태 초기화
      setSuccess("프로필 이미지가 업로드되었습니다.");
    } catch (err: any) {
      console.error("이미지 업로드 실패:", err);

      // 더 구체적인 에러 메시지 표시
      if (err.response?.status === 400) {
        setError(
          "이미지 형식이 올바르지 않습니다. JPG, PNG 파일을 사용해주세요."
        );
      } else if (err.response?.status === 413) {
        setError("이미지 파일이 너무 큽니다. 5MB 이하의 파일을 사용해주세요.");
      } else if (err.response?.status === 401) {
        console.log("이미지 업로드 중 401 에러: 자동 로그아웃 처리");
        handleUnauthorized();
        return;
      } else {
        setError("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileInfo((prev: UserProfileData) => ({
      ...prev,
      profileImageUrl: "",
    }));
    setImageLoadError(false); // 이미지 제거 시 에러 상태 초기화
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // 데이터 검증
      const validation = validateProfileData(profileInfo);
      if (!validation.isValid) {
        setError(validation.errors.join("\n"));
        return;
      }

      const updateData: UpdateUserProfileRequest = {
        name: profileInfo.name,
        nickname: profileInfo.nickname,
        phone: profileInfo.phone,
        birthDate: profileInfo.birthDate,
        gender: profileInfo.gender,
        height: profileInfo.height,
        weight: profileInfo.weight, // weight 필드 추가
        footSize: profileInfo.footSize,
        profileImageUrl: convertMockUrlToCdnUrl(
          profileInfo.profileImageUrl || ""
        ),
      };

      const updatedProfile = await UserProfileService.updateUserProfile(
        updateData
      );
      setProfileInfo(updatedProfile);
      setOriginalProfile(updatedProfile);
      setImageLoadError(false); // 프로필 저장 후 이미지 에러 상태 초기화
      setSuccess("프로필 정보가 성공적으로 저장되었습니다! 🎉");

      // 성공 메시지를 3초 후 자동으로 제거
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error("프로필 저장 실패:", err);

      // 더 구체적인 에러 메시지 표시
      if (err.response?.status === 400) {
        setError("입력한 정보가 올바르지 않습니다. 필수 항목을 확인해주세요.");
      } else if (err.response?.status === 401) {
        console.log("프로필 저장 중 401 에러: 자동 로그아웃 처리");
        handleUnauthorized();
        return;
      } else if (err.response?.status === 500) {
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("프로필 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalProfile) {
      setProfileInfo(originalProfile);
      setImageLoadError(false); // 취소 시 이미지 에러 상태 초기화
    }
  };

  // 사용자가 로그인하지 않은 경우
  if (!user) {
    console.log("사용자 정보 없음: 로그인 페이지로 리다이렉트");
    // 즉시 리다이렉트
    window.location.href = "/login";
    return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
            프로필 설정
          </h1>
          <p className="text-xl text-gray-400">
            개인 정보를 관리하고 업데이트하세요
          </p>
        </header>

        {/* 알림 메시지 */}
        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - 프로필 이미지 및 기본 정보 */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <img
                    src={
                      imageLoadError || !profileInfo.profileImageUrl
                        ? "https://via.placeholder.com/128x128/374151/9CA3AF?text=프로필"
                        : convertMockUrlToCdnUrl(profileInfo.profileImageUrl)
                    }
                    alt="프로필"
                    className="w-full h-full rounded-full object-cover border-4 border-gray-700 shadow-md"
                    onError={(e) => {
                      if (!imageLoadError) {
                        console.log("이미지 로드 실패:", e.currentTarget.src);
                        setImageLoadError(true);
                      }
                    }}
                    onLoad={() => {
                      if (profileInfo.profileImageUrl && !imageLoadError) {
                        console.log(
                          "이미지 로드 성공:",
                          convertMockUrlToCdnUrl(profileInfo.profileImageUrl)
                        );
                      }
                    }}
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
                <h2 className="text-2xl font-bold text-white mb-2">
                  {profileInfo.name || "이름 없음"}
                </h2>
                <p className="text-gray-400 mb-4">
                  @{profileInfo.nickname || "닉네임 없음"}
                </p>
                {profileInfo.profileImageUrl &&
                  profileInfo.profileImageUrl !== "" && (
                    <button
                      onClick={handleRemoveProfileImage}
                      className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                    >
                      사진 삭제
                    </button>
                  )}
              </div>
            </section>

            {/* 신체 정보 */}
            <section className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <i className="fas fa-ruler-combined text-orange-500 mr-2"></i>
                신체 정보
              </h2>

              {/* 신체 정보 그리드 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-700 p-3 rounded-xl border border-gray-600 hover:border-orange-500 transition-colors">
                  <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center">
                    <i className="fas fa-arrows-alt-v text-orange-400 mr-1"></i>
                    키 (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={profileInfo.height || ""}
                    onChange={handleNumberChange}
                    placeholder="170"
                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white text-sm"
                  />
                </div>

                <div className="bg-gray-700 p-3 rounded-xl border border-gray-600 hover:border-orange-500 transition-colors">
                  <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center">
                    <i className="fas fa-weight text-orange-400 mr-1"></i>
                    몸무게 (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={profileInfo.weight || ""}
                    onChange={handleNumberChange}
                    placeholder="65"
                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white text-sm"
                  />
                </div>

                <div className="bg-gray-700 p-3 rounded-xl border border-gray-600 hover:border-orange-500 transition-colors">
                  <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center">
                    <i className="fas fa-shoe-prints text-orange-400 mr-1"></i>
                    발 사이즈 (mm)
                  </label>
                  <input
                    type="number"
                    name="footSize"
                    value={profileInfo.footSize || ""}
                    onChange={handleNumberChange}
                    placeholder="260"
                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white text-sm"
                  />
                </div>

                <div className="bg-gray-700 p-3 rounded-xl border border-gray-600 hover:border-orange-500 transition-colors">
                  <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center">
                    <i className="fas fa-expand-arrows-alt text-orange-400 mr-1"></i>
                    발 너비
                  </label>
                  <select
                    name="footWidth"
                    value={profileInfo.footWidth || "NORMAL"}
                    onChange={handleProfileChange}
                    className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white text-sm"
                  >
                    <option value="NARROW">좁음</option>
                    <option value="NORMAL">보통</option>
                    <option value="WIDE">넓음</option>
                  </select>
                </div>
              </div>

              {/* 신체 정보 요약 */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-3 rounded-lg border border-orange-500/20">
                <p className="text-xs text-gray-400 text-center">
                  <i className="fas fa-info-circle text-orange-400 mr-1"></i>
                  신체 정보는 의류 및 신발 추천에 활용됩니다
                </p>
              </div>
            </section>
          </div>

          {/* Right Column - 상세 정보 */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-gray-800 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <i className="fas fa-user-edit text-orange-500 mr-3"></i>
                기본 정보
              </h2>

              {/* 필수 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-colors">
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                    <i className="fas fa-user text-orange-400 mr-2"></i>
                    이름 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileInfo.name}
                    onChange={handleProfileChange}
                    placeholder="홍길동"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>

                <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-colors">
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                    <i className="fas fa-at text-orange-400 mr-2"></i>
                    닉네임 *
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={profileInfo.nickname}
                    onChange={handleProfileChange}
                    placeholder="쇼핑러버"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>

                <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-colors">
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                    <i className="fas fa-phone text-orange-400 mr-2"></i>
                    전화번호 *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileInfo.phone}
                    onChange={handleProfileChange}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>

                <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-colors">
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                    <i className="fas fa-birthday-cake text-orange-400 mr-2"></i>
                    생년월일
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={profileInfo.birthDate || ""}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  />
                </div>

                <div className="bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-colors md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                    <i className="fas fa-venus-mars text-orange-400 mr-2"></i>
                    성별
                  </label>
                  <select
                    name="gender"
                    value={profileInfo.gender || "MALE"}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                  >
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </select>
                </div>
              </div>

              {/* 정보 안내 */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 rounded-xl border border-orange-500/20">
                <h3 className="text-sm font-semibold text-orange-400 mb-2 flex items-center">
                  <i className="fas fa-info-circle mr-2"></i>
                  입력 가이드
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-400">
                  <div className="flex items-center">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    닉네임은 2자 이상
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    전화번호 10-11자리
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-check text-green-400 mr-2"></i>
                    신체 정보는 선택사항
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 하단 버튼 */}
        <footer className="mt-12 flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            disabled={!hasChanges()}
            className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges() || saving}
            className="px-6 py-3 border border-transparent rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                저장 중...
              </>
            ) : (
              "변경사항 저장"
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
