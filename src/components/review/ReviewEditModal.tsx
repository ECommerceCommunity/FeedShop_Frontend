/**
 * 리뷰 수정 모달 컴포넌트
 *
 * 리뷰 목록에서 수정 버튼 클릭 시 열리는 모달입니다.
 * 간단한 수정 기능 (제목, 내용, 별점, 3요소 평가)을 제공합니다.
 */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { StarRating } from "./StarRating";
import { ReviewService } from "../../api/reviewService";
import { Review, UpdateReviewRequest, ELEMENT_OPTIONS, ENUM_TO_SCORE } from "../../types/review";
import { validateOptionalReviewTitle, validateReviewContent, validateRating, getEvaluationLabel } from "../../utils/review/reviewHelpers";

// =============== 타입 정의 ===============

interface ReviewEditModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedReview: Review) => void;
}

interface FormData {
  title: string;
  rating: number;
  content: string;
  sizeFit?: number;
  cushion?: number;
  stability?: number;
}

interface FormErrors {
  title?: string;
  rating?: string;
  content?: string;
}

// =============== 스타일 컴포넌트 ===============

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const FormSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.$hasError ? '#dc2626' : '#d1d5db'};
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#dc2626' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 100px;
  padding: 10px 12px;
  border: 1px solid ${props => props.$hasError ? '#dc2626' : '#d1d5db'};
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#dc2626' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CharacterCount = styled.div`
  text-align: right;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const EvaluationGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EvaluationItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EvaluationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const EvaluationLabel = styled.div`
  min-width: 60px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-align: left;
`;

const EvaluationButtons = styled.div`
  display: flex;
  gap: 4px;
  flex: 1;
`;

const EvaluationButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid ${props => props.$active ? '#2563eb' : '#d1d5db'};
  border-radius: 4px;
  background: ${props => props.$active ? '#2563eb' : 'white'};
  color: ${props => props.$active ? 'white' : '#374151'};
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 0;
  text-align: center;

  &:hover {
    border-color: #2563eb;
    background: ${props => props.$active ? '#1d4ed8' : '#eff6ff'};
  }

  @media (max-width: 768px) {
    font-size: 9px;
    padding: 4px 6px;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;

  ${props => props.$variant === 'primary' ? `
    background: #2563eb;
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: #1d4ed8;
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  `}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

// =============== 메인 컴포넌트 ===============

export const ReviewEditModal: React.FC<ReviewEditModalProps> = ({
  review,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    rating: 0,
    content: '',
    sizeFit: undefined,
    cushion: undefined,
    stability: undefined,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달이 열릴 때 현재 리뷰 데이터로 초기화
  useEffect(() => {
    if (isOpen && review) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 리뷰 수정 모달 초기화:', {
          reviewId: review.reviewId,
          sizeFit: { raw: review.sizeFit, type: typeof review.sizeFit },
          cushion: { raw: review.cushion, type: typeof review.cushion },
          stability: { raw: review.stability, type: typeof review.stability }
        });
      }

      setFormData({
        title: review.title || '',
        rating: review.rating,
        content: review.content,
        sizeFit: typeof review.sizeFit === 'number' ? review.sizeFit : 
                 typeof review.sizeFit === 'string' ? ENUM_TO_SCORE.sizeFit[review.sizeFit as keyof typeof ENUM_TO_SCORE.sizeFit] : undefined,
        cushion: typeof review.cushion === 'number' ? review.cushion : 
                 typeof review.cushion === 'string' ? ENUM_TO_SCORE.cushion[review.cushion as keyof typeof ENUM_TO_SCORE.cushion] : undefined,
        stability: typeof review.stability === 'number' ? review.stability : 
                   typeof review.stability === 'string' ? ENUM_TO_SCORE.stability[review.stability as keyof typeof ENUM_TO_SCORE.stability] : undefined,
      });

      if (process.env.NODE_ENV === 'development') {
        const convertedData = {
          sizeFit: typeof review.sizeFit === 'number' ? review.sizeFit : 
                   typeof review.sizeFit === 'string' ? ENUM_TO_SCORE.sizeFit[review.sizeFit as keyof typeof ENUM_TO_SCORE.sizeFit] : undefined,
          cushion: typeof review.cushion === 'number' ? review.cushion : 
                   typeof review.cushion === 'string' ? ENUM_TO_SCORE.cushion[review.cushion as keyof typeof ENUM_TO_SCORE.cushion] : undefined,
          stability: typeof review.stability === 'number' ? review.stability : 
                     typeof review.stability === 'string' ? ENUM_TO_SCORE.stability[review.stability as keyof typeof ENUM_TO_SCORE.stability] : undefined,
        };
        console.log('🔧 변환 결과:', convertedData);
      }
      setErrors({});
    }
  }, [isOpen, review]);

  // 폼 변경 핸들러들
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title }));
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setFormData(prev => ({ ...prev, content }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
  };

  const handleEvaluationChange = (
    type: 'sizeFit' | 'cushion' | 'stability',
    value: number
  ) => {
    setFormData(prev => ({ ...prev, [type]: value }));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const newErrors: FormErrors = {};

    // 제목 검증 (선택 사항이지만 입력된 경우 유효성 검사)
    const titleError = validateOptionalReviewTitle(formData.title);
    if (titleError) newErrors.title = titleError;

    const ratingError = validateRating(formData.rating);
    if (ratingError) newErrors.rating = ratingError;

    const contentError = validateReviewContent(formData.content);
    if (contentError) newErrors.content = contentError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      const updateData: UpdateReviewRequest = {
        title: formData.title.trim() || undefined,
        rating: formData.rating,
        content: formData.content.trim(),
        sizeFit: formData.sizeFit,
        cushion: formData.cushion,
        stability: formData.stability,
      };

      const response = await ReviewService.updateReview(review.reviewId, updateData);
      
      console.log('리뷰 수정 성공:', response);
      alert('리뷰가 성공적으로 수정되었습니다.');

      // 수정된 리뷰 데이터 생성 (로컬 업데이트용)
      const updatedReview: Review = {
        ...review,
        title: formData.title.trim(),
        rating: formData.rating,
        content: formData.content.trim(),
        sizeFit: formData.sizeFit,
        cushion: formData.cushion,
        stability: formData.stability,
        updatedAt: new Date().toISOString(),
      };

      onSuccess(updatedReview);
      onClose();

    } catch (error: any) {
      console.error('리뷰 수정 실패:', error);
      console.error('에러 상세:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      let errorMessage = '리뷰 수정에 실패했습니다.';
      
      if (error.response?.status === 404) {
        errorMessage = '리뷰 수정 API를 찾을 수 없습니다. 백엔드 팀에 문의해주세요.';
      } else if (error.response?.status === 401) {
        errorMessage = '로그인이 필요합니다. 다시 로그인해주세요.';
      } else if (error.response?.status === 403) {
        errorMessage = '이 리뷰를 수정할 권한이 없습니다.';
      } else {
        errorMessage = error.response?.data?.message || ReviewService.getErrorMessage(error);
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>리뷰 수정</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          {/* 별점 */}
          <FormSection>
            <SectionTitle>별점 *</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StarRating
                rating={formData.rating}
                size="medium"
                onChange={handleRatingChange}
              />
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                {formData.rating > 0 ? `${formData.rating}점` : '별점을 선택해주세요'}
              </span>
            </div>
            {errors.rating && <ErrorMessage>{errors.rating}</ErrorMessage>}
          </FormSection>

          {/* 제목 */}
          <FormSection>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="리뷰 제목 (선택사항)"
              maxLength={100}
              $hasError={!!errors.title}
            />
            <CharacterCount>{formData.title.length} / 100자</CharacterCount>
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormSection>

          {/* 내용 */}
          <FormSection>
            <Label htmlFor="content">내용 *</Label>
            <TextArea
              id="content"
              value={formData.content}
              onChange={handleContentChange}
              placeholder="리뷰 내용을 입력해주세요"
              $hasError={!!errors.content}
            />
            <CharacterCount>{formData.content.length} / 2000자</CharacterCount>
            {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
          </FormSection>

          {/* 3요소 평가 */}
          <FormSection>
            <SectionTitle>상품 평가</SectionTitle>
            <EvaluationGrid>
              {(['sizeFit', 'cushion', 'stability'] as const).map(type => (
                <EvaluationItem key={type}>
                  <EvaluationRow>
                    <EvaluationLabel>{getEvaluationLabel(type)}</EvaluationLabel>
                    <EvaluationButtons>
                      {ELEMENT_OPTIONS[type].map(option => (
                        <EvaluationButton
                          key={option.value}
                          type="button"
                          $active={formData[type] === option.value}
                          onClick={() => handleEvaluationChange(type, option.value)}
                        >
                          {option.label}
                        </EvaluationButton>
                      ))}
                    </EvaluationButtons>
                  </EvaluationRow>
                </EvaluationItem>
              ))}
            </EvaluationGrid>
          </FormSection>

          {/* 버튼 그룹 */}
          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" $variant="primary" disabled={isSubmitting}>
              {isSubmitting ? '수정 중...' : '수정하기'}
            </Button>
          </ButtonGroup>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};