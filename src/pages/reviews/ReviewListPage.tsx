/**
 * 리뷰 목록 페이지
 *
 * 상품 상세 페이지에서 사용되는 최종 리뷰 페이지입니다.
 * ProductReviews 컴포넌트를 사용하여 완전한 리뷰 시스템을 제공합니다.
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { ProductReviews } from "../../components/review/ProductReviews";

// =============== 타입 정의 ===============

interface RouteParams extends Record<string, string | undefined> {
    productId: string;
}

interface LocationState {
    productName?: string;
    brandName?: string;
    refreshReviews?: boolean; // 리뷰 새로고침 플래그
}

// 사용자 정보 타입 (실제 AuthContext에 맞게 조정 필요)
interface User {
    id: number;
    username: string;
    email: string;
}

// =============== 스타일 컴포넌트 ===============

const PageContainer = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  .icon {
    font-size: 16px;
  }
`;

const PageTitle = styled.div`
  flex: 1;
`;

const TitleText = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const WriteButton = styled.button<{ $canWrite: boolean }>`
  background: ${props => props.$canWrite ? '#2563eb' : '#9ca3af'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.$canWrite ? 'pointer' : 'not-allowed'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
  
  .icon {
    font-size: 16px;
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 13px;
    
    .text {
      display: none;
    }
  }
`;

const MainContent = styled.main`
  padding: 0;
`;

const ErrorContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const ErrorCard = styled.div`
  background: white;
  border: 1px solid #fee2e2;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 8px 0;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: #7f1d1d;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const ErrorButton = styled.button`
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
  }
`;

// =============== Toast 알림 컴포넌트 ===============

const ToastContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #111827;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(${props => props.$show ? '0' : '-100px'});
  opacity: ${props => props.$show ? 1 : 0};
  transition: all 0.3s ease;
  z-index: 1000;
  max-width: 400px;
  font-size: 14px;
  
  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
    max-width: none;
  }
`;

// =============== 메인 컴포넌트 ===============

export const ReviewListPage: React.FC = () => {
    const { productId } = useParams<RouteParams>();
    const navigate = useNavigate();
    const location = useLocation();

    // 라우트 상태에서 상품 정보 가져오기
    const state = location.state as LocationState;

    // 상태 관리
    const [user, setUser] = useState<User | null>(null);
    const [toast, setToast] = useState({ show: false, message: "" });
    const [pageError, setPageError] = useState<string | null>(null);

    // =============== 사용자 정보 로딩 ===============

    useEffect(() => {
        // 실제 AuthContext나 사용자 정보 API에서 가져와야 함
        // 임시로 localStorage에서 가져오는 예시
        const loadUser = () => {
            try {
                const token = localStorage.getItem("token");
                const userData = localStorage.getItem("user");

                if (token && userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error("사용자 정보 로딩 실패:", error);
            }
        };

        loadUser();
    }, []);

    // =============== 유틸리티 함수들 ===============

    /**
     * productId 유효성 검사
     */
    const getProductId = (): number => {
        const id = parseInt(productId || "0");
        if (isNaN(id) || id <= 0) {
            throw new Error("올바르지 않은 상품 ID입니다.");
        }
        return id;
    };

    /**
     * Toast 메시지 표시
     */
    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => {
            setToast({ show: false, message: "" });
        }, 3000);
    };

    // =============== 이벤트 핸들러들 ===============

    /**
     * 뒤로 가기 버튼 클릭
     */
    const handleBack = () => {
        // 이전 페이지가 있으면 뒤로, 없으면 홈으로
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    /**
     * 리뷰 작성 버튼 클릭
     */
    const handleWriteReview = () => {
        if (!user) {
            showToast("리뷰를 작성하려면 로그인이 필요합니다.");
            return;
        }

        try {
            const productIdNum = getProductId();
            // 리뷰 작성 페이지로 이동 (쿼리 파라미터 사용)
            navigate(`/review/write?productId=${productIdNum}`, {
                state: {
                    productName: state?.productName,
                    brandName: state?.brandName,
                }
            });
        } catch (error) {
            setPageError("올바르지 않은 상품 정보입니다.");
        }
    };

    /**
     * 리뷰 수정 버튼 클릭
     */
    const handleEditReview = (reviewId: number) => {
        if (!user) {
            showToast("리뷰를 수정하려면 로그인이 필요합니다.");
            return;
        }

        navigate(`/review/edit/${reviewId}`, {
            state: {
                productId: getProductId(),
                productName: state?.productName,
                brandName: state?.brandName,
            }
        });
    };

    /**
     * 리뷰 액션 성공 처리
     */
    const handleSuccess = (message: string) => {
        showToast(message);
    };

    /**
     * 리뷰 액션 에러 처리
     */
    const handleError = (message: string) => {
        showToast(message);
    };

    /**
     * 페이지 에러 재시도
     */
    const handleRetry = () => {
        setPageError(null);
        window.location.reload();
    };

    // =============== 렌더링 ===============

    // productId 유효성 검사
    let productIdNum: number;
    try {
        productIdNum = getProductId();
    } catch (error) {
        return (
            <PageContainer>
                <ErrorContainer>
                    <ErrorCard>
                        <ErrorIcon>⚠️</ErrorIcon>
                        <ErrorTitle>잘못된 접근입니다</ErrorTitle>
                        <ErrorMessage>올바르지 않은 상품 정보입니다.</ErrorMessage>
                        <ErrorButton onClick={() => navigate('/')}>
                            홈으로 돌아가기
                        </ErrorButton>
                    </ErrorCard>
                </ErrorContainer>
            </PageContainer>
        );
    }

    // 페이지 에러 상태
    if (pageError) {
        return (
            <PageContainer>
                <ErrorContainer>
                    <ErrorCard>
                        <ErrorIcon>❌</ErrorIcon>
                        <ErrorTitle>페이지 로딩 실패</ErrorTitle>
                        <ErrorMessage>{pageError}</ErrorMessage>
                        <ErrorButton onClick={handleRetry}>
                            다시 시도
                        </ErrorButton>
                    </ErrorCard>
                </ErrorContainer>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* 헤더 */}
            <Header>
                <HeaderContainer>
                    <BackButton onClick={handleBack} type="button">
                        <span className="icon">←</span>
                        <span>뒤로</span>
                    </BackButton>

                    <PageTitle>
                        <TitleText>
                            {state?.productName || "상품 리뷰"}
                        </TitleText>
                        {state?.brandName && (
                            <SubTitle>{state.brandName}</SubTitle>
                        )}
                    </PageTitle>

                    <WriteButton
                        $canWrite={!!user}
                        onClick={handleWriteReview}
                        type="button"
                    >
                        <span className="icon">✏️</span>
                        <span className="text">리뷰 작성</span>
                    </WriteButton>
                </HeaderContainer>
            </Header>

            {/* 메인 콘텐츠 */}
            <MainContent>
                <ProductReviews
                    productId={productIdNum}
                    currentUserId={user?.id}
                    canWriteReview={!!user}
                    onWriteReview={handleWriteReview}
                    onEditReview={handleEditReview}
                    enableInfiniteScroll={false} // 더보기 버튼 방식 사용
                    initialPageSize={10}
                    forceRefresh={state?.refreshReviews} // 새로고침 플래그 전달
                />
            </MainContent>

            {/* Toast 알림 */}
            <ToastContainer $show={toast.show}>
                {toast.message}
            </ToastContainer>
        </PageContainer>
    );
};

// =============== 사용 예시 (라우터 설정 참고용) ===============

/**
 * 라우터 설정 예시:
 *
 * // App.tsx 또는 라우터 설정 파일에서
 * <Route
 *   path="/products/:productId/reviews"
 *   element={<ReviewListPage />}
 * />
 *
 * // 상품 상세 페이지에서 이동하는 예시:
 * navigate(`/products/${product.id}/reviews`, {
 *   state: {
 *     productName: product.name,
 *     brandName: product.brandName
 *   }
 * });
 */

export default ReviewListPage;