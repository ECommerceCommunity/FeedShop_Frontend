import axiosInstance from "./axios";

export interface UserWithdrawRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export class UserService {
  // 사용자 본인 회원 탈퇴
  static async withdrawUser(
    request: UserWithdrawRequest
  ): Promise<ApiResponse<string>> {
    try {
      const response = await axiosInstance.delete("/api/users/withdraw", {
        data: request,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "회원 탈퇴에 실패했습니다."
      );
    }
  }

  // 관리자가 사용자 회원 탈퇴 (관리자 전용)
  static async adminWithdrawUserByEmail(
    email: string
  ): Promise<ApiResponse<string>> {
    try {
      const response = await axiosInstance.delete(
        `/api/users/admin/by-email/${email}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "회원 탈퇴 처리에 실패했습니다."
      );
    }
  }
}
