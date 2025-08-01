import { CartItem } from "../../types/cart";

export interface SelectedTotals {
  totalPrice: number;
  totalDiscount: number;
  deliveryFee: number;
  finalPrice: number;
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

export const getSelectedTotals = (
  cartItems: CartItem[],
  selectedItemIds: number[]
): SelectedTotals => {
  const selectedCartItems = cartItems.filter((item) =>
    selectedItemIds.includes(item.cartItemId)
  );

  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + (item.productPrice || 0) * (item.quantity || 1),
    0
  );

  const totalDiscount = selectedCartItems.reduce(
    (sum, item) =>
      sum +
      ((item.productPrice || 0) - (item.discountPrice || 0)) *
        (item.quantity || 1),
    0
  );

  const finalPrice = totalPrice - totalDiscount;
  const deliveryFee = finalPrice >= 50000 ? 0 : 3000;

  return { totalPrice, totalDiscount, deliveryFee, finalPrice };
};
