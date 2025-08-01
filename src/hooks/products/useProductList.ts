import { useState, useEffect } from "react";
import { ProductService } from "../../api/productService";
import { ProductListItem } from "types/products";

export const useProductList = (pageSize: number = 9) => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadProducts = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ProductService.getProducts(page, pageSize);

      setProducts(response.content || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("상품 목록 로딩 실패:", err);
      setError("상품 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      loadProducts(page);
    }
  };

  const retry = () => {
    loadProducts(currentPage);
  };

  useEffect(() => {
    loadProducts(0);
  }, []);

  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    loadProducts,
    handlePageChange,
    retry,
  };
};
