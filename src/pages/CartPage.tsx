import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ItemName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
`;

const ItemPrice = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #87ceeb;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  background-color: #f5f5f5;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e5e5e5;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const RemoveButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #ff5252;
  }
`;

const CartSummary = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 1.1rem;
`;

const TotalRow = styled(SummaryRow)`
  font-size: 1.3rem;
  font-weight: bold;
  color: #87ceeb;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const CheckoutButton = styled(Link)`
  display: block;
  background-color: #87ceeb;
  color: white;
  text-align: center;
  padding: 15px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 20px;

  &:hover {
    opacity: 0.9;
  }
`;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const initialCart = [
  {
    id: "1",
    name: "프리미엄 스마트폰",
    option: "블랙 / 256GB",
    price: 1200000,
    discount: 10,
    quantity: 1,
    image:
      "https://readdy.ai/api/search-image?query=A%2520sleek%2520modern%2520smartphone%2520with%2520a%2520minimalist%2520design%252C%2520displayed%2520on%2520a%2520clean%2520white%2520background%2520with%2520subtle%2520shadows%252C%2520professional%2520product%2520photography%2520with%2520high%2520detail%2520and%2520clarity%252C%2520soft%2520lighting%2520highlighting%2520the%2520premium%2520features&width=120&height=120&seq=1&orientation=squarish",
  },
  {
    id: "2",
    name: "울트라 노트북",
    option: "실버 / 16GB / 512GB SSD",
    price: 1800000,
    discount: 5,
    quantity: 2,
    image:
      "https://readdy.ai/api/search-image?query=A%2520premium%2520ultrabook%2520laptop%2520with%2520thin%2520aluminum%2520body%252C%2520displayed%2520at%2520an%2520angle%2520on%2520a%2520clean%2520white%2520background%252C%2520professional%2520product%2520photography%2520with%2520soft%2520lighting%2520highlighting%2520the%2520sleek%2520design%2520and%2520keyboard&width=120&height=120&seq=2&orientation=squarish",
  },
  {
    id: "3",
    name: "프리미엄 헤드폰",
    option: "화이트 / 노이즈 캔슬링",
    price: 350000,
    discount: 15,
    quantity: 1,
    image:
      "https://readdy.ai/api/search-image?query=Premium%2520over-ear%2520headphones%2520with%2520luxurious%2520design%252C%2520displayed%2520on%2520a%2520clean%2520white%2520background%252C%2520professional%2520product%2520photography%2520with%2520soft%2520lighting%2520highlighting%2520the%2520cushioned%2520ear%2520cups%2520and%2520metallic%2520details&width=120&height=120&seq=3&orientation=squarish",
  },
];

const CartPage: React.FC = () => {
  const nav = useNavigate();
  const [cart, setCart] = useState(initialCart);
  const [selected, setSelected] = useState<number[]>(
    cart.map((item) => Number(item.id))
  );
  const [delivery, setDelivery] = useState({
    name: "",
    phone: "",
    zipcode: "",
    address: "",
    detail: "",
    request: "",
  });
  const [payMethod, setPayMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({ number: "", expire: "", cvc: "" });

  // 계산 함수
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = cart.reduce(
    (sum, item) => sum + item.price * (item.discount / 100) * item.quantity,
    0
  );
  const shipping = subtotal > 50000 ? 0 : 3000;
  const total = subtotal - discount + shipping;

  // 수량 변경
  const changeQty = (id: number, diff: number) => {
    setCart((cart) =>
      cart.map((item) =>
        Number(item.id) === id
          ? { ...item, quantity: Math.max(1, item.quantity + diff) }
          : item
      )
    );
  };
  // 삭제
  const removeItem = (id: number) => {
    setCart((cart) => cart.filter((item) => Number(item.id) !== id));
    setSelected((selected) => selected.filter((sid) => sid !== id));
  };
  // 선택
  const toggleSelect = (id: number) => {
    setSelected((selected) =>
      selected.includes(id)
        ? selected.filter((sid) => sid !== id)
        : [...selected, id]
    );
  };
  // 전체 선택
  const toggleAll = () => {
    setSelected(
      selected.length === cart.length ? [] : cart.map((item) => Number(item.id))
    );
  };

  return (
    <div
      style={{ background: "#f7fafc", minHeight: "100vh", padding: "40px 0" }}
    >
      <div
        style={{ maxWidth: 1300, margin: "0 auto", display: "flex", gap: 32 }}
      >
        {/* 중앙(왼쪽) 영역 */}
        <div style={{ flex: 2 }}>
          {/* 장바구니 카드 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 12px #e0e7ef",
              padding: 32,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 22,
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <input
                type="checkbox"
                checked={selected.length === cart.length}
                onChange={toggleAll}
                style={{ width: 18, height: 18, accentColor: "#60a5fa" }}
              />
              전체 선택 ({cart.length})
            </div>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #f1f5f9",
                  padding: "18px 0",
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(Number(item.id))}
                  onChange={() => toggleSelect(Number(item.id))}
                  style={{
                    width: 18,
                    height: 18,
                    accentColor: "#60a5fa",
                    marginRight: 18,
                  }}
                />
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 8,
                    objectFit: "cover",
                    marginRight: 18,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 14,
                      margin: "4px 0 8px 0",
                    }}
                  >
                    {item.option}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <button
                      onClick={() => changeQty(Number(item.id), -1)}
                      style={{
                        border: "1px solid #d1d5db",
                        borderRadius: 4,
                        width: 28,
                        height: 28,
                        background: "#f3f4f6",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => changeQty(Number(item.id), 1)}
                      style={{
                        border: "1px solid #d1d5db",
                        borderRadius: 4,
                        width: 28,
                        height: 28,
                        background: "#f3f4f6",
                        color: "#374151",
                        fontWeight: 700,
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 120 }}>
                  {item.discount > 0 && (
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 14,
                        textDecoration: "line-through",
                      }}
                    >
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: 18, color: "#222" }}>
                    {(
                      item.price *
                      (1 - item.discount / 100) *
                      item.quantity
                    ).toLocaleString()}
                    원
                  </div>
                  {item.discount > 0 && (
                    <div style={{ color: "#ef4444", fontSize: 13 }}>
                      {item.discount}% 할인
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeItem(Number(item.id))}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    fontSize: 18,
                    marginLeft: 18,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* 배송 정보 카드 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 12px #e0e7ef",
              padding: 32,
              marginBottom: 32,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>
              배송 정보
            </div>
            <div style={{ display: "flex", gap: 18, marginBottom: 16 }}>
              <input
                placeholder="받는 사람"
                value={delivery.name}
                onChange={(e) =>
                  setDelivery((d) => ({ ...d, name: e.target.value }))
                }
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: 15,
                }}
              />
              <input
                placeholder="연락처"
                value={delivery.phone}
                onChange={(e) =>
                  setDelivery((d) => ({ ...d, phone: e.target.value }))
                }
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: 15,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 18, marginBottom: 16 }}>
              <input
                placeholder="우편번호"
                value={delivery.zipcode}
                onChange={(e) =>
                  setDelivery((d) => ({ ...d, zipcode: e.target.value }))
                }
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: 15,
                }}
              />
              <input
                placeholder="주소"
                value={delivery.address}
                onChange={(e) =>
                  setDelivery((d) => ({ ...d, address: e.target.value }))
                }
                style={{
                  flex: 2,
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  fontSize: 15,
                }}
              />
            </div>
            <input
              placeholder="상세 주소"
              value={delivery.detail}
              onChange={(e) =>
                setDelivery((d) => ({ ...d, detail: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: 15,
                marginBottom: 16,
              }}
            />
            <input
              placeholder="배송 요청사항"
              value={delivery.request}
              onChange={(e) =>
                setDelivery((d) => ({ ...d, request: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontSize: 15,
              }}
            />
          </div>

          {/* 결제 방법 카드 */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 12px #e0e7ef",
              padding: 32,
              marginBottom: 32,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>
              결제 방법
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
              <button
                onClick={() => setPayMethod("card")}
                style={{
                  flex: 1,
                  background: payMethod === "card" ? "#e0f2fe" : "#f3f4f6",
                  color: payMethod === "card" ? "#60a5fa" : "#374151",
                  border: "1.5px solid #bae6fd",
                  borderRadius: 8,
                  padding: "14px 0",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                신용/체크카드
              </button>
              <button
                onClick={() => setPayMethod("bank")}
                style={{
                  flex: 1,
                  background: payMethod === "bank" ? "#e0f2fe" : "#f3f4f6",
                  color: payMethod === "bank" ? "#60a5fa" : "#374151",
                  border: "1.5px solid #bae6fd",
                  borderRadius: 8,
                  padding: "14px 0",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                무통장입금
              </button>
              <button
                onClick={() => setPayMethod("naver")}
                style={{
                  flex: 1,
                  background: payMethod === "naver" ? "#e0f2fe" : "#f3f4f6",
                  color: payMethod === "naver" ? "#60a5fa" : "#374151",
                  border: "1.5px solid #bae6fd",
                  borderRadius: 8,
                  padding: "14px 0",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                간편결제
              </button>
              <button
                onClick={() => setPayMethod("phone")}
                style={{
                  flex: 1,
                  background: payMethod === "phone" ? "#e0f2fe" : "#f3f4f6",
                  color: payMethod === "phone" ? "#60a5fa" : "#374151",
                  border: "1.5px solid #bae6fd",
                  borderRadius: 8,
                  padding: "14px 0",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                휴대폰결제
              </button>
            </div>
            {payMethod === "card" && (
              <div style={{ display: "flex", gap: 18 }}>
                <input
                  placeholder="카드 번호"
                  value={cardInfo.number}
                  onChange={(e) =>
                    setCardInfo((c) => ({ ...c, number: e.target.value }))
                  }
                  style={{
                    flex: 2,
                    padding: "10px 12px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    fontSize: 15,
                  }}
                />
                <input
                  placeholder="유효기간(MM/YY)"
                  value={cardInfo.expire}
                  onChange={(e) =>
                    setCardInfo((c) => ({ ...c, expire: e.target.value }))
                  }
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    fontSize: 15,
                  }}
                />
                <input
                  placeholder="CVC"
                  value={cardInfo.cvc}
                  onChange={(e) =>
                    setCardInfo((c) => ({ ...c, cvc: e.target.value }))
                  }
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    fontSize: 15,
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 우측 주문 요약 */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 12px #e0e7ef",
              padding: 32,
              marginBottom: 24,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 18 }}>
              주문 요약
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ color: "#64748b" }}>상품 금액</span>
              <span style={{ fontWeight: 600 }}>
                {subtotal.toLocaleString()}원
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ color: "#64748b" }}>할인 금액</span>
              <span style={{ color: "#ef4444", fontWeight: 600 }}>
                -{discount.toLocaleString()}원
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ color: "#64748b" }}>배송비</span>
              <span style={{ fontWeight: 600 }}>
                {shipping === 0 ? "무료" : `${shipping.toLocaleString()}원`}
              </span>
            </div>
            <div
              style={{ borderTop: "1px solid #e5e7eb", margin: "18px 0" }}
            ></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 18,
                fontWeight: 700,
                color: "#2563eb",
                marginBottom: 18,
              }}
            >
              <span>총 결제 금액</span>
              <span style={{ fontSize: 22 }}>{total.toLocaleString()}원</span>
            </div>
            <button onClick={ () => nav("/checkout?result=success") }
              style={{
                width: "100%",
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "14px 0",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 12,
                cursor: "pointer",
              }}
            >
              결제하기
            </button>
            <button
              style={{
                width: "100%",
                background: "#e5e7eb",
                color: "#374151",
                border: "none",
                borderRadius: 8,
                padding: "12px 0",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              계속 쇼핑하기
            </button>
            <div
              style={{
                background: "#f3f6fa",
                borderRadius: 8,
                padding: "14px 14px 10px 14px",
                color: "#64748b",
                fontSize: 14,
                marginTop: 18,
              }}
            >
              <b>안내사항</b>
              <br />
              50,000원 이상 구매 시 무료배송
              <br />
              결제 완료 후 배송이 시작됩니다.
              <br />
              문의: 고객센터 1234-5678
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 14, color: "#64748b" }}>
                <input type="checkbox" style={{ marginRight: 8 }} />위 내용을
                확인하였으며, 결제에 동의합니다.
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
