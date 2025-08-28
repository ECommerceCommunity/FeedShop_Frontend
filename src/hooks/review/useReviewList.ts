/**
 * 리뷰 목록 데이터 관리 훅 (기본 기능만)
 *
 * 백엔드에 구현된 기본 기능들만 사용하여 리뷰 목록을 관리합니다.
 * 복잡한 기능들은 제외하고 실용적인 기능들만 포함합니다.
 */

import { useState, useEffect, useCallback } from "react";
import ReviewService from "../../api/reviewService";
import {
    Review,
    Product,
    ReviewListParams,
    ReviewListResponse,
    ReviewFilterState,
    UseReviewListReturn
} from "../../types/review";

// =============== 훅 설정 옵션 ===============

interface UseReviewListOptions {
    productId: number;
    initialPageSize?: number;
    autoLoad?: boolean;
    forceRefresh?: boolean; // 강제 새로고침 플래그
}

// =============== 기본 필터 상태 ===============

const DEFAULT_FILTER: ReviewFilterState = {
    sort: 'latest',
    rating: 0,
    exactRating: false,
    sizeFit: 0,
    cushion: 0,
    stability: 0,
};

// =============== 메인 훅 ===============

export const useReviewList = (options: UseReviewListOptions): UseReviewListReturn => {
    const { productId, initialPageSize = 10, autoLoad = true, forceRefresh = false } = options;

    // =============== 상태 관리 ===============

    const [reviews, setReviews] = useState<Review[]>([]); // 빈 배열로 초기화
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    // 필터 상태
    const [filter, setFilter] = useState<ReviewFilterState>(DEFAULT_FILTER);

    // =============== 데이터 로딩 함수들 ===============

    /**
     * 상품 정보를 불러오는 함수
     */
    const loadProduct = useCallback(async () => {
        try {
            const productData = await ReviewService.getProductInfo(productId);
            setProduct(productData);
        } catch (err) {
            console.error('상품 정보 로딩 실패:', err);
            // 상품 정보는 필수가 아니므로 에러를 무시
        }
    }, [productId]);

    /**
     * 리뷰 목록을 불러오는 함수
     */
    const loadReviews = useCallback(async (
        page: number = 0,
        resetList: boolean = false
    ) => {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('📦 useReviewList - loadReviews 시작:', {
                    productId,
                    page,
                    resetList,
                    filter: JSON.stringify(filter)
                });
            }

            setIsLoading(true);
            setError(null);

            const params: ReviewListParams = {
                page,
                size: initialPageSize,
                sort: filter.sort,
            };

            // 별점 필터 추가
            if (filter.rating && filter.rating > 0) {
                params.rating = filter.rating;
                params.exactRating = filter.exactRating;
            }

            // 3요소 필터 추가
            if (filter.sizeFit && filter.sizeFit > 0) {
                params.sizeFit = filter.sizeFit;
            }
            if (filter.cushion && filter.cushion > 0) {
                params.cushion = filter.cushion;
            }
            if (filter.stability && filter.stability > 0) {
                params.stability = filter.stability;
            }

            if (process.env.NODE_ENV === 'development') {
                console.log('📦 useReviewList - API 호출 직전');
            }

            const response: ReviewListResponse = await ReviewService.getProductReviews(
                productId,
                params
            );

            if (process.env.NODE_ENV === 'development') {
                console.log('📦 useReviewList - API 응답 받음:', response);
            }

            // 리뷰 목록 업데이트 (백엔드 응답 구조에 맞게 수정)
            if (process.env.NODE_ENV === 'development') {
                console.log('📦 useReviewList - 응답 데이터 구조:', {
                    hasReviews: !!response.reviews,
                    reviewsLength: response.reviews?.length,
                    reviewsType: Array.isArray(response.reviews) ? 'array' : typeof response.reviews,
                    firstReview: response.reviews?.[0],
                    resetList,
                    page
                });
            }

            if (resetList || page === 0) {
                const newReviews = response.reviews || [];
                setReviews(newReviews);
                if (process.env.NODE_ENV === 'development') {
                    console.log('📦 useReviewList - 새 리뷰 목록 설정:', newReviews.length, '개');
                }
            } else {
                setReviews(prev => {
                    const newReviews = [...prev, ...(response.reviews || [])];
                    if (process.env.NODE_ENV === 'development') {
                        console.log('📦 useReviewList - 리뷰 목록 추가:', prev.length, '+', (response.reviews || []).length, '=', newReviews.length);
                    }
                    return newReviews;
                });
            }

            // 페이지네이션 정보 업데이트
            setCurrentPage(response.number);
            setTotalPages(response.totalPages);
            setTotalCount(response.totalElements);
            setHasMore(!response.last);

            if (process.env.NODE_ENV === 'development') {
                console.log('📦 useReviewList - 페이지네이션 업데이트:', {
                    currentPage: response.number,
                    totalPages: response.totalPages,
                    totalCount: response.totalElements,
                    hasMore: !response.last
                });
            }

        } catch (err) {
            console.error('리뷰 목록 로딩 실패:', err);
            setError(ReviewService.getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    }, [productId, initialPageSize, filter]);

    // =============== 사용자 액션 함수들 ===============

    /**
     * 더 많은 리뷰를 불러오는 함수
     */
    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            loadReviews(currentPage + 1, false);
        }
    }, [isLoading, hasMore, currentPage, loadReviews]);

    /**
     * 필터를 적용하고 리뷰 목록을 새로 불러오는 함수
     */
    const applyFilter = useCallback((newFilter: ReviewFilterState) => {
        setFilter(newFilter);
        setCurrentPage(0);
        // useEffect에서 filter 변경을 감지하여 자동으로 로딩
    }, []);

    /**
     * 데이터를 새로고침하는 함수
     */
    const refresh = useCallback(() => {
        setCurrentPage(0);
        loadProduct();
        loadReviews(0, true);
    }, [loadProduct, loadReviews]);

    /**
     * 리뷰를 로컬 상태에서 제거하는 함수 (삭제 후 사용)
     */
    const removeReview = useCallback((reviewId: number) => {
        setReviews(prev => prev.filter(review => review.reviewId !== reviewId));
        setTotalCount(prev => prev - 1);

        // 상품 정보 새로고침 (평점 업데이트)
        loadProduct();
    }, [loadProduct]);

    // =============== Effect 훅들 ===============

    /**
     * 컴포넌트 마운트 시 초기 데이터 로딩
     */
    useEffect(() => {
        if (autoLoad && productId > 0) {
            loadProduct();
            loadReviews(0, true);
        }
    }, [autoLoad, productId, loadProduct, loadReviews]);

    /**
     * 필터 변경 시 리뷰 목록 새로고침
     */
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('📦 useReviewList - 필터 변경 감지:', {
                productId,
                'filter.sort': filter.sort,
                'filter.rating': filter.rating,
                'filter.exactRating': filter.exactRating,
                'filter.sizeFit': filter.sizeFit,
                'filter.cushion': filter.cushion,
                'filter.stability': filter.stability
            });
        }

        if (productId > 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log('📦 useReviewList - loadReviews 호출 (필터 변경)');
            }
            loadReviews(0, true);
        }
    }, [filter.sort, filter.rating, filter.exactRating, filter.sizeFit, filter.cushion, filter.stability]); // loadReviews는 의존성에서 제외 (무한 루프 방지)

    /**
     * forceRefresh prop 변경 시 데이터 새로고침
     */
    useEffect(() => {
        if (forceRefresh && productId > 0) {
            console.log('🔄 강제 새로고침 실행');
            loadProduct();
            loadReviews(0, true);
        }
    }, [forceRefresh, productId, loadProduct, loadReviews]);

    // =============== 반환값 구성 ===============

    return {
        // 데이터
        reviews,
        product,

        // 상태
        isLoading,
        error,
        hasMore,
        totalCount,

        // 필터 상태
        filter,

        // 액션 함수들
        loadMore,
        applyFilter,
        refresh,
        removeReview,
    };
};