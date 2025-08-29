// Event 관련 타입들은 event.ts에서 import
export type {
  EventStatus,
  EventType,
  ParticipationStatus,
  MatchStatus,
  EventRewardDto,
  FeedEventDto,
  EventSummaryDto,
  ApiResponse,
  EventDto,
  EventCreateRequestDto,
  EventUpdateRequestDto,
  EventListResponse,
  EventResultDto,
  EventResultDetailDto,
  EventParticipantDto,
  EventRankingDto,
  BattleMatchDto,
  EventDetail,
  Event,
  EventParticipant,
  EventRanking,
  BattleMatch
} from './event';

// Feed 관련 타입들은 별도로 관리 (순환 참조 방지)
// 필요시 각 파일에서 직접 import하여 사용

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
  addressId: number;
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
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// 사용자 관련 타입들
export interface User {
  id: number;
  email: string;
  nickname: string;
  name: string;
  userType: string;
  profileImg?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  name: string;
  userType: string;
  profileImg?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

// 상품 관련 타입들
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  imageUrl: string;
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// 주문 관련 타입들
export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: Address;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

// 피드 관련 타입들
export interface Feed {
  id: number;
  title: string;
  content: string;
  imageUrls: string[];
  userId: number;
  userNickname: string;
  userProfileImg?: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  eventId?: number;
  eventTitle?: string;
  createdAt: string;
  updatedAt: string;
}

// 리뷰 관련 타입들
export interface Review {
  id: number;
  productId: number;
  userId: number;
  userNickname: string;
  userProfileImg?: string;
  rating: number;
  title: string;
  content: string;
  imageUrls: string[];
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

// 장바구니 관련 타입들
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  price: number;
  quantity: number;
  selected: boolean;
  createdAt: string;
  updatedAt: string;
}

// 위시리스트 관련 타입들
export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  price: number;
  discountPrice?: number;
  createdAt: string;
}

// 쿠폰 관련 타입들
export interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API 명세서에 따른 실제 쿠폰 응답 구조 (couponCode, discountType 필드 없음)
export interface CouponResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // CouponsPage에서 사용하는 추가 속성들
  couponCode?: string;
  couponName?: string;
  freeShipping?: boolean;
  issuedAt?: string;
  expiresAt?: string;
  status?: string;
  usedAt?: string;
  // develop 브랜치에서 추가된 속성들
  isFreeShipping?: boolean;
  couponStatus?: UserCouponStatus;
}

export interface CouponIssueRequest {
  email: string;
  couponCode: string;
}

export interface CouponUseRequest {
  email: string;
  couponCode: string;
  orderAmount: number;
}

export type UserCouponStatus = 'AVAILABLE' | 'USED' | 'EXPIRED';

// 뱃지 관련 타입들
export interface BadgeType {
  name: string;
  description: string;
  imageUrl: string;
  bonusPoints: number;
}

export interface BadgeResponse {
  id: number;
  badgeName: string;
  badgeDescription: string;
  badgeImageUrl: string;
  badgeType: string;
  awardedAt: string;
  isDisplayed: boolean;
}

export interface BadgeListResponse {
  badges: BadgeResponse[];
  totalCount: number;
  displayedCount: number;
}

export interface BadgeToggleRequest {
  badgeId: number;
}

export interface BadgeAwardRequest {
  userId: number;
  badgeType: string;
}

// 리워드 관련 타입들
export interface RewardType {
  displayName: string;
  description: string;
}

export interface RewardHistoryResponse {
  historyId: number;
  userId: number;
  userLoginId: string;
  rewardType: string;
  rewardTypeDisplayName: string;
  points: number;
  description: string;
  relatedId: number | null;
  relatedType: string | null;
  adminId: number | null;
  isProcessed: boolean;
  processedAt: string | null;
  createdAt: string;
}

export interface RewardPolicyResponse {
  policyId: number;
  rewardType: string;
  rewardTypeDisplayName: string;
  rewardTypeDescription: string;
  points: number;
  description: string;
  isActive: boolean;
  dailyLimit: number | null;
  monthlyLimit: number | null;
  validFrom: string | null;
  validTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RewardGrantRequest {
  userId: number;
  points: number;
  description: string;
}

export interface RewardHistoryPage {
  content: RewardHistoryResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// 공통 응답 타입들
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
