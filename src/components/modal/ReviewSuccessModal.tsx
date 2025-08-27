/**
 * 리뷰 작성 성공 모달
 * 
 * 리뷰 작성 완료 시 표시되는 모달로 적립된 포인트 정보를 보여줍니다.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { CreateReviewResponse } from '../../types/review';

// =============== 애니메이션 정의 ===============

const slideInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const confetti = keyframes`
    0% {
        opacity: 1;
        transform: translateY(0) rotate(0deg);
    }
    100% {
        opacity: 0;
        transform: translateY(-100px) rotate(360deg);
    }
`;

const bounce = keyframes`
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-10px);
    }
    60% {
        transform: translateY(-5px);
    }
`;

const shine = keyframes`
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
`;

// =============== 스타일 컴포넌트 ===============

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 16px;
    padding: 32px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    animation: ${slideInUp} 0.3s ease-out;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
        padding: 24px;
        margin: 0 16px;
    }
`;

const SuccessHeader = styled.div`
    text-align: center;
    margin-bottom: 24px;
`;

const SuccessIcon = styled.div`
    font-size: 48px;
    margin-bottom: 16px;
    animation: ${bounce} 2s ease-in-out infinite;
`;

const SuccessTitle = styled.h3`
    font-size: 24px;
    font-weight: 700;
    color: #059669;
    margin: 0 0 8px 0;

    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

const SuccessMessage = styled.p`
    font-size: 16px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
`;

const PointReward = styled.div`
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 2px solid #f59e0b;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
        );
        animation: ${shine} 2s linear infinite;
    }

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

const ConfettiParticle = styled.div<{ delay: number }>`
    position: absolute;
    top: -10px;
    font-size: 16px;
    animation: ${confetti} 3s linear infinite;
    animation-delay: ${props => props.delay}s;

    &:nth-child(1) { left: 10%; }
    &:nth-child(2) { left: 20%; }
    &:nth-child(3) { left: 30%; }
    &:nth-child(4) { left: 70%; }
    &:nth-child(5) { left: 80%; }
    &:nth-child(6) { left: 90%; }
`;

const PointIcon = styled.div`
    font-size: 32px;
    margin-bottom: 8px;
    display: inline-block;
    animation: ${bounce} 1.5s ease-in-out infinite;
`;

const PointAmount = styled.div`
    font-size: 24px;
    font-weight: 800;
    color: #d97706;
    margin-bottom: 8px;

    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

const CurrentPoints = styled.p`
    font-size: 14px;
    color: #92400e;
    margin: 0;
    font-weight: 500;

    strong {
        font-weight: 700;
        font-size: 16px;
    }
`;

const PointFailed = styled.div`
    background: #f3f4f6;
    border: 2px solid #d1d5db;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

const FailedMessage = styled.p`
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
`;

const ModalActions = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 24px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>`
    flex: 1;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;

    ${props => props.variant === 'primary' ? `
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        
        &:hover {
            background: linear-gradient(135deg, #1d4ed8, #1e40af);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }
    ` : `
        background: white;
        color: #374151;
        border: 2px solid #e5e7eb;
        
        &:hover {
            background: #f9fafb;
            border-color: #d1d5db;
        }
    `}

    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
`;

// =============== Props 타입 정의 ===============

interface ReviewSuccessModalProps {
    response: CreateReviewResponse;
    onClose: () => void;
}

// =============== 메인 컴포넌트 ===============

export const ReviewSuccessModal: React.FC<ReviewSuccessModalProps> = ({
    response,
    onClose
}) => {
    const navigate = useNavigate();
    const { reviewId, pointsEarned, currentPoints } = response;

    const handleMyReviewsClick = () => {
        onClose();
        navigate('/mypage/reviews');
    };

    const handleCloseClick = () => {
        onClose();
    };

    return (
        <ModalOverlay onClick={handleCloseClick}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                {/* 성공 헤더 */}
                <SuccessHeader>
                    <SuccessIcon>🎉</SuccessIcon>
                    <SuccessTitle>리뷰 작성 완료!</SuccessTitle>
                    <SuccessMessage>
                        소중한 후기를 남겨주셔서 감사합니다.
                    </SuccessMessage>
                </SuccessHeader>

                {/* 포인트 적립 결과 */}
                {pointsEarned && pointsEarned > 0 ? (
                    <PointReward>
                        {/* 축하 색종이 */}
                        {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((delay, index) => (
                            <ConfettiParticle key={index} delay={delay}>
                                🎊
                            </ConfettiParticle>
                        ))}
                        
                        <PointIcon>🪙</PointIcon>
                        <PointAmount>+{pointsEarned}P 적립완료!</PointAmount>
                        <CurrentPoints>
                            현재 보유 포인트: <strong>{currentPoints?.toLocaleString()}P</strong>
                        </CurrentPoints>
                    </PointReward>
                ) : (
                    <PointFailed>
                        <FailedMessage>
                            포인트 적립은 일시적으로 지연될 수 있습니다.<br />
                            마이페이지에서 포인트 적립 현황을 확인해주세요.
                        </FailedMessage>
                    </PointFailed>
                )}

                {/* 액션 버튼 */}
                <ModalActions>
                    <ActionButton
                        variant="secondary"
                        onClick={handleMyReviewsClick}
                    >
                        내 리뷰 보기
                    </ActionButton>
                    <ActionButton
                        variant="primary"
                        onClick={handleCloseClick}
                    >
                        확인
                    </ActionButton>
                </ModalActions>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ReviewSuccessModal;