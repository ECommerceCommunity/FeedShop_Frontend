/**
 * 리뷰 시스템 타입 정의 (백엔드 구현 기능만 포함)
 *
 * 실제 백엔드에 구현된 기본 기능들만 포함합니다.
 * 도움됨, 신고 등의 기능은 추후 구현 예정입니다.
 */

// =============== 백엔드 API 응답 타입 (첨부파일 기준) ===============

/**
 * 공통 API 응답 래퍼 타입
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

/**
 * 리뷰 이미지 타입 (백엔드 API 응답 구조)
 */
export interface ReviewImage {
    reviewImageId: number;
    originalFilename: string;
    imageUrl: string;
    imageOrder: number;
    fileSize: number;
    alt?: string; // 선택적 필드로 유지
}

/**
 * 리뷰 타입 (백엔드 응답 구조)
 */
export interface Review {
    reviewId: number;
    userId: number;
    productId: number;
    userName: string;
    userProfileImage?: string;
    rating: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    images: ReviewImage[];
    title?: string; // 백엔드에서 제목도 포함
    // 백엔드에서 추가로 오는 필드들
    helpfulCount?: number;
    isHelpful?: boolean;
    // 3요소 평가 (백엔드에서 문자열로 오는 경우와 숫자 모두 지원)
    sizeFit?: number | string;    // 숫자: 1,2,3 또는 문자열: SMALL,NORMAL,BIG
    cushion?: number | string;    // 숫자: 1,2,3 또는 문자열: SOFT,NORMAL,HARD  
    stability?: number | string;  // 숫자: 1,2,3 또는 문자열: LOW,NORMAL,STABLE
}

/**
 * 리뷰 목록 응답 타입 (백엔드 실제 응답 구조)
 */
export interface ReviewListResponse {
    reviews: Review[];           // 백엔드는 content 대신 reviews 사용
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    averageRating: number;       // 백엔드 응답에 포함된 추가 필드
    totalReviews: number;        // 백엔드 응답에 포함된 추가 필드
    first?: boolean;             // 옵셔널로 변경
    last?: boolean;              // 옵셔널로 변경
}

/**
 * 상품 정보 타입
 */
export interface Product {
    productId: number;
    name: string;
    brandName: string;
    thumbnailUrl: string;
    averageRating: number;
    totalReviewCount: number;
}

// =============== API 요청 타입 ===============

/**
 * 리뷰 생성 요청 타입
 */
export interface CreateReviewRequest {
    productId: number;
    title: string;
    rating: number;
    content: string;
    sizeFit?: number;
    cushion?: number;
    stability?: number;
}

/**
 * 리뷰 수정 요청 타입
 */
export interface UpdateReviewRequest {
    title?: string;  // 수정에서는 선택적으로 처리
    rating: number;
    content: string;
    sizeFit?: number;
    cushion?: number;
    stability?: number;
    deleteImageIds?: number[];  // 삭제할 이미지 ID들
}

/**
 * 리뷰 정렬 옵션 (백엔드 구현 기능만)
 */
export type ReviewSortOption = 'latest' | 'rating_high' | 'rating_low';

/**
 * 리뷰 목록 조회 파라미터 타입
 */
export interface ReviewListParams {
    page?: number;
    size?: number;
    sort?: ReviewSortOption;
    rating?: number; // 별점 필터 (정확한 별점이면 exact=true와 함께 사용)
    exactRating?: boolean; // true면 정확한 별점, false면 이상 (기본값)
    sizeFit?: number; // 사이즈 필터 (1-5: 매우작음~매우큼)
    cushion?: number; // 쿠션감 필터 (1-5: 매우딱딱함~매우푹신함)
    stability?: number; // 안정성 필터 (1-5: 매우불안정~매우안정적)
}

// =============== API 응답 타입 ===============

/**
 * 리뷰 생성 응답 타입
 */
export interface CreateReviewResponse {
    reviewId: number;
    message: string;
    imageUrls?: string[];
    pointsEarned?: number;    // 새로 적립된 포인트
    currentPoints?: number;   // 현재 총 보유 포인트
}


/**
 * 도움이 됨 응답 타입
 */
export interface HelpfulResponse {
    reviewId: number;
    isHelpful: boolean;
    helpfulCount: number;
}

/**
 * 리뷰 수정 응답 타입
 */
export interface UpdateReviewResponse {
    reviewId: number;
    message: string;
    newImageUrls: string[];
    deletedImageIds: number[];
}

/**
 * 리뷰 삭제 응답 타입
 */
export interface DeleteReviewResponse {
    reviewId: number;
    message: string;
    deletedImageCount: number;
}

// =============== 정렬 및 필터링 옵션 ===============

/**
 * 리뷰 필터 상태
 */
export interface ReviewFilterState {
    sort: ReviewSortOption;
    rating: number;        // 0: 전체, 1-5: 별점 필터
    exactRating: boolean;  // true: 정확한 별점, false: 이상 (기본값)
    sizeFit: number;       // 0: 전체, 1-5: 매우작음~매우큼
    cushion: number;       // 0: 전체, 1-5: 매우딱딱함~매우푹신함
    stability: number;     // 0: 전체, 1-5: 매우불안정~매우안정적
}

// =============== 컴포넌트 Props 타입 ===============

/**
 * 별점 컴포넌트 Props
 */
export interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: "small" | "medium" | "large";
    readOnly?: boolean;
    showNumber?: boolean;
    onChange?: (rating: number) => void;
}

/**
 * 리뷰 카드 컴포넌트 Props
 */
export interface ReviewCardProps {
    review: Review;
    currentUserId?: number;
    onEdit?: (reviewId: number) => void;
    onDelete?: (reviewId: number) => void;
}

/**
 * 리뷰 목록 컴포넌트 Props
 */
export interface ReviewListProps {
    reviews: Review[];
    currentUserId?: number;
    isLoading: boolean;
    hasMore: boolean;
    error?: string | null;
    onLoadMore?: () => void;
    onEdit?: (reviewId: number) => void;
    onDelete?: (reviewId: number) => void;
    enableInfiniteScroll?: boolean;
    emptyMessage?: string;
    loadingMessage?: string;
}

/**
 * 리뷰 필터 컴포넌트 Props
 */
export interface ReviewFilterProps {
    totalCount: number;
    currentFilter: ReviewFilterState;
    onFilterChange: (filter: ReviewFilterState) => void;
    isLoading?: boolean;
}

/**
 * 상품 리뷰 전체 섹션 Props
 */
export interface ProductReviewsProps {
    productId: number;
    currentUserId?: number;
    canWriteReview?: boolean;
    onWriteReview?: () => void;
    onEditReview?: (reviewId: number) => void;
    enableInfiniteScroll?: boolean;
    initialPageSize?: number;
    productImage?: string;
}

// =============== 폼 관련 타입 ===============

/**
 * 리뷰 작성/수정 폼 데이터
 */
export interface ReviewFormData {
    title: string;
    rating: number;
    content: string;
    sizeFit?: number;
    cushion?: number;
    stability?: number;
    images: File[];
}

/**
 * 폼 유효성 검사 에러
 */
export interface ReviewFormErrors {
    title?: string;
    rating?: string;
    content?: string;
    sizeFit?: string;
    cushion?: string;
    stability?: string;
    images?: string;
}

// =============== 훅 반환 타입 (기본 기능만) ===============

/**
 * useReviewList 훅 반환 타입
 */
export interface UseReviewListReturn {
    // 데이터
    reviews: Review[];
    product: Product | null;

    // 상태
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    totalCount: number;

    // 필터 상태
    filter: ReviewFilterState;

    // 액션 함수들
    loadMore: () => void;
    applyFilter: (filter: ReviewFilterState) => void;
    refresh: () => void;
    removeReview: (reviewId: number) => void;  // 삭제 후 로컬 상태 업데이트
}

/**
 * useReviewActions 훅 반환 타입
 */
export interface UseReviewActionsReturn {
    // 상태
    isSubmitting: boolean;

    // 액션 함수들
    createReview: (data: CreateReviewRequest, images?: File[]) => Promise<CreateReviewResponse>;
    updateReview: (reviewId: number, data: UpdateReviewRequest, newImages?: File[]) => Promise<UpdateReviewResponse>;
    deleteReview: (reviewId: number) => Promise<DeleteReviewResponse>;

    // 간단한 권한 체크
    canEditReview: (review: Review, currentUserId?: number) => boolean;
    canDeleteReview: (review: Review, currentUserId?: number) => boolean;
}

// =============== 리뷰 신고 관련 타입 ===============

/**
 * 리뷰 신고 사유 옵션
 */
export type ReportReason = 
    | 'ABUSIVE_LANGUAGE'     // 욕설 및 비방
    | 'SPAM'                 // 스팸 및 도배
    | 'INAPPROPRIATE_CONTENT' // 부적절한 내용
    | 'FALSE_INFORMATION'    // 허위 정보
    | 'ADVERTISING'          // 광고성 내용
    | 'COPYRIGHT_VIOLATION'  // 저작권 침해
    | 'OTHER';               // 기타

/**
 * 리뷰 신고 요청 타입
 */
export interface ReportReviewRequest {
    reason: ReportReason;
    description?: string;
}

/**
 * 리뷰 신고 응답 타입
 */
export interface ReportReviewResponse {
    reportId: number;
    reviewId: number;
    reporterId: number;
    reason: ReportReason;
    createdAt: string;
}

/**
 * 신고 사유 옵션 정보
 */
export interface ReportReasonOption {
    value: ReportReason;
    label: string;
    description: string;
}

// =============== 기타 유틸리티 타입 ===============

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// =============== 3요소 통계 타입 ===============

/**
 * 3요소 평가 옵션 타입
 */
export type CushionLevel = 'VERY_SOFT' | 'SOFT' | 'MEDIUM' | 'FIRM' | 'VERY_FIRM';
export type SizeFitLevel = 'VERY_SMALL' | 'SMALL' | 'NORMAL' | 'BIG' | 'VERY_BIG';
export type StabilityLevel = 'VERY_UNSTABLE' | 'UNSTABLE' | 'NORMAL' | 'STABLE' | 'VERY_STABLE';

/**
 * 개별 요소 통계 구조
 */
export interface ElementStatistics {
    distribution: Record<string, number>;
    percentage: Record<string, number>;
    mostSelected: string | null;
    averageScore: number;
}

/**
 * 상품 3요소 평가 통계 응답 타입
 */
export interface ProductStatistics {
    totalReviews: number;
    cushionStatistics: ElementStatistics;
    sizeFitStatistics: ElementStatistics;
    stabilityStatistics: ElementStatistics;
}

/**
 * 3요소 라벨 매핑
 */
export const ELEMENT_LABELS = {
    cushion: {
        VERY_FIRM: '매우 딱딱함',
        FIRM: '딱딱함', 
        MEDIUM: '적당함',
        SOFT: '푹신함',
        VERY_SOFT: '매우 푹신함'
    },
    sizeFit: {
        VERY_SMALL: '매우 작음',
        SMALL: '작음',
        NORMAL: '적당함',
        BIG: '큼',
        VERY_BIG: '매우 큼'
    },
    stability: {
        VERY_UNSTABLE: '매우 불안정',
        UNSTABLE: '불안정',
        NORMAL: '보통',
        STABLE: '안정적',
        VERY_STABLE: '매우 안정적'
    }
} as const;

/**
 * 5단계 평가를 위한 매핑 (1-5 점수 → 백엔드 enum)
 */
export const SCORE_TO_ENUM = {
    cushion: {
        1: 'VERY_FIRM',
        2: 'FIRM',
        3: 'MEDIUM', 
        4: 'SOFT',
        5: 'VERY_SOFT'
    },
    sizeFit: {
        1: 'VERY_SMALL',
        2: 'SMALL',
        3: 'NORMAL',
        4: 'BIG', 
        5: 'VERY_BIG'
    },
    stability: {
        1: 'VERY_UNSTABLE',
        2: 'UNSTABLE',
        3: 'NORMAL',
        4: 'STABLE',
        5: 'VERY_STABLE'
    }
} as const;

/**
 * 5단계 평가 옵션 (프론트엔드 표시용)
 */
export const ELEMENT_OPTIONS = {
    cushion: [
        { value: 1, label: '매우 딱딱함', enum: 'VERY_FIRM' },
        { value: 2, label: '딱딱함', enum: 'FIRM' },
        { value: 3, label: '적당함', enum: 'MEDIUM' },
        { value: 4, label: '푹신함', enum: 'SOFT' },
        { value: 5, label: '매우 푹신함', enum: 'VERY_SOFT' }
    ],
    sizeFit: [
        { value: 1, label: '매우 작음', enum: 'VERY_SMALL' },
        { value: 2, label: '작음', enum: 'SMALL' },
        { value: 3, label: '적당함', enum: 'NORMAL' },
        { value: 4, label: '큼', enum: 'BIG' },
        { value: 5, label: '매우 큼', enum: 'VERY_BIG' }
    ],
    stability: [
        { value: 1, label: '매우 불안정', enum: 'VERY_UNSTABLE' },
        { value: 2, label: '불안정', enum: 'UNSTABLE' },
        { value: 3, label: '보통', enum: 'NORMAL' },
        { value: 4, label: '안정적', enum: 'STABLE' },
        { value: 5, label: '매우 안정적', enum: 'VERY_STABLE' }
    ]
} as const;

/**
 * 백엔드 enum을 1-5 점수로 역변환하는 매핑
 */
export const ENUM_TO_SCORE = {
    cushion: {
        'VERY_FIRM': 1,
        'FIRM': 2,
        'MEDIUM': 3,
        'SOFT': 4,
        'VERY_SOFT': 5
    },
    sizeFit: {
        'VERY_SMALL': 1,
        'SMALL': 2,
        'NORMAL': 3,
        'BIG': 4,
        'VERY_BIG': 5
    },
    stability: {
        'VERY_UNSTABLE': 1,
        'UNSTABLE': 2,
        'NORMAL': 3,
        'STABLE': 4,
        'VERY_STABLE': 5
    }
} as const;