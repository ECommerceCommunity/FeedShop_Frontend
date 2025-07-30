import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { PaymentItem } from "types/order";
import Fail from "components/modal/Fail";
import { toUrl } from "utils/images";

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  display: flex;
  gap: 32px;
  padding: 0 20px;
  min-height: calc(100vh - 120px);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
    margin: 20px auto;
  }
`;

const FormSection = styled.div`
  flex: 2;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 16px;
  }
`;

const SummarySection = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    margin-top: 24px;
  }
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  margin-top: 32px;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
  position: relative;

  &:first-child {
    margin-top: 0;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 1px;
  }
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
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  min-width: 200px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #ffffff;
  }

  &::placeholder {
    color: #9ca3af;
  }
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
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e5e7eb")};
  background: ${(props) => (props.selected ? "#eff6ff" : "#f9fafb")};
  color: ${(props) => (props.selected ? "#2563eb" : "#374151")};
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
  background: ${({ disabled }) =>
    disabled ? "#a5b4fc" : "linear-gradient(90deg, #60a5fa, #3b82f6)"};
  color: #fff;
  margin-bottom: 12px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
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

const PaymentPage: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [isAgree, setIsAgree] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("카드");
  const [usePoint, setUsePoint] = useState(false);
  const [usedPoints, setUsedPoints] = useState(0);
  const [availablePoints] = useState(5000); // 실제로는 API에서 가져와야 한다.
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
              size: item.optionDetails?.size?.replace("SIZE_", ""),
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
            size: selectedOptions?.size?.replace("SIZE_", ""),
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
          nav(-1);
        } else {
          nav("/products");
        }
      }, 3000);
    }
  }, [location.state, nav]);

  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value);

    // 100 단위로만 사용 가능하다.
    if (numValue % 100 !== 0) {
      setErrorMessage("포인트는 100원 단위로만 사용 가능합니다.");
      setErrorModal(true);
      return;
    }

    const totals = calculateTotals();

    // 최대 사용 가능 포인트 체크 (구매금액의 10%)
    const maxUsablePoints = Math.floor(totals.finalAmount * 0.1);
    if (numValue > maxUsablePoints) {
      setErrorMessage(
        `포인트는 구매금액의 10%인 ${maxUsablePoints.toLocaleString()}원까지만 사용 가능합니다.`
      );
      setErrorModal(true);
      return;
    }

    // 보유 포인트를 체크한다.
    if (numValue > availablePoints) {
      setErrorMessage(
        `보유 포인트가 부족합니다. (보유: ${availablePoints.toLocaleString()}원)`
      );
      setErrorModal(true);
      return;
    }

    setUsedPoints(numValue);
  };

  const calculateTotals = () => {
    const subtotal = totalOriginalPrice;
    const discount = totalDiscount;
    const finalAmount = subtotal - discount;
    const deliveryFee = shipping;

    // 사용 가능한 포인트는 구매금액의 10%까지
    const maxUsablePoints = Math.floor(finalAmount * 0.1);
    const actualUsedPoints = Math.min(
      usedPoints,
      maxUsablePoints,
      availablePoints
    );

    const totalAmount = finalAmount - actualUsedPoints + deliveryFee;

    return {
      subtotal,
      discount,
      finalAmount,
      deliveryFee,
      totalAmount,
      actualUsedPoints,
      maxUsablePoints,
    };
  };

  const handleDeliveryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const totalOriginalPrice = items.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  const totalDiscount = items.reduce(
    (sum, item) =>
      sum + (item.productPrice - item.discountPrice * item.quantity),
    0
  );

  // 배송비 계산 (50,000원 이상 무료배송)
  const shipping = totalOriginalPrice - totalDiscount >= 50000 ? 0 : 3000;

  const totals = calculateTotals();
  const finalPaidAmount = totals.totalAmount;
  const earnedPoints = Math.floor(finalPaidAmount / 10000) * 50;

  const onClickPayment = () => {
    if (!isAgree) {
      setErrorMessage("결제 동의에 체크해 주세요.");
      setErrorModal(true);
      return;
    }

    // 배송 정보 검증
    if (!shippingInfo.name?.trim()) {
      setErrorMessage("받는 분 이름을 입력해주세요.");
      setErrorModal(true);
      return;
    }

    if (shippingInfo.name.length < 2) {
      setErrorMessage("받는 분 이름은 2자 이상 입력해주세요.");
      setErrorModal(true);
      return;
    }

    if (!shippingInfo.phone?.trim()) {
      setErrorMessage("전화번호를 입력해주세요.");
      setErrorModal(true);
      return;
    }

    if (!validatePhoneNumber(shippingInfo.phone)) {
      setErrorMessage(
        "올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)"
      );
      setErrorModal(true);
      return;
    }

    if (!shippingInfo.zipcode?.trim()) {
      setErrorMessage("우편번호를 입력해주세요.");
      setErrorModal(true);
      return;
    }

    if (!validatePostalCode(shippingInfo.zipcode)) {
      setErrorMessage("올바른 우편번호 형식을 입력해주세요. (5자리 숫자)");
      setErrorModal(true);
      return;
    }

    if (!shippingInfo.address?.trim() || !shippingInfo.detailAddress?.trim()) {
      setErrorMessage("배송지를 입력해주세요.");
      setErrorModal(true);
      return;
    }

    // 카드 결제시 카드 정보 검증
    if (selectedMethod === "카드") {
      if (!shippingInfo.cardNumber?.trim()) {
        setErrorMessage("카드번호를 입력해주세요.");
        setErrorModal(true);
        return;
      }

      if (!validateCardNumber(shippingInfo.cardNumber)) {
        setErrorMessage("올바른 카드번호를 입력해주세요. (16자리 숫자)");
        setErrorModal(true);
        return;
      }

      if (!shippingInfo.cardExpiry?.trim()) {
        setErrorMessage("카드 유효기간을 입력해주세요.");
        setErrorModal(true);
        return;
      }

      if (!validateCardExpiry(shippingInfo.cardExpiry)) {
        setErrorMessage(
          "올바른 유효기간을 입력해주세요. (MM/YY 형식, 만료되지 않은 카드)"
        );
        setErrorModal(true);
        return;
      }

      if (!shippingInfo.cardCvv?.trim()) {
        setErrorMessage("카드 CVC를 입력해주세요.");
        setErrorModal(true);
        return;
      }

      if (!validateCVC(shippingInfo.cardCvv)) {
        setErrorMessage("올바른 CVC를 입력해주세요. (3자리 숫자)");
        setErrorModal(true);
        return;
      }
    }

    const orderId = generateRandomOrderId();

    const orderData = {
      orderId,
      status: "ORDERED",
      orderedAt: new Date().toISOString(),
      usedPoints: usePoint ? usedPoints : 0,
      earnedPoints: earnedPoints,
      currency: "KRW",
      deliveryFee: shipping,
      totalDiscountPrice: totalDiscount,
      totalPrice: finalPaidAmount,
      shippingInfo: {
        recipientName: shippingInfo.name,
        recipientPhone: shippingInfo.phone,
        postalCode: shippingInfo.zipcode,
        deliveryAddress: shippingInfo.address,
        detailDeliveryAddress: shippingInfo.detailAddress,
        deliveryMessage: shippingInfo.request,
      },
      paymentInfo: {
        paymentMethod: selectedMethod,
        card_number: selectedMethod === "카드" ? shippingInfo.cardNumber : null,
        card_expiry: selectedMethod === "카드" ? shippingInfo.cardExpiry : null,
        card_cvc: selectedMethod === "카드" ? shippingInfo.cardCvv : null,
      },
      items: items,
      deletedAt: null,
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    existingOrders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    nav("/checkout?result=success", {
      state: { orderId },
    });
  };

  const generateRandomOrderId = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return 1000000 + (array[0] % 9000000); // 1000000 ~ 9999999
  };

  // 전화번호 유효성 검사
  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  // 우편번호 유효성 검사
  const validatePostalCode = (postalCode: string): boolean => {
    const postalRegex = /^[0-9]{5}$/;
    return postalRegex.test(postalCode);
  };

  // 카드번호 유효성 검사
  const validateCardNumber = (cardNumber: string): boolean => {
    const cardRegex = /^[0-9]{16}$/;
    return cardRegex.test(cardNumber);
  };

  // 유효기간 유효성 검사
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

  // CVC 유효성 검사
  const validateCVC = (cvc: string): boolean => {
    const cvcRegex = /^[0-9]{3}$/;
    return cvcRegex.test(cvc);
  };

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
              <div style={{ textAlign: "center", color: "#6b7280" }}>
                상품 정보를 불러오는 중...
              </div>
            </ProductPreview>
          ) : (
            <ProductPreview>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <img
                    src={toUrl(item.imageUrl)}
                    alt={item.productName}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = toUrl(
                        "images/common/no-image.png"
                      );
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {item.productName}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: "4px",
                      }}
                    >
                      사이즈: {item.size}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontWeight: "600", color: "#ef4444" }}>
                        {item.discountPrice.toLocaleString()}원
                      </span>
                      {item.discountPrice > 0 && (
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#9ca3af",
                            textDecoration: "line-through",
                          }}
                        >
                          {item.productPrice.toLocaleString()}원
                        </span>
                      )}
                      <span style={{ fontSize: "14px", color: "#6b7280" }}>
                        × {item.quantity}개
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </ProductPreview>
          )}

          <SectionTitle>포인트 사용</SectionTitle>
          <div
            style={{
              background: "#f8fafc",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginBottom: "4px",
              }}
            >
              보유 포인트
            </div>
            <div
              style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}
            >
              {availablePoints.toLocaleString()}P
            </div>
          </div>
          <CheckLabel>
            <input
              type="checkbox"
              checked={usePoint}
              onChange={(e) => setUsePoint(e.target.checked)}
              style={{ marginRight: 8, marginBottom: 16 }}
            />
            포인트 사용하기
          </CheckLabel>
          {usePoint && (
            <>
              <InputRow>
                <Input
                  type="number"
                  min={0}
                  max={availablePoints}
                  value={usedPoints}
                  onChange={(e) => handlePointsChange(e.target.value)}
                  placeholder="사용할 포인트를 입력하세요 (100원 단위)"
                  step="100"
                />
              </InputRow>

              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginTop: "8px",
                  lineHeight: "1.4",
                }}
              >
                • 포인트는 100원 단위로 사용 가능합니다
                <br />
                • 구매금액의 10%까지만 사용 가능합니다
                <br />• 사용 가능 포인트:{" "}
                {Math.min(
                  Math.floor((totalOriginalPrice - totalDiscount) * 0.1),
                  availablePoints
                ).toLocaleString()}
                원
              </div>
            </>
          )}
          <SectionTitle>배송 정보</SectionTitle>
          <InputRow>
            <Input
              name="name"
              value={shippingInfo.name}
              onChange={handleDeliveryChange}
              placeholder="이름을 입력하세요"
            />
            <Input
              name="phone"
              value={shippingInfo.phone}
              onChange={(e) => {
                // 전화번호 입력 시 자동 하이픈 삽입
                let value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length >= 3) {
                  if (value.length <= 7) {
                    value = value.replace(/^(\d{3})(\d{1,4})/, "$1-$2");
                  } else {
                    value = value.replace(
                      /^(\d{3})(\d{4})(\d{1,4})/,
                      "$1-$2-$3"
                    );
                  }
                }
                setShippingInfo((prev) => ({ ...prev, phone: value }));
              }}
              placeholder="전화번호 (예: 010-1234-5678)"
              maxLength={13}
            />
          </InputRow>
          <InputRow>
            <Input
              name="zipcode"
              value={shippingInfo.zipcode}
              onChange={handleDeliveryChange}
              placeholder="우편번호"
            />
            <Button
              style={{
                maxWidth: 140,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "14px 20px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(102, 126, 234, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.2)";
              }}
            >
              우편번호 검색
            </Button>
          </InputRow>
          <InputRow>
            <Input
              name="address"
              value={shippingInfo.address}
              onChange={handleDeliveryChange}
              placeholder="기본 주소"
            />
            <Input
              name="detailAddress"
              value={shippingInfo.detailAddress}
              onChange={handleDeliveryChange}
              placeholder="상세 주소를 입력하세요"
            />
          </InputRow>
          <Select
            name="request"
            value={shippingInfo.request}
            onChange={handleDeliveryChange}
          >
            <option value="">배송 요청사항을 선택하세요</option>
            <option value="문 앞에 두고 벨 눌러주세요">
              문 앞에 두고 벨 눌러주세요
            </option>
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
              <InputRow>
                <Input
                  name="cardNumber"
                  value={shippingInfo.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setShippingInfo((prev) => ({ ...prev, cardNumber: value }));
                  }}
                  placeholder="카드번호 16자리"
                  maxLength={16}
                />
              </InputRow>
              <InputRow>
                <Input
                  name="cardExpiry"
                  value={shippingInfo.cardExpiry}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length >= 2) {
                      value = value.replace(/^(\d{2})(\d{1,2})/, "$1/$2");
                    }
                    setShippingInfo((prev) => ({ ...prev, cardExpiry: value }));
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                <Input
                  name="cardCvv"
                  value={shippingInfo.cardCvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setShippingInfo((prev) => ({ ...prev, cardCvv: value }));
                  }}
                  placeholder="CVC 3자리"
                  maxLength={3}
                />
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
              <span style={{ color: "#ef4444" }}>
                -{totalDiscount.toLocaleString()}원
              </span>
            </SummaryRow>
            <SummaryRow>
              <span>포인트 사용</span>
              <span style={{ color: "#ef4444" }}>
                -{usePoint ? usedPoints.toLocaleString() : 0}원
              </span>
            </SummaryRow>
            <SummaryRow>
              <span>배송비</span>
              <span>
                {shipping === 0 ? "무료" : `${shipping.toLocaleString()}원`}
              </span>
            </SummaryRow>
            <hr style={{ margin: "16px 0" }} />
            <TotalPrice>{finalPaidAmount.toLocaleString()}원</TotalPrice>

            <SummaryRow>
              <span style={{ fontSize: 14, color: "#6b7280" }}>
                적립 예정 포인트
              </span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {earnedPoints.toLocaleString()}P
              </span>
            </SummaryRow>
            <PrimaryButton
              onClick={onClickPayment}
              disabled={!isAgree || items.length === 0}
            >
              {items.length === 0 ? "상품 정보 로딩 중..." : "결제하기"}
            </PrimaryButton>
            <SecondaryButton onClick={() => nav("/products")}>
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
                style={{ marginRight: 8 }}
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
