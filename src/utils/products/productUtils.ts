import { ProductDetail } from "types/products";

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ko-KR").format(price);
};

export const getDiscountRate = (product: ProductDetail | null): number => {
  if (!product || product.price === product.discountPrice) return 0;
  return Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );
};