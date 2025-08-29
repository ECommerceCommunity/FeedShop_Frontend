import axiosInstance from "./axios";
import {
  FeedPost,
  FeedComment,
  CreateFeedRequest,
  UpdateFeedRequest,
  CreateCommentRequest,
  ApiResponse,
  FeedListResponse,
  CommentListResponse,
  LikeResponse,
  VoteResponse,
  FeedListParams,
  CommentListParams,
  MyLikedFeedsResponseDto,
  PaginatedResponse,
  FeedListResponseDto,
  FeedType,
} from "../types/feed";

// 백엔드 응답 타입 정의 (FeedDetailResponseDto에 맞춤)
interface BackendFeedPost {
  feedId: number;
  title: string;
  content: string;
  instagramId?: string;
  feedType: FeedType;
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
  productImageUrl?: string;
  productId?: number;
  eventId?: number;
  eventTitle?: string;
  eventDescription?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  hashtags?: Array<{
    tagId: number;
    tag: string;
  }>;
  images?: Array<{
    imageId: number;
    imageUrl: string;
    sortOrder: number;
    uploadedAt: string;
  }>;
  comments?: Array<{
    commentId: number;
    content: string;
    createdAt: string;
    userId: number;
    userNickname: string;
    userProfileImg?: string;
  }>;
  isLiked?: boolean;
  isVoted?: boolean;
  canVote?: boolean;
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
      images: backendFeed.images?.map((img: any, index: number) => ({
        id: img.imageId || index + 1,
        imageUrl: img.imageUrl,
        sortOrder: img.sortOrder || index,
      })) || [],
      hashtags: backendFeed.hashtags?.map((tag) => ({
        id: tag.tagId,
        tag: tag.tag,
      })) || [],
      isLiked: backendFeed.isLiked ?? false,
      isVoted: backendFeed.isVoted ?? false,
      createdAt: backendFeed.createdAt,
      updatedAt: backendFeed.updatedAt ?? backendFeed.createdAt,
      // 이벤트 참여 관련 필드 추가
      eventId: backendFeed.eventId,
      eventTitle: backendFeed.eventTitle,
      eventDescription: backendFeed.eventDescription,
      eventStartDate: backendFeed.eventStartDate,
      eventEndDate: backendFeed.eventEndDate,
      canVote: backendFeed.canVote ?? false,
    };
  }

  /**
   * 피드 목록을 조회합니다
   * feedType이 있으면 타입별 조회 API를 사용하고, 없으면 전체 조회 API를 사용합니다
   */
  static async getFeeds(params: FeedListParams = {}): Promise<PaginatedResponse<FeedListResponseDto>> {
    try {
      const { feedType, ...otherParams } = params;
      
      let url: string;
      if (feedType) {
        // 타입별 조회 API 사용
        url = `/api/feeds?feedType=${feedType}`;
      } else {
        // 전체 조회 API 사용
        url = '/api/feeds';
      }
      
      const response = await axiosInstance.get<ApiResponse<PaginatedResponse<FeedListResponseDto>>>(
        url,
        { params: otherParams }
      );
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '피드 목록 조회에 실패했습니다.');
      }
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
        `/api/feeds?feedType=${feedType}`,
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
      console.log('이미지 URL 타입:', typeof feedData.imageUrls);
      console.log('이미지 URL 값:', feedData.imageUrls);
      console.log('이미지 URL이 배열인가:', Array.isArray(feedData.imageUrls));
      console.log('이미지 URL 길이:', feedData.imageUrls?.length);
      
      // 이미지가 있는 경우 multipart/form-data로 전송 (undefined, 빈 배열, 빈 문자열은 이미지 없음으로 처리)
      const hasValidImages = feedData.imageUrls && 
                            Array.isArray(feedData.imageUrls) && 
                            feedData.imageUrls.length > 0 && 
                            feedData.imageUrls.some(url => url && typeof url === 'string' && url.trim() !== '');
      console.log('유효한 이미지가 있는가:', hasValidImages);
      console.log('이미지 URL 배열 내용:', feedData.imageUrls);
      console.log('이미지 URL이 undefined인가:', feedData.imageUrls === undefined);
      
      if (hasValidImages) {
        const formData = new FormData();
        
        // 피드 데이터를 JSON 문자열로 변환하여 추가
        const feedDataJson = {
          title: feedData.title,
          content: feedData.content,
          orderItemId: feedData.orderItemId,
          eventId: feedData.eventId,
          instagramId: feedData.instagramId,
          hashtags: feedData.hashtags
        };
        formData.append('feedData', new Blob([JSON.stringify(feedDataJson)], {
          type: 'application/json'
        }));
        
        // 이미지들을 FormData에 추가
        for (let i = 0; i < feedData.imageUrls.length; i++) {
          const imageUrl = feedData.imageUrls[i];
          // Base64 이미지를 Blob으로 변환
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          formData.append('images', blob, `image${i}.jpg`);
        }
        
        const response = await axiosInstance.post<ApiResponse<FeedPost>>(
          '/api/feeds',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        console.log('피드 생성 응답 (이미지 포함):', response.data);
        const apiResponse = response.data;
        return apiResponse.data;
      } else {
        // 이미지가 없는 경우 JSON으로 전송
        const response = await axiosInstance.post<ApiResponse<FeedPost>>(
          '/api/feeds/text-only',
          feedData
        );
        
        console.log('피드 생성 응답 (텍스트만):', response.data);
        const apiResponse = response.data;
        return apiResponse.data;
      }
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
        `/api/feeds/text-only/${feedId}`,
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
      await axiosInstance.delete(`/api/feeds/text-only/${feedId}`);
    } catch (error: any) {
      console.error('피드 삭제 실패:', error);
      throw error;
    }
  }

  /**
   * 사용자가 좋아요한 피드 목록을 가져옵니다
   */
  static async getMyLikedFeeds(page: number, size: number): Promise<MyLikedFeedsResponseDto> {
    try {
      const response = await axiosInstance.get<ApiResponse<MyLikedFeedsResponseDto>>(
        `/api/feeds/my-likes?page=${page}&size=${size}`
      );
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        console.error('API 응답 실패:', apiResponse.message);
        throw new Error(apiResponse.message || '좋아요한 피드 목록 조회에 실패했습니다.');
      }
      
      return apiResponse.data;
    } catch (error: any) {
      console.error('좋아요한 피드 목록 조회 실패:', error);
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
   * 피드에 투표합니다
   */
  static async voteFeed(feedId: number): Promise<VoteResponse> {
    try {
      console.log(`투표 API 호출 - feedId: ${feedId}, URL: /api/feeds/${feedId}/vote`);
      
      // JWT 토큰 확인
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }
      
      const response = await axiosInstance.post<ApiResponse<VoteResponse>>(
        `/api/feeds/${feedId}/vote`
      );
      
      console.log(`투표 API 응답 성공:`, response.data);
      const apiResponse = response.data;
      return apiResponse.data;
    } catch (error: any) {
      console.error('투표 실패:', error);
      console.error('투표 실패 상세:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  }

  /**
   * 사용자가 해당 피드에 투표했는지 확인합니다
   */
  static async hasVoted(feedId: number): Promise<boolean> {
    try {
      console.log(`투표 상태 확인 API 호출 - feedId: ${feedId}`);
      
      // JWT 토큰 확인
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("JWT 토큰이 없어서 투표 상태를 확인할 수 없습니다.");
        return false;
      }
      
      const response = await axiosInstance.get<ApiResponse<boolean>>(
        `/api/feeds/${feedId}/vote/check`
      );
      
      console.log(`투표 상태 확인 응답:`, response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('투표 상태 확인 실패:', error);
      console.error('투표 상태 확인 실패 상세:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      return false;
    }
  }

  /**
   * 피드의 투표 수를 조회합니다
   */
  static async getVoteCount(feedId: number): Promise<number> {
    try {
      const response = await axiosInstance.get<ApiResponse<number>>(
        `/api/feeds/${feedId}/vote/count`
      );
      return response.data.data;
    } catch (error: any) {
      console.error('투표 수 조회 실패:', error);
      return 0;
    }
  }

  /**
   * 피드의 투표를 취소합니다
   */
  static async unvoteFeed(feedId: number): Promise<VoteResponse> {
    try {
      // JWT 토큰 확인
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }
      
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
      const response = await axiosInstance.get<ApiResponse<any>>(
        `/api/feeds/${feedId}/comments`,
        { params }
      );
      
      if (response.data.success) {
        // 백엔드 응답을 프론트엔드 타입으로 변환
        const data = response.data.data;
        if (data.pagination?.content) {
          data.pagination.content = data.pagination.content.map((comment: any) => {
            console.log('댓글 원본 데이터:', comment);
            const transformed = {
              ...comment,
              id: comment.commentId, // 프론트엔드 호환성을 위해 id 필드 추가
              user: {
                id: comment.userId,
                nickname: comment.userNickname,
                profileImg: comment.userProfileImage
              }
            };
            console.log('댓글 변환 후 데이터:', transformed);
            return transformed;
          });
        }
        return data;
      } else {
        throw new Error(response.data.message || '댓글 목록 조회에 실패했습니다.');
      }
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
      const response = await axiosInstance.post<ApiResponse<any>>(
        `/api/feeds/${feedId}/comments`,
        commentData
      );
      
      if (response.data.success) {
        // 백엔드 응답을 프론트엔드 타입으로 변환
        const comment = response.data.data;
        console.log('댓글 생성 원본 데이터:', comment);
        const transformed = {
          ...comment,
          id: comment.commentId, // 프론트엔드 호환성을 위해 id 필드 추가
          user: {
            id: comment.userId,
            nickname: comment.userNickname,
            profileImg: comment.userProfileImage
          }
        };
        console.log('댓글 생성 변환 후 데이터:', transformed);
        return transformed;
      } else {
        throw new Error(response.data.message || '댓글 생성에 실패했습니다.');
      }
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
      const response = await axiosInstance.delete<ApiResponse<void>>(
        `/api/feeds/${feedId}/comments/${commentId}`
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || '댓글 삭제에 실패했습니다.');
      }
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
        url = `/api/feeds/text-only/my/type/${feedType}`;
      } else {
        // 전체 조회 API 사용
        url = '/api/feeds/text-only/my';
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
        `/api/feeds/text-only/my/type/${feedType}`,
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
      }>>('/api/feeds/text-only/my/count');
      
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

  /**
   * 현재 로그인한 사용자가 작성한 댓글 목록을 조회합니다
   */
  static async getMyComments(page: number = 0, size: number = 20): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(
        `/api/feeds/text-only/my-comments`,
        { params: { page, size } }
      );
      return response.data;
    } catch (error: any) {
      console.error('내 댓글 목록 조회 실패:', error);
      throw error;
    }
  }

  // 해시태그 관련 기능은 피드 생성/수정 시 함께 처리됩니다
  // 별도의 해시태그 검색이나 인기 해시태그 기능이 필요하면 나중에 추가할 수 있습니다

  /**
   * 피드 검색 API
   */
  static async searchFeeds(params: {
    q?: string;
    authorId?: number;
    feedType?: 'DAILY' | 'EVENT' | 'RANKING';
    startDate?: string;
    endDate?: string;
    productName?: string;
    productId?: number;
    eventId?: number;
    eventTitle?: string;
    hashtags?: string[];
    page?: number;
    size?: number;
    sort?: 'latest' | 'popular';  // 백엔드에서 지원하는 2가지 옵션만
  } = {}): Promise<FeedListResponse> {
    try {
      console.log('피드 검색 시작:', params);
      
      const queryParams = new URLSearchParams();
      
      // 파라미터 추가
      if (params.q) queryParams.append('q', params.q);
      if (params.authorId) queryParams.append('authorId', params.authorId.toString());
      if (params.feedType) queryParams.append('feedType', params.feedType);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.productName) queryParams.append('productName', params.productName);
      if (params.productId) queryParams.append('productId', params.productId.toString());
      if (params.eventId) queryParams.append('eventId', params.eventId.toString());
      if (params.eventTitle) queryParams.append('eventTitle', params.eventTitle);
      if (params.hashtags) {
        params.hashtags.forEach(tag => queryParams.append('hashtags', tag));
      }
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size) queryParams.append('size', params.size.toString());
      if (params.sort) queryParams.append('sort', params.sort);

      const response = await axiosInstance.get<ApiResponse<any>>(`/api/feeds/text-only/search?${queryParams.toString()}`);
      
      console.log('검색 API 응답:', response.data);
      
      // 백엔드 응답을 프론트엔드 타입에 맞게 변환
      const transformedFeeds = (response.data.data.content || []).map((backendFeed: BackendFeedPost) => 
        this.transformBackendFeedToFrontend(backendFeed)
      );

      return {
        ...response.data.data,
        content: transformedFeeds,
      };
    } catch (error: any) {
      console.error('피드 검색 실패:', error);
      throw error;
    }
  }
}

export default FeedService; 