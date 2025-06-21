import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.div`
  max-width: 1100px;
  margin: 40px auto;
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
  }
`;

const FormSection = styled.div`
  flex: 2;
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SummarySection = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    margin-top: 24px;
  }
`;

const SectionTitle = styled.h3`
  margin-bottom: 16px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
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

  @media (max-width: 768px) {
    flex-direction: column;
  }
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

  @media (max-width: 768px) {
    flex: unset;
    width: 100%;
  }
`;

const SummaryCard = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  margin-bottom: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
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

const PrimaryButton = styled(Button)<{ disabled?: boolean }>`
  background: ${({ disabled }) => disabled ? '#a5b4fc' : 'linear-gradient(90deg, #60a5fa, #3b82f6)'};
  color: #fff;
  margin-bottom: 12px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
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
  cursor: pointer;
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
}

const PaymentPage: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const products: IProduct[] = location.state?.products ?? [];
  const [isAgree, setIsAgree] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("카드");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    zipcode: "",
    address: "",
    detailAddress: "",
    request: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  }

  const parsePrice = (price: string) => Number(price.replace(/[원,]/g, ""));

  const totalOriginalPrice = products.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );

  const totalDiscount = 0; // 할인 정보는 넘어오지 않았으므로 생략 또는 향후 적용
  const shipping = totalOriginalPrice - totalDiscount > 50000 ? 0 : 3000;
  const totalPrice = totalOriginalPrice - totalDiscount + shipping;

  const onClickPayment = () => {
    if (!isAgree) {
      alert("결제 동의에 체크해 주세요.");
      return;
    }

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.detailAddress) {
      alert("배송 정보를 입력해 주세요.");
      return;
    }
    if (selectedMethod === "카드" &&
      (!shippingInfo.cardNumber || !shippingInfo.cardExpiry || !shippingInfo.cardCvv)) {
        alert("카드 정보를 모두 입력해 주세요.");
      return; 
  }

    nav("/checkout?result=success", {
      state: {
        products,
        totalPrice,
        shipping,
        selectedMethod,
        shippingInfo
      }
    });
  };

  return (
    <Container>
      <FormSection>
        <ProductHeader>구매 상품 정보</ProductHeader>
        <ProductPreview>
          {products.map((product) => (
            <div key={product.id}>
              {product.name} × {product.quantity}개
            </div>
          ))}
        </ProductPreview>

        <SectionTitle>배송 정보</SectionTitle>
        <InputRow>
          <Input name="name" value={shippingInfo.name} onChange={handleDeliveryChange} placeholder="이름을 입력하세요" />
          <Input name="phone" value={shippingInfo.phone} onChange={handleDeliveryChange} placeholder="연락처를 입력하세요" />
        </InputRow>
        <InputRow>
          <Input name="zipcode" value={shippingInfo.zipcode} onChange={handleDeliveryChange} placeholder="우편번호" />
          <Button style={{ maxWidth: 120 }}>우편번호 검색</Button>
        </InputRow>
        <InputRow>
          <Input name="address" value={shippingInfo.address} onChange={handleDeliveryChange} placeholder="기본 주소" />
          <Input name="detailAddress" value={shippingInfo.detailAddress} onChange={handleDeliveryChange} placeholder="상세 주소를 입력하세요" />
        </InputRow>
        <Select name="request" value={shippingInfo.request} onChange={handleDeliveryChange}>
          <option value="">배송 요청사항을 선택하세요</option>
          <option value="문 앞에 두고 벨 눌러주세요">문 앞에 두고 벨 눌러주세요</option>
          <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
        </Select>

        <SectionTitle>결제 방법</SectionTitle>
        <PaymentMethods>
          {["카드", "무통장입금", "간편결제", "휴대폰결제"].map((method) => (
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
            <Input name="cardNumber" placeholder="카드 번호" onChange={handleDeliveryChange}/>
            <InputRow>
              <Input name="cardExpiry" placeholder="MM/YY" onChange={handleDeliveryChange}/>
              <Input name="cardCvv" placeholder="CVV" maxLength={3} onChange={handleDeliveryChange} />
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
            <span>{shipping === 0 ? "무료" : `${shipping.toLocaleString()}원`}</span>
          </SummaryRow>
          <hr style={{ margin: "16px 0" }} />
          <TotalPrice>{totalPrice.toLocaleString()}원</TotalPrice>

          <PrimaryButton onClick={onClickPayment} disabled={!isAgree}>
            결제하기
          </PrimaryButton>
          <SecondaryButton onClick={() => nav("/products")}>계속 쇼핑하기</SecondaryButton>

          <Notice>
            <b>안내사항</b>
            <br />
            50,000원 이상 구매 시 배송비 무료
            <br />
            주문 완료 후 배송 조회는 마이페이지에서 가능합니다.
            <br />
            무통장입금은 입금 확인 후 배송이 시작됩니다.
          </Notice>

          <CheckLabel>
            <input
              type="checkbox"
              checked={isAgree}
              onChange={(e) => setIsAgree(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            주문 내용을 확인하였으며, 결제에 동의합니다.
          </CheckLabel>
        </SummaryCard>
      </SummarySection>
    </Container>
  );
};

export default PaymentPage;
