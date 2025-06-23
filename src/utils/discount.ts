import { Discount } from '../types/types';
export const isDiscountValid = (discount?: Discount): discount is Discount & { discount_type: '정률' | '정액' } => {
    return (
      discount?.discount_type === '정률' ||
      discount?.discount_type === '정액'
    ) && typeof discount.discount_value === 'number';
  };