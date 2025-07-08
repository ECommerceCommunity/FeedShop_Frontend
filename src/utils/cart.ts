import products from "../pages/data/products/products.json";
import discounts from "../pages/data/products/discounts.json";
import { isDiscountValid } from "./discount";
import { getDiscountPrice } from "./price";

export const getCartData = (id: number) => {
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

    return {
      productData,
      originalPrice,
      discountPrice: Math.floor(discountPrice),
      discountRate: isDiscounted
        ? Math.floor(((originalPrice - discountPrice) / originalPrice) * 100)
        : 0,
    };
};
