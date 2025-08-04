import { ApiResponse } from "types/api";
import axiosInstance from "./axios";
import {
  CreateOrderRequest,
  OrderDetail,
  OrderListResponse,
  OrderResponse,
  PurchasedProduct,
} from "types/order";

export class OrderService {
  // 주문을 생성한다
  static async createOrder(
    orderData: CreateOrderRequest
  ): Promise<OrderResponse> {
    try {
      const response = await axiosInstance.post<ApiResponse<OrderResponse>>(
        "/api/users/orders",
        orderData
      );
      return response.data.data;
    } catch (error: any) {
      console.log("주문 생성 실패:", error);
      throw error;
    }
  }

  // 사용자의 주문 목록을 조회한다
  static async getOrders(
    page: number = 0,
    size: number = 10,
    status?:
      | "ORDERED"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED"
      | "RETURNED"
      | "ALL"
  ): Promise<OrderListResponse> {
    try {
      const params: any = { page, size };
      if (status && status !== "ALL") {
        params.status = status;
      }

      const response = await axiosInstance.get<ApiResponse<OrderListResponse>>(
        "/api/users/orders",
        { params }
      );
      return response.data.data;
    } catch (error: any) {
      console.error("주문 목록 조회 실패:", error);
      throw error;
    }
  }

  // 주문의 상세 정보를 조회한다.
  static async getOrderDetail(orderId: number): Promise<OrderDetail> {
    try {
      const response = await axiosInstance.get<ApiResponse<OrderDetail>>(
        `/api/users/orders/${orderId}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("주문 상세 조회 실패:", error);
      throw error;
    }
  }

  // 구매한 상품 목록을 조회합니다.
  static async getPurchasedProducts(): Promise<PurchasedProduct[]> {
    try {
      const response = await axiosInstance.get<
        ApiResponse<{ items: PurchasedProduct[] }>
      >("/api/users/orders/items");
      return response.data.data.items;
    } catch (error: any) {
      console.error("구매 상품 목록 조회 실패:", error);
      throw error;
    }
  }

  // 판매자가 자신의 주문 목록을 조회한다.
  static async getSellerOrders(
    page: number = 0,
    size: number = 10,
    status?:
      | "ORDERED"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED"
      | "RETURNED"
      | "ALL"
  ): Promise<OrderListResponse> {
    try {
      const params: any = { page, size };
      if (status && status !== "ALL") {
        params.status = status;
      }

      const response = await axiosInstance.get<ApiResponse<OrderListResponse>>(
        "/api/seller/orders",
        { params }
      );
      return response.data.data;
    } catch (error: any) {
      console.error("판매자 주문 목록 조회 실패:", error);
      throw error;
    }
  }

  // 판매자가 주문 상태를 변경한다.
  static async updateOrderStatus(
    orderId: number,
    status: "ORDERED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED"
  ): Promise<{ orderId: number; status: string }> {
    try {
      const response = await axiosInstance.post<
        ApiResponse<{ orderId: number; status: string }>
      >(`/api/seller/orders/${orderId}/status`, { status });
      return response.data.data;
    } catch (error: any) {
      console.error("주문 상태 변경 실패", error);
      throw error;
    }
  }
}

export default OrderService;
