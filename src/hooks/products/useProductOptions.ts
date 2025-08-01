import { useState } from "react";
import { ProductDetail } from "types/products";

export interface SelectedOptions {
  optionId: number;
  size: string;
  quantity: number;
  price: number;
  stock: number;
}

export const useProductOptions = (product: ProductDetail | null) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions[]>([]);

  const handleSizeSelect = (
    optionId: number,
    onError: (message: string) => void
  ) => {
    if (!product) return;

    const option = product.options.find((opt) => opt.optionId === optionId);
    if (!option) return;

    const existingOption = selectedOptions.find(
      (opt) => opt.optionId === optionId
    );
    if (existingOption) {
      onError("이미 선택된 사이즈입니다.");
      return;
    }

    if (option.stock === 0) {
      onError(`${option.size.replace("SIZE_", "")} 사이즈는 현재 품절입니다.`);
      return;
    }

    const newOption: SelectedOptions = {
      optionId: option.optionId,
      size: option.size.replace("SIZE_", ""),
      quantity: 1,
      price: product.discountPrice,
      stock: option.stock,
    };

    setSelectedOptions((prev) => [...prev, newOption]);
  };

  const handleQuantityChange = (
    optionId: number,
    newQuantity: number,
    onError: (message: string) => void
  ) => {
    if (newQuantity < 1) return;

    const option = selectedOptions.find((opt) => opt.optionId === optionId);
    if (!option) return;

    if (newQuantity > option.stock) {
      onError(`사이즈 ${option.size}의 재고가 부족합니다.`);
      return;
    }

    if (newQuantity > 5) {
      onError("한 번에 최대 5개까지만 구매할 수 있습니다.");
      return;
    }

    setSelectedOptions((prev) =>
      prev.map((opt) =>
        opt.optionId === optionId ? { ...opt, quantity: newQuantity } : opt
      )
    );
  };

  const handleRemoveOption = (optionId: number) => {
    setSelectedOptions((prev) =>
      prev.filter((opt) => opt.optionId !== optionId)
    );
  };

  const clearSelectedOptions = () => {
    setSelectedOptions([]);
  };

  const getTotalQuantity = () => {
    return selectedOptions.reduce(
      (total, option) => total + option.quantity,
      0
    );
  };

  const getTotalPrice = () => {
    return selectedOptions.reduce(
      (total, option) => total + option.price * option.quantity,
      0
    );
  };

  return {
    selectedOptions,
    handleSizeSelect,
    handleQuantityChange,
    handleRemoveOption,
    clearSelectedOptions,
    getTotalQuantity,
    getTotalPrice,
  };
};