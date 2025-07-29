// 이벤트 관련 통일된 타입 정의

export interface EventRewardDto {
  conditionValue: number;
  rewardValue: string;
}

export interface EventDetailDto {
  id: number;
  title: string;
  description: string;
  purchaseStartDate: string;
  purchaseEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  announcement: string;
  participationMethod: string;
  selectionCriteria: string;
  precautions: string;
  imageUrl?: string;
}

export interface EventDto {
  id: number;
  type: 'BATTLE' | 'MISSION' | 'MULTIPLE';
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  maxParticipants: number;
  participantCount?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  
  // 이벤트 상세 정보 (평면 구조)
  title: string;
  description: string;
  purchaseStartDate: string;
  purchaseEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  announcement: string;
  participationMethod: string;
  selectionCriteria: string;
  precautions: string;
  imageUrl?: string;
  
  // 보상 정보 (배열 구조)
  rewards: EventRewardDto[];
}

// 이벤트 생성 요청 DTO
export interface EventCreateRequestDto {
  title: string;
  type: 'BATTLE' | 'MISSION' | 'MULTIPLE';
  purchaseStartDate: string;
  purchaseEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  announcement: string;
  description: string;
  participationMethod: string;
  rewards: EventRewardDto[];
  selectionCriteria: string;
  precautions: string;
  maxParticipants: number;
  imageUrl?: string;
}

// 이벤트 수정 요청 DTO
export interface EventUpdateRequestDto {
  title?: string;
  type?: 'BATTLE' | 'MISSION' | 'MULTIPLE';
  purchaseStartDate?: string;
  purchaseEndDate?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  announcement?: string;
  description?: string;
  participationMethod?: string;
  rewards?: EventRewardDto[];
  selectionCriteria?: string;
  precautions?: string;
  maxParticipants?: number;
  imageUrl?: string;
}

// 이벤트 목록 조회 응답
export interface EventListResponse {
  content: EventDto[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
} 