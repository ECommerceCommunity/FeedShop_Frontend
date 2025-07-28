import axiosInstance from './axios';

export interface EventRewardDto {
  conditionValue: number;
  rewardValue: string;
}

export interface FeedEventDto {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  maxParticipants: number;
  purchaseStartDate: string;
  purchaseEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  announcement: string;
  participationMethod: string;
  selectionCriteria: string;
  precautions: string;
  rewards: EventRewardDto[];
  imageUrl?: string;
}

class EventService {
  /**
   * 피드 생성 시 사용 가능한 이벤트 목록 조회
   */
  async getFeedAvailableEvents(): Promise<FeedEventDto[]> {
    try {
      const response = await axiosInstance.get('/api/events/feed-available');
      return response.data.data || [];
    } catch (error) {
      console.error('이벤트 목록 조회 실패:', error);
      return [];
    }
  }

  /**
   * 모든 이벤트 목록 조회
   */
  async getAllEvents(): Promise<FeedEventDto[]> {
    try {
      const response = await axiosInstance.get('/api/events');
      return response.data.data || [];
    } catch (error) {
      console.error('이벤트 목록 조회 실패:', error);
      return [];
    }
  }

  /**
   * 특정 이벤트 상세 조회
   */
  async getEventById(eventId: number): Promise<FeedEventDto | null> {
    try {
      const response = await axiosInstance.get(`/api/events/${eventId}`);
      return response.data.data || null;
    } catch (error) {
      console.error('이벤트 상세 조회 실패:', error);
      return null;
    }
  }
}

export default new EventService();