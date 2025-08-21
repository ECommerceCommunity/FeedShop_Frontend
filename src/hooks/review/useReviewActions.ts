/**
 * 리뷰 액션 처리 훅 (기본 기능만)
 *
 * 백엔드에 구현된 기본 기능들만 사용하여 리뷰 생성, 수정, 삭제를 처리합니다.
 * 복잡한 권한 체크나 추가 기능들은 제외하고 실용적인 기능들만 포함합니다.
 */

import { useState, useCallback } from "react";
import { ReviewService } from "../../api/reviewService";
import {
    Review,
    CreateReviewRequest,
    CreateReviewResponse,
    UpdateReviewRequest,
    UpdateReviewResponse,
    DeleteReviewResponse,
    UseReviewActionsReturn,
    ReviewFormData
} from "../../types/review";
import { validateReviewTitle, validateReviewContent, validateRating, validateImages } from "../../utils/review/reviewHelpers";

// =============== 훅 설정 옵션 ===============

interface UseReviewActionsOptions {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

// =============== 메인 훅 ===============

export const useReviewActions = (options: UseReviewActionsOptions = {}): UseReviewActionsReturn => {
    const { onSuccess, onError } = options;

    // =============== 상태 관리 ===============

    const [isSubmitting, setIsSubmitting] = useState(false);

    // =============== 유효성 검사 함수 ===============

    /**
     * 리뷰 폼 데이터를 검증하는 함수
     */
    const validateReviewForm = useCallback((formData: ReviewFormData): string[] => {
        const errors: string[] = [];

        // 제목 검증
        const titleError = validateReviewTitle(formData.title);
        if (titleError) errors.push(titleError);

        // 별점 검증
        const ratingError = validateRating(formData.rating);
        if (ratingError) errors.push(ratingError);

        // 내용 검증
        const contentError = validateReviewContent(formData.content);
        if (contentError) errors.push(contentError);

        // 이미지 검증
        if (formData.images && formData.images.length > 0) {
            const imageError = validateImages(formData.images);
            if (imageError) errors.push(imageError);
        }

        return errors;
    }, []);

    // =============== 리뷰 CRUD 액션 함수들 ===============

    /**
     * 새 리뷰를 작성하는 함수
     */
    const createReview = useCallback(async (
        data: CreateReviewRequest,
        images?: File[]
    ): Promise<CreateReviewResponse> => {
        try {
            setIsSubmitting(true);

            // 기본 유효성 검사
            const formData: ReviewFormData = {
                title: data.title,
                rating: data.rating,
                content: data.content,
                sizeFit: data.sizeFit,
                cushion: data.cushion,
                stability: data.stability,
                images: images || [],
            };

            const errors = validateReviewForm(formData);
            if (errors.length > 0) {
                throw new Error(errors.join(", "));
            }

            // API 호출
            const response = await ReviewService.createReview(data, images);

            // 성공 콜백 실행
            if (onSuccess) {
                onSuccess(response.message || "리뷰가 성공적으로 작성되었습니다.");
            }

            return response;

        } catch (error) {
            const errorMessage = ReviewService.getErrorMessage(error);
            console.error('리뷰 작성 실패:', errorMessage);

            // 에러 콜백 실행
            if (onError) {
                onError(errorMessage);
            }

            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, [validateReviewForm, onSuccess, onError]);

    /**
     * 기존 리뷰를 수정하는 함수
     */
    const updateReview = useCallback(async (
        reviewId: number,
        data: UpdateReviewRequest,
        newImages?: File[]
    ): Promise<UpdateReviewResponse> => {
        try {
            setIsSubmitting(true);

            // 기본 유효성 검사
            const formData: ReviewFormData = {
                title: data.title || '', // updateReview에서는 title이 없을 수 있으므로 기본값 설정
                rating: data.rating,
                content: data.content,
                sizeFit: data.sizeFit,
                cushion: data.cushion,
                stability: data.stability,
                images: newImages || [],
            };

            const errors = validateReviewForm(formData);
            if (errors.length > 0) {
                throw new Error(errors.join(", "));
            }

            // API 호출
            const response = await ReviewService.updateReview(reviewId, data, newImages);

            // 성공 콜백 실행
            if (onSuccess) {
                onSuccess(response.message || "리뷰가 성공적으로 수정되었습니다.");
            }

            return response;

        } catch (error) {
            const errorMessage = ReviewService.getErrorMessage(error);
            console.error('리뷰 수정 실패:', errorMessage);

            // 에러 콜백 실행
            if (onError) {
                onError(errorMessage);
            }

            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, [validateReviewForm, onSuccess, onError]);

    /**
     * 리뷰를 삭제하는 함수
     */
    const deleteReview = useCallback(async (
        reviewId: number
    ): Promise<DeleteReviewResponse> => {
        try {
            setIsSubmitting(true);

            // 삭제 확인
            const confirmDelete = window.confirm("정말로 이 리뷰를 삭제하시겠습니까?");
            if (!confirmDelete) {
                throw new Error("사용자가 삭제를 취소했습니다.");
            }

            // API 호출
            const response = await ReviewService.deleteReview(reviewId);

            // 성공 콜백 실행
            if (onSuccess) {
                onSuccess(response.message || "리뷰가 성공적으로 삭제되었습니다.");
            }

            return response;

        } catch (error) {
            const errorMessage = ReviewService.getErrorMessage(error);
            console.error('리뷰 삭제 실패:', errorMessage);

            // 사용자 취소가 아닌 경우에만 에러 콜백 실행
            if (errorMessage !== "사용자가 삭제를 취소했습니다." && onError) {
                onError(errorMessage);
            }

            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, [onSuccess, onError]);

    // =============== 간단한 권한 체크 함수들 ===============

    /**
     * 현재 사용자가 리뷰를 수정할 수 있는지 확인하는 함수
     */
    const canEditReview = useCallback((review: Review, currentUserId?: number): boolean => {
        // 로그인하지 않은 경우
        if (!currentUserId) return false;

        // 본인이 작성한 리뷰인지 확인
        return review.userId === currentUserId;
    }, []);

    /**
     * 현재 사용자가 리뷰를 삭제할 수 있는지 확인하는 함수
     */
    const canDeleteReview = useCallback((review: Review, currentUserId?: number): boolean => {
        // 로그인하지 않은 경우
        if (!currentUserId) return false;

        // 본인이 작성한 리뷰인지 확인
        return review.userId === currentUserId;
    }, []);

    // =============== 반환값 구성 ===============

    return {
        // 상태
        isSubmitting,

        // 액션 함수들
        createReview,
        updateReview,
        deleteReview,

        // 권한 체크 함수들
        canEditReview,
        canDeleteReview,
    };
};