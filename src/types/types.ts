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
