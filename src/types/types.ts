// Event 관련 타입들 추가
export type EventStatus = "UPCOMING" | "ONGOING" | "ENDED";
export type EventType = "BATTLE" | "MISSION" | "MULTIPLE" | "REVIEW" | "CHALLENGE";
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
