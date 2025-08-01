import { useState, useEffect } from "react";
import { ProductService } from "../../api/productService";
import { ProductDetail } from "types/products";
import { addToRecentView } from "../../utils/cart/recentview";

/**
 * 상품 상세 정보 관리 훅
 *
 * URL 파라미터의 상품 ID를 기반으로 서버에서 상품 상세 정보를 가져옵니다.
 * 데이터 로드와 동시에 최근 본 상품 목록에도 추가합니다.
 * 로딩, 에러 상태를 포함하여 안전하게 데이터를 처리합니다.
 *
 * @param id URL에서 추출한 상품 ID (문자열 형태)
 */
export const useProductDetail = (id: string | undefined) => {
  // 상품 상세 정보 상태
  const [product, setProduct] = useState<ProductDetail | null>(null);
  // 로딩 상태 (초기값은 true로 설정)
  const [loading, setLoading] = useState(true);
  // 에러 상태
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * 서버에서 상품 상세 정보를 불러오는 비동기 함수
     */
    const loadProduct = async () => {
      // 상품 ID가 없는 경우 에러 처리
      if (!id) {
        setError("유효하지 않은 상품 ID입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);  // 로딩 시작
        
        // ProductService를 통해 상품 상세 정보 요청 (문자열 ID를 숫자로 변환)
        const productData = await ProductService.getProduct(Number(id));
        setProduct(productData);  // 성공시 데이터 설정
        
        // 최근 본 상품 목록에 추가 (사용자 경험 향상용)
        addToRecentView(productData);
      } catch (err: any) {
        // 에러 발생 시 에러 메시지 설정
        setError("상품 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);  // 성공/실패 관계없이 로딩 종료
      }
    };

    loadProduct();
  }, [id]); // id가 변경될 때마다 재실행

  // 상품 상세 정보와 로딩/에러 상태를 반환
  return { 
    product,   // 상품 상세 정보 (로딩 중이거나 에러 시 null)
    loading,   // 로딩 상태
    error      // 에러 메시지
  };
};
