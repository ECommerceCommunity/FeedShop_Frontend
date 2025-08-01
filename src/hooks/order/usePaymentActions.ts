import { useNavigate } from "react-router-dom";
import { OrderService } from "../../api/orderService";
import { CreateOrderRequest } from "../../types/order";
import {
  validatePhoneNumber,
  validatePostalCode,
  validateCardNumber,
  validateCardExpiry,
  validateCVC,
} from "../../utils/order/validation";

interface PaymentData {
  items: any[];
  shippingInfo: any;
  selectedMethod: string;
  usePoint: boolean;
  usedPoints: number;
  isAgree: boolean;
  availablePoints: number;
  isDirectOrder: boolean;
}

interface UsePaymentActionsProps {
  paymentData: PaymentData;
  setUsedPoints: (points: number) => void;
  setIsProcessing: (processing: boolean) => void;
  onError: (message: string) => void;
}

export const usePaymentActions = ({
  paymentData,
  setUsedPoints,
  setIsProcessing,
  onError,
}: UsePaymentActionsProps) => {
  const navigate = useNavigate();

  const calculateTotals = () => {
    const productTotal = paymentData.items.reduce(
      (sum, item) => sum + item.discountPrice * item.quantity,
      0
    );
    const deliveryFee = productTotal >= 50000 ? 0 : 3000;
    const pointsToUse = paymentData.usePoint ? paymentData.usedPoints : 0;
    const finalAmount = productTotal + deliveryFee - pointsToUse;

    return {
      productTotal,
      deliveryFee,
      finalAmount,
      usedPoints: pointsToUse,
    };
  };

  const handlePointsChange = (value: string) => {
    if (!paymentData.usePoint) return;

    const numValue = parseInt(value) || 0;

    if (numValue % 100 !== 0 && numValue !== 0) {
      onError("포인트는 100원 단위로만 사용 가능합니다.");
      return;
    }

    const totals = calculateTotals();
    const maxUsablePoints = Math.floor(totals.productTotal * 0.1);

    if (numValue > maxUsablePoints) {
      onError(
        `포인트는 구매금액의 10%인 ${maxUsablePoints.toLocaleString()}원까지만 사용 가능합니다.`
      );
      return;
    }

    if (numValue > paymentData.availablePoints) {
      onError("보유한 포인트가 부족합니다.");
      return;
    }

    setUsedPoints(numValue);
  };

  const handleUseAllPoints = () => {
    if (!paymentData.usePoint) return;

    const totals = calculateTotals();
    const maxUsablePoints = Math.floor(totals.productTotal * 0.1);
    const maxPoints = Math.min(paymentData.availablePoints, maxUsablePoints);
    const roundedPoints = Math.floor(maxPoints / 100) * 100;

    setUsedPoints(roundedPoints);
  };

  const getFinalDeliveryRequest = () => {
    if (paymentData.shippingInfo.request === "기타 (직접 입력)") {
      return paymentData.shippingInfo.customRequest || "없음";
    }
    return paymentData.shippingInfo.request;
  };

  const validatePaymentData = () => {
    const { shippingInfo, selectedMethod, isAgree } = paymentData;

    if (!shippingInfo.name.trim()) {
      throw new Error("받는 분 성함을 입력해주세요.");
    }

    if (!validatePhoneNumber(shippingInfo.phone)) {
      throw new Error(
        "올바른 휴대폰 번호를 입력해주세요. (010, 011 등으로 시작하는 10~11자리)"
      );
    }

    if (!validatePostalCode(shippingInfo.zipcode)) {
      throw new Error("올바른 우편번호를 입력해주세요. (5자리 숫자)");
    }

    if (!shippingInfo.address.trim()) {
      throw new Error("주소를 입력해주세요.");
    }

    if (!shippingInfo.detailAddress.trim()) {
      throw new Error("상세 주소를 입력해주세요.");
    }

    if (selectedMethod === "카드") {
      if (!validateCardNumber(shippingInfo.cardNumber)) {
        throw new Error("올바른 카드번호를 입력해주세요. (13~19자리 숫자)");
      }

      if (!validateCardExpiry(shippingInfo.cardExpiry)) {
        throw new Error("올바른 유효기간을 입력해주세요. (MM/YY)");
      }

      if (!validateCVC(shippingInfo.cardCvv)) {
        throw new Error("올바른 CVC를 입력해주세요. (3자리 숫자)");
      }
    }

    if (!isAgree) {
      throw new Error("주문 내용 확인 및 결제 동의가 필요합니다.");
    }
  };

  const handlePayment = async () => {
    try {
      // Check if it's a direct order and block payment
      if (paymentData.isDirectOrder) {
        onError("현재는 장바구니에서 주문만 가능합니다.");
        return;
      }

      validatePaymentData();
      setIsProcessing(true);

      const totals = calculateTotals();
      const { shippingInfo, selectedMethod, usePoint, usedPoints } =
        paymentData;

      const orderData: CreateOrderRequest = {
        deliveryAddress: shippingInfo.address,
        deliveryDetailAddress: shippingInfo.detailAddress,
        postalCode: shippingInfo.zipcode,
        recipientName: shippingInfo.name,
        recipientPhone: shippingInfo.phone,
        usedPoints: usePoint ? usedPoints : 0,
        deliveryMessage: getFinalDeliveryRequest(),
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

      const orderResponse = await OrderService.createOrder(orderData);

      navigate("/checkout", {
        state: {
          orderId: orderResponse.orderId,
        },
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        onError(error.response.data.message);
      } else if (error.message) {
        onError(error.message);
      } else {
        onError("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    calculateTotals,
    handlePointsChange,
    handleUseAllPoints,
    handlePayment,
  };
};
