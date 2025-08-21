/**
 * 리뷰 관련 유틸리티 함수들 (기본 기능만)
 *
 * 백엔드에 구현된 기본 기능들을 지원하는 유틸리티 함수들입니다.
 * 복잡한 기능들은 제외하고 실용적인 함수들만 포함합니다.
 */

// =============== 숫자 및 날짜 포맷팅 ===============

/**
 * 숫자를 한국어 형식으로 포맷팅하는 함수
 * 예: 12345 -> "12,345"
 */
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("ko-KR").format(num);
};

/**
 * 날짜를 한국어 형식으로 포맷팅하는 함수
 * 예: "2024-01-15T10:30:00" -> "2024년 1월 15일"
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "날짜 없음";
    }

    return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

/**
 * 상대적인 시간을 계산하는 함수 (몇 일 전, 몇 시간 전)
 * 예: "3일 전", "2시간 전", "방금 전"
 */
export const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    if (isNaN(date.getTime())) {
        return "시간 정보 없음";
    }

    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
        return "방금 전";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    } else if (diffInDays < 30) {
        return `${diffInDays}일 전`;
    } else {
        return formatDate(dateString);
    }
};

// =============== 별점 관련 함수들 ===============

/**
 * 평균 별점을 계산하는 함수
 */
export const calculateAverageRating = (ratings: number[]): number => {
    // 안전한 검사
    if (!ratings || !Array.isArray(ratings) || ratings.length === 0) {
        return 0;
    }

    const validRatings = ratings.filter(rating =>
        !isNaN(rating) && rating >= 1 && rating <= 5
    );

    if (validRatings.length === 0) {
        return 0;
    }

    const sum = validRatings.reduce((total, rating) => total + rating, 0);
    const average = sum / validRatings.length;

    return Math.round(average * 10) / 10; // 소수점 1자리
};

/**
 * 별점별 리뷰 개수를 계산하는 함수
 */
export const getRatingDistribution = (reviews: any[]): Record<number, number> => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // 안전한 검사
    if (!reviews || !Array.isArray(reviews)) {
        return distribution;
    }

    reviews.forEach(review => {
        if (review && typeof review.rating === 'number') {
            const rating = Math.floor(review.rating);
            if (rating >= 1 && rating <= 5) {
                distribution[rating as keyof typeof distribution]++;
            }
        }
    });

    return distribution;
};

/**
 * 별점별 비율을 계산하는 함수 (퍼센트)
 */
export const getRatingPercentages = (reviews: any[]): Record<number, number> => {
    // 안전한 검사
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
        return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    }

    const distribution = getRatingDistribution(reviews);
    const totalReviews = reviews.length;

    const percentages: Record<number, number> = {};

    for (const [rating, count] of Object.entries(distribution)) {
        percentages[Number(rating)] = Math.round((count / totalReviews) * 100);
    }

    return percentages;
};

// =============== 리뷰 텍스트 처리 ===============

/**
 * 리뷰 텍스트를 요약하는 함수 (미리보기용)
 */
export const summarizeReviewContent = (content: string, maxLength: number = 100): string => {
    if (!content) {
        return "내용 없음";
    }

    if (content.length <= maxLength) {
        return content;
    }

    return content.slice(0, maxLength) + "...";
};

// =============== 정렬 및 필터링 (기본 기능만) ===============

/**
 * 리뷰를 별점순으로 정렬하는 함수
 */
export const sortByRating = (reviews: any[], order: "asc" | "desc" = "desc"): any[] => {
    return [...reviews].sort((a, b) => {
        if (order === "desc") {
            return b.rating - a.rating;
        } else {
            return a.rating - b.rating;
        }
    });
};

/**
 * 리뷰를 날짜순으로 정렬하는 함수
 */
export const sortByDate = (reviews: any[], order: "asc" | "desc" = "desc"): any[] => {
    return [...reviews].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (order === "desc") {
            return dateB - dateA; // 최신순
        } else {
            return dateA - dateB; // 오래된 순
        }
    });
};

/**
 * 특정 별점 이상의 리뷰만 필터링하는 함수
 */
export const filterByMinRating = (reviews: any[], minRating: number): any[] => {
    return reviews.filter(review => review.rating >= minRating);
};

// =============== 3요소 평가 관련 ===============

/**
 * 3요소 평가 값을 텍스트로 변환하는 함수
 */
export const getEvaluationText = (
    type: 'sizeFit' | 'cushion' | 'stability',
    value?: number
): { text: string; color: string } => {
    if (!value) return { text: "미평가", color: "#9ca3af" };

    const evaluationMap = {
        sizeFit: {
            1: { text: "작음", color: "#dc2626" },
            2: { text: "적당함", color: "#059669" },
            3: { text: "큼", color: "#dc2626" }
        },
        cushion: {
            1: { text: "부드러움", color: "#2563eb" },
            2: { text: "적당함", color: "#059669" },
            3: { text: "딱딱함", color: "#dc2626" }
        },
        stability: {
            1: { text: "낮음", color: "#dc2626" },
            2: { text: "보통", color: "#059669" },
            3: { text: "높음", color: "#2563eb" }
        }
    };

    return evaluationMap[type][value as keyof typeof evaluationMap[typeof type]] ||
        { text: "미평가", color: "#9ca3af" };
};

/**
 * 3요소 평가의 라벨을 반환하는 함수
 */
export const getEvaluationLabel = (type: 'sizeFit' | 'cushion' | 'stability'): string => {
    const labelMap = {
        sizeFit: "사이즈",
        cushion: "쿠션감",
        stability: "안정성"
    };

    return labelMap[type];
};

// =============== 유효성 검사 함수들 ===============

/**
 * 리뷰 제목 유효성 검사
 */
export const validateReviewTitle = (title: string): string | null => {
    if (!title.trim()) {
        return "제목을 입력해주세요.";
    }
    if (title.trim().length < 5) {
        return "제목은 최소 5자 이상 입력해주세요.";
    }
    if (title.trim().length > 100) {
        return "제목은 100자를 초과할 수 없습니다.";
    }
    return null;
};

/**
 * 리뷰 제목 유효성 검사 (수정용 - 선택사항)
 */
export const validateOptionalReviewTitle = (title: string): string | null => {
    if (!title.trim()) {
        return null; // 빈 제목은 수정시 허용
    }
    if (title.trim().length < 5) {
        return "제목은 최소 5자 이상 입력해주세요.";
    }
    if (title.trim().length > 100) {
        return "제목은 100자를 초과할 수 없습니다.";
    }
    return null;
};

/**
 * 리뷰 내용 유효성 검사
 */
export const validateReviewContent = (content: string): string | null => {
    if (!content.trim()) {
        return "리뷰 내용을 입력해주세요.";
    }
    if (content.length < 10) {
        return "리뷰 내용은 10자 이상 입력해주세요.";
    }
    if (content.length > 2000) {
        return "리뷰 내용은 2000자 이내로 입력해주세요.";
    }
    return null;
};

/**
 * 별점 유효성 검사
 */
export const validateRating = (rating: number): string | null => {
    if (!rating || rating < 1 || rating > 5) {
        return "별점을 선택해주세요.";
    }
    return null;
};

/**
 * 이미지 파일 유효성 검사
 */
export const validateImages = (files: File[]): string | null => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_FILE_COUNT = 5; // 최대 5개
    const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (files.length > MAX_FILE_COUNT) {
        return `이미지는 최대 ${MAX_FILE_COUNT}개까지 업로드 가능합니다.`;
    }

    for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
            return "이미지 크기는 5MB를 초과할 수 없습니다.";
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return "JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.";
        }
    }

    return null;
};