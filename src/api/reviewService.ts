// src/api/reviewService.ts

import axiosInstance from "./axios";
import { 
    Review, 
    ReviewImage, 
    ReviewListResponse, 
    Product,
    ApiResponse,
    CreateReviewRequest,
    CreateReviewResponse,
    UpdateReviewRequest,
    UpdateReviewResponse,
    DeleteReviewResponse,
    ReviewListParams,
    HelpfulResponse,
    SCORE_TO_ENUM
} from "../types/review";

// ===== 중복 타입 제거하고 공통 타입 사용 =====

// ===== 메인 ReviewService 클래스 =====

export class ReviewService {

    // ===== 리뷰 조회 관련 메서드 =====

    /**
     * 상품별 리뷰 목록 조회
     * @param productId 상품 ID
     * @param params 조회 옵션 (페이지, 크기, 정렬, 필터)
     * @returns 리뷰 목록과 페이지네이션 정보
     */
    static async getProductReviews(
        productId: number,
        params: ReviewListParams = {}
    ): Promise<ReviewListResponse> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('리뷰 목록 API 호출:', { productId, params });
            }

            // 1-5 점수를 백엔드 enum으로 변환하는 헬퍼 함수
            const convertScoreToEnum = (type: 'sizeFit' | 'cushion' | 'stability', score: number) => {
                const enumValue = SCORE_TO_ENUM[type][score as keyof typeof SCORE_TO_ENUM[typeof type]];
                // 대소문자 문제 방지를 위해 강제로 대문자 변환
                const finalValue = enumValue?.toUpperCase() || enumValue;
                if (process.env.NODE_ENV === 'development') {
                    console.log(`🔄 필터 변환: ${type} ${score} → ${enumValue} → ${finalValue}`);
                    if (!enumValue) {
                        console.error(`❌ 변환 실패: ${type}의 ${score} 값에 해당하는 enum을 찾을 수 없습니다.`);
                        console.log(`🗺️ 사용 가능한 ${type} 매핑:`, SCORE_TO_ENUM[type]);
                    }
                }
                return finalValue;
            };

            const queryParams = {
                page: params.page || 0,
                size: params.size || 10,
                sort: params.sort || 'latest',
                ...(params.rating && params.rating > 0 && { 
                    rating: params.rating,
                    exactRating: params.exactRating || false 
                }),
                ...(params.sizeFit && params.sizeFit > 0 && { 
                    sizeFit: convertScoreToEnum('sizeFit', params.sizeFit)
                }),
                ...(params.cushion && params.cushion > 0 && { 
                    cushion: convertScoreToEnum('cushion', params.cushion)
                }),
                ...(params.stability && params.stability > 0 && { 
                    stability: convertScoreToEnum('stability', params.stability)
                })
            };

            if (process.env.NODE_ENV === 'development') {
                console.log('🔍 실제 전송될 queryParams:', queryParams);
                
                // 3요소 필터 매핑 상세 로그
                if (params.sizeFit) {
                    console.log(`📊 sizeFit 필터: ${params.sizeFit} → ${queryParams.sizeFit}`);
                }
                if (params.cushion) {
                    console.log(`📊 cushion 필터: ${params.cushion} → ${queryParams.cushion}`);
                }
                if (params.stability) {
                    console.log(`📊 stability 필터: ${params.stability} → ${queryParams.stability}`);
                }
                
                // URL 파라미터 문자열 확인
                const urlParams = new URLSearchParams();
                Object.entries(queryParams).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        urlParams.append(key, String(value));
                    }
                });
                const finalUrl = `/api/reviews/products/${productId}/filter?${urlParams.toString()}`;
                console.log('🌐 최종 요청 URL:', finalUrl);
                
                // SCORE_TO_ENUM 매핑 테이블 확인
                console.log('🗺️ SCORE_TO_ENUM 매핑 테이블:', SCORE_TO_ENUM);
            }

            // axios 요청 전에 실제 URL 로깅
            if (process.env.NODE_ENV === 'development') {
                // axios interceptor로 실제 요청 URL 캡처
                const originalRequest = axiosInstance.interceptors.request.use(
                    (config) => {
                        console.log('🚀 axios 실제 요청 URL:', config.url);
                        console.log('🚀 axios 실제 요청 params:', config.params);
                        axiosInstance.interceptors.request.eject(originalRequest);
                        return config;
                    }
                );
            }

            const response = await axiosInstance.get<ApiResponse<ReviewListResponse>>(
                `/api/reviews/products/${productId}/filter`,
                { params: queryParams }
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('🔍 리뷰 목록 API 응답:', response.data);
                console.log('🔍 API 응답 데이터 구조 분석:', {
                    hasData: !!response.data?.data,
                    dataKeys: response.data?.data ? Object.keys(response.data.data) : null,
                    dataType: typeof response.data?.data,
                    fullData: response.data?.data
                });
                
                // 필터링 결과 검증  
                if (response.data?.data?.reviews && Array.isArray(response.data.data.reviews)) {
                    const reviews = response.data.data.reviews;
                    console.log(`📋 응답된 리뷰 ${reviews.length}개:`);
                    
                    reviews.forEach((review, idx) => {
                        console.log(`  리뷰 ${idx + 1} (ID: ${review.reviewId}):`, {
                            sizeFit: review.sizeFit,
                            cushion: review.cushion,
                            stability: review.stability,
                            userName: review.userName
                        });
                    });

                    // 필터 조건 체크
                    if (queryParams.sizeFit) {
                        const matchingReviews = reviews.filter(r => r.sizeFit === queryParams.sizeFit);
                        console.log(`🔍 sizeFit="${queryParams.sizeFit}" 조건에 맞는 리뷰: ${matchingReviews.length}/${reviews.length}개`);
                        
                        if (matchingReviews.length !== reviews.length) {
                            console.warn('⚠️ sizeFit 필터링이 백엔드에서 제대로 되지 않았습니다!');
                            console.log('조건에 맞지 않는 리뷰들:');
                            reviews.filter(r => r.sizeFit !== queryParams.sizeFit).forEach(r => {
                                console.log(`  - 리뷰 ${r.reviewId}: sizeFit=${r.sizeFit} (예상: ${queryParams.sizeFit})`);
                            });
                        }
                    }
                    
                    if (queryParams.cushion) {
                        const matchingReviews = reviews.filter(r => r.cushion === queryParams.cushion);
                        console.log(`🔍 cushion="${queryParams.cushion}" 조건에 맞는 리뷰: ${matchingReviews.length}/${reviews.length}개`);
                    }
                    
                    if (queryParams.stability) {
                        const matchingReviews = reviews.filter(r => r.stability === queryParams.stability);
                        console.log(`🔍 stability="${queryParams.stability}" 조건에 맞는 리뷰: ${matchingReviews.length}/${reviews.length}개`);
                    }
                } else {
                    console.warn('⚠️ API 응답에서 content 배열을 찾을 수 없습니다.');
                }
            }
            return response.data.data;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('리뷰 목록 조회 실패:', error);
            }

            // 네트워크 오류나 서버 오류 시 빈 응답 반환
            if (!error.response || error.code === 'NETWORK_ERROR') {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('백엔드 연결 실패, 빈 데이터 반환');
                }
                return {
                    reviews: [],
                    totalPages: 0,
                    totalElements: 0,
                    size: params.size || 10,
                    number: params.page || 0,
                    averageRating: 0,
                    totalReviews: 0,
                    first: true,
                    last: true
                };
            }

            throw error;
        }
    }

    /**
     * 특정 리뷰 상세 조회
     * @param reviewId 리뷰 ID
     * @returns 리뷰 상세 정보
     */
    static async getReview(reviewId: number): Promise<Review> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('리뷰 상세 API 호출:', reviewId);
            }

            const response = await axiosInstance.get<ApiResponse<Review>>(
                `/api/reviews/${reviewId}`
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('리뷰 상세 API 응답:', response.data);
            }
            return response.data.data;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('리뷰 상세 조회 실패:', error);
            }
            throw error;
        }
    }

    /**
     * 상품 정보 조회 (리뷰 페이지용)
     * @param productId 상품 ID
     * @returns 상품 기본 정보
     */
    static async getProductInfo(productId: number): Promise<Product> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('상품 정보 API 호출:', productId);
            }

            const response = await axiosInstance.get<ApiResponse<Product>>(
                `/api/products/${productId}`
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('상품 정보 API 응답:', response.data);
            }
            return response.data.data;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('상품 정보 조회 실패:', error);
            }
            throw error;
        }
    }

    /**
     * 구매이력 검증 (리뷰 작성 권한 확인)
     * @param productId 상품 ID
     * @returns 구매이력 존재 여부
     */
    static async checkPurchaseHistory(productId: number): Promise<boolean> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('구매이력 검증 API 호출:', productId);
            }

            // 구매한 상품 목록 조회
            const response = await axiosInstance.get<ApiResponse<{ items: any[] }>>(
                '/api/users/orders/items'
            );

            const purchasedItems = response.data.data.items;
            if (process.env.NODE_ENV === 'development') {
                console.log('구매한 상품 목록:', purchasedItems);
            }

            // 해당 상품이 구매 목록에 있는지 확인
            const hasPurchased = purchasedItems.some((item: any) => 
                item.productId === productId
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('구매이력 검증 결과:', hasPurchased);
            }
            return hasPurchased;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('구매이력 검증 실패:', error);
            }
            // 에러 발생 시 false 반환 (안전한 기본값)
            return false;
        }
    }

    // ===== 리뷰 작성/수정/삭제 메서드 (인증 필요) =====

    /**
     * 새 리뷰 작성
     * @param reviewData 리뷰 작성 데이터
     * @param images 첨부할 이미지 파일들 (선택적)
     * @returns 생성된 리뷰 정보
     */
    static async createReview(
        reviewData: CreateReviewRequest,
        images?: File[]
    ): Promise<CreateReviewResponse> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('리뷰 작성 API 호출:', reviewData);
                
                // 인증 토큰 확인
                const token = localStorage.getItem('token');
                console.log('🔑 인증 토큰 상태:', {
                    hasToken: !!token,
                    tokenLength: token?.length,
                    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
                });
            }

            // FormData를 사용하여 텍스트와 이미지를 함께 전송
            const formData = new FormData();
            
            // 각 필드를 개별적으로 FormData에 추가 (백엔드가 JSON 파싱을 지원하지 않는 경우)
            formData.append('productId', reviewData.productId.toString());
            formData.append('title', reviewData.title);
            formData.append('rating', reviewData.rating.toString());
            formData.append('content', reviewData.content);
            
            if (reviewData.sizeFit !== undefined) {
                const sizeFitEnum = SCORE_TO_ENUM.sizeFit[reviewData.sizeFit as keyof typeof SCORE_TO_ENUM.sizeFit];
                formData.append('sizeFit', sizeFitEnum);
            }
            if (reviewData.cushion !== undefined) {
                const cushionEnum = SCORE_TO_ENUM.cushion[reviewData.cushion as keyof typeof SCORE_TO_ENUM.cushion];
                formData.append('cushion', cushionEnum);
            }
            if (reviewData.stability !== undefined) {
                const stabilityEnum = SCORE_TO_ENUM.stability[reviewData.stability as keyof typeof SCORE_TO_ENUM.stability];
                formData.append('stability', stabilityEnum);
            }

            if (images && images.length > 0) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('📷 images 개수:', images.length);
                }
                images.forEach((image, index) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(`📷 이미지 ${index + 1}:`, {
                            name: image.name,
                            size: image.size,
                            type: image.type
                        });
                    }
                    formData.append('images', image);
                });
            }
            
            // FormData 내용 확인
            if (process.env.NODE_ENV === 'development') {
                console.log('📋 FormData 구성 완료 (개별 필드 방식)');
                if (images && images.length > 0) {
                    console.log(`  - ${images.length}개 이미지 포함됨`);
                }
                
                // FormData의 모든 항목 출력
                console.log('📋 FormData entries:');
                const entries = Array.from(formData.entries());
                entries.forEach(([key, value]) => {
                    if (value instanceof File) {
                        console.log(`  ${key}: File(${value.name}, ${value.size}bytes, ${value.type})`);
                    } else {
                        console.log(`  ${key}:`, value);
                    }
                });
                
                // 최종 요청 URL과 헤더 확인
                console.log('🌐 요청 URL:', '/api/user/reviews');
                console.log('🔑 Authorization 헤더가 자동으로 추가될 예정');
            }

            const response = await axiosInstance.post<ApiResponse<CreateReviewResponse>>(
                '/api/user/reviews',
                formData,
                {
                    headers: {
                        // multipart/form-data는 브라우저가 자동으로 설정하도록 함
                        // Content-Type을 명시적으로 설정하지 않음
                    },
                }
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('리뷰 작성 API 응답:', response.data);
            }
            return response.data.data;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('리뷰 작성 실패:', error);
                console.error('에러 상세:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                });
                console.error('전송한 데이터:', {
                    reviewData,
                    imageCount: images?.length || 0,
                });
                
                // 서버 에러 메시지 상세 출력
                if (error.response?.data) {
                    console.error('🚨 백엔드 에러 응답:', JSON.stringify(error.response.data, null, 2));
                }
            }
            throw error;
        }
    }

    /**
     * 리뷰 수정
     * @param reviewId 수정할 리뷰 ID
     * @param reviewData 수정할 리뷰 데이터
     * @param newImages 새로 추가할 이미지들 (선택적)
     * @returns 수정된 리뷰 정보
     */
    static async updateReview(
        reviewId: number,
        reviewData: UpdateReviewRequest,
        newImages?: File[]
    ): Promise<UpdateReviewResponse> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('리뷰 수정 API 호출:', { reviewId, reviewData });
            }

            const formData = new FormData();
            
            // 3요소 평가 값을 enum으로 변환
            const convertedReviewData = {
                ...reviewData,
                ...(reviewData.sizeFit !== undefined && {
                    sizeFit: SCORE_TO_ENUM.sizeFit[reviewData.sizeFit as keyof typeof SCORE_TO_ENUM.sizeFit]
                }),
                ...(reviewData.cushion !== undefined && {
                    cushion: SCORE_TO_ENUM.cushion[reviewData.cushion as keyof typeof SCORE_TO_ENUM.cushion]
                }),
                ...(reviewData.stability !== undefined && {
                    stability: SCORE_TO_ENUM.stability[reviewData.stability as keyof typeof SCORE_TO_ENUM.stability]
                })
            };
            
            formData.append('review', JSON.stringify(convertedReviewData));

            if (newImages && newImages.length > 0) {
                newImages.forEach(image => {
                    formData.append('newImages', image);
                });
            }

            const response = await axiosInstance.put<ApiResponse<UpdateReviewResponse>>(
                `/api/user/reviews/${reviewId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('리뷰 수정 API 응답:', response.data);
            }
            return response.data.data;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('리뷰 수정 실패:', error);
            }
            throw error;
        }
    }

    /**
     * 리뷰 삭제
     * @param reviewId 삭제할 리뷰 ID
     * @returns 삭제 결과
     */
    static async deleteReview(reviewId: number): Promise<DeleteReviewResponse> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('리뷰 삭제 API 호출:', reviewId);
            }

            const response = await axiosInstance.delete<ApiResponse<DeleteReviewResponse>>(
                `/api/user/reviews/${reviewId}`
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('리뷰 삭제 API 응답:', response.data);
            }
            return response.data.data;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('리뷰 삭제 실패:', error);
            }
            throw error;
        }
    }

    // ===== 리뷰 상호작용 메서드 =====

    /**
     * 리뷰 "도움이 됨" 토글
     * @param reviewId 대상 리뷰 ID
     * @returns 토글 후 상태
     */
    static async toggleHelpful(reviewId: number): Promise<HelpfulResponse> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('도움이 됨 토글 API 호출:', reviewId);
            }

            const response = await axiosInstance.post<ApiResponse<HelpfulResponse>>(
                `/api/user/reviews/${reviewId}/helpful`
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('도움이 됨 토글 API 응답:', response.data);
            }
            return response.data.data;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('도움이 됨 토글 실패:', error);
            }
            throw error;
        }
    }

    /**
     * 리뷰 신고
     * @param reviewId 신고할 리뷰 ID
     * @param reason 신고 사유
     * @param description 상세 설명 (선택)
     * @returns 신고 결과
     */
    static async reportReview(
        reviewId: number, 
        reason: string, 
        description?: string
    ): Promise<{ success: boolean; message: string; data: any }> {
        try {
            if (process.env.NODE_ENV === 'development') {
                const token = localStorage.getItem('token');
                console.log('🚨 리뷰 신고 API 호출:', { 
                    reviewId, 
                    reviewIdType: typeof reviewId,
                    reason, 
                    description,
                    url: `/api/user/reviews/${reviewId}/report`,
                    hasToken: !!token,
                    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
                });

                // JWT 토큰 디코딩 (Base64)
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        console.log('🔑 JWT 토큰 정보:', {
                            username: payload.username || payload.sub,
                            exp: payload.exp,
                            현재시간: Math.floor(Date.now() / 1000),
                            만료여부: payload.exp < Math.floor(Date.now() / 1000) ? '만료됨' : '유효함'
                        });
                    } catch (e) {
                        console.error('JWT 토큰 디코딩 실패:', e);
                    }
                }
            }

            // 인증이 필요한 사용자 API 엔드포인트 사용
            // (axiosInstance에서 자동으로 Authorization 헤더 추가됨)
            const response = await axiosInstance.post<ApiResponse<any>>(
                `/api/user/reviews/${reviewId}/report`,
                { 
                    reason,
                    ...(description && { description })
                }
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('리뷰 신고 API 응답:', response.data);
            }
            return response.data;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('🚨 리뷰 신고 실패:', error);
                console.error('📋 에러 상세 정보:');
                console.error('- Status:', error.response?.status);
                console.error('- Status Text:', error.response?.statusText);
                console.error('- Response Data:', error.response?.data);
                console.error('- Request URL:', error.config?.url);
                console.error('- Request Data:', error.config?.data);
                
                // 백엔드 에러 메시지 특별히 강조
                if (error.response?.data) {
                    console.error('🔥 백엔드 에러 메시지:', JSON.stringify(error.response.data, null, 2));
                }
            }
            throw error;
        }
    }

    // ===== 내 리뷰 관리 메서드 =====

    /**
     * 내가 작성한 리뷰 목록 조회
     * @param params 조회 옵션
     * @returns 내 리뷰 목록
     */
    static async getMyReviews(params: ReviewListParams = {}): Promise<ReviewListResponse> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('내 리뷰 목록 API 호출:', params);
            }

            const queryParams = {
                page: params.page || 0,
                size: params.size || 10,
                sort: params.sort || 'latest'
            };

            const response = await axiosInstance.get<ApiResponse<ReviewListResponse>>(
                '/api/user/reviews/my',
                { params: queryParams }
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('내 리뷰 목록 API 응답:', response.data);
            }
            return response.data.data;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('내 리뷰 목록 조회 실패:', error);
            }
            throw error;
        }
    }

    // ===== 3요소 통계 관련 메서드 =====

    /**
     * 상품별 3요소 평가 통계 조회
     * @param productId 상품 ID
     * @returns 3요소 평가 통계 데이터
     */
    static async getProductStatistics(productId: number): Promise<any> {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('3요소 통계 API 호출:', productId);
            }

            const response = await axiosInstance.get<ApiResponse<any>>(
                `/api/reviews/products/${productId}/statistics`
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('3요소 통계 API 응답:', response.data);
                const stats = response.data.data;
                
                console.log('📊 쿠션감 통계 상세:', {
                    distribution: stats.cushionStatistics?.distribution,
                    percentage: stats.cushionStatistics?.percentage,
                    mostSelected: stats.cushionStatistics?.mostSelected,
                    averageScore: stats.cushionStatistics?.averageScore
                });
                
                console.log('📊 착용감 통계 상세:', {
                    distribution: stats.sizeFitStatistics?.distribution,
                    percentage: stats.sizeFitStatistics?.percentage,
                    mostSelected: stats.sizeFitStatistics?.mostSelected,
                    averageScore: stats.sizeFitStatistics?.averageScore
                });
                
                console.log('📊 안정성 통계 상세:', {
                    distribution: stats.stabilityStatistics?.distribution,
                    percentage: stats.stabilityStatistics?.percentage,
                    mostSelected: stats.stabilityStatistics?.mostSelected,
                    averageScore: stats.stabilityStatistics?.averageScore
                });
            }
            return response.data.data;

        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') {
                console.error('3요소 통계 조회 실패:', error);
            }

            // 네트워크 오류나 서버 오류 시 빈 응답 반환
            if (!error.response || error.code === 'NETWORK_ERROR') {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('백엔드 연결 실패, 빈 통계 데이터 반환');
                }
                return {
                    totalReviews: 0,
                    cushionStatistics: {
                        distribution: {},
                        percentage: {},
                        mostSelected: null,
                        averageScore: 0.0
                    },
                    sizeFitStatistics: {
                        distribution: {},
                        percentage: {},
                        mostSelected: null,
                        averageScore: 0.0
                    },
                    stabilityStatistics: {
                        distribution: {},
                        percentage: {},
                        mostSelected: null,
                        averageScore: 0.0
                    }
                };
            }

            throw error;
        }
    }

    // ===== 유틸리티 메서드 =====

    /**
     * 정렬 옵션을 백엔드 형식으로 변환
     * @param sort 프론트엔드 정렬 옵션
     * @returns 백엔드 정렬 파라미터
     */
    private static mapSortOption(sort: string): string {
        const sortMap: { [key: string]: string } = {
            'latest': 'latest',
            'helpful': 'points', // 백엔드의 "인기순"
            'rating_high': 'rating_desc',
            'rating_low': 'rating_asc'
        };

        return sortMap[sort] || 'latest';
    }

    /**
     * 에러 메시지를 사용자 친화적으로 변환
     * @param error 원본 에러
     * @returns 사용자에게 표시할 메시지
     */
    static getErrorMessage(error: any): string {
        if (!error.response) {
            return '네트워크 연결을 확인해주세요.';
        }

        const status = error.response.status;
        const message = error.response.data?.message;

        switch (status) {
            case 400:
                return message || '잘못된 요청입니다.';
            case 401:
                return '로그인이 필요합니다.';
            case 403:
                return '권한이 없습니다.';
            case 404:
                return '리뷰를 찾을 수 없습니다.';
            case 500:
                return '서버 오류가 발생했습니다.';
            default:
                return message || '알 수 없는 오류가 발생했습니다.';
        }
    }
}

export default ReviewService;