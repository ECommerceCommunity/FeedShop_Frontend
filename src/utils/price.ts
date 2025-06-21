import { Discount } from '../types/types'

export const getDiscountPrice = (originalPrice: number, discount?: Discount): number => {
  const isDiscountValid =
    discount &&
    (discount.discount_type === '정률' || discount.discount_type === '정액') &&
    typeof discount.discount_value === 'number' &&
    !!discount.discount_start &&
    !!discount.discount_end;

  if (!isDiscountValid) return originalPrice;

  return discount.discount_type === '정률'
    ? Math.floor(originalPrice * (1 - discount.discount_value / 100))
    : originalPrice - discount.discount_value;
};