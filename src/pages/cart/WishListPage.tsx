import Warning from "components/modal/Warning";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { WishListItem } from "types/types";

// ✅ styled-components
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 24px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TitleBox = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
`;

const SubTitle = styled.p`
  margin-top: 8px;
  color: #4b5563;
`;

const FilterBar = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const SelectBox = styled.select`
  width: 180px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  color: #374151;
  &:focus {
    border-color: #6366f1;
    outline: none;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
  &:hover {
    transform: scale(1.02);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 240px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 180px;
  padding: 16px;
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  height: 44px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const OriginalPrice = styled.p`
  font-size: 14px;
  text-decoration: line-through;
  color: #9ca3af;
`;

const DiscountedPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #dc2626;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const CartButton = styled.button`
  flex: 1;
  background-color: #6366f1;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #4f46e5;
  }
`;

const RemoveButton = styled.button`
  width: 40px;
  background-color: #f3f4f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background-color: #e5e7eb;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
`;

const PaginationButton = styled.button<{
  active?: boolean;
  disabled?: boolean;
}>`
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background-color: ${({ active }) => (active ? "#6366f1" : "#e5e7eb")};
  color: ${({ active }) => (active ? "#fff" : "#1f2937")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  font-weight: 500;
  &:hover {
    background-color: ${({ active, disabled }) =>
      disabled ? "" : active ? "#4f46e5" : "#d1d5db"};
  }
`;

// ✅ 본문 컴포넌트
const WishListPage: React.FC = () => {
  const [sortOption, setSortOption] = useState("최신순");
  const [priceFilter, setPriceFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeItemId, setRemoveItemId] = useState<number | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishListItem[]>([]);
  const navigate = useNavigate();

  const itemsPerPage = 8;

  const priceRanges = [
    "전체",
    "10만원 이하",
    "10만원-50만원",
    "50만원-100만원",
    "100만원 이상",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    const parsed: WishListItem[] = stored ? JSON.parse(stored) : [];
    setWishlistItems(parsed);
  }, []);

  const filteredItems = wishlistItems.filter((item) => {
    const price = item.discountPrice;
    if (priceFilter === "10만원 이하" && price > 100000) return false;
    if (priceFilter === "10만원-50만원" && (price <= 100000 || price > 500000))
      return false;
    if (
      priceFilter === "50만원-100만원" &&
      (price <= 500000 || price > 1000000)
    )
      return false;
    if (priceFilter === "100만원 이상" && price <= 1000000) return false;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOption === "가격 높은순") return b.discountPrice - a.discountPrice;
    if (sortOption === "가격 낮은순") return a.discountPrice - b.discountPrice;
    return b.id - a.id;
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const currentItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (price: number) => price.toLocaleString() + "원";

  const onClickProduct = (id: number) => {
    const item = wishlistItems.find((item) => item.id === id);
    if (item) {
      navigate(`/products/${item.id}`);
    }
  };

  const onClickRemove = (id: number) => {
    setRemoveItemId(id);
    setShowRemoveModal(true);
  };

  const removeFromWishlist = () => {
    if (removeItemId !== null) {
      const updated = wishlistItems.filter((item) => item.id !== removeItemId);
      setWishlistItems(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setShowRemoveModal(false);
      setRemoveItemId(null);
    }
  };

  return (
    <>
      {showRemoveModal && (
        <Warning
          open={showRemoveModal}
          title="찜한 상품 삭제"
          message="찜한 상품에서 삭제하시겠어요?"
          onConfirm={() => {
            setShowRemoveModal(false);
            removeFromWishlist();
          }}
          onCancel={() => setShowRemoveModal(false)}
        />
      )}

      <PageWrapper>
        <Container>
          <TitleBox>
            <Title>찜한 상품</Title>
            <SubTitle>
              찜한 상품을 확인하고 관리하세요. 총 {filteredItems.length}개
            </SubTitle>
          </TitleBox>

          <FilterBar>
            <SelectBox
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option>최신순</option>
              <option>가격 높은순</option>
              <option>가격 낮은순</option>
            </SelectBox>
            <SelectBox
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              {priceRanges.map((range) => (
                <option key={range}>{range}</option>
              ))}
            </SelectBox>
          </FilterBar>

          <Grid>
            {currentItems.map((item) => (
              <Card key={item.id}>
                <ImageWrapper>
                  <ProductImage src={item.image} alt={item.name} />
                  {item.discountRate > 0 && (
                    <DiscountBadge>{item.discountRate}% 할인</DiscountBadge>
                  )}
                </ImageWrapper>
                <CardContent>
                  <ProductName>{item.name}</ProductName>
                  {item.discountRate > 0 ? (
                    <>
                      <OriginalPrice>
                        {formatPrice(item.originalPrice)}
                      </OriginalPrice>
                      <DiscountedPrice>
                        {formatPrice(item.discountPrice)}
                      </DiscountedPrice>
                    </>
                  ) : (
                    <DiscountedPrice>
                      {formatPrice(item.originalPrice)}
                    </DiscountedPrice>
                  )}
                  <ButtonRow>
                    <CartButton onClick={() => onClickProduct(item.id)}>
                      상품 보기
                    </CartButton>
                    <RemoveButton onClick={() => onClickRemove(item.id)}>
                      <i className="fa-solid fa-trash"></i>{" "}
                    </RemoveButton>
                  </ButtonRow>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>

        {totalPages > 1 && (
          <PaginationWrapper>
            <PaginationButton
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </PaginationButton>

            {[...Array(totalPages)].map((_, idx) => (
              <PaginationButton
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                active={currentPage === idx + 1}
              >
                {idx + 1}
              </PaginationButton>
            ))}

            <PaginationButton
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음
            </PaginationButton>
          </PaginationWrapper>
        )}
      </PageWrapper>
    </>
  );
};

export default WishListPage;
