import axiosInstance from "./axios";

export interface RewardType {
  displayName: string;
  description: string;
}

export interface RewardHistoryResponse {
  historyId: number;
  userId: number;
  userLoginId: string;
  rewardType: string;
  rewardTypeDisplayName: string;
  points: number;
  description: string;
  relatedId: number | null;
  relatedType: string | null;
  adminId: number | null;
  isProcessed: boolean;
  processedAt: string | null;
  createdAt: string;
}

export interface RewardPolicyResponse {
  policyId: number;
  rewardType: string;
  rewardTypeDisplayName: string;
  rewardTypeDescription: string;
  points: number;
  description: string;
  isActive: boolean;
  dailyLimit: number | null;
  monthlyLimit: number | null;
  validFrom: string | null;
  validTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RewardGrantRequest {
  userId: number;
  points: number;
  description: string;
}

export interface RewardHistoryPage {
  content: RewardHistoryResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

/**
 * 리워드 관련 API 서비스
 */
export const rewardService = {
  /**
   * 리워드 히스토리 조회 (페이징)
   * @param page 페이지 번호 (0부터 시작)
   * @param size 페이지 크기
   * @returns 리워드 히스토리 페이지
   */
  getRewardHistory: async (
    page: number = 0,
    size: number = 20
  ): Promise<RewardHistoryPage> => {
    try {
      const response = await axiosInstance.get("/api/rewards/history", {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error("리워드 히스토리 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 리워드 정책 조회
   * @returns 리워드 정책 목록
   */
  getRewardPolicies: async (): Promise<RewardPolicyResponse[]> => {
    try {
      const response = await axiosInstance.get("/api/rewards/policies");
      return response.data;
    } catch (error) {
      console.error("리워드 정책 조회 실패:", error);
      throw error;
    }
  },

  /**
   * 관리자 포인트 지급
   * @param request 포인트 지급 요청
   * @returns 지급된 리워드 히스토리
   */
  grantPointsByAdmin: async (request: RewardGrantRequest): Promise<RewardHistoryResponse> => {
    try {
      const response = await axiosInstance.post("/api/rewards/admin/grant", request);
      return response.data;
    } catch (error) {
      console.error("관리자 포인트 지급 실패:", error);
      throw error;
    }
  }
};
