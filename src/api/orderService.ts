import axiosInstance from "./axios";
import { CartItem } from "../types/types";

export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  orderedAt: string;
}

export interface PurchasedItemListResponse {
  items: OrderItem[];
  totalCount: number;
}

export interface OrderListResponse {
  content: OrderItem[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
}

export class OrderService {
  /**
   * 현재 로그인한 사용자의 구매한 상품 목록을 조회합니다 (피드 생성용)
   */
  static async getPurchasedItems(): Promise<PurchasedItemListResponse> {
    try {
      const response = await axiosInstance.get('/api/users/orders/items');
      return response.data.data;
    } catch (error: any) {
      console.error('구매한 상품 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 현재 로그인한 사용자의 구매 내역을 조회합니다
   */
  static async getUserOrders(params: {
    page?: number;
    size?: number;
    sort?: string;
  } = {}): Promise<OrderListResponse> {
    try {
      const response = await axiosInstance.get('/api/orders/my', { params });
      return response.data.data;
    } catch (error: any) {
      console.error('구매 내역 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 주문의 상세 정보를 조회합니다
   */
  static async getOrderDetail(orderId: number): Promise<OrderItem[]> {
    try {
      const response = await axiosInstance.get(`/api/orders/${orderId}/items`);
      return response.data.data;
    } catch (error: any) {
      console.error('주문 상세 조회 실패:', error);
      throw error;
    }
  }
}

export default OrderService; 