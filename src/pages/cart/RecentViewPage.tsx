import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 192px;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.3s;

  ${Card}:hover & {
    transform: scale(1.05);
  }
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

const WishButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;

  &:hover {
    border-color: #87ceeb;
    color: #87ceeb;
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  background-color: #111827;
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: ${fadeInUp} 0.3s ease-out;
  z-index: 50;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Modal = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
`;

const ModalText = styled.p`
  color: #4b5563;
  margin-bottom: 24px;
`;

const ModalButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ModalCancel = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
`;

const ModalDelete = styled.button`
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;

const RecentViewPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const recentItems = [
    {
      id: 1,
      name: "프리미엄 스마트폰",
      price: 1200000,
      discount: 10,
      image:
        "https://readdy.ai/api/search-image?query=A%2520sleek%2520modern%2520smartphone%2520with%2520a%2520minimalist%2520design%252C%2520displayed%2520on%2520a%2520clean%2520white%2520background%2520with%2520subtle%2520shadows%252C%2520professional%2520product%2520photography%2520with%2520high%2520detail%2520and%2520clarity%252C%2520soft%2520lighting%2520highlighting%2520the%2520premium%2520features&width=240&height=240&seq=1&orientation=squarish",
    },
    {
      id: 2,
      name: "울트라 노트북",
      price: 1800000,
      discount: 5,
      image:
        "https://readdy.ai/api/search-image?query=A%2520premium%2520ultrabook%2520laptop%2520with%2520thin%2520aluminum%2520body%252C%2520displayed%2520at%2520an%2520angle%2520on%2520a%2520clean%2520white%2520background%252C%2520professional%2520product%2520photography%2520with%2520soft%2520lighting%2520highlighting%2520the%2520sleek%2520design%2520and%2520keyboard&width=240&height=240&seq=2&orientation=squarish",
    },
    {
      id: 3,
      name: "프리미엄 헤드폰",
      price: 350000,
      discount: 15,
      image:
        "https://readdy.ai/api/search-image?query=Premium%2520over-ear%2520headphones%2520with%2520luxurious%2520design%252C%2520displayed%2520on%2520a%2520clean%2520white%2520background%252C%2520professional%2520product%2520photography%2520with%2520soft%2520lighting%2520highlighting%2520the%2520cushioned%2520ear%2520cups%2520and%2520metallic%2520details&width=240&height=240&seq=3&orientation=squarish",
    },
    {
      id: 4,
      name: "스마트 워치",
      price: 280000,
      discount: 8,
      image:
        "https://readdy.ai/api/search-image?query=Modern%2520smartwatch%2520with%2520sleek%2520design%2520and%2520vibrant%2520display%252C%2520shown%2520on%2520a%2520clean%2520white%2520background%252C%2520professional%2520product%2520photography%2520with%2520soft%2520lighting%2520highlighting%2520the%2520premium%2520materials%2520and%2520screen%2520interface&width=240&height=240&seq=4&orientation=squarish",
    },
    {
      id: 5,
      name: "무선 이어버드",
      price: 180000,
      discount: 12,
      image:
        "https://readdy.ai/api/search-image?query=Wireless%2520earbuds%2520with%2520charging%2520case%252C%2520modern%2520design%2520with%2520ergonomic%2520shape%252C%2520displayed%2520on%2520a%2520clean%2520white%2520background%252C%2520professional%2520product%2520photography%2520with%2520soft%2520lighting%2520highlighting%2520the%2520glossy%2520finish&width=240&height=240&seq=5&orientation=squarish",
    },
    {
      id: 6,
      name: "게이밍 마우스",
      price: 89000,
      discount: 0,
      image:
        "https://readdy.ai/api/search-image?query=High%2520performance%2520gaming%2520mouse%2520with%2520ergonomic%2520design%2520and%2520RGB%2520lighting%252C%2520displayed%2520on%2520a%2520clean%2520white%2520background%252C%2520professional%2520product%2520photography%2520with%2520soft%2520lighting%2520highlighting%2520the%2520buttons%2520and%2520texture&width=240&height=240&seq=6&orientation=squarish",
    },
    {
      id: 7,
      name: "블루투스 스피커",
      price: 120000,
      discount: 10,
      image:
        "https://readdy.ai/api/search-image?query=Portable%2520bluetooth%2520speaker%2520with%2520modern%2520fabric%2520covered%2520design%252C%2520displayed%2520on%2520a%2520clean%2520white%2520background%252C%2520professional%2520product%2520photography%2520with%2520soft%2520lighting%2520highlighting%2520the%2520texture%2520and%2520control%2520buttons&width=240&height=240&seq=7&orientation=squarish",
    },
    {
      id: 8,
      name: "태블릿 PC",
      price: 650000,
      discount: 7,
      image:
        "https://readdy.ai/api/search-image?query=Slim%2520tablet%2520computer%2520with%2520large%2520display%2520and%2520minimal%2520bezels%252C%2520displayed%2520on%2520a%2520clean%2520white%2520background%252C%2520professional%2520product%2520photography%2520with%2520soft%2520lighting%2520highlighting%2520the%2520screen%2520and%2520premium%2520finish&width=240&height=240&seq=8&orientation=squarish",
    },
  ];

  const calculateItemPrice = (item: (typeof recentItems)[0]) => {
    return item.price * (1 - item.discount / 100);
  };

  const addToCart = (itemId: number) => {
    setToastMessage("장바구니에 상품이 추가되었습니다.");
    setShowToast(true);
  };

  const addToWishlist = (itemId: number) => {
    setToastMessage("관심 상품에 추가되었습니다.");
    setShowToast(true);
  };

  const confirmDelete = (itemId: number) => {
    setItemToDelete(itemId);
    setShowDeleteConfirm(true);
  };

  const deleteItem = () => {
    if (itemToDelete === -1) {
      setSelectedItems([]);
      setToastMessage("모든 최근 본 상품이 삭제되었습니다.");
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemToDelete));
      setToastMessage("선택한 상품이 삭제되었습니다.");
    }
    setShowDeleteConfirm(false);
    setShowToast(true);
  };

  const confirmDeleteAll = () => {
    setItemToDelete(-1);
    setShowDeleteConfirm(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <PageWrapper>
      <Main>
        <TitleRow>
          <Title>최근 본 상품</Title>
          <DeleteAllButton onClick={confirmDeleteAll}>
            <i className="fa-solid fa-trash" style={{ marginRight: 4 }}></i>{" "}
            전체 삭제
          </DeleteAllButton>
        </TitleRow>

        {recentItems.length > 0 ? (
          <Grid>
            {recentItems.map((item) => (
              <Card key={item.id}>
                <ImageWrapper>
                  <ProductImage src={item.image} alt={item.name} />
                  {item.discount > 0 && <Badge>{item.discount}% 할인</Badge>}
                  <DeleteIcon onClick={() => confirmDelete(item.id)}>
                    <i className="fa-solid fa-xmark"></i>
                  </DeleteIcon>
                </ImageWrapper>
                <CardContent>
                  <ProductTitle>{item.name}</ProductTitle>
                  <PriceRow>
                    <FinalPrice>
                      {calculateItemPrice(item).toLocaleString()}원
                    </FinalPrice>
                    {item.discount > 0 && (
                      <OriginalPrice>
                        {item.price.toLocaleString()}원
                      </OriginalPrice>
                    )}
                  </PriceRow>
                  <ButtonRow>
                    <CartButton onClick={() => addToCart(item.id)}>
                      <i
                        className="fa-solid fa-cart-shopping"
                        style={{ marginRight: 4 }}
                      ></i>{" "}
                      장바구니
                    </CartButton>
                    <WishButton onClick={() => addToWishlist(item.id)}>
                      <i className="fa-solid fa-heart"></i>
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

      {showDeleteConfirm && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>삭제 확인</ModalTitle>
            <ModalText>
              {itemToDelete === -1
                ? "모든 최근 본 상품을 삭제하시겠습니까?"
                : "선택한 상품을 삭제하시겠습니까?"}
            </ModalText>
            <ModalButtonRow>
              <ModalCancel onClick={() => setShowDeleteConfirm(false)}>
                취소
              </ModalCancel>
              <ModalDelete onClick={deleteItem}>삭제</ModalDelete>
            </ModalButtonRow>
          </Modal>
        </ModalOverlay>
      )}

      {showToast && <Toast>{toastMessage}</Toast>}
    </PageWrapper>
  );
};

export default RecentViewPage;
