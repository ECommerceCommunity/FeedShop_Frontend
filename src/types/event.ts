// 이벤트 관련 통일된 타입 정의

// 기본 이벤트 타입들 (백엔드 enum과 완벽 일치)
export type EventStatus = "UPCOMING" | "ONGOING" | "ENDED";
export type EventType = "RANKING" | "BATTLE" | "ranking" | "battle";
export type ParticipationStatus = "PARTICIPATING" | "COMPLETED" | "ELIMINATED";
export type MatchStatus = "PENDING" | "ONGOING" | "COMPLETED";

// 백엔드 응답 구조와 일치하는 타입들
export interface EventListResponseDto {
  content: EventDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 개별 보상 타입
export interface EventRewardItem {
  id?: number;
  rewardType: "BADGE_POINTS" | "POINTS" | "DISCOUNT_COUPON";
  rewardValue: number;
  rewardDescription: string;
  maxRecipients?: number;
}

// 순위별 보상 그룹 타입 (하나의 순위에 여러 보상 가능)
export interface EventRewardGroup {
  id?: number;
  rank?: number;
  conditionValue: string; // 예: "1등", "최우수상"
  rewards: EventRewardItem[]; // 여러 보상을 배열로 관리
  conditionType?: string;
  conditionDescription?: string;
}

// 기존 호환성을 위한 타입 (하나의 보상만 있는 경우)
export interface EventRewardDto {
  id?: number;
  rank?: number;
  conditionValue: string;
  rewardType: "BADGE_POINTS" | "POINTS" | "DISCOUNT_COUPON";
  rewardValue: number;
  rewardDescription: string;
  conditionType?: string;
  conditionDescription?: string;
  maxRecipients?: number;
}

// 피드 생성용 이벤트 타입 (백엔드와 완벽 일치)
export interface FeedEventDto {
  eventId: number;
  title: string;
  eventStartDate: string;
  eventEndDate: string;
  type: EventType;
  deletedAt?: string | null;
  isDeleted?: boolean;
}

// 이벤트 요약 정보 타입 (백엔드와 완벽 일치)
export interface EventSummaryDto {
  eventId: number;
  title: string;
  eventStartDate: string;
  eventEndDate: string;
  type: EventType;
  deletedAt?: string | null;
  isDeleted?: boolean;
  isParticipatable?: boolean;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// 이벤트 상세 정보 타입 (백엔드와 완벽 일치)
export interface EventDto {
  eventId: number;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  eventStartDate: string;
  eventEndDate: string;
  purchaseStartDate?: string;
  purchaseEndDate?: string;
  purchasePeriod?: string;
  votePeriod?: string;
  announcementDate?: string;
  participationMethod: string;
  rewards: EventRewardDto[] | string;
  selectionCriteria: string;
  precautions: string;
  maxParticipants: number;
  imageUrl?: string;
  createdBy?: string;
  createdAt?: string;
  isParticipatable?: boolean;
}

// 이벤트 생성 요청 타입 (백엔드와 완벽 일치)
export interface EventCreateRequestDto {
  title: string;
  description: string;
  type: EventType;
  eventStartDate: string;
  eventEndDate: string;
  purchaseStartDate: string;
  purchaseEndDate: string;
  announcement: string;
  participationMethod: string;
  rewards: EventRewardDto[] | string;
  selectionCriteria: string;
  precautions: string;
  maxParticipants: number;
  image?: File;
}

// 이벤트 수정 요청 타입
export interface EventUpdateRequestDto extends EventCreateRequestDto {
  id: number;
}

// 이벤트 참여 요청 타입 (주문내역과 연동)
export interface EventParticipationRequestDto {
  eventId: number;
  feedId: number;
  orderItemId?: number; // 구매한 상품과의 연동
  productName?: string; // 상품명
  productSize?: number; // 상품 사이즈
}

// 이벤트 목록 응답 타입
export interface EventListResponse {
  content: EventDto[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
}

// 이벤트 결과 관리 관련 타입들
export interface EventResultDto {
  eventId: number;
  eventTitle: string;
  eventType: string;
  eventStatus: string;
  eventStartDate: string;
  eventEndDate: string;
  totalParticipants: number;
  totalFeeds: number;
  isResultAnnounced: boolean;
  announcementDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventResultDetailDto {
  eventId: number;
  eventTitle: string;
  eventType: string;
  eventStatus: string;
  eventStartDate: string;
  eventEndDate: string;
  totalParticipants: number;
  totalFeeds: number;
  isResultAnnounced: boolean;
  announcementDate?: string;
  participants: EventParticipantDto[];
  rankings: EventRankingDto[];
  battleMatches?: BattleMatchDto[];
  createdAt: string;
  updatedAt: string;
}

export interface EventParticipantDto {
  participantId: number;
  userId: number;
  username: string;
  participationStatus: string;
  participationDate: string;
  feedId?: number;
  feedTitle?: string;
  feedImageUrl?: string;
  voteCount?: number;
  rankPosition?: number;
  orderItemId?: number; // 구매한 상품과의 연동
  productName?: string; // 상품명
  productSize?: number; // 상품 사이즈
}

export interface EventRankingDto {
  rankingId: number;
  participantId: number;
  userId: number;
  username: string;
  voteCount: number;
  rankPosition: number;
  calculatedAt: string;
}

export interface BattleMatchDto {
  battleMatchId: number;
  participant1Id: number;
  participant1Username: string;
  participant1FeedId?: number;
  participant1FeedTitle?: string;
  participant1FeedImageUrl?: string;
  participant2Id: number;
  participant2Username: string;
  participant2FeedId?: number;
  participant2FeedTitle?: string;
  participant2FeedImageUrl?: string;
  winnerId?: number;
  winnerUsername?: string;
  matchStatus: string;
  createdAt: string;
  startTime?: string;
  endTime?: string;
}

// ===== 공통 컴포넌트용 타입들 =====

// 이벤트 폼 타입 (UI용 - 공통)
export interface EventForm {
  title: string;
  type: EventType;
  purchaseStartDate: string;
  purchaseEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  announcementDate: string;
  description: string;
  participationMethod: string;
  rewards: EventRewardGroup[]; // 여러 보상을 지원하는 그룹으로 변경
  selectionCriteria: string;
  precautions: string;
  maxParticipants: number;
  image: string;
  imageFile: File | null;
  imagePreview: string;
}

// 이벤트 모달 Props 타입
export interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event: EventDto | null;
}

// 레거시 타입들 (기존 코드와의 호환성을 위해 유지)
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
  rewards: EventRewardDto[] | string;
}

export interface Event {
  id: number;
  type: EventType;
  status: EventStatus;
  maxParticipants: number;
  createdBy: string;
  updatedBy: string;
  eventDetail: EventDetail;
  rewards: EventRewardDto[];
}

export interface EventParticipant {
  id: number;
  participationStatus: ParticipationStatus;
  participationDate: string;
  feedId: number;
  eventId: number;
  orderItemId?: number; // 구매한 상품과의 연동
  productName?: string; // 상품명 (표시용)
  productSize?: number; // 상품 사이즈
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

// ===== 이벤트 결과관리 관련 타입들 =====

// 이벤트 결과 응답 DTO
export interface EventResultResponseDto {
  id: number;
  eventId: number;
  eventTitle: string;
  resultType: string;
  announcedAt: string;
  totalParticipants: number;
  totalVotes: number;
  resultDetails: EventResultDetailResponseDto[];
}

// 이벤트 결과 상세 응답 DTO
export interface EventResultDetailResponseDto {
  id: number;
  userId: number;
  userName: string;
  feedId: number;
  feedTitle: string;
  rankPosition: number;
  voteCount: number;
  pointsEarned: number;
  badgePointsEarned: number;
  couponCode: string;
  couponDescription: string;
  rewardProcessed: boolean;
  rewardProcessedAt: string | null;
}

// 보상 처리 결과
export interface RewardProcessResult {
  eventId: number;
  totalParticipants: number;
  successfulRewards: number;
  failedRewards: number;
  rewardDetails: RewardDetail[];
}

// 보상 상세 정보
export interface RewardDetail {
  userId: number;
  rankPosition: number;
  pointsEarned?: number;
  badgePointsEarned?: number;
  couponCode?: string;
  success: boolean;
  message: string;
}

// 이벤트 결과 생성 요청 DTO
export interface EventResultCreateRequestDto {
  eventId: number;
  forceRecalculate: boolean;
} 