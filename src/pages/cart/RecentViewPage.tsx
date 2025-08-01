import { useState, useEffect } from "react";
import { RecentViewItem } from "types/cart";
import styled from "styled-components";
import { getRecentViewItems } from "utils/cart/recentview";
import Warning from "components/modal/Warning";
import { useNavigate } from "react-router-dom";
import { toUrl } from "utils/common/images";

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #111827;
`;

const DeleteAllButton = styled.button`
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
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

const Badge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
`;

const DeleteIcon = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(31, 41, 55, 0.7);
  color: white;
  padding: 6px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(31, 41, 55, 0.9);
  }
`;

const CardContent = styled.div`
  padding: 16px;
`;

const ProductTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #111827;
  transition: color 0.2s;

  &:hover {
    color: #87ceeb;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 12px;
`;

const FinalPrice = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #111827;
`;

const OriginalPrice = styled.span`
  font-size: 14px;
  color: #6b7280;
  text-decoration: line-through;
  margin-left: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

const CartButton = styled.button`
  flex: 1;
  background: #87ceeb;
  color: white;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #5fb4d9;
  }
`;

const WishButton = styled.button<{ $isWishlisted: boolean }>`
  width: 40px;
  height: 40px;
  border: 1px solid ${(props) => (props.$isWishlisted ? "#ef4444" : "#d1d5db")};
  background: ${(props) => (props.$isWishlisted ? "#ef4444" : "white")};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$isWishlisted ? "white" : "#4b5563")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #ef4444;
    background: ${(props) => (props.$isWishlisted ? "#dc2626" : "#fef2f2")};
    color: ${(props) => (props.$isWishlisted ? "white" : "#ef4444")};
  }
`;

const ViewedAtText = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
`;

const RecentViewPage: React.FC = () => {
  const navigate = useNavigate();
  const [recentViewItems, setRecentViewItems] = useState<RecentViewItem[]>([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAllRemoveModal, setShowAllRemoveModal] = useState(false);
  const [removeItemId, setRemoveItemId] = useState<number | null>(null);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  useEffect(() => {
    const items = getRecentViewItems(8);
    setRecentViewItems(items);

    const loadWishlist = () => {
      try {
        const currentWishlist = JSON.parse(
          localStorage.getItem("wishlist") ?? "[]"
        );
        const wishlistIds = currentWishlist.map((item: any) => item.id);
        setWishlistItems(wishlistIds);
      } catch (error) {
        console.log("위시리스트 로드 중 오류 : ", error);
        setWishlistItems([]);
      }
    };

    loadWishlist();
  }, []);

  const formatViewdAt = (viewedAt: string) => {
    const date = new Date(viewedAt);
    const now = new Date();
    const differenceInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (differenceInMinutes < 1) {
      return "방금 전";
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes}분 전`;
    } else if (differenceInMinutes < 24 * 60) {
      const hours = Math.floor(differenceInMinutes / 60);
      return `${hours}시간 전`;
    } else {
      const days = Math.floor(differenceInMinutes / (24 * 60));
      return `${days}일 전`;
    }
  };

  const onClickProduct = (id: number) => {
    const item = recentViewItems.find((item) => item.id === id);
    if (item) {
      navigate(`/products/${item.id}`);
    }
  };

  const toggleWishlist = (item: RecentViewItem) => {
    const currentWishlist = JSON.parse(
      localStorage.getItem("wishlist") ?? "[]"
    );
    const isCurrentWishlist = wishlistItems.includes(item.id);

    if (isCurrentWishlist) {
      const updateWishlist = currentWishlist.filter(
        (wishItem: any) => wishItem.id !== item.id
      );
      localStorage.setItem("wishlist", JSON.stringify(updateWishlist));
      setWishlistItems((prev) => prev.filter((id) => id !== item.id));
    } else {
      const wishItem = {
        id: item.id,
        name: item.name,
        originalPrice: item.originalPrice,
        discountPrice: item.discountPrice,
        discountType: item.discountType,
        discountValue: item.discountValue,
        category: item.category,
        image: item.image,
        addedAt: new Date().toISOString(),
      };

      const updatedWishlist = [...currentWishlist, wishItem];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setWishlistItems((prev) => [...prev, item.id]);
    }
  };

  const onClickRemove = (id: number) => {
    setRemoveItemId(id);
    setShowRemoveModal(true);
  };

  const onClickAllRemove = () => {
    setRemoveItemId(-1);
    setShowAllRemoveModal(true);
  };

  const removeFromRecentView = () => {
    if (removeItemId !== null) {
      const updated = recentViewItems.filter(
        (item) => item.id !== removeItemId
      );
      setRecentViewItems(updated);
      localStorage.setItem("recentview", JSON.stringify(updated));
      setShowRemoveModal(false);
      setRemoveItemId(null);
    }
  };

  const clearRecentView = () => {
    setRecentViewItems([]);
    localStorage.setItem("recentview", JSON.stringify([]));
    setShowAllRemoveModal(false);
    setRemoveItemId(null);
  };

  return (
    <>
      {showRemoveModal && (
        <Warning
          open={showRemoveModal}
          title="최근 본 상품 삭제"
          message="최근 본 상품에서 삭제하시겠어요?"
          onConfirm={() => {
            setShowRemoveModal(false);
            removeFromRecentView();
          }}
          onCancel={() => setShowRemoveModal(false)}
        />
      )}

      {showAllRemoveModal && (
        <Warning
          open={showAllRemoveModal}
          title="최근 본 상품 전체 삭제"
          message="최근 본 상품을 전부 삭제하시겠어요?"
          onConfirm={() => {
            setShowAllRemoveModal(false);
            clearRecentView();
          }}
          onCancel={() => setShowAllRemoveModal(false)}
        />
      )}

      <PageWrapper>
        <Main>
          <TitleRow>
            <Title>최근 본 상품</Title>
            {recentViewItems.length > 0 ? (
              <DeleteAllButton onClick={onClickAllRemove}>
                <i className="fa-solid fa-trash" style={{ marginRight: 4 }}></i>{" "}
                전체 삭제
              </DeleteAllButton>
            ) : (
              <></>
            )}
          </TitleRow>

          {recentViewItems.length > 0 ? (
            <Grid>
              {recentViewItems.map((item) => (
                <Card key={item.id}>
                  <ImageWrapper>
                    <ProductImage src={toUrl(item.image)} alt={item.name} />
                    {item.discountValue > 0 && (
                      <Badge>
                        {item.discountValue}
                        {item.discountType === "RATE_DISCOUNT"
                          ? "%"
                          : "원"}{" "}
                        할인
                      </Badge>
                    )}
                    <DeleteIcon onClick={() => onClickRemove(item.id)}>
                      <i className="fa-solid fa-xmark"></i>
                    </DeleteIcon>
                  </ImageWrapper>
                  <CardContent>
                    <ViewedAtText>{formatViewdAt(item.viewedAt)}</ViewedAtText>
                    <ProductTitle>{item.name}</ProductTitle>
                    <PriceRow>
                      <FinalPrice>
                        {item.discountPrice.toLocaleString()}원
                      </FinalPrice>
                      {item.discountValue > 0 && (
                        <OriginalPrice>
                          {item.originalPrice.toLocaleString()}원
                        </OriginalPrice>
                      )}
                    </PriceRow>
                    <ButtonRow>
                      <CartButton onClick={() => onClickProduct(item.id)}>
                        <i
                          className="fa-solid fa-cart-shopping"
                          style={{ marginRight: 4 }}
                        ></i>{" "}
                        상품 보기
                      </CartButton>
                      <WishButton
                        $isWishlisted={wishlistItems.includes(item.id)}
                        onClick={() => toggleWishlist(item)}
                      >
                        <i
                          className={
                            wishlistItems.includes(item.id)
                              ? "fa-solid fa-heart"
                              : "fa-regular fa-heart"
                          }
                        ></i>
                      </WishButton>
                    </ButtonRow>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          ) : (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <div style={{ fontSize: 48, color: "#9ca3af", marginBottom: 16 }}>
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                최근 본 상품이 없습니다
              </h3>
              <p style={{ color: "#6b7280", marginBottom: 24 }}>
                상품을 둘러보고 다시 방문해 주세요.
              </p>
            </div>
          )}
        </Main>
      </PageWrapper>
    </>
  );
};

export default RecentViewPage;
