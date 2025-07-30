import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ProductService } from "../../api/productService";
import { CartService } from "../../api/cartService";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { ProductDetail } from "../../types/products";
import { toUrl } from "../../utils/images";
import { addToRecentView } from "../../utils/recentView";
import CartSuccessModal from "../../components/modal/CartSuccessModal";
import Fail from "../../components/modal/Fail";

// 스타일드 컴포넌트 정의
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: #6b7280;
`;

const ProductSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
`;

const Thumbnail = styled.img<{ $active: boolean }>`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid ${(props) => (props.$active ? "#3b82f6" : "#e5e7eb")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProductTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const StoreInfo = styled.div`
  font-size: 1rem;
  color: #6b7280;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
`;

const OriginalPrice = styled.div`
  font-size: 1.1rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-left: 8px;
`;

const OptionSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

const OptionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
`;

const OptionButton = styled.button<{ $available: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.$available ? "#d1d5db" : "#f3f4f6")};
  border-radius: 6px;
  background: ${(props) => (props.$available ? "#fff" : "#f9fafb")};
  color: ${(props) => (props.$available ? "#374151" : "#9ca3af")};
  font-size: 0.875rem;
  cursor: ${(props) => (props.$available ? "pointer" : "not-allowed")};
  transition: all 0.2s ease;

  &:hover {
    ${(props) =>
      props.$available &&
      `
      border-color: #3b82f6;
      background: #eff6ff;
    `}
  }
`;

const SelectedOptionsContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

const SelectedOptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const OptionInfo = styled.div`
  flex: 1;
`;

const OptionName = styled.div`
  font-weight: 600;
  color: #374151;
`;

const OptionPrice = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const StockInfo = styled.div<{ $lowStock: boolean }>`
  font-size: 0.875rem;
  color: ${(props) => (props.$lowStock ? "#ea580c" : "#6b7280")};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: #374151;
`;

const RemoveButton = styled.button`
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: #fef2f2;
  }
`;

const TotalSummary = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 8px;
  border: 1px solid #3b82f6;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
    font-weight: 700;
    font-size: 1.1rem;
    color: #1e40af;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ $variant: "primary" | "secondary" }>`
  flex: 1;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  `
      : `
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
    
    &:hover:not(:disabled) {
      border-color: #3b82f6;
      color: #3b82f6;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const DescriptionSection = styled.div`
  margin-top: 40px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const DescriptionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
`;

const DescriptionText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  white-space: pre-line;
`;

const DetailImages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

const DetailImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
  margin: 0 auto;
`;

// 선택된 옵션 타입 정의
interface SelectedOptions {
  optionId: number;
  size: string;
  quantity: number;
  price: number;
  stock: number;
}

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateCartItemCount } = useCart();

  // 상태 관리
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 옵션 선택 상태
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions[]>([]);

  // 모달 상태
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // 상품 상세 정보 로딩
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError("유효하지 않은 상품 ID입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await ProductService.getProduct(Number(id));
        setProduct(productData);

        // 최근 본 상품에 추가
        addToRecentView(productData);
      } catch (err: any) {
        setError("상품 정보를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // 로딩 중일 때
  if (loading) {
    return (
      <Container>
        <LoadingContainer>상품 정보를 불러오는 중...</LoadingContainer>
      </Container>
    );
  }

  // 에러 발생 시
  if (error || !product) {
    return (
      <Container>
        <LoadingContainer>
          {error || "상품을 찾을 수 없습니다."}
        </LoadingContainer>
      </Container>
    );
  }

  // 가격 포맷팅 함수
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 할인율 계산 함수
  const getDiscountRate = (): number => {
    if (product.discountType === "RATE_DISCOUNT") {
      return product.discountValue;
    } else if (product.discountType === "FIXED_DISCOUNT") {
      return Math.round((product.discountValue / product.price) * 100);
    }
    return 0;
  };

  // 옵션 선택 함수
  const handleOptionSelect = (option: any) => {
    // 이미 선택된 옵션인지 확인
    const existingOption = selectedOptions.find(
      (selected) => selected.optionId === option.optionId
    );

    if (existingOption) {
      setModalMessage("이미 선택된 옵션입니다.");
      setShowErrorModal(true);
      return;
    }

    // 재고가 없는 경우
    if (option.stock <= 0) {
      setModalMessage("재고가 없는 상품입니다.");
      setShowErrorModal(true);
      return;
    }

    // 새 옵션 추가
    const newOption: SelectedOptions = {
      optionId: option.optionId,
      size: option.size.replace("SIZE_", ""),
      quantity: 1,
      price: product.discountPrice,
      stock: option.stock,
    };

    setSelectedOptions([...selectedOptions, newOption]);
  };

  // 옵션 수량 변경 함수
  const handleQuantityChange = (optionId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setSelectedOptions(
      selectedOptions.map((option) => {
        if (option.optionId === optionId) {
          // 재고 확인
          if (newQuantity > option.stock) {
            setModalMessage(`재고가 부족합니다. (최대 ${option.stock}개)`);
            setShowErrorModal(true);
            return option;
          }
          return { ...option, quantity: newQuantity };
        }
        return option;
      })
    );
  };

  // 옵션 제거 함수
  const handleRemoveOption = (optionId: number) => {
    setSelectedOptions(
      selectedOptions.filter((option) => option.optionId !== optionId)
    );
  };

  // 총 수량 계산
  const getTotalQuantity = (): number => {
    return selectedOptions.reduce(
      (total, option) => total + option.quantity,
      0
    );
  };

  // 총 가격 계산
  const getTotalPrice = (): number => {
    return selectedOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0
    );
  };

  // 장바구니 담기 함수
  const handleAddToCart = async () => {
    if (!user) {
      setModalMessage("로그인이 필요합니다.");
      setShowErrorModal(true);
      return;
    }

    if (selectedOptions.length === 0) {
      setModalMessage("옵션을 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    try {
      // 각 선택된 옵션별로 장바구니에 추가
      for (const option of selectedOptions) {
        // 메인 이미지 찾기
        const mainImage = product.images.find((img) => img.type === "MAIN");
        if (!mainImage) {
          setModalMessage("상품 이미지가 없습니다.");
          setShowErrorModal(true);
          return;
        }

        await CartService.addCartItem({
          optionId: option.optionId,
          imageId: mainImage.imageId,
          quantity: option.quantity,
        });
      }

      // 장바구니 개수 업데이트
      await updateCartItemCount();

      setModalMessage("장바구니에 상품이 추가되었습니다.");
      setShowSuccessModal(true);

      // 선택된 옵션 초기화
      setSelectedOptions([]);
    } catch (err: any) {
      console.error("장바구니 추가 실패:", err);
      setModalMessage(err.message || "장바구니 추가에 실패했습니다.");
      setShowErrorModal(true);
    }
  };

  // 바로 주문하기 함수
  const handleDirectOrder = () => {
    if (!user) {
      setModalMessage("로그인이 필요합니다.");
      setShowErrorModal(true);
      return;
    }

    if (selectedOptions.length === 0) {
      setModalMessage("옵션을 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    // 바로 주문 페이지로 이동
    navigate("/payment", {
      state: {
        directOrder: true,
        product: product,
        selectedOptions: selectedOptions[0], // 첫 번째 옵션만 전달 (단일 상품 주문)
      },
    });
  };

  return (
    <Container>
      <ProductSection>
        {/* 이미지 섹션 */}
        <ImageSection>
          <MainImage
            src={toUrl(product.images[selectedImageIndex]?.url)}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.jpg";
            }}
          />

          {product.images.length > 1 && (
            <ThumbnailContainer>
              {product.images.map((image, index) => (
                <Thumbnail
                  key={image.imageId}
                  src={toUrl(image.url)}
                  alt={`${product.name} ${index + 1}`}
                  $active={index === selectedImageIndex}
                  onClick={() => setSelectedImageIndex(index)}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.jpg";
                  }}
                />
              ))}
            </ThumbnailContainer>
          )}
        </ImageSection>

        {/* 상품 정보 섹션 */}
        <InfoSection>
          <ProductTitle>{product.name}</ProductTitle>
          <StoreInfo>판매자: {product.storeName}</StoreInfo>

          <PriceContainer>
            <Price>
              {formatPrice(product.discountPrice)}원
              {getDiscountRate() > 0 && (
                <DiscountBadge>{getDiscountRate()}% 할인</DiscountBadge>
              )}
            </Price>
            {product.price !== product.discountPrice && (
              <OriginalPrice>{formatPrice(product.price)}원</OriginalPrice>
            )}
          </PriceContainer>

          {/* 옵션 선택 */}
          <OptionSection>
            <OptionTitle>사이즈 선택</OptionTitle>
            <OptionGrid>
              {product.options.map((option) => (
                <OptionButton
                  key={option.optionId}
                  $available={option.stock > 0}
                  onClick={() => handleOptionSelect(option)}
                  disabled={option.stock <= 0}
                >
                  {option.size.replace("SIZE_", "")}
                  {option.stock <= 0 && " (품절)"}
                </OptionButton>
              ))}
            </OptionGrid>
          </OptionSection>

          {/* 선택된 옵션들 */}
          {selectedOptions.length > 0 && (
            <SelectedOptionsContainer>
              <OptionTitle>선택된 옵션</OptionTitle>
              {selectedOptions.map((option) => (
                <SelectedOptionItem key={option.optionId}>
                  <OptionInfo>
                    <OptionName>사이즈: {option.size}</OptionName>
                    <OptionPrice>{formatPrice(option.price)}원</OptionPrice>
                    <StockInfo $lowStock={option.stock <= 5}>
                      재고: {option.stock}개
                    </StockInfo>
                  </OptionInfo>
                  <QuantityControls>
                    <QuantityButton
                      onClick={() =>
                        handleQuantityChange(
                          option.optionId,
                          option.quantity - 1
                        )
                      }
                      disabled={option.quantity <= 1}
                    >
                      -
                    </QuantityButton>
                    <QuantityDisplay>{option.quantity}</QuantityDisplay>
                    <QuantityButton
                      onClick={() =>
                        handleQuantityChange(
                          option.optionId,
                          option.quantity + 1
                        )
                      }
                      disabled={option.quantity >= option.stock}
                    >
                      +
                    </QuantityButton>
                    <RemoveButton
                      onClick={() => handleRemoveOption(option.optionId)}
                    >
                      ✕
                    </RemoveButton>
                  </QuantityControls>
                </SelectedOptionItem>
              ))}

              {/* 총 계산 요약 */}
              <TotalSummary>
                <TotalRow>
                  <span>총 수량</span>
                  <span>{getTotalQuantity()}개</span>
                </TotalRow>
                <TotalRow>
                  <span>총 금액</span>
                  <span>{formatPrice(getTotalPrice())}원</span>
                </TotalRow>
              </TotalSummary>
            </SelectedOptionsContainer>
          )}

          {/* 액션 버튼들 */}
          <ActionButtons>
            <ActionButton
              $variant="secondary"
              onClick={handleAddToCart}
              disabled={selectedOptions.length === 0}
            >
              장바구니 담기{" "}
              {selectedOptions.length > 0 && `(${getTotalQuantity()}개)`}
            </ActionButton>
            <ActionButton
              $variant="primary"
              onClick={handleDirectOrder}
              disabled={selectedOptions.length === 0}
            >
              바로 주문하기{" "}
              {selectedOptions.length > 0 &&
                `(${formatPrice(getTotalPrice())}원)`}
            </ActionButton>
          </ActionButtons>
        </InfoSection>
      </ProductSection>

      {/* 상품 설명 섹션 */}
      <DescriptionSection>
        <DescriptionTitle>상품 설명</DescriptionTitle>
        <DescriptionText>
          {product.description || "상품 설명이 없습니다."}
        </DescriptionText>

        {/* 상세 이미지들 */}
        {product.images.filter((img) => img.type === "DETAIL").length > 0 && (
          <DetailImages>
            {product.images
              .filter((img) => img.type === "DETAIL")
              .map((image) => (
                <DetailImage
                  key={image.imageId}
                  src={toUrl(image.url)}
                  alt={`${product.name} 상세 이미지`}
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
              ))}
          </DetailImages>
        )}
      </DescriptionSection>

      {/* 성공 모달 */}
      <CartSuccessModal
        open={showSuccessModal}
        message={modalMessage}
        onClose={() => setShowSuccessModal(false)}
        onGoToCart={() => navigate("/cart")}
      />

      {/* 에러 모달 */}
      {showErrorModal && (
        <Fail
          title="알림"
          message={modalMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </Container>
  );
};

export default DetailPage;
