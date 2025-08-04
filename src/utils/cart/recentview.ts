import { RecentViewItem } from "types/cart";
import { ProductDetail } from "types/products";

export const addToRecentView = (productData: ProductDetail) => {
  const existing = localStorage.getItem("recentview");
  let recentView: RecentViewItem[] = existing ? JSON.parse(existing) : [];

  recentView = recentView.filter((item) => item.id !== productData.productId);

  const item: RecentViewItem = {
    id: productData.productId,
    name: productData.name,
    originalPrice: productData.price,
    discountPrice: productData.discountPrice,
    discountType: productData.discountType,
    discountValue: productData.discountValue,
    category: productData.categoryType,
    image: productData.images[0].url,
    viewedAt: new Date().toISOString(),
  };

  // 최신순
  recentView.unshift(item);

  // localStorage에서는 최대 50개까지만 저장. (UI에서는 8개만 보여줌)
  // 실제 서버 적용하면 일정 기간 이후 자동 삭제 적용 (TTL)
  if (recentView.length > 50) {
    recentView = recentView.slice(0, 50);
  }

  localStorage.setItem("recentview", JSON.stringify(recentView));
};

export const getRecentViewItems = (limit: number = 8): RecentViewItem[] => {
  const existing = localStorage.getItem("recentview");
  const recentView: RecentViewItem[] = existing ? JSON.parse(existing) : [];

  return recentView
    .sort(
      (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
    )
    .slice(0, limit);
};
