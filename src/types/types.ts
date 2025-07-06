// 할인 정보
export type DiscountType = "정률" | "정액";

export type Discount = {
  product_id: number;
  discount_type: DiscountType;
  discount_value: number;
  discount_start: string; // ISO date (e.g., "2025-06-01T00:00:00Z")
  discount_end: string;
};

// 브랜드 정보
export type Brand = {
  store_id: number;
  store_name: string;
  brand_logo_url: string;
  brand_info: string;
  brand_likes: number;
};

// 상품 정보
export type Product = {
  id: number;
  name: string;
  price: number;
  gender?: string;
  product_likes: number;
  description?: string;
  main_image_urls: string[];
  detail_image_urls?: string[];
  store_id: number;
  size_stock_list?: SizeStock[];
  color_info?: {
    current_colors?: (string | { color_name: string })[];
    other_color_products?: OtherColorProduct[];
  };
};

// 사이즈별 재고 정보
export type SizeStock = {
  size: string;
  stock_quantity: number;
};

// 다른 색상 제품 정보
export type OtherColorProduct = {
  product_id: number;
  thumbnail_url: string;
};

// 장바구니/구매용 상품 항목
export type CartItem = {
  id: string; // 예: `${product.id}-${size}`
  name: string;
  option: string; // 사이즈
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
  image: string;
  selected: boolean;
};

// filter.ts
export type Filter = {
  id: string;
  name: string;
  options: FilterOption[];
};

export type FilterOption =
  | string
  | {
      name: string;
      color_image_url?: string;
    };

// color.ts
export type MusinsaColor = {
  color_name: string;
  color_name_en: string;
  color_image_url: string;
};

export type Order = {
  orderId: number;
  status: string;
  deliveryFee: number;
  totalPrice: number;
  totalDiscountPrice: number;
  currency: string;
  usedPoints: number;
  earnedPoints: number;
  paymentInfo: {
    paymentMethod: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
  };
  shippingInfo: {
    deliveryAddress: string;
    detailDeliveryAddress: string;
    postalCode: string;
    recipientName: string;
    recipientPhone: string;
    deliveryMessage: string;
  };
  orderedAt: string;
  deletedAt: string | null;
  items: CartItem[];
};

export type WishListItem = {
  id: number;
  name: string;
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
  category: string;
  image: string;
  addedAt: string;
};
