import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { PaymentItem } from "../../types/order";
import { CreateOrderRequest } from "../../types/order";
import { OrderService } from "../../api/orderService";
import { CartService } from "../../api/cartService";
import { useCart } from "../../hooks/useCart";
import { toUrl } from "../../utils/images";
import Fail from "../../components/modal/Fail";

// 스타일드 컴포넌트들 (기존 코드와 동일)
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

const DeliveryRequestContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RequestOptionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
`;

const RequestOptionButton = styled.button<{ selected: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 8px;
  background: ${(props) => (props.selected ? "#eff6ff" : "#f9fafb")};
  color: ${(props) => (props.selected ? "#2563eb" : "#374151")};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CustomRequestContainer = styled.div<{ show: boolean }>`
  margin-top: ${(props) => (props.show ? "8px" : "0")};
  max-height: ${(props) => (props.show ? "200px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.show ? 1 : 0)};
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
`;

const PointContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #f9fafb;
`;

const PointHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const PointToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleSlider = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #3b82f6;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
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

const PointInputContainer = styled.div<{ disabled: boolean }>`
  display: flex;
  gap: 8px;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  transition: all 0.2s ease;
`;

const UseAllButton = styled.button`
  padding: 8px 16px;
  background: #e5e7eb;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
  min-width: 70px;

  &:hover {
    background: #d1d5db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

const ProductInfo = styled.div`
  flex: 1;
  min-width: 0; /* 텍스트 오버플로우 방지 */
`;

const ProductName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductDetails = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const ProductPrice = styled.div`
  font-weight: 600;
  color: #3b82f6;
  text-align: right;
  flex-shrink: 0;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  &::after {
    content: "";
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateCartItemCount } = useCart();

  // 상태 관리
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [isAgree, setIsAgree] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("카드");
  const [usePoint, setUsePoint] = useState(false);
  const [usedPoints, setUsedPoints] = useState(0);
  const [availablePoints] = useState(5000); // 실제로는 API에서 가져와야 함
  const [isProcessing, setIsProcessing] = useState(false); // 결제 처리 중 상태
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    zipcode: "",
    address: "",
    detailAddress: "",
    request: "없음", // 기본값을 "없음"으로 설정
    customRequest: "", // 직접 입력용 필드 추가
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
      } else if (
        state.directOrder &&
        state.product &&
        Array.isArray(state.selectedOptions)
      ) {
        // 바로 주문인 경우 (DetailPage에서 온 경우)
        const { product, selectedOptions } = state;

        items = selectedOptions.map((item: any) => ({
          id: `${product.productId}-${item.optionId}`,
          productName: product.name,
          size: item.size,
          discountPrice: product.discountPrice,
          productPrice: product.price,
          discount: product.price - product.discountPrice,
          quantity: item.quantity,
          imageUrl: product.images[0]?.url,
          selected: true,
        }));
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
    const pointsToUse = usePoint ? usedPoints : 0; // 토글 상태에 따라 포인트 사용량 결정
    const finalAmount = productTotal + deliveryFee - pointsToUse;

    return {
      productTotal,
      deliveryFee,
      finalAmount,
      usedPoints: pointsToUse,
    };
  };

  // 포인트 사용 변경 함수
  const handlePointsChange = (value: string) => {
    if (!usePoint) return; // 포인트 사용이 비활성화된 경우 무시

    const numValue = parseInt(value) || 0;

    // 100 단위로만 사용 가능
    if (numValue % 100 !== 0 && numValue !== 0) {
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
    if (!usePoint) return; // 포인트 사용이 비활성화된 경우 무시

    const totals = calculateTotals();
    const maxUsablePoints = Math.floor(totals.productTotal * 0.1);
    const maxPoints = Math.min(availablePoints, maxUsablePoints);

    // 100원 단위로 맞춤
    const roundedPoints = Math.floor(maxPoints / 100) * 100;
    setUsedPoints(roundedPoints);
  };

  // 배송 요구사항 옵션들
  const deliveryOptions = [
    "없음",
    "문 앞에 두고 벨을 눌러주세요",
    "경비실에 맡겨주세요",
    "부재 시 안전한 곳에 보관해주세요",
    "직접 받겠습니다",
    "기타 (직접 입력)",
  ];

  // 배송 요구사항 선택 함수
  const handleDeliveryRequestChange = (option: string) => {
    setShippingInfo((prev) => ({
      ...prev,
      request: option,
      customRequest: option === "기타 (직접 입력)" ? prev.customRequest : "",
    }));
  };

  // 최종 배송 요구사항 생성 함수
  const getFinalDeliveryRequest = () => {
    if (shippingInfo.request === "기타 (직접 입력)") {
      return shippingInfo.customRequest || "없음";
    }
    return shippingInfo.request;
  };

  // 포인트 사용 토글 함수
  const handlePointToggle = (enabled: boolean) => {
    setUsePoint(enabled);
    if (!enabled) {
      setUsedPoints(0); // 토글 비활성화 시 사용 포인트 초기화
    }
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
    // 숫자만 추출 (공백, 하이픈 제거)
    const cleanPhone = phone.replace(/[\s-]/g, "");

    // 10~11자리 숫자이고 01로 시작하는지 체크
    const phoneRegex = /^01[0-9]{8,9}$/;
    return phoneRegex.test(cleanPhone);
  };

  const validatePostalCode = (postalCode: string): boolean => {
    const postalRegex = /^[0-9]{5}$/;
    return postalRegex.test(postalCode);
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    // 숫자만 추출 (공백, 하이픈 제거)
    const cleanNumber = cardNumber.replace(/[\s-]/g, "");

    // 13~19자리 숫자 체크만 (루앤 알고리즘 제거)
    const cardRegex = /^[0-9]{13,19}$/;
    return cardRegex.test(cleanNumber);
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

  // 실제 API를 이용한 결제 처리 함수
  const handlePayment = async () => {
    // 필수 입력값 검증
    if (!shippingInfo.name.trim()) {
      setErrorMessage("받는 분 성함을 입력해주세요.");
      setErrorModal(true);
      return;
    }

    if (!validatePhoneNumber(shippingInfo.phone)) {
      setErrorMessage(
        "올바른 휴대폰 번호를 입력해주세요. (010, 011 등으로 시작하는 10~11자리)"
      );
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
        setErrorMessage("올바른 카드번호를 입력해주세요. (13~19자리 숫자)");
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
      setIsProcessing(true);

      // 주문 API 요청 데이터 생성
      const totals = calculateTotals();

      const orderData: CreateOrderRequest = {
        deliveryAddress: shippingInfo.address,
        deliveryDetailAddress: shippingInfo.detailAddress,
        postalCode: shippingInfo.zipcode,
        recipientName: shippingInfo.name,
        recipientPhone: shippingInfo.phone,
        usedPoints: usePoint ? usedPoints : 0,
        deliveryMessage: getFinalDeliveryRequest(), // 최종 배송 요구사항 사용
        deliveryFee: totals.deliveryFee,
        paymentMethod: selectedMethod,
        cardNumber:
          selectedMethod === "카드" ? shippingInfo.cardNumber : undefined,
        cardExpiry:
          selectedMethod === "카드"
            ? shippingInfo.cardExpiry.replace("/", "")
            : undefined,
        cardCvc: selectedMethod === "카드" ? shippingInfo.cardCvv : undefined,
      };

      // 실제 주문 API 호출
      const orderResponse = await OrderService.createOrder(orderData);

      // 주문 완료 페이지로 이동 (API에서 받은 실제 orderId 사용)
      navigate("/checkout", {
        state: {
          orderId: orderResponse.orderId,
        },
      });
    } catch (error: any) {
      // API 에러 메시지 처리
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }

      setErrorModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const totals = calculateTotals();

  return (
    <>
      {/* 결제 처리 중 로딩 오버레이 */}
      {isProcessing && (
        <LoadingOverlay>
          <LoadingSpinner>
            <div
              style={{ fontSize: "16px", fontWeight: "600", color: "#374151" }}
            >
              결제 처리 중입니다...
            </div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              잠시만 기다려주세요.
            </div>
          </LoadingSpinner>
        </LoadingOverlay>
      )}

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
                  <ProductImage
                    src={toUrl(item.imageUrl)}
                    alt={item.productName}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.jpg";
                    }}
                  />
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
                disabled={isProcessing}
              />
            </FormGroup>

            <FormGroup>
              <Label>휴대폰 번호 *</Label>
              <Input
                type="text"
                placeholder="01012345678 또는 010-1234-5678"
                value={shippingInfo.phone}
                onChange={(e) => {
                  // 숫자만 입력 허용하고 자동으로 하이픈 추가
                  const value = e.target.value.replace(/\D/g, "");
                  let formattedValue = value;

                  if (value.length >= 3) {
                    if (value.length <= 6) {
                      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
                    } else {
                      formattedValue = `${value.slice(0, 3)}-${value.slice(
                        3,
                        7
                      )}-${value.slice(7, 11)}`;
                    }
                  }

                  if (value.length <= 11) {
                    // 최대 11자리까지 허용
                    handleInputChange("phone", formattedValue);
                  }
                }}
                disabled={isProcessing}
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
                  disabled={isProcessing}
                />
                <Input
                  type="text"
                  placeholder="주소"
                  value={shippingInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={isProcessing}
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
                disabled={isProcessing}
              />
            </FormGroup>

            <FormGroup>
              <Label>배송 요청사항</Label>
              <DeliveryRequestContainer>
                <RequestOptionContainer>
                  {deliveryOptions.map((option) => (
                    <RequestOptionButton
                      key={option}
                      type="button"
                      selected={shippingInfo.request === option}
                      onClick={() => handleDeliveryRequestChange(option)}
                      disabled={isProcessing}
                    >
                      {option}
                    </RequestOptionButton>
                  ))}
                </RequestOptionContainer>

                <CustomRequestContainer
                  show={shippingInfo.request === "기타 (직접 입력)"}
                >
                  <TextArea
                    placeholder="배송 시 요청사항을 직접 입력해주세요"
                    value={shippingInfo.customRequest}
                    onChange={(e) =>
                      handleInputChange("customRequest", e.target.value)
                    }
                    disabled={isProcessing}
                    style={{ minHeight: "60px" }}
                  />
                </CustomRequestContainer>
              </DeliveryRequestContainer>
            </FormGroup>
          </Card>

          {/* 포인트 사용 */}
          <Card>
            <SectionTitle>포인트 사용</SectionTitle>
            <PointContainer>
              <PointHeader>
                <PointInfo>
                  <span>보유 포인트</span>
                  <PointBalance>{formatPrice(availablePoints)}P</PointBalance>
                </PointInfo>
                <PointToggle>
                  <ToggleLabel>포인트 사용</ToggleLabel>
                  <ToggleSwitch>
                    <ToggleSlider
                      checked={usePoint}
                      onChange={(e) => handlePointToggle(e.target.checked)}
                      disabled={isProcessing}
                    />
                    <Slider />
                  </ToggleSwitch>
                </PointToggle>
              </PointHeader>

              <PointInputContainer disabled={!usePoint}>
                <Input
                  type="number"
                  placeholder="사용할 포인트"
                  value={usePoint ? usedPoints || "" : ""}
                  onChange={(e) => handlePointsChange(e.target.value)}
                  min="0"
                  step="100"
                  disabled={isProcessing || !usePoint}
                  style={{ opacity: usePoint ? 1 : 0.5 }}
                />
                <UseAllButton
                  onClick={handleUseAllPoints}
                  disabled={isProcessing || !usePoint}
                >
                  전액사용
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
                    disabled={isProcessing}
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
                    disabled={isProcessing}
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
                      disabled={isProcessing}
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
                      disabled={isProcessing}
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
              <span>-{formatPrice(usePoint ? usedPoints : 0)}원</span>
            </SummaryRow>
            <TotalPrice>
              총 결제금액: {formatPrice(totals.finalAmount)}원
            </TotalPrice>

            <PrimaryButton
              onClick={handlePayment}
              disabled={items.length === 0 || !isAgree || isProcessing}
            >
              {isProcessing
                ? "결제 처리 중..."
                : items.length === 0
                ? "상품 정보 로딩 중..."
                : "결제하기"}
            </PrimaryButton>
            <SecondaryButton
              onClick={() => navigate("/products")}
              disabled={isProcessing}
            >
              계속 쇼핑하기
            </SecondaryButton>

            <Notice>
              <b>안내사항</b>
              <br />
              • 50,000원 이상 구매 시 배송비 무료
              <br />
              • 주문 완료 후 배송 조회는 마이페이지에서 가능합니다.
              <br />
              • 무통장입금은 입금 확인 후 배송이 시작됩니다.
              <br />• 결제 완료 후에는 주문 취소가 어려우니 신중히 결제해주세요.
            </Notice>

            <CheckLabel>
              <input
                type="checkbox"
                checked={isAgree}
                onChange={(e) => setIsAgree(e.target.checked)}
                disabled={isProcessing}
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
