import { RecentViewItem } from "types/types";
import products from '../pages/data/products/products.json'
import discounts from '../pages/data/products/discounts.json'
import { isDiscountValid } from "./discount";
import { getDiscountPrice } from "./price";

export const addToRecentView = (id: number) => {
    const existing = localStorage.getItem("recentview");
    let recentView: RecentViewItem[] = existing ? JSON.parse(existing) : [];

    recentView = recentView.filter((item) => item.id !== id);

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

    const item: RecentViewItem = {
        id: productData.id,
        name: productData.name,
        originalPrice: productData.price,
        discountPrice: Math.floor(discountPrice),
        discountRate: isDiscounted
            ? Math.floor(((originalPrice - discountPrice) / originalPrice) * 100)
            : 0,
        category: productData.shoes_type || "",
        image: productData.main_image_urls[0],
        viewedAt: new Date().toISOString(),
    };

    // 최신순
    recentView.unshift(item);
    
    // localStorage에서는 최대 50개까지만 저장. (UI에서는 8개만 보여줌)
    // 실제 서버 적용하면 일정 기간 이후 자동 삭제 적용 (TTL)
    if (recentView.length > 50) {
        recentView = recentView.slice(0, 50);
    }

    localStorage.setItem('recentview', JSON.stringify(recentView));
};

export const getRecentViewItems = (limit: number = 8): RecentViewItem[] => {
    const existing = localStorage.getItem("recentview");
    const recentView: RecentViewItem[] = existing ? JSON.parse(existing) : [];

    return recentView.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()).slice(0, limit);
}