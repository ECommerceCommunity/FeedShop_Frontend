import { useState, useEffect } from 'react';
import { ReviewService } from '../../api/reviewService';
import { ProductStatistics } from '../../types/review';

interface UseProductStatisticsReturn {
  statistics: ProductStatistics | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProductStatistics = (productId: number | undefined): UseProductStatisticsReturn => {
  const [statistics, setStatistics] = useState<ProductStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    if (!productId) {
      setStatistics(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await ReviewService.getProductStatistics(productId);
      setStatistics(data);

    } catch (err: any) {
      console.error('통계 조회 실패:', err);
      setError(err.response?.data?.message || '통계를 불러오는데 실패했습니다.');
      
      // 에러 발생 시에도 빈 통계 데이터를 설정하여 UI가 깨지지 않도록 함
      setStatistics({
        totalReviews: 0,
        cushionStatistics: {
          distribution: {},
          percentage: {},
          mostSelected: null,
          averageScore: 0.0
        },
        sizeFitStatistics: {
          distribution: {},
          percentage: {},
          mostSelected: null,
          averageScore: 0.0
        },
        stabilityStatistics: {
          distribution: {},
          percentage: {},
          mostSelected: null,
          averageScore: 0.0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [productId]);

  const refetch = () => {
    fetchStatistics();
  };

  return {
    statistics,
    loading,
    error,
    refetch
  };
};