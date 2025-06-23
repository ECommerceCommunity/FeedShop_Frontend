import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// 📌 애니메이션
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
  margin-top: 12px;
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

const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: #111827;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  animation: ${fadeInUp} 0.3s ease-out;
  z-index: 50;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  width: 320px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #111827;
`;

const ModalText = styled.p`
  color: #6b7280;
  margin-bottom: 24px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ModalCancel = styled.button`
  background-color: #e5e7eb;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #d1d5db;
  }
`;

const ModalDelete = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #dc2626;
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
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "프리미엄 스마트폰 갤럭시 S23 울트라 512GB",
      originalPrice: 1450000,
      discountPrice: 1299000,
      discountRate: 10,
      image:
        "https://readdy.ai/api/search-image?query=Premium%20smartphone%20Galaxy%20S23%20Ultra%20with%20sleek%20design%2C%20professional%20camera%20setup%2C%20and%20high-end%20features%20displayed%20on%20a%20simple%20white%20background%2C%20product%20photography%20style%20with%20soft%20shadows%20and%20clean%20presentation&width=300&height=300&seq=1&orientation=squarish",
      category: "전자기기",
    },
    {
      id: 2,
      name: "초경량 노트북 LG 그램 16인치 i7",
      originalPrice: 1850000,
      discountPrice: 1665000,
      discountRate: 10,
      image:
        "https://readdy.ai/api/search-image?query=Ultra-lightweight%20laptop%20LG%20Gram%2016%20inch%20with%20slim%20design%2C%20metallic%20finish%2C%20open%20display%20showing%20clear%20screen%2C%20positioned%20on%20a%20simple%20white%20background%20with%20soft%20shadows&width=300&height=300&seq=2&orientation=squarish",
      category: "전자기기",
    },
    {
      id: 3,
      name: "고급 가죽 크로스백 - 브라운",
      originalPrice: 280000,
      discountPrice: 224000,
      discountRate: 20,
      image:
        "https://readdy.ai/api/search-image?query=Luxury%20brown%20leather%20crossbody%20bag%20with%20elegant%20stitching%2C%20gold%20hardware%2C%20and%20adjustable%20strap%20displayed%20on%20a%20simple%20white%20background%20with%20soft%20shadows%2C%20professional%20product%20photography&width=300&height=300&seq=3&orientation=squarish",
      category: "패션",
    },
    {
      id: 4,
      name: "프리미엄 블루투스 노이즈 캔슬링 헤드폰",
      originalPrice: 350000,
      discountPrice: 315000,
      discountRate: 10,
      image:
        "https://readdy.ai/api/search-image?query=Premium%20wireless%20noise-cancelling%20headphones%20with%20sleek%20design%2C%20plush%20ear%20cushions%2C%20and%20adjustable%20headband%20displayed%20on%20a%20simple%20white%20background%20with%20soft%20shadows%2C%20professional%20product%20photography&width=300&height=300&seq=4&orientation=squarish",
      category: "전자기기",
    },
    {
      id: 5,
      name: "스마트 워치 애플 워치 시리즈 8",
      originalPrice: 599000,
      discountPrice: 539100,
      discountRate: 10,
      image:
        "https://readdy.ai/api/search-image?query=Smart%20watch%20Apple%20Watch%20Series%208%20with%20modern%20design%2C%20bright%20display%20showing%20fitness%20tracking%20features%2C%20and%20silicone%20band%20displayed%20on%20a%20simple%20white%20background%20with%20soft%20shadows&width=300&height=300&seq=5&orientation=squarish",
      category: "전자기기",
    },
    {
      id: 6,
      name: "프리미엄 캐시미어 니트 스웨터",
      originalPrice: 189000,
      discountPrice: 151200,
      discountRate: 20,
      image:
        "https://readdy.ai/api/search-image?query=Premium%20cashmere%20knit%20sweater%20in%20soft%20beige%20color%20with%20elegant%20texture%20and%20classic%20design%20displayed%20on%20a%20simple%20white%20background%20with%20soft%20shadows%2C%20professional%20fashion%20product%20photography&width=300&height=300&seq=6&orientation=squarish",
      category: "패션",
    },
    {
      id: 7,
      name: "고급 향수 샤넬 No.5 100ml",
      originalPrice: 175000,
      discountPrice: 175000,
      discountRate: 0,
      image:
        "https://readdy.ai/api/search-image?query=Luxury%20perfume%20Chanel%20No.5%20100ml%20bottle%20with%20iconic%20design%20and%20elegant%20packaging%20displayed%20on%20a%20simple%20white%20background%20with%20soft%20shadows%2C%20professional%20beauty%20product%20photography&width=300&height=300&seq=7&orientation=squarish",
      category: "뷰티",
    },
    {
      id: 8,
      name: "프리미엄 스테인리스 주방용품 세트",
      originalPrice: 250000,
      discountPrice: 200000,
      discountRate: 20,
      image:
        "https://readdy.ai/api/search-image?query=Premium%20stainless%20steel%20kitchen%20utensil%20set%20with%20polished%20finish%2C%20ergonomic%20handles%2C%20and%20professional%20quality%20displayed%20on%20a%20simple%20white%20background%20with%20soft%20shadows%2C%20kitchen%20product%20photography&width=300&height=300&seq=8&orientation=squarish",
      category: "주방",
    },
    {
      id: 9,
      name: "고급 가죽 남성 지갑 - 블랙",
      originalPrice: 120000,
      discountPrice: 120000,
      discountRate: 0,
      image:
        "https://readdy.ai/api/search-image?query=Luxury%20black%20leather%20mens%20wallet%20with%20fine%20stitching%2C%20multiple%20card%20slots%2C%20and%20sleek%20design%20displayed%20on%20a%20simple%20white%20background%20with%20soft%20shadows%2C%20professional%20accessory%20product%20photography&width=300&height=300&seq=9&orientation=squarish",
      category: "패션",
    },
  ]);

  const [sortOption, setSortOption] = useState("최신순");
  const [priceFilter, setPriceFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const itemsPerPage = 8;

  const priceRanges = [
    "전체",
    "10만원 이하",
    "10만원-50만원",
    "50만원-100만원",
    "100만원 이상",
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // 외부 클릭 핸들링 생략 가능
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const addToCart = (id: number) => {
    const item = wishlistItems.find((i) => i.id === id);
    if (item) {
      setToastMessage(`"${item.name}" 상품이 장바구니에 추가되었습니다.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const removeFromWishlist = () => {
    if (itemToRemove !== null) {
      setWishlistItems((prev) => prev.filter((i) => i.id !== itemToRemove));
      setShowModal(false);
      setItemToRemove(null);
      setToastMessage("상품이 관심 상품에서 삭제되었습니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
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
                  <CartButton onClick={() => addToCart(item.id)}>
                    장바구니
                  </CartButton>
                  <RemoveButton
                    onClick={() => {
                      setItemToRemove(item.id);
                      setShowModal(true);
                    }}
                  >
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

      {showToast && <Toast>{toastMessage}</Toast>}

      {showModal && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>관심 상품 삭제</ModalTitle>
            <ModalText>정말 이 상품을 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setShowModal(false)}>
                취소
              </ModalCancel>
              <ModalDelete onClick={removeFromWishlist}>삭제하기</ModalDelete>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default WishListPage;
