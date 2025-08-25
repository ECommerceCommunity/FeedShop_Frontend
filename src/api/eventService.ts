import axiosInstance from './axios';
import {
  EventRewardDto,
  FeedEventDto,
  EventSummaryDto,
  ApiResponse,
  EventDto,
  EventCreateRequestDto,
  EventUpdateRequestDto,
  EventListResponse
} from '../types/event';

class EventService {

  /**
   * 피드 생성용 이벤트 목록 조회 (진행중인 이벤트만)
   * 백엔드 캐싱과 연동하여 성능 최적화
   */
  async getFeedAvailableEvents(): Promise<FeedEventDto[]> {
    try {
      // 캐시 헤더 추가로 브라우저 캐싱 활용
      const response = await axiosInstance.get<ApiResponse<EventSummaryDto[]>>('/api/events/feed-available', {
        headers: {
          'Cache-Control': 'max-age=300', // 5분간 브라우저 캐시
        }
      });
      
      // 백엔드 ApiResponse 구조에서 데이터 추출
      const eventData = response.data.data || [];
      const events = Array.isArray(eventData) ? eventData : [];
      
      // 백엔드에서 반환하는 EventSummaryDto를 FeedEventDto로 변환
      const feedEvents: FeedEventDto[] = events.map(event => ({
        eventId: event.eventId,
        title: event.title,
        eventStartDate: event.eventStartDate,
        eventEndDate: event.eventEndDate,
        type: event.type,
        deletedAt: event.deletedAt,
        isDeleted: event.isDeleted
      }));
      
      console.log('피드 생성용 이벤트 목록 조회 성공:', feedEvents);
      return feedEvents;
      
    } catch (error: any) {
      console.error('이벤트 목록 조회 실패:', error);
      
      // 백엔드 연결 실패시 빈 배열 반환
      if (!error.response || error.code === 'NETWORK_ERROR') {
        return [];
      }
      
      throw error;
    }
  }

  /**
   * 모든 이벤트 목록 조회
   */
  async getAllEvents(params?: {
    page?: number;
    size?: number;
    sort?: string;
    status?: string;
    keyword?: string;
  }): Promise<EventListResponse> {
    try {
      console.log('이벤트 목록 API 호출 파라미터:', params);
      const response = await axiosInstance.get('/api/events/all', { params });
      console.log('이벤트 목록 API 응답:', response.data);
      
      const result = response.data.data || response.data || { content: [], totalPages: 0, totalElements: 0, last: true, first: true, size: 10, number: 0 };
      console.log('파싱된 이벤트 목록:', result);
      
      return result;
    } catch (error) {
      console.error('이벤트 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 이벤트 상세 조회
   */
  async getEventById(eventId: number): Promise<EventDto | null> {
    try {
      // console.log('Calling API:', `/api/events/${eventId}`);
      const response = await axiosInstance.get(`/api/events/${eventId}`);
      // console.log('API Response:', response.data);
      // console.log('Response data structure:', JSON.stringify(response.data, null, 2));
      
      // 백엔드 응답 구조에 따라 데이터 추출
      const eventData = response.data.data || response.data || null;
      // console.log('Extracted event data:', eventData);
      
      return eventData;
    } catch (error: any) {
      console.error('이벤트 상세 조회 실패:', error);
      console.error('Error details:', error.response?.data);
      return null;
    }
  }

  /**
   * 이벤트 생성
   */
  async createEvent(eventData: EventCreateRequestDto): Promise<EventDto> {
    try {
      const response = await axiosInstance.post('/api/events', eventData);
      return response.data.data;
    } catch (error) {
      console.error('이벤트 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 이벤트 수정
   */
  async updateEvent(eventId: number, eventData: EventUpdateRequestDto): Promise<EventDto> {
    try {
      const response = await axiosInstance.put(`/api/events/${eventId}`, eventData);
      return response.data.data;
    } catch (error) {
      console.error('이벤트 수정 실패:', error);
      throw error;
    }
  }

  /**
   * 이벤트 삭제
   */
  async deleteEvent(eventId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/api/events/${eventId}`);
    } catch (error) {
      console.error('이벤트 삭제 실패:', error);
      throw error;
    }
  }



  /**
   * 문자열 rewards를 EventRewardDto[]로 변환
   */
  parseRewardsString(rewardsString: string): EventRewardDto[] {
    try {
      // 간단한 파싱 로직 (실제로는 더 정교한 파싱 필요)
      const lines = rewardsString.split('\n').filter(line => line.trim());
      return lines.map((line, index) => ({
        conditionValue: String(index + 1),
        reward: line.trim()
      }));
    } catch (error) {
      console.error('rewards 파싱 실패:', error);
      return [];
    }
  }

  // ===== 이벤트 결과 관리 API =====

  /**
   * 특정 이벤트 결과 상세 조회
   */
  async getEventResultDetail(eventId: number): Promise<any> {
    try {
      console.log('이벤트 결과 상세 조회 API 호출:', eventId);
      // 백엔드 API 경로 수정: /api/v2/events/{eventId}/results
      const response = await axiosInstance.get(`/api/v2/events/${eventId}/results`);
      console.log('이벤트 결과 상세 API 응답:', response.data);
      
      const result = response.data.data || response.data || null;
      return result;
    } catch (error: any) {
      console.error('이벤트 결과 상세 조회 실패:', error);
      console.error('Error details:', error.response?.data);
      return null;
    }
  }

  /**
   * 이벤트 결과 생성 (발표)
   */
  async announceEventResult(eventId: number): Promise<void> {
    try {
      console.log('이벤트 결과 생성 API 호출:', eventId);
      // 백엔드 API 경로 수정: /api/v2/events/{eventId}/results
      await axiosInstance.post(`/api/v2/events/${eventId}/results`, {
        forceRecalculate: false
      });
      console.log('이벤트 결과 생성 성공');
    } catch (error) {
      console.error('이벤트 결과 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 이벤트 결과 삭제 (발표 취소)
   */
  async cancelEventResultAnnouncement(eventId: number): Promise<void> {
    try {
      console.log('이벤트 결과 삭제 API 호출:', eventId);
      // 백엔드 API 경로 수정: /api/v2/events/{eventId}/results
      await axiosInstance.delete(`/api/v2/events/${eventId}/results`);
      console.log('이벤트 결과 삭제 성공');
    } catch (error) {
      console.error('이벤트 결과 삭제 실패:', error);
      throw error;
    }
  }

  /**
   * 이벤트 결과 수동 마이그레이션
   */
  async migrateEventResult(eventId: number): Promise<void> {
    try {
      console.log('이벤트 결과 마이그레이션 API 호출:', eventId);
      // 백엔드 API 경로 수정: /api/v2/events/migration/{eventId}
      await axiosInstance.post(`/api/v2/events/migration/${eventId}`);
      console.log('이벤트 결과 마이그레이션 성공');
    } catch (error) {
      console.error('이벤트 결과 마이그레이션 실패:', error);
      throw error;
    }
  }

  /**
   * EventRewardDto[]를 문자열로 변환
   */
  stringifyRewards(rewards: EventRewardDto[]): string {
    return rewards.map(reward => reward.reward).join('\n');
  }

  /**
   * Fallback 이벤트 데이터 (백엔드 연결 실패시 사용)
   */
  private getFallbackEvents(): FeedEventDto[] {
    const currentDate = new Date();
    const fallbackEvents = [
      {
        eventId: 1,
        title: '여름 스타일 챌린지',
        eventStartDate: '2025-07-20',
        eventEndDate: '2025-08-07',
        type: 'BATTLE',
        deletedAt: null,
        isDeleted: false
      },
      {
        eventId: 2,
        title: '신상품 리뷰 이벤트',
        eventStartDate: '2025-07-15',
        eventEndDate: '2025-08-10',
        type: 'MISSION',
        deletedAt: null,
        isDeleted: false
      },
      {
        eventId: 3,
        title: '베스트 리뷰어 선발대회',
        eventStartDate: '2025-07-01',
        eventEndDate: '2025-08-15',
        type: 'MULTIPLE',
        deletedAt: null,
        isDeleted: false
      }
    ];
    
    // 현재 진행중인 이벤트만 필터링 (더 엄격한 검증)
    return fallbackEvents.filter(event => {
      const startDate = new Date(event.eventStartDate);
      const endDate = new Date(event.eventEndDate);
      
      // 현재 날짜가 시작일 이후이고 종료일 이전인지 확인
      return currentDate >= startDate && currentDate <= endDate;
    });
  }
}

export default new EventService();
