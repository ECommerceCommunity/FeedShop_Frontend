import { ApiResponse } from "types/api";
import axiosInstance from "./axios";
import { AddCartRequest, CartResponse, UpdateCartRequest } from "types/cart";

export class CartService {
  // 장바구니 상품 추가
  static async addCartItem(itemData: AddCartRequest): Promise<{
    cartItemId: number;
    optionId: number;
    imageId: number;
    quantity: number;
  }> {
    try {
      const response = await axiosInstance.post<
        ApiResponse<{
          cartItemId: number;
          optionId: number;
          imageId: number;
          quantity: number;
        }>
      >("/api/users/cart/items", itemData);
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "장바구니 추가에 실패했습니다.";
      throw new Error(message);
    }
  }

  // 장바구니 목록 조회
  static async getCartItems(): Promise<CartResponse> {
    try {
      const response = await axiosInstance.get<ApiResponse<CartResponse>>(
        "/api/users/cart"
      );
      return response.data.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || "장바구니 조회에 실패했습니다.";
      throw new Error(message);
    }
  }

  // 장바구니 아이템 수정
  static async updateCartItem(
    cartItemId: number,
    updateData: UpdateCartRequest
  ): Promise<void> {
    try {
      await axiosInstance.patch<ApiResponse<null>>(
        `/api/users/cart/items/${cartItemId}`,
        updateData
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message || "장바구니 수정에 실패했습니다.";
      throw new Error(message);
    }
  }

  // 장바구니 아이템 삭제
  static async removeCartItem(cartItemId: number): Promise<void> {
    try {
      await axiosInstance.delete<ApiResponse<null>>(
        `/api/users/cart/items/${cartItemId}`
      );
    } catch (error: any) {
      throw error;
    }
  }
}

export default CartService;
