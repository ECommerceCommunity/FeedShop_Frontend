export interface CartItem {
  cartItemId: number;
  productId: number;
  storeId: number;
  optionId: number;
  imageId: number;
  productName: string;
  productPrice: number;
  discountPrice: number;
  quantity: number;
  selected: boolean;
  optionDetails: {
    stock: number;
    gender: "MEN" | "WOMEN" | "UNISEX";
    size: string;
    color: string;
  };
  imageUrl: string;
  storeName: string;
  createdAt: string;
}

export interface CartResponse {
  items: CartItem[];
  totalOriginalPrice: number;
  totalDiscountPrice: number;
  totalSavings: number;
  totalItemCount: number;
}

export interface AddCartRequest {
  optionId: number;
  imageId: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity?: number;
  selected?: boolean;
}

export type WishListItem = {
  id: number;
  name: string;
  originalPrice: number;
  discountPrice: number;
  discountType: string;
  discountValue: number;
  category: string;
  image: string;
  addedAt: string;
};

export type RecentViewItem = {
  id: number;
  name: string;
  originalPrice: number;
  discountPrice: number;
  discountType: string;
  discountValue: number;
  category: string;
  image: string;
  viewedAt: string;
};
