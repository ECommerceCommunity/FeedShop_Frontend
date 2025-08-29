import axiosInstance from "./axios";

export interface BadgeType {
  name: string;
  description: string;
  imageUrl: string;
  bonusPoints: number;
}

export interface BadgeResponse {
  id: number;
  badgeName: string;
  badgeDescription: string;
  badgeImageUrl: string;
  badgeType: string;
  awardedAt: string;
  isDisplayed: boolean;
}

export interface BadgeListResponse {
  badges: BadgeResponse[];
  totalCount: number;
  displayedCount: number;
}

export interface BadgeToggleRequest {
  badgeId: number;
}

export interface BadgeAwardRequest {
  userId: number;
  badgeType: string;
}

/**
 * 뱃지 관련 API 서비스
 */
export const badgeService = {
  /**
   * 현재 사용자의 모든 뱃지 조회
   * @returns 뱃지 목록 응답
   */
  getMyBadges: async (): Promise<BadgeListResponse> => {
    try {
      const response = await axiosInstance.get("/api/users/badges/me");
      return response.data;
    } catch (error) {
      console.error("뱃지 목록 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 현재 사용자의 표시되는 뱃지만 조회
   * @returns 표시되는 뱃지 목록 응답
   */
  getMyDisplayedBadges: async (): Promise<BadgeListResponse> => {
    try {
      const response = await axiosInstance.get("/api/users/badges/me/displayed");
      return response.data;
    } catch (error) {
      console.error("표시 뱃지 목록 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 특정 사용자의 표시되는 뱃지 조회
   * @param userId 사용자 ID
   * @returns 표시되는 뱃지 목록 응답
   */
  getUserDisplayedBadges: async (userId: number): Promise<BadgeListResponse> => {
    try {
      const response = await axiosInstance.get(`/api/users/badges/users/${userId}/displayed`);
      return response.data;
    } catch (error) {
      console.error("사용자 뱃지 목록 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 뱃지 표시/숨김 토글
   * @param request 뱃지 토글 요청
   * @returns 토글된 뱃지 정보
   */
  toggleBadgeDisplay: async (request: BadgeToggleRequest): Promise<BadgeResponse> => {
    try {
      const response = await axiosInstance.patch("/api/users/badges/toggle", request);
      return response.data;
    } catch (error) {
      console.error("뱃지 토글 실패:", error);
      throw error;
    }
  },

  /**
   * 관리자용: 특정 사용자에게 뱃지 수여
   * @param request 뱃지 수여 요청
   * @returns 수여된 뱃지 정보
   */
  awardBadge: async (request: BadgeAwardRequest): Promise<BadgeResponse> => {
    try {
      const response = await axiosInstance.post("/api/users/badges/admin/award", request);
      return response.data;
    } catch (error) {
      console.error("뱃지 수여 실패:", error);
      throw error;
    }
  },

  /**
   * 관리자용: 특정 사용자의 모든 뱃지 조회
   * @param userId 사용자 ID
   * @returns 뱃지 목록 응답
   */
  getUserBadgesForAdmin: async (userId: number): Promise<BadgeListResponse> => {
    try {
      const response = await axiosInstance.get(`/api/users/badges/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("관리자용 사용자 뱃지 조회 실패:", error);
      throw error;
    }
  }
};
