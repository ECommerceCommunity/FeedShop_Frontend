import { WishListItem } from "types/cart";
import { getCartData } from "./cart";
import { toUrl } from "../common/images";

export const addToWishList = (id: number) => {
  const existing = localStorage.getItem("wishlist");
  const wishlist: WishListItem[] = existing ? JSON.parse(existing) : [];

  if (wishlist.some((item) => item.id === id)) {
    return;
  }

  const { productData, originalPrice, discountPrice, discountRate } =
    getCartData(id);

  const item = {
    id: productData.id,
    name: productData.name,
    originalPrice,
    discountPrice,
    discountType: "",
    discountValue: discountRate,
    category: productData.shoes_type,
    image: productData.main_image_urls?.map((url) => toUrl(url))[0],
    addedAt: new Date().toISOString(),
  };

  wishlist.push(item);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};

export const removeToWishList = (id: number) => {
  const existing = localStorage.getItem("wishlist");
  const wishlist: WishListItem[] = existing ? JSON.parse(existing) : [];
  const filtered = wishlist.filter((p) => p.id !== id);
  localStorage.setItem("wishlist", JSON.stringify(filtered));
};
