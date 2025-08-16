// Event 관련 타입들 추가
export type EventStatus = "UPCOMING" | "ONGOING" | "ENDED";
export type EventType =
  | "BATTLE"
  | "MISSION"
  | "MULTIPLE"
  | "REVIEW"
  | "CHALLENGE";
export type ParticipationStatus = "PARTICIPATING" | "COMPLETED" | "ELIMINATED";
export type MatchStatus = "PENDING" | "ONGOING" | "COMPLETED";

// EventReward는 eventService.ts에서 정의

export interface EventDetail {
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
  imageUrl: string;
  precautions: string;
  rewards: any[] | string; // eventService.ts의 EventReward 사용
}

export interface Event {
  id: number; // event_id
  type: EventType;
  status: EventStatus;
  maxParticipants: number;
  createdBy: string;
  updatedBy: string;
  eventDetail: EventDetail;
  rewards: any[]; // eventService.ts의 EventReward 사용
}

export interface EventParticipant {
  id: number;
  participationStatus: ParticipationStatus;
  participationDate: string;
  feedId: number;
  eventId: number;
}

export interface EventRanking {
  rankingId: number;
  participantId: number;
  voteCount: number;
  rankPosition: number;
  calculatedAt: string;
}

export interface BattleMatch {
  battleMatchId: number;
  participant1Id: number;
  participant2Id: number;
  winnerId?: number;
  matchStatus: MatchStatus;
  createdAt: string;
  startTime?: string;
  endTime?: string;
}

// Address 관련 타입들 - 백엔드 UserAddress 모델에 맞춤
export interface Address {
  id: number;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  addressLine1: string;
  addressLine2?: string;
  isDefault: boolean;
}

export interface AddressRequest {
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  addressLine1: string;
  addressLine2?: string;
  isDefault?: boolean;
}

export interface AddressResponse {
  id: number;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  addressLine1: string;
  addressLine2?: string;
  isDefault: boolean;
}

// 백엔드 응답을 위한 새로운 타입 정의
export interface BackendAddressResponse {
  id: number;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  addressLine1: string;
  addressLine2?: string;
  is_default: boolean;
}
