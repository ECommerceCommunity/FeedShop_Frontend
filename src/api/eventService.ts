import axiosInstance from './axios';
import { 
  EventDto, 
  EventCreateRequestDto, 
  EventUpdateRequestDto, 
  EventListResponse,
  EventRewardDto 
} from '../types/event';

class EventService {
  /**
   * 피드 생성 시 사용 가능한 이벤트 목록 조회
   */
  async getFeedAvailableEvents(): Promise<EventDto[]> {
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
  async getAllEvents(params?: {
    page?: number;
    size?: number;
    sort?: string;
    status?: string;
    keyword?: string;
  }): Promise<EventListResponse> {
    try {
      const response = await axiosInstance.get('/api/events', { params });
      return response.data.data || { content: [], totalPages: 0, totalElements: 0, last: true, first: true, size: 10, number: 0 };
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
      console.log('Calling API:', `/api/events/${eventId}`);
      const response = await axiosInstance.get(`/api/events/${eventId}`);
      console.log('API Response:', response.data);
      console.log('Response data structure:', JSON.stringify(response.data, null, 2));
      
      // 백엔드 응답 구조에 따라 데이터 추출
      const eventData = response.data.data || response.data || null;
      console.log('Extracted event data:', eventData);
      
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
        conditionValue: index + 1,
        rewardValue: line.trim()
      }));
    } catch (error) {
      console.error('rewards 파싱 실패:', error);
      return [];
    }
  }

  /**
   * EventRewardDto[]를 문자열로 변환
   */
  stringifyRewards(rewards: EventRewardDto[]): string {
    return rewards.map(reward => reward.rewardValue).join('\n');
  }
}

export default new EventService();