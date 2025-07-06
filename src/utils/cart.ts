import { WishListItem } from "types/types";
import products from "../pages/data/products/products.json";
import discounts from "../pages/data/products/discounts.json";
import { getDiscountPrice } from "./price";
import { isDiscountValid } from "./discount";

export const addToWishList = (id: number) => {
  const existing = localStorage.getItem("wishlist");
  const wishlist: WishListItem[] = existing ? JSON.parse(existing) : [];

  if (wishlist.some((item) => item.id === id)) {
    return;
  }

  const productData = products.find((product) => product.id === id);
  if (!productData) {
    throw new Error("Product Data Not Found");
  }

  const originalPrice = Number(
    typeof productData?.price === "number" ? productData.price : 0
  );
  const discountDataRaw = discounts.find((d) => d.product_id === Number(id));
  const discountDataTyped = discountDataRaw
    ? {
        ...discountDataRaw,
        discount_type: (discountDataRaw.discount_type ?? "정률") as
          | "정률"
          | "정액",
      }
    : undefined;
  const safeDiscount = isDiscountValid(discountDataTyped)
    ? discountDataTyped
    : undefined;
  const discountPrice = getDiscountPrice(originalPrice, safeDiscount);
  const isDiscounted = discountPrice < originalPrice;

  const item = {
    id: productData.id,
    name: productData.name,
    originalPrice: productData.price,
    discountPrice: Math.floor(discountPrice),
    discountRate: isDiscounted
      ? Math.floor(((originalPrice - discountPrice) / originalPrice) * 100)
      : 0,
    category: productData.shoes_type,
    image: productData.main_image_urls[0],
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
