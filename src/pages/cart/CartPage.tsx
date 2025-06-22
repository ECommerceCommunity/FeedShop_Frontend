import { FC, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 16px;
  }
`;
const CartSection = styled.div` 
  flex: 2;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const SummarySection = styled.div` 
  flex: 1; 
  min-width: 320px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
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

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;
const ItemImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 18px;

  @media (max-width: 768px) {
    margin-right: 0;
    width: 100%;
    height: auto;
  }
`;
const ItemInfo = styled.div` 
  flex: 1;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const ItemName = styled.div` font-weight: 600; font-size: 17px; `;
const ItemOption = styled.div` color: #64748b; font-size: 14px; margin: 4px 0 8px 0; `;
const QtyControl = styled.div` display: flex; align-items: center; gap: 8px; `;
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
  
  @media (max-width: 768px) {
    text-align: left;
  }
`;
const Discount = styled.div` color: #ef4444; font-size: 13px; `;
const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 18px;
  margin-left: 18px;
  cursor: pointer;
`;
const SummaryCard = styled(Card)` margin-bottom: 24px; `;
const SummaryRow = styled.div` display: flex; justify-content: space-between; margin-bottom: 10px; `;
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

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 12px 0;
  }
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

  @media (max-width: 768px) {
    font-size: 14px;
  }
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
  cursor: pointer;
`;

const StyledCheckbox = styled.input`
  margin-right: 12px;
`;

interface IProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  detail_image_urls: string[];
  main_image_urls: string[];
  gender: string;
  price: string;
  quantity: number;
  product_likes: number;
  store_id: number;
  image: string;
}

interface IDiscounts {
  product_id: number;
  discount_type: string;
  discount_value: number;
  discount_start: string;
  discount_end: string;
}

const CartPage: FC = () => {
  const [cart, setCart] = useState<IProduct[]>([]);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [discounts, setDiscounts] = useState<IDiscounts[]>([]);
  const [isAgree, setIsAgree] = useState(false);

  const nav = useNavigate();

  useEffect(() => {

    // cart 데이터 가져오기
    const jsonCart = localStorage.getItem("cart");
    if (jsonCart) {
      const parsedCart = JSON.parse(jsonCart);
      setCart(parsedCart);
      setCheckedItems(parsedCart.map((item: IProduct) => item.id));
    }

    // discounts 데이터 가져오기
    const jsonDiscounts = localStorage.getItem("discounts");
    if (jsonDiscounts) {
      setDiscounts(JSON.parse(jsonDiscounts));
    }

  }, []);

  useEffect(() => {

    // product 데이터 가져오기
    const jsonProduct = localStorage.getItem("product");
    if (!jsonProduct) {
      return;
    }

    const product: IProduct = JSON.parse(jsonProduct);
    product.quantity = 1; // quantity 데이터가 없어서 일단 1로 하드 코딩.

    setCart((cart) => {
      const existing = cart.find((item) => item.id === product.id);
      const updated = existing
        ? cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
        : [...cart, product];

      localStorage.setItem("cart", JSON.stringify(updated));

      setCheckedItems((prev) => {
        if (existing) return prev;
        return [...prev, product.id];
      });

      return updated;
    });
    // discounts 데이터 가져오기
    const jsonDiscounts = localStorage.getItem("discounts");
    if (jsonDiscounts) {
      setDiscounts(JSON.parse(jsonDiscounts));
    }

    localStorage.removeItem("product");
  }, []);

  // price parsing => 꼭 필요한지 ?
  const parsePrice = (price: string | number | null | undefined): number => {
    if (typeof price === 'string') {
      return Number(price.replace(/[원,]/g, ''));
    }
    if (typeof price === 'number') {
      return price;
    }
    return 0; // fallback
  };

  const findDiscount = (product: IProduct): IDiscounts | null => {
    return discounts.find((discount) => discount.product_id === product.id) || null;
  };

  const getDiscountedPrice = (product: IProduct): number => {
    const original = parsePrice(product.price);

    const discount = findDiscount(product);
    if (!discount) {
      return original;
    }

    return discount.discount_type === "정률"
      ? original * ((100 - discount.discount_value) / 100)
      : original - discount.discount_value;
  };

  const subtotal = cart.reduce((sum, item) => {
    if (!checkedItems.includes(item.id)) return sum;
    return sum + parsePrice(item.price) * item.quantity;
  }, 0);

  const totalDiscount = cart.reduce((sum, item) => {
    if (!checkedItems.includes(item.id)) {
      return sum;
    }
    const discount = findDiscount(item);
    if (!discount) {
      return sum;
    }

    const original = parsePrice(item.price);
    const discounted = getDiscountedPrice(item);
    return sum + (original - discounted) * item.quantity;
  }, 0);

  const subdiscount = `${totalDiscount.toLocaleString()}원`;
  const shipping = subtotal - totalDiscount > 50000 ? 0 : 3000;
  const total = subtotal - totalDiscount + shipping;

  const handleCheckout = () => {
    if (!isAgree) {
      alert("주문 동의에 체크해 주세요.");
      return;
    }

    const selectedProducts = cart.filter((item) => checkedItems.includes(item.id));
    nav("/payment", { state: { products: selectedProducts } });
  };

  const changeQuantity = (id: number, diff: number) => {
    const updateCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + diff) } : item
    );
    setCart(updateCart);
    localStorage.setItem("cart", JSON.stringify(updateCart));
  };

  const removeItem = (id: number) => {
    const updateCart = cart.filter((item) => item.id !== id);
    setCart(updateCart);
    setCheckedItems((cart) => cart.filter((itemId) => itemId !== id));
    localStorage.setItem("cart", JSON.stringify(updateCart));
  };

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setCheckedItems(cart.map((item) => item.id));
    } else {
      setCheckedItems([]);
    }
  };

  const toggleItem = (id: number) => {
    setCheckedItems((cart) =>
      cart.includes(id) ? cart.filter((i) => i !== id) : [...cart, id]
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
              checked={checkedItems.length === cart.length && cart.length > 0}
              onChange={(e) => toggleAll(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            전체 선택 ({checkedItems.length}/{cart.length})
          </label>
          {cart.map((item) => {
            const discountedPrice = getDiscountedPrice(item);
            const discount = findDiscount(item);
            const originalTotal = parsePrice(item.price) * item.quantity;
            const discountedTotal = discountedPrice * item.quantity;
            let discountLabel = "";
            if (discount) {
              if (discount.discount_type === "정률") {
                discountLabel = `${discount.discount_value}% 할인`;
              } else {
                discountLabel = `${discount.discount_value.toLocaleString()}원 할인`;
              }
            }
            return (
              <ItemRow key={item.id}>
                <StyledCheckbox
                  type="checkbox"
                  checked={checkedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  title={`${item.name} 선택`}
                />
                <ItemImage src={item.image} alt={item.name} />
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemOption>{item.category}</ItemOption>
                  <QtyControl>
                    <QtyButton onClick={() => changeQuantity(item.id, -1)}>-</QtyButton>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{item.quantity}</span>
                    <QtyButton onClick={() => changeQuantity(item.id, 1)}>+</QtyButton>
                  </QtyControl>
                </ItemInfo>
                <PriceBox>
                  <div style={{ color: "#94a3b8", fontSize: 14, textDecoration: "line-through" }}>
                    {originalTotal.toLocaleString()}원
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#222" }}>
                    {discountedTotal.toLocaleString()}원
                  </div>
                  {discountLabel && <Discount>{discountLabel}</Discount>}
                </PriceBox>
                <RemoveButton onClick={() => removeItem(item.id)}>×</RemoveButton>
              </ItemRow>
            );
          })}
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
            <span style={{ color: "#ef4444", fontWeight: 600 }}>-{subdiscount}</span>
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
          <ContinueButton onClick={() => nav('/products')}>계속 쇼핑하기</ContinueButton>
          <Notice>
            <b>안내사항</b>
            <br />
            50,000원 이상 구매 시 무료배송<br />
            결제 완료 후 배송이 시작됩니다.<br />
            문의: 고객센터 1234-5678
          </Notice>
          <CheckLabel htmlFor="agree-checkbox">
            <StyledCheckbox
              id="agree-checkbox"
              type="checkbox"
              checked={isAgree}
              onChange={(e) => setIsAgree(e.target.checked)}
              title="구매 동의 체크박스"
            />
            주문 내용을 확인하였으며, 구매에 동의합니다.
          </CheckLabel>
        </SummaryCard>
      </SummarySection>
    </Container>
  );
};

export default CartPage;