import { useState, useEffect } from "react";
import { ProductService } from "../../api/productService";
import { ProductDetail } from "types/products";
import { addToRecentView } from "../../utils/cart/recentview";

export const useProductDetail = (id: string | undefined) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError("유효하지 않은 상품 ID입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await ProductService.getProduct(Number(id));
        setProduct(productData);
        addToRecentView(productData);
      } catch (err: any) {
        setError("상품 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  return { product, loading, error };
};
