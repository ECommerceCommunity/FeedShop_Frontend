import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  display: flex;
  gap: 32px;
`;

const CartSection = styled.div`
  flex: 2;
`;

const SummarySection = styled.div`
  flex: 1;
  min-width: 320px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px #e0e7ef;
  padding: 32px;
  margin-bottom: 32px;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  padding: 18px 0;
`;

const ItemImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 18px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  font-size: 17px;
`;

const ItemOption = styled.div`
  color: #64748b;
  font-size: 14px;
  margin: 4px 0 8px 0;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QtyButton = styled.button`
  border: 1px solid #d1d5db;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  background: #f3f4f6;
  color: #374151;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
`;

const PriceBox = styled.div`
  text-align: right;
  min-width: 120px;
`;

const Discount = styled.div`
  color: #ef4444;
  font-size: 13px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 18px;
  margin-left: 18px;
  cursor: pointer;
`;

const SummaryCard = styled(Card)`
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 18px;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 0;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 12px;
  cursor: pointer;
`;

const ContinueButton = styled.button`
  width: 100%;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
`;

const Notice = styled.div`
  background: #f3f6fa;
  border-radius: 8px;
  padding: 14px 14px 10px 14px;
  color: #64748b;
  font-size: 14px;
  margin-top: 18px;
`;

const CheckLabel = styled.label`
  font-size: 14px;
  color: #64748b;
  margin-top: 14px;
  display: block;
`;

interface CartItem {
  id: string;
  name: string;
  option: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
  image: string;
}

// const initialCart: CartItem[] = [
//   {
//     id: "1",
//     name: "프리미엄 스마트폰",
//     option: "블랙 / 256GB",
//     price: 1080000,
//     originalPrice: 1200000,
//     discount: 10,
//     quantity: 1,
//     image: "https://via.placeholder.com/100",
//   },
//   {
//     id: "2",
//     name: "울트라 노트북",
//     option: "실버 / 16GB / 512GB SSD",
//     price: 1710000,
//     originalPrice: 1800000,
//     discount: 5,
//     quantity: 2,
//     image: "https://via.placeholder.com/100",
//   },
//   {
//     id: "3",
//     name: "프리미엄 헤드폰",
//     option: "화이트 / 노이즈 캔슬링",
//     price: 297500,
//     originalPrice: 350000,
//     discount: 15,
//     quantity: 1,
//     image: "https://via.placeholder.com/100",
//   },
// ];

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsed: CartItem[] = JSON.parse(savedCart);
      setCart(parsed);
      setCheckedItems(parsed.map(item => item.id));
    }
  }, [location.key]); // 경로 변경 시 마다 다시 실행

  const selectedItems = cart.filter(item => checkedItems.includes(item.id));

  const subtotal = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const discount = selectedItems.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
  const shipping = subtotal - discount > 50000 ? 0 : 3000;
  const total = subtotal - discount + shipping;

  const handleCheckout = () => {
    nav("/payment", {
      state: {
        products: selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
          option: item.option,
          price: item.price,
          original_price: item.originalPrice,
          quantity: item.quantity,
        })),
      },
    });
  };

  const changeQty = (id: string, diff: number) => {
    setCart((cart) =>
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + diff) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart((cart) => cart.filter((item) => item.id !== id));
    setCheckedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const toggleAll = (checked: boolean) => {
    setCheckedItems(checked ? cart.map((item) => item.id) : []);
  };

  const toggleItem = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <Container>
      <CartSection>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontWeight: 700, fontSize: 22 }}>장바구니</div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={checkedItems.length === cart.length}
              onChange={(e) => toggleAll(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            전체 선택 ({checkedItems.length}/{cart.length})
          </label>
          {cart.map((item) => (
            <ItemRow key={item.id}>
              <input
                type="checkbox"
                checked={checkedItems.includes(item.id)}
                onChange={() => toggleItem(item.id)}
                style={{ marginRight: 12 }}
              />
              <ItemImage src={item.image} alt={item.name} />
              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemOption>{item.option}</ItemOption>
                <QtyControl>
                  <QtyButton onClick={() => changeQty(item.id, -1)}>-</QtyButton>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{item.quantity}</span>
                  <QtyButton onClick={() => changeQty(item.id, 1)}>+</QtyButton>
                </QtyControl>
              </ItemInfo>
              <PriceBox>
                <div style={{ color: "#94a3b8", fontSize: 14, textDecoration: "line-through" }}>
                  {item.originalPrice.toLocaleString()}원
                </div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#222" }}>
                  {(item.price * item.quantity).toLocaleString()}원
                </div>
                <Discount>{item.discount}% 할인</Discount>
              </PriceBox>
              <RemoveButton onClick={() => removeItem(item.id)}>×</RemoveButton>
            </ItemRow>
          ))}
        </Card>
      </CartSection>
      <SummarySection>
        <SummaryCard>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>주문 요약</div>
          <SummaryRow>
            <span style={{ color: "#64748b" }}>상품 금액</span>
            <span style={{ fontWeight: 600 }}>{subtotal.toLocaleString()}원</span>
          </SummaryRow>
          <SummaryRow>
            <span style={{ color: "#64748b" }}>할인 금액</span>
            <span style={{ color: "#ef4444", fontWeight: 600 }}>-{discount.toLocaleString()}원</span>
          </SummaryRow>
          <SummaryRow>
            <span style={{ color: "#64748b" }}>배송비</span>
            <span style={{ fontWeight: 600 }}>{shipping === 0 ? "무료" : `${shipping.toLocaleString()}원`}</span>
          </SummaryRow>
          <div style={{ borderTop: "1px solid #e5e7eb", margin: "18px 0" }}></div>
          <TotalRow>
            <span>총 결제 금액</span>
            <span style={{ fontSize: 22 }}>{total.toLocaleString()}원</span>
          </TotalRow>
          <CheckoutButton onClick={handleCheckout}>구매하기</CheckoutButton>
          <ContinueButton onClick={() => nav('/')}>계속 쇼핑하기</ContinueButton>
          <Notice>
            <b>안내사항</b>
            <br />
            50,000원 이상 구매 시 무료배송<br />
            결제 완료 후 배송이 시작됩니다.<br />
            문의: 고객센터 1234-5678
          </Notice>
          <CheckLabel>
            <input type="checkbox" style={{ marginRight: 8 }} />
            주문 내용을 확인하였으며, 결제에 동의합니다.
          </CheckLabel>
        </SummaryCard>
      </SummarySection>
    </Container>
  );
};

export default CartPage;
