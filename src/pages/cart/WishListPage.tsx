import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import UserProtectedRoute from "../../components/UserProtectedRoute";
import { toUrl } from "../../utils/images";
import { WishListItem } from "../../types/types";

// 스타일드 컴포넌트들
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
`;

const ItemCount = styled.span`
  font-size: 1rem;
  color: #6b7280;
`;

const WishGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const WishCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ProductLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ProductCategory = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 12px;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const DiscountPrice = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #ef4444;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: #ef4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const AddedDate = styled.div`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const EmptyWishlist = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const EmptyMessage = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 24px;
`;

const ShoppingButton = styled.button`
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;

const WishListPageContent: React.FC = () => {
  const navigate = useNavigate();
  const [wishList, setWishList] = useState<WishListItem[]>([]);

  // localStorage에서 찜한 상품 목록 로딩
  useEffect(() => {
    const loadWishList = () => {
      try {
        const savedWishList = localStorage.getItem("wishlist");
        if (savedWishList) {
          const parsedWishList = JSON.parse(savedWishList);
          // 최근 추가순으로 정렬
          const sortedWishList = parsedWishList.sort((a: WishListItem, b: WishListItem) => 
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          );
          setWishList(sortedWishList);
        }
      } catch (error) {
        console.error('찜한 상품 목록 로딩 실패:', error);
        setWishList([]);
      }
    };

    loadWishList();
  }, []);

  // 찜한 상품 제거 함수
  const handleRemoveFromWishList = (productId: number) => {
    try {
      const updatedWishList = wishList.filter(item => item.id !== productId);
      setWishList(updatedWishList);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishList));
    } catch (error) {
      console.error('찜한 상품 제거 실패:', error);
    }
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <Title>찜한 상품</Title>
        <ItemCount>총 {wishList.length}개</ItemCount>
      </Header>

      {/* 찜한 상품이 없는 경우 */}
      {wishList.length === 0 ? (
        <EmptyWishlist>
          <EmptyIcon>❤️</EmptyIcon>
          <EmptyTitle>찜한 상품이 없습니다</EmptyTitle>
          <EmptyMessage>
            마음에 드는 상품을 찜해보세요.
            <br />
            나중에 쉽게 찾아볼 수 있습니다.
          </EmptyMessage>
          <ShoppingButton onClick={() => navigate("/products")}>
            상품 보러가기
          </ShoppingButton>
        </EmptyWishlist>
      ) : (
        <>
          {/* 찜한 상품 그리드 */}
          <WishGrid>
            {wishList.map((item) => (
              <WishCard key={item.id}>
                <ProductLink to={`/products/${item.id}`}>
                  <ProductImage 
                    src={toUrl(item.image)} 
                    alt={item.name}
                    onError={(e) => {
                      // 이미지 로드 실패시 기본 이미지로 대체
                      (e.target as HTMLImageElement).src = toUrl('images/common/no-image.png');
                    }}
                  />
                </ProductLink>
                
                {/* 제거 버튼 */}
                <RemoveButton 
                  onClick={() => handleRemoveFromWishList(item.id)}
                  title="찜 해제"
                >
                  ×
                </RemoveButton>
                
                <ProductInfo>
                  <ProductLink to={`/products/${item.id}`}>
                    <ProductName>{item.name}</ProductName>
                    <ProductCategory>{item.category}</ProductCategory>
                    
                    <PriceSection>
                      <DiscountPrice>{formatPrice(item.discountPrice)}원</DiscountPrice>
                      {item.originalPrice !== item.discountPrice && (
                        <>
                          <OriginalPrice>{formatPrice(item.originalPrice)}원</OriginalPrice>
                          {item.discountValue > 0 && (
                            <DiscountBadge>{item.discountValue}{ item.discountType==='RATE_DISCOUNT' ? '%':'원' }</DiscountBadge>
                          )}
                        </>
                      )}
                    </PriceSection>
                  </ProductLink>
                  
                  <AddedDate>
                    {formatDate(item.addedAt)} 추가
                  </AddedDate>
                </ProductInfo>
              </WishCard>
            ))}
          </WishGrid>
        </>
      )}
    </Container>
  );
};

// 권한 확인이 포함된 메인 컴포넌트
const WishListPage: React.FC = () => {
  return (
    <UserProtectedRoute requireUserRole={true} showNotice={true}>
      <WishListPageContent />
    </UserProtectedRoute>
  );
};

export default WishListPage;