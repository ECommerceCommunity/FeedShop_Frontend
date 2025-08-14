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

// 백엔드 응답 타입 정의
interface BackendFeedPost {
  feedId: number;
  title: string;
  content: string;
  instagramId?: string;
  feedType: 'DAILY' | 'EVENT' | 'RANKING';
  likeCount: number;
  commentCount: number;
  participantVoteCount: number;
  userId: number;
  userNickname: string;
  userLevel?: number;
  userProfileImg?: string;
  userGender?: string;
  userHeight?: number;
  orderItemId: number;
  productName: string;
  productSize?: number;
  eventId?: number;
  eventTitle?: string;
  eventDescription?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  hashtags?: any[];
  images?: any[];
  imageUrls?: string[];
  isLiked?: boolean;
  isVoted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export class FeedService {
  /**
   * 백엔드 피드 데이터를 프론트엔드 타입으로 변환하는 공통 함수
   */
  private static transformBackendFeedToFrontend(backendFeed: BackendFeedPost): FeedPost {
    return {
      id: backendFeed.feedId,
      title: backendFeed.title,
      content: backendFeed.content,
      instagramId: backendFeed.instagramId,
      feedType: backendFeed.feedType,
      likeCount: backendFeed.likeCount,
      commentCount: backendFeed.commentCount,
      participantVoteCount: backendFeed.participantVoteCount,
      user: {
        id: backendFeed.userId,
        nickname: backendFeed.userNickname,
        level: backendFeed.userLevel,
        profileImg: backendFeed.userProfileImg,
        gender: backendFeed.userGender,
        height: backendFeed.userHeight,
      },
      orderItem: {
        id: backendFeed.orderItemId,
        productName: backendFeed.productName,
        size: backendFeed.productSize,
      },
      event: backendFeed.eventId && backendFeed.eventTitle && backendFeed.eventStartDate && backendFeed.eventEndDate ? {
        id: backendFeed.eventId,
        title: backendFeed.eventTitle,
        description: backendFeed.eventDescription,
        startDate: backendFeed.eventStartDate,
        endDate: backendFeed.eventEndDate,
      } : undefined,
      images: backendFeed.imageUrls?.map((url: string, index: number) => ({
        id: index + 1,
        imageUrl: url,
        sortOrder: index,
      })) || [],
      hashtags: backendFeed.hashtags?.map((tag: any, index: number) => {
        // 디버깅: 백엔드에서 오는 해시태그 데이터 구조 확인
        console.log(`해시태그 ${index}:`, tag, typeof tag);
        
        // 백엔드에서 hashtags가 문자열 배열인지 객체 배열인지 확인
        if (typeof tag === 'string') {
          return {
            id: index + 1,
            tag: tag,
          };
        } else if (tag && typeof tag === 'object') {
          // 백엔드에서 {tagId, tag} 형태로 오는 경우
          const tagId = tag.tagId || tag.id || index + 1;
          const tagText = tag.tag || String(tag);
          
          console.log(`해시태그 변환: ${tagId} -> ${tagText}`);
          
          return {
            id: tagId,
            tag: tagText,
          };
        } else {
          // 예상치 못한 형태의 데이터는 건너뛰기
          return {
            id: index + 1,
            tag: String(tag),
          };
        }
      }) || [],
      isLiked: backendFeed.isLiked,
      isVoted: backendFeed.isVoted,
      createdAt: backendFeed.createdAt,
      updatedAt: backendFeed.updatedAt,
    };
  }

  /**
   * 피드 목록을 조회합니다
   * feedType이 있으면 타입별 조회 API를 사용하고, 없으면 전체 조회 API를 사용합니다
   */
  static async getFeeds(params: FeedListParams = {}): Promise<FeedListResponse> {
    try {
      const { feedType, ...otherParams } = params;
      
      let url: string;
      if (feedType) {
        // 타입별 조회 API 사용
        url = `/api/feeds/type/${feedType}`;
      } else {
        // 전체 조회 API 사용
        url = '/api/feeds';
      }
      
      const response = await axiosInstance.get<ApiResponse<any>>(
        url,
        { params: otherParams }
      );
      const apiResponse = response.data;
      
      // 백엔드 응답을 프론트엔드 타입에 맞게 변환
      const transformedFeeds = apiResponse.data.content.map((backendFeed: BackendFeedPost) => 
        this.transformBackendFeedToFrontend(backendFeed)
      );
      
      return {
        ...apiResponse.data,
        content: transformedFeeds,
      };
    } catch (error: any) {
      console.error('피드 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 타입의 피드 목록을 조회합니다
   */
  static async getFeedsByType(feedType: string, params: Omit<FeedListParams, 'feedType'> = {}): Promise<FeedListResponse> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(
        `/api/feeds/type/${feedType}`,
        { params }
      );
      const apiResponse = response.data;
      
      // 백엔드 응답을 프론트엔드 타입에 맞게 변환
      const transformedFeeds = apiResponse.data.content.map((backendFeed: BackendFeedPost) => 
        this.transformBackendFeedToFrontend(backendFeed)
      );
      
      return {
        ...apiResponse.data,
        content: transformedFeeds,
      };
    } catch (error: any) {
      console.error('피드 타입별 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 피드의 상세 정보를 조회합니다
   */
  static async getFeed(feedId: number): Promise<FeedPost> {
    try {
      console.log(`FeedService.getFeed 호출 - feedId: ${feedId}`);
      const url = `/api/feeds/${feedId}`;
      console.log(`API 호출 URL: ${url}`);
      
      const response = await axiosInstance.get<ApiResponse<BackendFeedPost>>(url);
      
      console.log('API 응답 상태:', response.status);
      console.log('API 응답 데이터:', response.data);
      
      // 백엔드 응답 구조에 따라 처리
      if (response.data.success) {
        console.log('피드 조회 성공:', response.data.data);
        const backendData: BackendFeedPost = response.data.data;
        
        // 백엔드 응답을 프론트엔드 타입에 맞게 변환
        const feedPost: FeedPost = this.transformBackendFeedToFrontend(backendData);
        
        console.log('변환된 피드 데이터:', feedPost);
        return feedPost;
      } else {
        console.log('API 응답 실패:', response.data.message);
        throw new Error(response.data.message || '피드 조회에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('피드 상세 조회 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // 백엔드 에러를 그대로 전파하여 실제 데이터베이스 오류를 확인할 수 있도록 함
      
      throw error;
    }
  }

  /**
   * 새 피드를 생성합니다
   */
  static async createFeed(feedData: CreateFeedRequest): Promise<FeedPost> {
    try {
      console.log('FeedService.createFeed 호출:', feedData);
      
      const response = await axiosInstance.post<ApiResponse<FeedPost>>(
        '/api/feeds',
        feedData
      );
      
      console.log('피드 생성 응답:', response.data);
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('피드 생성 실패:', error);
      console.error('에러 상세:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
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
        `/api/feeds/${feedId}/likes/toggle`
      );
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('좋아요 실패:', error);
      throw error;
    }
  }

  /**
   * 피드를 좋아요한 사용자 목록을 조회합니다
   */
  static async getFeedLikes(
    feedId: number
  ): Promise<Array<{ userId?: number; nickname: string; profileImg?: string }>> {
    try {
      const url = `/api/feeds/${feedId}/likes`;
      const response = await axiosInstance.get<ApiResponse<any>>(url);

      const raw = response.data?.data;

      // 다양한 백엔드 응답 형태를 방어적으로 처리
      const items = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.content)
        ? raw.content
        : [];

      return items.map((item: any) => {
        // 가능한 필드 케이스 대응
        const nickname = item?.nickname || item?.userNickname || item?.name || String(item);
        return {
          userId: item?.userId || item?.id,
          nickname,
          profileImg: item?.profileImg || item?.userProfileImg,
        };
      });
    } catch (error: any) {
      console.error('좋아요 사용자 목록 조회 실패:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  }

  /**
   * 현재 로그인한 사용자가 좋아요한 피드 ID 목록을 가져옵니다
   */
  static async getMyLikedFeeds(): Promise<number[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<number[]>>(
        '/api/feeds/my-likes'
      );
      
      if (response.data.success) {
        // 백엔드에서 이미 number[] 형태로 반환하므로 그대로 사용
        return response.data.data;
      } else {
        return [];
      }
    } catch (error: any) {
      console.error('내 좋아요 피드 목록 조회 실패:', error);
      // 에러가 발생해도 빈 배열 반환 (로그인하지 않은 경우 등)
      return [];
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
   * feedType이 있으면 타입별 조회 API를 사용하고, 없으면 전체 조회 API를 사용합니다
   */
  static async getMyFeeds(params: FeedListParams = {}): Promise<FeedListResponse> {
    try {
      const { feedType, ...otherParams } = params;
      
      let url: string;
      if (feedType) {
        // 타입별 조회 API 사용
        url = `/api/feeds/my/type/${feedType}`;
      } else {
        // 전체 조회 API 사용
        url = '/api/feeds/my';
      }
      
      const response = await axiosInstance.get<ApiResponse<any>>(
        url,
        { params: otherParams }
      );
      const apiResponse = response.data;

      // 백엔드 응답을 프론트엔드 타입에 맞게 변환
      const transformedFeeds = (apiResponse.data.content || []).map((backendFeed: BackendFeedPost) => 
        this.transformBackendFeedToFrontend(backendFeed)
      );

      return {
        ...apiResponse.data,
        content: transformedFeeds,
      };
    } catch (error: any) {
      console.error('내 피드 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 현재 로그인한 사용자의 특정 타입 피드 목록을 조회합니다
   */
  static async getMyFeedsByType(feedType: string, params: Omit<FeedListParams, 'feedType'> = {}): Promise<FeedListResponse> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(
        `/api/feeds/my/type/${feedType}`,
        { params }
      );
      const apiResponse = response.data;

      // 백엔드 응답을 프론트엔드 타입에 맞게 변환
      const transformedFeeds = (apiResponse.data.content || []).map((backendFeed: BackendFeedPost) => 
        this.transformBackendFeedToFrontend(backendFeed)
      );

      return {
        ...apiResponse.data,
        content: transformedFeeds,
      };
    } catch (error: any) {
      console.error('내 피드 타입별 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 현재 로그인한 사용자의 피드 개수를 조회합니다
   */
  static async getMyFeedsCount(): Promise<{ totalCount: number; dailyCount: number; eventCount: number; rankingCount: number }> {
    try {
      const response = await axiosInstance.get<ApiResponse<{
        totalCount: number;
        dailyCount: number;
        eventCount: number;
        rankingCount: number;
      }>>('/api/feeds/my/count');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return {
          totalCount: 0,
          dailyCount: 0,
          eventCount: 0,
          rankingCount: 0
        };
      }
    } catch (error: any) {
      console.error('내 피드 개수 조회 실패:', error);
      // 에러가 발생해도 기본값 반환
      return {
        totalCount: 0,
        dailyCount: 0,
        eventCount: 0,
        rankingCount: 0
      };
    }
  }

  // 해시태그 관련 기능은 피드 생성/수정 시 함께 처리됩니다
  // 별도의 해시태그 검색이나 인기 해시태그 기능이 필요하면 나중에 추가할 수 있습니다
}

export default FeedService; 