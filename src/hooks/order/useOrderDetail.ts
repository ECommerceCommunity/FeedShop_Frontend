import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OrderService } from "../../api/orderService";
import { OrderDetail } from "../../types/order";

interface UseOrderDetailReturn {
  orderDetail: OrderDetail | null;
  loading: boolean;
  error: string | null;
}

export const useOrderDetail = (): UseOrderDetailReturn => {
  const location = useLocation();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = location.state?.orderId;

  useEffect(() => {
    const loadOrderDetail = async () => {
      if (!orderId) {
        setError("주문 ID가 없습니다. 잘못된 접근입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const detail = await OrderService.getOrderDetail(orderId);
        setOrderDetail(detail);
        setError(null);
      } catch (err: any) {
        setError("주문 정보를 불러오는데 실패했습니다.");
        setOrderDetail(null);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetail();
  }, [orderId]);

  return {
    orderDetail,
    loading,
    error,
  };
};
