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

            const response: ReviewListResponse = await ReviewService.getProductReviews(
                productId,
                params
            );

            // 리뷰 목록 업데이트
            if (resetList || page === 0) {
                setReviews(response.content || []); // 안전한 설정
            } else {
                setReviews(prev => [...prev, ...(response.content || [])]); // 안전한 추가
            }

            // 페이지네이션 정보 업데이트
            setCurrentPage(response.number);
            setTotalPages(response.totalPages);
            setTotalCount(response.totalElements);
            setHasMore(!response.last);

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
        if (productId > 0) {
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