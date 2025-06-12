import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.div`
  max-width: 1100px;
  margin: 40px auto;
  display: flex;
  gap: 32px;
`;

const FormSection = styled.div`
  flex: 2;
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
`;

const SummarySection = styled.div`
  flex: 1;
`;

const SectionTitle = styled.h3`
  margin-bottom: 16px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-width: 200px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const PaymentButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 2px solid ${(props) => (props.selected ? '#3b82f6' : '#e5e7eb')};
  background: ${(props) => (props.selected ? '#eff6ff' : '#f9fafb')};
  color: ${(props) => (props.selected ? '#2563eb' : '#374151')};
  font-weight: 600;
  cursor: pointer;
`;

const SummaryCard = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const TotalPrice = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #3b82f6;
  text-align: right;
  margin-bottom: 18px;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
  color: #fff;
  margin-bottom: 12px;
`;

const SecondaryButton = styled(Button)`
  background: #e5e7eb;
  color: #374151;
`;

const Notice = styled.div`
  background: #f3f6fa;
  padding: 14px;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  margin-top: 16px;
`;

const CheckLabel = styled.label`
  display: block;
  margin-top: 16px;
  color: #64748b;
  font-size: 14px;
`;

const ProductHeader = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
`;

const ProductPreview = styled.div`
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #374151;
`;

interface Product {
  id: string;
  name: string;
  option?: string;
  price: number;
  original_price: number;
  quantity: number;
}

const fallbackCart: Product[] = [
  {
    id: "1",
    name: "프리미엄 스마트폰",
    option: "블랙 / 256GB",
    price: 1080000,
    original_price: 1100000,
    quantity: 1,
  },
  {
    id: "2",
    name: "울트라 노트북",
    option: "실버 / 16GB / 512GB SSD",
    price: 3420000,
    original_price: 3520000,
    quantity: 2,
  },
  {
    id: "3",
    name: "프리미엄 헤드폰",
    option: "화이트 / 노이즈 캔슬링",
    price: 297500,
    original_price: 299000,
    quantity: 1,
  },
];

const PaymentPage: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const products: Product[] = location.state?.products || fallbackCart;
  const totalQty = products.reduce((sum, item) => sum + item.quantity, 0);
  const totalOriginalPrice = products.reduce(
    (sum, item) => sum + (item.original_price || item.price) * item.quantity,
    0
  );

  const onClickPayment = () => {
    nav('/checkout?result=success')
  }
  
  const totalDiscount = products.reduce(
    (sum, item) =>
      sum + ((item.original_price || item.price) - item.price) * item.quantity,
    0
  );
  
  const totalPrice = totalOriginalPrice - totalDiscount;

  const [selectedMethod, setSelectedMethod] = useState("카드");

  return (
    <Container>
      <FormSection>
        <ProductHeader>구매 상품 정보</ProductHeader>
        <ProductPreview>
          {products.map(product => (
            <div key={product.id}>
              {product.name} {product.option ? `(${product.option})` : ''} × {product.quantity}개
            </div>
          ))}
        </ProductPreview>
        <SectionTitle>배송 정보</SectionTitle>
        <InputRow>
          <Input placeholder="이름을 입력하세요" />
          <Input placeholder="연락처를 입력하세요" />
        </InputRow>
        <InputRow>
          <Input placeholder="우편번호" />
          <Button style={{ maxWidth: 120 }}>우편번호 검색</Button>
        </InputRow>
        <InputRow>
          <Input style={{ marginBottom: 16 }} placeholder="기본 주소" />
          <Input style={{ marginBottom: 16 }} placeholder="상세 주소를 입력하세요" />
        </InputRow>
        <Select>
          <option>배송 요청사항을 선택하세요</option>
          <option>문 앞에 두고 벨 눌러주세요</option>
          <option>경비실에 맡겨주세요</option>
        </Select>

        <SectionTitle>결제 방법</SectionTitle>
        <PaymentMethods>
          {['카드', '무통장입금', '간편결제', '휴대폰결제'].map((method) => (
            <PaymentButton
              key={method}
              onClick={() => setSelectedMethod(method)}
              selected={selectedMethod === method}
            >
              {method}
            </PaymentButton>
          ))}
        </PaymentMethods>

        {selectedMethod === "카드" && (
          <>
            <Input style={{ marginBottom: 16 }} placeholder="카드 번호" />
            <InputRow>
              <Input placeholder="MM/YY" />
              <Input placeholder="CVV" />
            </InputRow>
          </>
        )}
      </FormSection>

      <SummarySection>
        <SummaryCard>
          <h4 style={{ marginBottom: 18 }}>주문 요약</h4>
          <SummaryRow>
          <span>상품 금액</span>
          <span>{totalOriginalPrice.toLocaleString()}원</span>
          </SummaryRow>
          <SummaryRow>
          <span>할인 금액</span>
          <span style={{ color: "#ef4444" }}>-{totalDiscount.toLocaleString()}원</span>
          </SummaryRow>
          <SummaryRow>
          <span>배송비</span>
          <span>무료</span>
          </SummaryRow>
          <hr style={{ margin: "16px 0" }} />
          <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>
          <PrimaryButton onClick={onClickPayment}>결제하기</PrimaryButton>
          <SecondaryButton onClick={() => nav('/')}>계속 쇼핑하기</SecondaryButton>
          <Notice>
            <b>안내사항</b><br />
            50,000원 이상 구매 시 배송비 무료<br />
            주문 완료 후 배송 조회는 마이페이지에서 가능합니다.<br />
            무통장입금은 입금 확인 후 배송이 시작됩니다.
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

export default PaymentPage;