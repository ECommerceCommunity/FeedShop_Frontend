import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { PaymentItem } from "../../types/order";
import Fail from "../../components/modal/Fail";

// 스타일드 컴포넌트들
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SummarySection = styled.div`
  position: sticky;
  top: 20px;
  height: fit-content;
`;

const Card = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentMethodContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const PaymentMethodButton = styled.button<{ selected: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 8px;
  background: ${(props) => (props.selected ? "#eff6ff" : "#f9fafb")};
  color: ${(props) => (props.selected ? "#2563eb" : "#374151")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  @media (max-width: 768px) {
    flex: unset;
    width: 100%;
  }
`;

const PointContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #f9fafb;
`;

const PointInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
`;

const PointBalance = styled.span`
  font-weight: 600;
  color: #3b82f6;
`;

const PointInputContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const UseAllButton = styled.button`
  padding: 8px 12px;
  background: #e5e7eb;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #d1d5db;
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
  font-size: 14px;
`;

const TotalPrice = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #3b82f6;
  text-align: right;
  margin-bottom: 18px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(Button)<{ disabled?: boolean }>`
  background: ${({ disabled }) =>
    disabled ? "#a5b4fc" : "linear-gradient(90deg, #60a5fa, #3b82f6)"};
  color: #fff;
  margin-bottom: 12px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: #e5e7eb;
  color: #374151;

  &:hover {
    background: #d1d5db;
  }
`;

const Notice = styled.div`
  background: #f3f6fa;
  padding: 14px;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  margin-top: 16px;
  line-height: 1.5;
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  margin-top: 16px;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  gap: 8px;
`;

const ProductHeader = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
`;

const ProductPreview = styled.div`
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 28px;
  font-size: 14px;
  color: #374151;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ProductDetails = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const ProductPrice = styled.div`
  font-weight: 600;
  color: #3b82f6;
`;

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 관리
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [isAgree, setIsAgree] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("카드");
  const [usePoint, setUsePoint] = useState(false);
  const [usedPoints, setUsedPoints] = useState(0);
  const [availablePoints] = useState(5000); // 실제로는 API에서 가져와야 함
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
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setErrorModal] = useState(false);

  // 페이지 로드 시 주문 아이템 설정
  useEffect(() => {
    const state = location.state;

    if (!state) {
      setErrorMessage("잘못된 접근입니다.");
      setErrorModal(true);
      return;
    }

    let items: PaymentItem[] = [];

    try {
      // 장바구니에서 온 경우
      if (state.cartItems) {
        items = state.cartItems
          .filter((item: any) => item && item.productId)
          .map((item: any) => {
            return {
              id: `${item.productId}-${item.optionId}`,
              productName: item.productName,
              size: item.optionDetails?.size?.replace("SIZE_", "") || "",
              discountPrice: item.discountPrice,
              productPrice: item.productPrice,
              discount: item.productPrice - item.discountPrice,
              quantity: item.quantity,
              imageUrl: item.imageUrl,
              selected: item.selected,
            };
          });
      } else if (state.directOrder && state.product) {
        // 바로 주문인 경우 (DetailPage에서 온 경우)
        const { product, selectedOptions } = state;

        items = [
          {
            id: `${product.productId}-${selectedOptions?.optionId}`,
            productName: product.name,
            size: selectedOptions?.size?.replace("SIZE_", "") || "",
            discountPrice: product.discountPrice,
            productPrice: product.price,
            discount: product.price - product.discountPrice,
            quantity: selectedOptions.quantity,
            imageUrl: product.images[0]?.url,
            selected: true,
          },
        ];
      } else {
        throw new Error("지원하지 않는 주문 방식입니다.");
      }

      if (items.length === 0) {
        setErrorMessage("주문할 상품이 없습니다.");
        setErrorModal(true);
        return;
      }

      setItems(items);
    } catch (error: any) {
      setErrorMessage("주문 정보를 처리하는 중 오류가 발생했습니다.");
      setErrorModal(true);

      setTimeout(() => {
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate("/products");
        }
      }, 3000);
    }
  }, [location.state, navigate]);

  // 가격 포맷팅 함수
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 총합 계산 함수
  const calculateTotals = () => {
    const productTotal = items.reduce(
      (sum, item) => sum + item.discountPrice * item.quantity,
      0
    );
    const deliveryFee = productTotal >= 50000 ? 0 : 3000;
    const finalAmount = productTotal + deliveryFee - usedPoints;

    return {
      productTotal,
      deliveryFee,
      finalAmount,
      usedPoints,
    };
  };

  // 포인트 사용 변경 함수
  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value) || 0;

    // 100 단위로만 사용 가능
    if (numValue % 100 !== 0) {
      setErrorMessage("포인트는 100원 단위로만 사용 가능합니다.");
      setErrorModal(true);
      return;
    }

    const totals = calculateTotals();

    // 최대 사용 가능 포인트 체크 (구매금액의 10%)
    const maxUsablePoints = Math.floor(totals.productTotal * 0.1);
    if (numValue > maxUsablePoints) {
      setErrorMessage(
        `포인트는 구매금액의 10%인 ${maxUsablePoints.toLocaleString()}원까지만 사용 가능합니다.`
      );
      setErrorModal(true);
      return;
    }

    // 보유 포인트 체크
    if (numValue > availablePoints) {
      setErrorMessage("보유한 포인트가 부족합니다.");
      setErrorModal(true);
      return;
    }

    setUsedPoints(numValue);
  };

  // 전체 포인트 사용 함수
  const handleUseAllPoints = () => {
    const totals = calculateTotals();
    const maxUsablePoints = Math.floor(totals.productTotal * 0.1);
    const maxPoints = Math.min(availablePoints, maxUsablePoints);

    // 100원 단위로 맞춤
    const roundedPoints = Math.floor(maxPoints / 100) * 100;
    setUsedPoints(roundedPoints);
  };

  // 입력값 변경 함수
  const handleInputChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 유효성 검사 함수들
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  const validatePostalCode = (postalCode: string): boolean => {
    const postalRegex = /^[0-9]{5}$/;
    return postalRegex.test(postalCode);
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    const cardRegex = /^[0-9]{16}$/;
    return cardRegex.test(cardNumber);
  };

  const validateCardExpiry = (expiry: string): boolean => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) return false;

    const [month, year] = expiry.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const cardYear = parseInt(year);
    const cardMonth = parseInt(month);

    if (
      cardYear < currentYear ||
      (cardYear === currentYear && cardMonth < currentMonth)
    ) {
      return false;
    }

    return true;
  };

  const validateCVC = (cvc: string): boolean => {
    const cvcRegex = /^[0-9]{3}$/;
    return cvcRegex.test(cvc);
  };

  // 결제 처리 함수
  const handlePayment = async () => {
    // 필수 입력값 검증
    if (!shippingInfo.name.trim()) {
      setErrorMessage("받는 분 성함을 입력해주세요.");
      setErrorModal(true);
      return;
    }

    if (!validatePhoneNumber(shippingInfo.phone)) {
      setErrorMessage("올바른 휴대폰 번호를 입력해주세요. (예: 010-1234-5678)");
      setErrorModal(true);
      return;
    }

    if (!validatePostalCode(shippingInfo.zipcode)) {
      setErrorMessage("올바른 우편번호를 입력해주세요. (5자리 숫자)");
      setErrorModal(true);
      return;
    }

    if (!shippingInfo.address.trim()) {
      setErrorMessage("주소를 입력해주세요.");
      setErrorModal(true);
      return;
    }

    if (!shippingInfo.detailAddress.trim()) {
      setErrorMessage("상세 주소를 입력해주세요.");
      setErrorModal(true);
      return;
    }

    // 카드 결제일 때 카드 정보 검증
    if (selectedMethod === "카드") {
      if (!validateCardNumber(shippingInfo.cardNumber)) {
        setErrorMessage("올바른 카드번호를 입력해주세요. (16자리 숫자)");
        setErrorModal(true);
        return;
      }

      if (!validateCardExpiry(shippingInfo.cardExpiry)) {
        setErrorMessage("올바른 유효기간을 입력해주세요. (MM/YY)");
        setErrorModal(true);
        return;
      }

      if (!validateCVC(shippingInfo.cardCvv)) {
        setErrorMessage("올바른 CVC를 입력해주세요. (3자리 숫자)");
        setErrorModal(true);
        return;
      }
    }

    if (!isAgree) {
      setErrorMessage("주문 내용 확인 및 결제 동의가 필요합니다.");
      setErrorModal(true);
      return;
    }

    try {
      // 주문 데이터 생성
      const totals = calculateTotals();
      const orderId = generateRandomOrderId();

      const orderData = {
        orderId,
        status: "ORDERED",
        orderedAt: new Date().toISOString(),
        deliveryFee: totals.deliveryFee,
        totalPrice: totals.finalAmount,
        totalDiscountPrice: items.reduce(
          (sum, item) => sum + item.discount * item.quantity,
          0
        ),
        currency: "KRW",
        usedPoints: usedPoints,
        earnedPoints: Math.floor(totals.finalAmount * 0.01), // 1% 적립
        shippingInfo: {
          recipientName: shippingInfo.name,
          recipientPhone: shippingInfo.phone,
          postalCode: shippingInfo.zipcode,
          deliveryAddress: shippingInfo.address,
          deliveryDetailAddress: shippingInfo.detailAddress,
          deliveryMessage: shippingInfo.request,
        },
        paymentInfo: {
          paymentMethod: selectedMethod,
          cardNumber:
            selectedMethod === "카드" ? shippingInfo.cardNumber : null,
          cardExpiry:
            selectedMethod === "카드" ? shippingInfo.cardExpiry : null,
          cardCvc: selectedMethod === "카드" ? shippingInfo.cardCvv : null,
        },
        items: items,
        deletedAt: null,
      };

      // localStorage에 주문 정보 저장 (실제로는 서버에 전송)
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      existingOrders.push(orderData);
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      // 주문 완료 페이지로 이동
      navigate("/checkout", {
        state: { orderId },
      });
    } catch (error: any) {
      setErrorMessage("결제 처리 중 오류가 발생했습니다.");
      setErrorModal(true);
    }
  };

  // 랜덤 주문번호 생성 함수
  const generateRandomOrderId = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return 1000000 + (array[0] % 9000000); // 1000000 ~ 9999999
  };

  const totals = calculateTotals();

  return (
    <>
      {showErrorModal && (
        <Fail
          title="확인 필요"
          message={errorMessage}
          onClose={() => setErrorModal(false)}
        />
      )}

      <Container>
        <FormSection>
          <ProductHeader>구매 상품 정보</ProductHeader>
          {items.length === 0 ? (
            <ProductPreview>
              <div style={{ textAlign: "center", color: "#9ca3af" }}>
                상품 정보 로딩 중...
              </div>
            </ProductPreview>
          ) : (
            <ProductPreview>
              {items.map((item) => (
                <ProductItem key={item.id}>
                  <ProductInfo>
                    <ProductName>{item.productName}</ProductName>
                    <ProductDetails>
                      사이즈: {item.size} | 수량: {item.quantity}개
                    </ProductDetails>
                  </ProductInfo>
                  <ProductPrice>
                    {formatPrice(item.discountPrice * item.quantity)}원
                  </ProductPrice>
                </ProductItem>
              ))}
            </ProductPreview>
          )}

          {/* 배송 정보 */}
          <Card>
            <SectionTitle>배송 정보</SectionTitle>
            <FormGroup>
              <Label>받는 분 성함 *</Label>
              <Input
                type="text"
                placeholder="성함을 입력해주세요"
                value={shippingInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>휴대폰 번호 *</Label>
              <Input
                type="text"
                placeholder="010-1234-5678"
                value={shippingInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>주소 *</Label>
              <Row>
                <Input
                  type="text"
                  placeholder="우편번호 (5자리)"
                  value={shippingInfo.zipcode}
                  onChange={(e) => handleInputChange("zipcode", e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="주소"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </Row>
              <Input
                type="text"
                placeholder="상세 주소"
                value={shippingInfo.detailAddress}
                onChange={(e) =>
                  handleInputChange("detailAddress", e.target.value)
                }
                style={{ marginTop: "8px" }}
              />
            </FormGroup>

            <FormGroup>
              <Label>배송 요청사항</Label>
              <TextArea
                placeholder="배송 시 요청사항을 입력해주세요"
                value={shippingInfo.request}
                onChange={(e) => handleInputChange("request", e.target.value)}
              />
            </FormGroup>
          </Card>

          {/* 포인트 사용 */}
          <Card>
            <SectionTitle>포인트 사용</SectionTitle>
            <PointContainer>
              <PointInfo>
                <span>보유 포인트</span>
                <PointBalance>{formatPrice(availablePoints)}P</PointBalance>
              </PointInfo>
              <PointInputContainer>
                <Input
                  type="number"
                  placeholder="사용할 포인트"
                  value={usedPoints || ""}
                  onChange={(e) => handlePointsChange(e.target.value)}
                  min="0"
                  step="100"
                />
                <UseAllButton onClick={handleUseAllPoints}>
                  전액 사용
                </UseAllButton>
              </PointInputContainer>
              <div
                style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}
              >
                * 100원 단위로 사용 가능하며, 구매금액의 10%까지 사용할 수
                있습니다.
              </div>
            </PointContainer>
          </Card>

          {/* 결제 수단 */}
          <Card>
            <SectionTitle>결제 수단</SectionTitle>
            <PaymentMethodContainer>
              {["카드", "무통장입금", "간편결제", "휴대폰결제"].map(
                (method) => (
                  <PaymentMethodButton
                    key={method}
                    selected={selectedMethod === method}
                    onClick={() => setSelectedMethod(method)}
                  >
                    {method}
                  </PaymentMethodButton>
                )
              )}
            </PaymentMethodContainer>

            {/* 카드 결제 시 추가 정보 */}
            {selectedMethod === "카드" && (
              <div style={{ marginTop: "16px" }}>
                <FormGroup>
                  <Label>카드번호 *</Label>
                  <Input
                    type="text"
                    placeholder="1234567890123456"
                    value={shippingInfo.cardNumber}
                    onChange={(e) =>
                      handleInputChange("cardNumber", e.target.value)
                    }
                    maxLength={16}
                  />
                </FormGroup>
                <Row>
                  <FormGroup>
                    <Label>유효기간 *</Label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={shippingInfo.cardExpiry}
                      onChange={(e) =>
                        handleInputChange("cardExpiry", e.target.value)
                      }
                      maxLength={5}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>CVC *</Label>
                    <Input
                      type="text"
                      placeholder="123"
                      value={shippingInfo.cardCvv}
                      onChange={(e) =>
                        handleInputChange("cardCvv", e.target.value)
                      }
                      maxLength={3}
                    />
                  </FormGroup>
                </Row>
              </div>
            )}
          </Card>
        </FormSection>

        {/* 주문 요약 */}
        <SummarySection>
          <SummaryCard>
            <SectionTitle>결제 정보</SectionTitle>
            <SummaryRow>
              <span>상품금액</span>
              <span>{formatPrice(totals.productTotal)}원</span>
            </SummaryRow>
            <SummaryRow>
              <span>배송비</span>
              <span>
                {totals.deliveryFee === 0
                  ? "무료"
                  : `${formatPrice(totals.deliveryFee)}원`}
              </span>
            </SummaryRow>
            <SummaryRow>
              <span>포인트 사용</span>
              <span>-{formatPrice(usedPoints)}원</span>
            </SummaryRow>
            <TotalPrice>
              총 결제금액: {formatPrice(totals.finalAmount)}원
            </TotalPrice>

            <PrimaryButton
              onClick={handlePayment}
              disabled={items.length === 0 || !isAgree}
            >
              {items.length === 0 ? "상품 정보 로딩 중..." : "결제하기"}
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate("/products")}>
              계속 쇼핑하기
            </SecondaryButton>

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
              />
              주문 내용을 확인하였으며, 결제에 동의합니다.
            </CheckLabel>
          </SummaryCard>
        </SummarySection>
      </Container>
    </>
  );
};

export default PaymentPage;
