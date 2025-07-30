import axiosInstance from "./axios";
import {
  FeedPost,
  FeedComment,
  CreateFeedRequest,
  UpdateFeedRequest,
  CreateCommentRequest,
  FeedVoteRequest,
  ApiResponse,
  FeedListResponse,
  CommentListResponse,
  LikeResponse,
  VoteResponse,
  FeedListParams,
  CommentListParams,
} from "../types/feed";

export class FeedService {
  /**
   * 피드 목록을 조회합니다
   */
  static async getFeeds(params: FeedListParams = {}): Promise<FeedListResponse> {
    try {
      const response = await axiosInstance.get<ApiResponse<FeedListResponse>>(
        '/api/feeds',
        { params }
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('피드 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 피드의 상세 정보를 조회합니다
   */
  static async getFeed(feedId: number): Promise<FeedPost> {
    try {
      const response = await axiosInstance.get<ApiResponse<FeedPost>>(
        `/api/feeds/${feedId}`
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('피드 상세 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 새 피드를 생성합니다
   */
  static async createFeed(feedData: CreateFeedRequest): Promise<FeedPost> {
    try {
      const response = await axiosInstance.post<ApiResponse<FeedPost>>(
        '/api/feeds',
        feedData
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('피드 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 피드를 수정합니다
   */
  static async updateFeed(feedId: number, feedData: UpdateFeedRequest): Promise<FeedPost> {
    try {
      const response = await axiosInstance.put<ApiResponse<FeedPost>>(
        `/api/feeds/${feedId}`,
        feedData
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('피드 수정 실패:', error);
      throw error;
    }
  }

  /**
   * 피드를 삭제합니다 (소프트 삭제)
   */
  static async deleteFeed(feedId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/api/feeds/${feedId}`);
    } catch (error: any) {
      console.error('피드 삭제 실패:', error);
      throw error;
    }
  }

  /**
   * 피드 좋아요를 토글합니다 (추가/취소)
   */
  static async likeFeed(feedId: number): Promise<LikeResponse> {
    try {
      const response = await axiosInstance.post<ApiResponse<LikeResponse>>(
        `/api/feeds/${feedId}/like`
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('좋아요 실패:', error);
      throw error;
    }
  }

  /**
   * 피드에 투표합니다
   */
  static async voteFeed(feedId: number, voteData: FeedVoteRequest): Promise<VoteResponse> {
    try {
      const response = await axiosInstance.post<ApiResponse<VoteResponse>>(
        `/api/feeds/${feedId}/vote`,
        voteData
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('투표 실패:', error);
      throw error;
    }
  }

  /**
   * 피드의 투표를 취소합니다
   */
  static async unvoteFeed(feedId: number): Promise<VoteResponse> {
    try {
      const response = await axiosInstance.delete<ApiResponse<VoteResponse>>(
        `/api/feeds/${feedId}/vote`
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('투표 취소 실패:', error);
      throw error;
    }
  }

  /**
   * 피드의 댓글 목록을 조회합니다
   */
  static async getComments(feedId: number, params: CommentListParams = {}): Promise<CommentListResponse> {
    try {
      const response = await axiosInstance.get<ApiResponse<CommentListResponse>>(
        `/api/feeds/${feedId}/comments`,
        { params }
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('댓글 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 피드에 댓글을 추가합니다
   */
  static async createComment(feedId: number, commentData: CreateCommentRequest): Promise<FeedComment> {
    try {
      const response = await axiosInstance.post<ApiResponse<FeedComment>>(
        `/api/feeds/${feedId}/comments`,
        commentData
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('댓글 생성 실패:', error);
      throw error;
    }
  }

  // 댓글 수정 기능은 지원하지 않습니다

  /**
   * 댓글을 삭제합니다
   */
  static async deleteComment(feedId: number, commentId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/api/feeds/${feedId}/comments/${commentId}`);
    } catch (error: any) {
      console.error('댓글 삭제 실패:', error);
      throw error;
    }
  }

  /**
   * 사용자의 피드 목록을 조회합니다
   */
  static async getUserFeeds(userId: number, params: FeedListParams = {}): Promise<FeedListResponse> {
    try {
      const response = await axiosInstance.get<ApiResponse<FeedListResponse>>(
        `/api/users/${userId}/feeds`,
        { params }
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('사용자 피드 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 현재 로그인한 사용자의 피드 목록을 조회합니다
   */
  static async getMyFeeds(params: FeedListParams = {}): Promise<FeedListResponse> {
    try {
      const response = await axiosInstance.get<ApiResponse<FeedListResponse>>(
        '/api/feeds/my',
        { params }
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('내 피드 목록 조회 실패:', error);
      throw error;
    }
  }

  // 해시태그 관련 기능은 피드 생성/수정 시 함께 처리됩니다
  // 별도의 해시태그 검색이나 인기 해시태그 기능이 필요하면 나중에 추가할 수 있습니다
}

export default FeedService; 