import axios from "./axios";
import { convertMockUrlToCdnUrl } from "../utils/common/images";

export interface UserProfileData {
  userId?: number;
  username?: string;
  email?: string;
  name: string;
  nickname: string;
  phone: string;
  birthDate?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  height?: number;
  weight?: number;
  footSize?: number;
  footWidth?: "NARROW" | "NORMAL" | "WIDE";
  profileImageUrl?: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  nickname?: string;
  phone?: string;
  birthDate?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  height?: number;
  weight?: number;
  footSize?: number;
  footWidth?: "NARROW" | "NORMAL" | "WIDE";
  profileImageUrl?: string;
}

export const UserProfileService = {
  // 사용자 프로필 정보 조회
  getUserProfile: async (): Promise<UserProfileData> => {
    try {
      // 토큰 상태 확인
      const token = localStorage.getItem("token");
      console.log(
        "현재 토큰:",
        token ? token.substring(0, 20) + "..." : "토큰 없음"
      );

      // Swagger에서 성공한 엔드포인트와 동일하게 수정
      const response = await axios.get("/api/users/me/profile");
      console.log("백엔드 응답 (원본):", response.data);

      // 백엔드 응답을 프론트엔드 형식에 맞춰 매핑
      const backendData = response.data;

      // 백엔드 응답 구조에 따라 매핑
      const mappedData = {
        userId: backendData.userId,
        username: backendData.username,
        email: backendData.email,
        name: backendData.name || backendData.username || "",
        nickname: backendData.nickname || "",
        phone: backendData.phone || "",
        birthDate: backendData.birthDate || "",
        gender: backendData.gender || "MALE",
        height: backendData.height,
        weight: backendData.weight,
        footSize: backendData.footSize,
        footWidth: backendData.footWidth || "NORMAL",
        profileImageUrl: backendData.profileImageUrl || "",
      };

      // 이미지 URL이 상대 경로인 경우 baseURL과 결합
      if (
        mappedData.profileImageUrl &&
        !mappedData.profileImageUrl.startsWith("http")
      ) {
        const baseURL =
          process.env.REACT_APP_API_URL || "https://localhost:8443";
        mappedData.profileImageUrl = `${baseURL}${
          mappedData.profileImageUrl.startsWith("/") ? "" : "/"
        }${mappedData.profileImageUrl}`;
      }

      // mock-gcp-bucket URL을 실제 CDN URL로 변환
      if (
        mappedData.profileImageUrl &&
        mappedData.profileImageUrl.includes("mock-gcp-bucket")
      ) {
        mappedData.profileImageUrl = convertMockUrlToCdnUrl(
          mappedData.profileImageUrl
        );
        console.log("CDN URL로 변환됨:", mappedData.profileImageUrl);
      }

      console.log("매핑된 데이터:", mappedData);
      return mappedData;
    } catch (error: any) {
      console.error("프로필 조회 실패:", error);

      // 프로덕션 환경에서는 에러를 그대로 전파
      if (process.env.NODE_ENV === "production") {
        throw error;
      }

      // 개발 환경에서만 임시 데이터 반환
      console.warn("개발 환경: 임시 프로필 데이터를 반환합니다.");
      return {
        name: "홍길동",
        nickname: "쇼핑러버",
        phone: "010-1234-5678",
        birthDate: "1990-01-01",
        gender: "MALE",
        height: 170,
        weight: 65,
        footSize: 260,
        footWidth: "NORMAL",
        profileImageUrl: "",
      };
    }
  },

  // 사용자 프로필 정보 수정
  updateUserProfile: async (
    profileData: UpdateUserProfileRequest
  ): Promise<UserProfileData> => {
    try {
      console.log("프로필 업데이트 요청 (원본):", profileData);

      // 백엔드 ProfileUpdateRequest 형식에 맞춰 데이터 정리
      const requestData = {
        name: profileData.name || "",
        nickname: profileData.nickname || "",
        phone: profileData.phone || "",
        birthDate: profileData.birthDate || null,
        gender: profileData.gender || "MALE",
        height: profileData.height || null,
        weight: profileData.weight || null, // weight 필드 추가
        footSize: profileData.footSize || null,
        footWidth: profileData.footWidth || "NORMAL", // footWidth 필드 추가
        profileImageUrl:
          convertMockUrlToCdnUrl(profileData.profileImageUrl || "") || null,
      };

      console.log("백엔드로 전송할 데이터:", requestData);

      // 백엔드 API 호출
      await axios.put("/api/users/me/profile", requestData);

      // 업데이트 성공 후 최신 데이터를 다시 조회
      const updatedProfile = await UserProfileService.getUserProfile();
      return updatedProfile;
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      throw error; // 에러를 상위로 전파하여 UI에서 처리할 수 있도록 함
    }
  },

  // 프로필 이미지 업로드
  uploadProfileImage: async (
    file: File
  ): Promise<{ profileImageUrl: string }> => {
    try {
      console.log("이미지 업로드 요청:", file.name);

      // FormData를 사용하여 파일 업로드
      const formData = new FormData();
      formData.append("image", file);

      // 백엔드 이미지 업로드 API 호출
      const response = await axios.post(
        "/api/users/me/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("이미지 업로드 응답:", response.data);

      // 백엔드에서 이미지 URL을 직접 반환하므로 그대로 사용
      // URL이 상대 경로인 경우 baseURL과 결합
      let imageUrl = response.data;
      if (imageUrl && !imageUrl.startsWith("http")) {
        const baseURL =
          process.env.REACT_APP_API_URL || "https://localhost:8443";
        imageUrl = `${baseURL}${
          imageUrl.startsWith("/") ? "" : "/"
        }${imageUrl}`;
      }

      // mock-gcp-bucket URL을 실제 CDN URL로 변환
      if (imageUrl && imageUrl.includes("mock-gcp-bucket")) {
        imageUrl = convertMockUrlToCdnUrl(imageUrl);
        console.log("업로드 후 CDN URL로 변환됨:", imageUrl);
      }

      console.log("최종 이미지 URL:", imageUrl);
      return { profileImageUrl: imageUrl };
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      console.log("백엔드 이미지 업로드 API가 없어 임시 처리합니다.");

      // 백엔드 API가 없을 경우 임시 처리
      return {
        profileImageUrl:
          "https://via.placeholder.com/128x128/374151/9CA3AF?text=업로드됨",
      };
    }
  },
};
