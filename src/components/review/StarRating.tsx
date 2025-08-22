/**
 * 별점 표시 및 입력 컴포넌트
 *
 * 리뷰의 별점을 표시하거나 사용자가 별점을 입력할 수 있는 컴포넌트입니다.
 * 읽기 전용 모드와 입력 모드를 모두 지원합니다.
 */

import React, { useState } from "react";
import styled from "styled-components";

// =============== 타입 정의 ===============

interface StarRatingProps {
    rating: number;                    // 현재 별점 (0-5)
    maxRating?: number;                // 최대 별점 (기본값: 5)
    size?: "small" | "medium" | "large"; // 크기
    readOnly?: boolean;                // 읽기 전용 여부
    showNumber?: boolean;              // 숫자 표시 여부
    onChange?: (rating: number) => void; // 별점 변경 콜백
}

// =============== 스타일 컴포넌트 ===============

const StarContainer = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  gap: ${props =>
    props.$size === "small" ? "2px" :
        props.$size === "large" ? "6px" : "4px"
};
`;

const StarsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Star = styled.button<{
    $filled: boolean;
    $size: string;
    $readOnly: boolean;
    $hovering: boolean;
}>`
  background: none;
  border: none;
  padding: 0;
  cursor: ${props => props.$readOnly ? "default" : "pointer"};
  font-size: ${props =>
    props.$size === "small" ? "14px" :
        props.$size === "large" ? "24px" : "18px"
};
  color: ${props => {
    if (props.$filled || props.$hovering) {
        return "#FFB800"; // 채워진 별 (황금색)
    }
    return "#E0E0E0"; // 빈 별 (회색)
}};
  
  transition: all 0.2s ease;
  
  &:hover {
    transform: ${props => props.$readOnly ? "none" : "scale(1.1)"};
  }
  
  &:focus {
    outline: none;
    box-shadow: ${props => props.$readOnly ? "none" : "0 0 0 2px #FFB800"};
    border-radius: 2px;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const RatingNumber = styled.span<{ $size: string }>`
  font-size: ${props =>
    props.$size === "small" ? "12px" :
        props.$size === "large" ? "18px" : "14px"
};
  color: #666;
  margin-left: 6px;
  font-weight: 500;
`;

const HiddenLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// =============== 메인 컴포넌트 ===============

export const StarRating: React.FC<StarRatingProps> = ({
                                                          rating,
                                                          maxRating = 5,
                                                          size = "medium",
                                                          readOnly = false,
                                                          showNumber = true,
                                                          onChange,
                                                      }) => {
    // 호버 상태 관리 (입력 모드에서만 사용)
    const [hoveredRating, setHoveredRating] = useState<number>(0);

    /**
     * 별점 클릭 처리
     * @param clickedRating 클릭된 별점
     */
    const handleStarClick = (clickedRating: number) => {
        if (readOnly || !onChange) return;

        // 같은 별을 다시 클릭하면 0점으로 설정
        if (clickedRating === rating) {
            onChange(0);
        } else {
            onChange(clickedRating);
        }
    };

    /**
     * 마우스 호버 처리 (입력 모드에서만)
     */
    const handleStarHover = (hoveredRating: number) => {
        if (readOnly) return;
        setHoveredRating(hoveredRating);
    };

    /**
     * 마우스가 별점 영역을 벗어났을 때
     */
    const handleMouseLeave = () => {
        if (readOnly) return;
        setHoveredRating(0);
    };

    /**
     * 키보드 접근성 처리
     * 방향키로 별점을 조절할 수 있도록 합니다
     */
    const handleKeyDown = (event: React.KeyboardEvent, starValue: number) => {
        if (readOnly || !onChange) return;

        switch (event.key) {
            case "ArrowRight":
            case "ArrowUp":
                event.preventDefault();
                if (rating < maxRating) {
                    onChange(rating + 1);
                }
                break;

            case "ArrowLeft":
            case "ArrowDown":
                event.preventDefault();
                if (rating > 0) {
                    onChange(rating - 1);
                }
                break;

            case "Home":
                event.preventDefault();
                onChange(1);
                break;

            case "End":
                event.preventDefault();
                onChange(maxRating);
                break;

            case "Delete":
            case "Backspace":
                event.preventDefault();
                onChange(0);
                break;

            case "Enter":
            case " ":
                event.preventDefault();
                handleStarClick(starValue);
                break;
        }
    };

    /**
     * 별이 채워져야 하는지 확인하는 함수
     * @param starValue 확인할 별의 값
     * @returns 채워져야 하는지 여부
     */
    const isFilled = (starValue: number): boolean => {
        // 입력 모드에서 호버 중인 경우
        if (!readOnly && hoveredRating > 0) {
            return starValue <= hoveredRating;
        }

        // 일반적인 경우 (현재 별점 기준)
        return starValue <= rating;
    };

    /**
     * 별이 호버 상태인지 확인하는 함수
     * @param starValue 확인할 별의 값
     * @returns 호버 상태인지 여부
     */
    const isHovering = (starValue: number): boolean => {
        return !readOnly && hoveredRating > 0 && starValue <= hoveredRating;
    };

    // 1부터 maxRating까지의 별들을 생성
    const stars = Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;

        return (
            <Star
                key={starValue}
                type="button"
                $filled={isFilled(starValue)}
                $size={size}
                $readOnly={readOnly}
                $hovering={isHovering(starValue)}
                onClick={() => handleStarClick(starValue)}
                onMouseEnter={() => handleStarHover(starValue)}
                onKeyDown={(e) => handleKeyDown(e, starValue)}
                disabled={readOnly}
                aria-label={`${starValue}점`}
                title={readOnly ? `${starValue}점` : `${starValue}점으로 평가하기`}
            >
                ★
            </Star>
        );
    });

    return (
        <StarContainer $size={size}>
            {/* 접근성을 위한 숨겨진 레이블 */}
            {!readOnly && (
                <HiddenLabel>
                    별점 선택 (현재 {rating}점 / {maxRating}점 만점)
                </HiddenLabel>
            )}

            {/* 별점 표시 영역 */}
            <StarsWrapper
                onMouseLeave={handleMouseLeave}
                role={readOnly ? "img" : "radiogroup"}
                aria-label={readOnly ? `${rating}점 (${maxRating}점 만점)` : "별점 선택"}
            >
                {stars}
            </StarsWrapper>

            {/* 숫자 표시 */}
            {showNumber && (
                <RatingNumber $size={size}>
                    {rating > 0 ? rating.toFixed(1) : "0.0"}
                </RatingNumber>
            )}
        </StarContainer>
    );
};

// =============== 사용 예시 (개발 참고용) ===============

/**
 * 사용 예시:
 *
 * // 읽기 전용 (리뷰 목록에서 사용)
 * <StarRating rating={4.5} readOnly />
 *
 * // 입력 모드 (리뷰 작성 폼에서 사용)
 * <StarRating
 *   rating={rating}
 *   onChange={setRating}
 *   size="large"
 * />
 *
 * // 작은 크기 (카드 내부 등)
 * <StarRating
 *   rating={3.2}
 *   size="small"
 *   readOnly
 *   showNumber={false}
 * />
 */