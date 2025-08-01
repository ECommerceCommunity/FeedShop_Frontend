import { useState } from "react";
import { ProductDetail } from "types/products";

/**
 * 상품 옵션 관리 훅
 *
 * 상품 상세 페이지에서 사용자가 선택한 상품 옵션들을 관리합니다.
 * 사이즈 선택, 수량 변경, 옵션 제거 등의 기능을 제공하고,
 * 재고 및 구매 제한 없이 유효성 검사를 수행합니다.
 */

// 선택된 옵션 정보 구조
export interface SelectedOptions {
  optionId: number;  // 옵션 ID
  size: string;      // 사이즈 (예: "M", "L" 등)
  quantity: number;  // 선택된 수량
  price: number;     // 단가
  stock: number;     // 재고 수량
}

/**
 * @param product 상품 상세 정보 (옵션 정보 포함)
 */
export const useProductOptions = (product: ProductDetail | null) => {
  // 사용자가 선택한 옵션들의 목록
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions[]>([]);

  /**
   * 사이즈 선택을 처리하는 함수
   * 중복 선택 및 품절 상태를 검사하고, 유효한 경우 선택 목록에 추가
   * @param optionId 선택할 옵션 ID
   * @param onError 에러 발생 시 호출할 콜백 함수
   */
  const handleSizeSelect = (
    optionId: number,
    onError: (message: string) => void
  ) => {
    // 상품 정보가 없으면 연기
    if (!product) return;

    // 선택한 옵션 ID에 해당하는 옵션 정보 찾기
    const option = product.options.find((opt) => opt.optionId === optionId);
    if (!option) return;

    // 이미 선택된 옵션인지 검사
    const existingOption = selectedOptions.find(
      (opt) => opt.optionId === optionId
    );
    if (existingOption) {
      onError("이미 선택된 사이즈입니다.");
      return;
    }

    // 재고 없음 검사
    if (option.stock === 0) {
      onError(`${option.size.replace("SIZE_", "")} 사이즈는 현재 품절입니다.`);
      return;
    }

    // 새로운 옵션 객체 생성 (기본 수량 1개로 설정)
    const newOption: SelectedOptions = {
      optionId: option.optionId,
      size: option.size.replace("SIZE_", ""),    // "SIZE_" 접두사 제거
      quantity: 1,                               // 기본 수량
      price: product.discountPrice,              // 할인가 사용
      stock: option.stock,
    };

    // 선택된 옵션 목록에 추가
    setSelectedOptions((prev) => [...prev, newOption]);
  };

  /**
   * 선택된 옵션의 수량을 변경하는 함수
   * 재고 수량 및 최대 구매 제한(5개)을 검사하여 유효성 검증
   * @param optionId 수량을 변경할 옵션 ID
   * @param newQuantity 새로운 수량
   * @param onError 에러 발생 시 호출할 콜백 함수
   */
  const handleQuantityChange = (
    optionId: number,
    newQuantity: number,
    onError: (message: string) => void
  ) => {
    // 1개 미만은 허용하지 않음
    if (newQuantity < 1) return;

    // 대상 옵션 찾기
    const option = selectedOptions.find((opt) => opt.optionId === optionId);
    if (!option) return;

    // 재고 수량 초과 검사
    if (newQuantity > option.stock) {
      onError(`사이즈 ${option.size}의 재고가 부족합니다.`);
      return;
    }

    // 최대 구매 제한 검사 (5개)
    if (newQuantity > 5) {
      onError("한 번에 최대 5개까지만 구매할 수 있습니다.");
      return;
    }

    // 해당 옵션의 수량만 업데이트
    setSelectedOptions((prev) =>
      prev.map((opt) =>
        opt.optionId === optionId ? { ...opt, quantity: newQuantity } : opt
      )
    );
  };

  /**
   * 선택된 옵션을 제거하는 함수
   * @param optionId 제거할 옵션 ID
   */
  const handleRemoveOption = (optionId: number) => {
    setSelectedOptions((prev) =>
      prev.filter((opt) => opt.optionId !== optionId)
    );
  };

  /**
   * 선택된 모든 옵션을 초기화하는 함수
   * 장바구니 추가 성공 후 등에 사용
   */
  const clearSelectedOptions = () => {
    setSelectedOptions([]);
  };

  /**
   * 선택된 모든 옵션의 총 수량을 계산하는 함수
   * @returns 전체 선택된 상품의 총 수량
   */
  const getTotalQuantity = () => {
    return selectedOptions.reduce(
      (total, option) => total + option.quantity,
      0
    );
  };

  /**
   * 선택된 모든 옵션의 총 가격을 계산하는 함수
   * @returns 전체 선택된 상품의 총 가격
   */
  const getTotalPrice = () => {
    return selectedOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0
    );
  };

  // 상품 옵션 관련 모든 상태와 함수를 반환
  return {
    selectedOptions,        // 선택된 옵션들의 배열
    handleSizeSelect,       // 사이즈 선택 처리 함수
    handleQuantityChange,   // 수량 변경 처리 함수
    handleRemoveOption,     // 옵션 제거 함수
    clearSelectedOptions,   // 모든 옵션 초기화 함수
    getTotalQuantity,       // 총 수량 계산 함수
    getTotalPrice,          // 총 가격 계산 함수
  };
};