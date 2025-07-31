import axiosInstance from './axios';

export interface FeedEventDto {
  eventId: number;
  title: string;
  eventStartDate: string;
  eventEndDate: string;
  type: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class EventService {

  /**
   * 피드 생성용 이벤트 목록 조회 (진행중인 이벤트만)
   */
  async getFeedAvailableEvents(): Promise<FeedEventDto[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<FeedEventDto[]>>('/api/events/feed-available');
      
      if (response.data.success) {
        // Soft delete된 이벤트 필터링 및 현재 진행중인 이벤트만 필터링
        const currentDate = new Date();
        const events = response.data.data.filter(event => {
          // Soft delete 체크
          if (event.deletedAt || event.isDeleted) {
            return false;
          }
          
          // 현재 날짜가 이벤트 기간 내에 있는지 체크
          const startDate = new Date(event.eventStartDate);
          const endDate = new Date(event.eventEndDate);
          
          return currentDate >= startDate && currentDate <= endDate;
        });
        
        // console.log('필터링된 이벤트 목록:', events);
        return events;
      } else {
        throw new Error(response.data.message || '이벤트 목록 조회에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('이벤트 목록 조회 실패:', error);
      
      // 백엔드 연결 실패시 fallback 데이터 반환
      if (!error.response || error.code === 'NETWORK_ERROR') {
        console.warn('백엔드 연결 실패 - fallback 이벤트 데이터 사용');
        return this.getFallbackEvents();
      }
      
      throw error;
    }
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
    
    // 현재 진행중인 이벤트만 필터링
    return fallbackEvents.filter(event => {
      const startDate = new Date(event.eventStartDate);
      const endDate = new Date(event.eventEndDate);
      return currentDate >= startDate && currentDate <= endDate;
    });
  }
}

export default new EventService(); 