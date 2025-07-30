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
import SuccessModal from "../../components/modal/SuccessModal";

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
  border: 2px solid ${props => props.$active ? '#3b82f6' : '#e5e7eb'};
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

const SizeButton = styled.button<{ $selected?: boolean; $outOfStock?: boolean }>`
  padding: 12px 8px;
  border: 1px solid ${props => props.$selected ? '#3b82f6' : '#d1d5db'};
  background: ${props => props.$outOfStock ? '#f3f4f6' : props.$selected ? '#3b82f6' : 'white'};
  color: ${props => props.$outOfStock ? '#9ca3af' : props.$selected ? 'white' : '#374151'};
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: ${props => props.$outOfStock ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
  }
`;

const QuantitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  padding: 8px 12px;
  border: none;
  background: #f9fafb;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 8px;
  border: none;
  text-align: center;
  font-size: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 16px;
  border: 1px solid ${props => props.$variant === 'primary' ? '#3b82f6' : '#d1d5db'};
  background: ${props => props.$variant === 'primary' ? '#3b82f6' : 'white'};
  color: ${props => props.$variant === 'primary' ? 'white' : '#374151'};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$variant === 'primary' ? '#2563eb' : '#f3f4f6'};
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

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 상태 관리
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
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
        console.error('상품 상세 조회 실패:', err);
        setError('상품 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // 장바구니 추가 함수
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

    if (!selectedOption) {
      setModalMessage("사이즈를 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    try {
      await CartService.addCartItem({
        optionId: selectedOption,
        imageId: product?.images[0]?.imageId || 1,
        quantity
      });

      setModalMessage("장바구니에 상품이 추가되었습니다.");
      setShowSuccessModal(true);
      
    } catch (err: any) {
      console.error('장바구니 추가 실패:', err);
      setModalMessage("장바구니 추가에 실패했습니다. 다시 시도해주세요.");
      setShowErrorModal(true);
    }
  };

  // 바로 주문 함수
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

    if (!selectedOption) {
      setModalMessage("사이즈를 선택해주세요.");
      setShowErrorModal(true);
      return;
    }

    // 바로 주문 페이지로 이동 (선택된 옵션 정보 전달)
    navigate("/payment", {
      state: {
        directOrder: true,
        product: product,
        selectedOption: product?.options.find(opt => opt.optionId === selectedOption),
        quantity: quantity
      }
    });
  };

  // 수량 변경 함수
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 5) {
      setQuantity(newQuantity);
    }
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 할인율 계산 함수
  const getDiscountRate = (): number => {
    if (!product || product.price === product.discountPrice) return 0;
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>상품 정보를 불러오는 중...</LoadingContainer>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <ErrorContainer>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate("/products")}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            상품 목록으로 돌아가기
          </button>
        </ErrorContainer>
      </Container>
    );
  }

  const discountRate = getDiscountRate();
  const availableOptions = product.options.filter(option => option.stock > 0);

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
          {product.images.filter(img => img.type === "MAIN").length > 1 && (
            <ThumbnailContainer>
              {product.images.filter(img => img.type === "MAIN")
                .map((image, index) => (
                <ThumbnailImage
                  key={image.imageId}
                  src={toUrl(image.url)}
                  alt={`${product.name} ${index + 1}`}
                  $active={selectedImageIndex === index}
                  onClick={() => setSelectedImageIndex(index)}
                  onError={e => { e.currentTarget.style.visibility = 'hidden'; }}
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
                  $selected={selectedOption === option.optionId}
                  $outOfStock={option.stock === 0}
                  disabled={option.stock === 0}
                  onClick={() => setSelectedOption(option.optionId)}
                >
                  {option.size.replace('SIZE_', '')}
                </SizeButton>
              ))}
            </SizeGrid>
          </OptionSection>

          {/* 수량 선택 */}
          {selectedOption && (
            <QuantitySection>
              <OptionTitle>수량</OptionTitle>
              <QuantityControl>
                <QuantityButton 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </QuantityButton>
                <QuantityInput 
                  type="number" 
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  min="1"
                  max="5"
                />
                <QuantityButton 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 5}
                >
                  +
                </QuantityButton>
              </QuantityControl>
            </QuantitySection>
          )}

          {/* 액션 버튼들 */}
          <ActionButtons>
            <ActionButton 
              $variant="secondary" 
              onClick={handleAddToCart}
              disabled={!selectedOption || availableOptions.length === 0}
            >
              장바구니 담기
            </ActionButton>
            <ActionButton 
              $variant="primary" 
              onClick={handleDirectOrder}
              disabled={!selectedOption || availableOptions.length === 0}
            >
              바로 주문하기
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
        {product.images.filter(img => img.type === "DETAIL").length > 0 && (
          <DetailImages>
            {product.images
              .filter(img => img.type === "DETAIL")
              .map((image) => (
                <DetailImage
                  key={image.imageId}
                  src={toUrl(image.url)}
                  alt={`${product.name} 상세 이미지`}
                  onError={e => { e.currentTarget.style.visibility = 'hidden'; }}
                />
              ))}
          </DetailImages>
        )}
      </DescriptionSection>

      {/* 성공 모달 */}
      <SuccessModal
          open={showSuccessModal}
          title="성공"
          message={modalMessage}
          onClose={() => setShowSuccessModal(false)}
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