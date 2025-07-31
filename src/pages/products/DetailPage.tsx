import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ProductService } from "../../api/productService";
import { CartService } from "../../api/cartService";
import { useAuth } from "../../contexts/AuthContext";
import { toUrl } from "../../utils/images";
import { addToRecentView } from "../../utils/recentview";
import Fail from "../../components/modal/Fail";
import { ProductDetail } from "types/products";
import CartSuccessModal from "components/modal/CartSuccessModal";
import { useCart } from "hooks/useCart";

// 스타일드 컴포넌트들
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
`;

const MainImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
`;

const ThumbnailImage = styled.img<{ $active?: boolean }>`
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
`;

const StoreName = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const ProductName = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  line-height: 1.3;
`;

const PriceSection = styled.div`
  margin-bottom: 24px;
`;

const DiscountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const DiscountBadge = styled.span`
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const OriginalPrice = styled.span`
  color: #9ca3af;
  text-decoration: line-through;
  font-size: 1.1rem;
`;

const CurrentPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ef4444;
`;

const OptionSection = styled.div`
  margin-bottom: 24px;
`;

const OptionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
`;

const SizeButton = styled.button<{
  $selected?: boolean;
  $outOfStock?: boolean;
}>`
  padding: 12px 8px;
  border: 1px solid ${(props) => (props.$selected ? "#3b82f6" : "#d1d5db")};
  background: ${(props) =>
    props.$outOfStock ? "#f3f4f6" : props.$selected ? "#3b82f6" : "white"};
  color: ${(props) =>
    props.$outOfStock ? "#9ca3af" : props.$selected ? "white" : "#374151"};
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: ${(props) => (props.$outOfStock ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

const ActionButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: 16px;
  border: 1px solid
    ${(props) => (props.$variant === "primary" ? "#3b82f6" : "#d1d5db")};
  background: ${(props) =>
    props.$variant === "primary" ? "#3b82f6" : "white"};
  color: ${(props) => (props.$variant === "primary" ? "white" : "#374151")};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$variant === "primary" ? "#2563eb" : "#f3f4f6"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DescriptionSection = styled.div`
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #e5e7eb;
`;

const DescriptionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
`;

const DescriptionText = styled.div`
  color: #374151;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const DetailImages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailImage = styled.img`
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.1rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #ef4444;
`;

const SelectedOptionsContainer = styled.div`
  margin: 24px 0;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
`;

const SelectedOptionsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
`;

const SelectedOptionItem = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const OptionInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SizeText = styled.span`
  font-weight: 600;
  color: #374151;
  min-width: 60px;
`;

const StockInfo = styled.span<{ $lowStock?: boolean }>`
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

  // 모달
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

        // 데이터를 가지고 온다.
        const productData = await ProductService.getProduct(Number(id));
        setProduct(productData);

        // 최근 본 상품에 추가
        addToRecentView(productData);
      } catch (err: any) {
        setError("상품 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>상품 정보를 불러오는 중...</LoadingContainer>
      </Container>
    );
  }

  // 사이즈 선택시 선택된 옵션 목록에 추가한다.
  const handleSizeSelect = (optionId: number) => {
    if (!product) {
      return;
    }

    const option = product.options.find((opt) => opt.optionId === optionId);
    if (!option) {
      return;
    }

    // 중복 선택 방지
    const existingOption = selectedOptions.find(
      (opt) => opt.optionId === optionId
    );
    if (existingOption) {
      setModalMessage("이미 선택된 사이즈입니다.");
      setShowErrorModal(true);
      return;
    }

    // 재고 확인
    if (option.stock === 0) {
      setModalMessage(
        `${option.size.replace("SIZE_", "")} 사이즈는 현재 품절입니다.`
      );
      setShowErrorModal(true);
      return;
    }

    const newOption: SelectedOptions = {
      optionId: option.optionId,
      size: option.size.replace("SIZE_", ""),
      quantity: 1,
      price: product.discountPrice,
      stock: option.stock,
    };

    setSelectedOptions((prev) => [...prev, newOption]);
  };

  // 선택된 옵션의 수량을 변경한다.
  const handleQuantityChange = (optionId: number, newQuantity: number) => {
    // 0개는 불가
    if (newQuantity < 1) {
      return;
    }

    const option = selectedOptions.find((opt) => opt.optionId === optionId);
    if (!option) {
      return;
    }

    // 추가할 수량이 옵션의 재고보다는 작아야 한다.
    if (newQuantity > option.stock) {
      setModalMessage(`사이즈 ${option.size}의 재고가 부족합니다.`);
      setShowErrorModal(true);
      return;
    }

    // 최대 5개까지 구매 가능하다.
    if (newQuantity > 5) {
      setModalMessage("한 번에 최대 5개까지만 구매할 수 있습니다.");
      setShowErrorModal(true);
      return;
    }

    setSelectedOptions((prev) =>
      prev.map((opt) =>
        opt.optionId === optionId ? { ...opt, quantity: newQuantity } : opt
      )
    );
  };

  // 선택된 옵션을 제거한다.
  const handleRemoveOption = (optionId: number) => {
    setSelectedOptions((prev) =>
      prev.filter((opt) => opt.optionId !== optionId)
    );
  };

  // 장바구니에 추가한다.
  const handleAddToCart = async () => {
    if (!user) {
      setModalMessage("로그인이 필요한 서비스입니다.");
      setShowErrorModal(true);
      return;
    }

    if (user.userType !== "user") {
      setModalMessage("일반 사용자만 이용할 수 있는 서비스입니다.");
      setShowErrorModal(true);
      return;
    }

    if (selectedOptions.length === 0) {
      setModalMessage("사이즈를 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    try {
      for (const option of selectedOptions) {
        await CartService.addCartItem({
          optionId: option.optionId,
          imageId: product?.images[0].imageId || 1,
          quantity: option.quantity,
        });
      }

      // 장바구니 개수 업데이트
      await updateCartItemCount();

      setModalMessage("장바구니에 상품이 추가되었습니다.");
      setShowSuccessModal(true);

      // 선택된 옵션은 초기화
      setSelectedOptions([]);
    } catch (err: any) {
      setModalMessage("장바구니 추가에 실패했습니다. 다시 시도해주세요.");
      setShowErrorModal(true);
    }
  };

  // 바로 주문을 한다.
  const handleDirectOrder = () => {
    if (!user) {
      setModalMessage("로그인이 필요한 서비스입니다.");
      setShowErrorModal(true);
      return;
    }

    if (user.userType !== "user") {
      setModalMessage("일반 사용자만 이용할 수 있는 서비스입니다.");
      setShowErrorModal(true);
      return;
    }

    if (!selectedOptions) {
      setModalMessage("사이즈를 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    // 바로 주문 페이지로 이동 (선택된 옵션 정보 전달)
    // directOrder : true, 상품정보, 옵션정보
    navigate("/payment", {
      state: {
        directOrder: true,
        product,
        selectedOptions,
      },
    });
  };

  // 총 계산 함수들
  const getTotalQuantity = () => {
    return selectedOptions.reduce(
      (total, option) => total + option.quantity,
      0
    );
  };

  const getTotalPrice = () => {
    return selectedOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0
    );
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const getDiscountRate = (): number => {
    if (!product || product.price === product.discountPrice) return 0;
    return Math.round(
      ((product.price - product.discountPrice) / product.price) * 100
    );
  };

  if (error || !product) {
    return (
      <Container>
        <ErrorContainer>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
          <button onClick={() => navigate("/products")}>
            상품 목록으로 돌아가기
          </button>
        </ErrorContainer>
      </Container>
    );
  }

  const discountRate = getDiscountRate();

  return (
    <Container>
      {/* 상품 정보 섹션 */}
      <ProductSection>
        {/* 이미지 섹션 */}
        <ImageSection>
          <MainImage
            src={toUrl(product.images[selectedImageIndex]?.url)}
            alt={product.name}
          />
          {product.images.filter((img) => img.type === "MAIN").length > 1 && (
            <ThumbnailContainer>
              {product.images
                .filter((img) => img.type === "MAIN")
                .map((image, index) => (
                  <ThumbnailImage
                    key={image.imageId}
                    src={toUrl(image.url)}
                    alt={`${product.name} ${index + 1}`}
                    $active={selectedImageIndex === index}
                    onClick={() => setSelectedImageIndex(index)}
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                ))}
            </ThumbnailContainer>
          )}
        </ImageSection>

        {/* 상품 정보 섹션 */}
        <InfoSection>
          <StoreName>{product.storeName}</StoreName>
          <ProductName>{product.name}</ProductName>

          {/* 가격 정보 */}
          <PriceSection>
            {discountRate > 0 && (
              <DiscountInfo>
                <DiscountBadge>{discountRate}%</DiscountBadge>
                <OriginalPrice>{formatPrice(product.price)}원</OriginalPrice>
              </DiscountInfo>
            )}
            <CurrentPrice>{formatPrice(product.discountPrice)}원</CurrentPrice>
          </PriceSection>

          {/* 옵션 선택 */}
          <OptionSection>
            <OptionTitle>사이즈 선택</OptionTitle>
            <SizeGrid>
              {product.options.map((option) => (
                <SizeButton
                  key={option.optionId}
                  $selected={selectedOptions.some(
                    (opt) => opt.optionId === option.optionId
                  )}
                  $outOfStock={option.stock === 0}
                  disabled={option.stock === 0}
                  onClick={() => handleSizeSelect(option.optionId)}
                >
                  {option.size.replace("SIZE_", "")}
                  {option.stock === 0 && (
                    <div style={{ fontSize: "10px", color: "#ef4444" }}>
                      품절
                    </div>
                  )}
                </SizeButton>
              ))}
            </SizeGrid>
          </OptionSection>

          {/* 선택된 옵션들 표시 */}
          {selectedOptions.length > 0 && (
            <SelectedOptionsContainer>
              <SelectedOptionsTitle>선택된 옵션</SelectedOptionsTitle>

              {selectedOptions.map((option) => (
                <SelectedOptionItem key={option.optionId}>
                  <OptionInfo>
                    <SizeText>사이즈 {option.size}</SizeText>
                    <StockInfo $lowStock={option.stock < 5}>
                      재고 {option.stock}개
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
                      disabled={
                        option.quantity >= 5 || option.quantity >= option.stock
                      }
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
