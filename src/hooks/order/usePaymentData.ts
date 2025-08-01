import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PaymentItem } from "../../types/order";
import CartService from "../../api/cartService";

interface PaymentState {
  items: PaymentItem[];
  shippingInfo: {
    name: string;
    phone: string;
    zipcode: string;
    address: string;
    detailAddress: string;
    request: string;
    customRequest: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
  };
  selectedMethod: string;
  usePoint: boolean;
  usedPoints: number;
  isAgree: boolean;
  isProcessing: boolean;
  isDirectOrder: boolean;
  tempCartItemIds: number[];
}

interface UsePaymentDataReturn extends PaymentState {
  availablePoints: number;
  updateShippingInfo: (field: string, value: string) => void;
  setSelectedMethod: (method: string) => void;
  setUsePoint: (use: boolean) => void;
  setUsedPoints: (points: number) => void;
  setIsAgree: (agree: boolean) => void;
  setIsProcessing: (processing: boolean) => void;
  handleDeliveryRequestChange: (option: string) => void;
  handlePointToggle: (enabled: boolean) => void;
}

export const usePaymentData = (): UsePaymentDataReturn => {
  const location = useLocation();
  const [availablePoints] = useState(5000);

  const [state, setState] = useState<PaymentState>({
    items: [],
    shippingInfo: {
      name: "",
      phone: "",
      zipcode: "",
      address: "",
      detailAddress: "",
      request: "없음",
      customRequest: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
    },
    selectedMethod: "카드",
    usePoint: false,
    usedPoints: 0,
    isAgree: false,
    isProcessing: false,
    isDirectOrder: false,
    tempCartItemIds: [],
  });

  const loadDirectOrderItems = async (tempIds: number[]) => {
    try {
      const cartData = await CartService.getCartItems();
      const directOrderItems = cartData.items
        .filter((item) => tempIds.includes(item.cartItemId))
        .map((item: any) => ({
          id: `${item.productId}-${item.optionId || item.optionInfo?.optionId}`,
          productName: item.productName,
          size: item.optionInfo?.size?.replace("SIZE_", "") || "",
          discountPrice: item.discountPrice,
          productPrice: item.productPrice,
          discount: item.productPrice - item.discountPrice,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
          selected: true,
        }));

      setState((prev) => ({ ...prev, items: directOrderItems }));
    } catch (error) {
      throw new Error("주문 정보를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    const locationState = location.state;

    if (!locationState) {
      throw new Error("잘못된 접근입니다.");
    }

    if (locationState.isDirectOrder) {
      setState((prev) => ({
        ...prev,
        isDirectOrder: true,
        tempCartItemIds: locationState.tempCartItemIds,
      }));
      loadDirectOrderItems(locationState.tempCartItemIds);
      return;
    }

    const items = locationState.cartItems
      .filter((item: any) => item && item.productId)
      .map((item: any) => ({
        id: `${item.productId}-${item.optionId}`,
        productName: item.productName,
        size: item.optionDetails?.size?.replace("SIZE_", "") || "",
        discountPrice: item.discountPrice,
        productPrice: item.productPrice,
        discount: item.productPrice - item.discountPrice,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        selected: item.selected,
      }));

    setState((prev) => ({ ...prev, items }));
  }, [location.state]);

  const updateShippingInfo = (field: string, value: string) => {
    setState((prev) => ({
      ...prev,
      shippingInfo: {
        ...prev.shippingInfo,
        [field]: value,
      },
    }));
  };

  const handleDeliveryRequestChange = (option: string) => {
    setState((prev) => ({
      ...prev,
      shippingInfo: {
        ...prev.shippingInfo,
        request: option,
        customRequest:
          option === "기타 (직접 입력)" ? prev.shippingInfo.customRequest : "",
      },
    }));
  };

  const handlePointToggle = (enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      usePoint: enabled,
      usedPoints: enabled ? prev.usedPoints : 0,
    }));
  };

  return {
    ...state,
    availablePoints,
    updateShippingInfo,
    setSelectedMethod: (method: string) =>
      setState((prev) => ({ ...prev, selectedMethod: method })),
    setUsePoint: (use: boolean) =>
      setState((prev) => ({ ...prev, usePoint: use })),
    setUsedPoints: (points: number) =>
      setState((prev) => ({ ...prev, usedPoints: points })),
    setIsAgree: (agree: boolean) =>
      setState((prev) => ({ ...prev, isAgree: agree })),
    setIsProcessing: (processing: boolean) =>
      setState((prev) => ({ ...prev, isProcessing: processing })),
    handleDeliveryRequestChange,
    handlePointToggle,
  };
};
