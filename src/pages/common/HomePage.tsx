import { FC, useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ProductService } from "../../api/productService";
import { ProductListItem } from "../../types/products";
import { toUrl } from "utils/common/images";

// 애니메이션 정의
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
  color: white;
  padding: 8rem 0 6rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(249,115,22,0.1)" points="0,1000 1000,0 1000,1000"/></svg>');
    background-size: cover;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 30% 20%,
        rgba(249, 115, 22, 0.2) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(239, 68, 68, 0.2) 0%,
        transparent 50%
      );
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
`;

const HeroContent = styled.div`
  text-align: center;
  animation: ${fadeInUp} 1s ease-out;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff, #fef3c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${float} 3s ease-in-out infinite;
  text-shadow: 0 4px 20px rgba(249, 115, 22, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
  line-height: 1.6;
  animation: ${fadeInUp} 1s ease-out 0.3s both;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  animation: ${fadeInUp} 1s ease-out 0.6s both;
`;

const PrimaryButton = styled(Link)`
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3);
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(249, 115, 22, 0.4);
    background: linear-gradient(135deg, #ea580c, #dc2626);
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(249, 115, 22, 0.5);
    transform: translateY(-3px);
    color: #f97316;
  }
`;

const StatsSection = styled.section`
  padding: 4rem 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  text-align: center;
  color: white;
  animation: ${fadeInUp} 1s ease-out;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffffff, #fef3c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${pulse} 2s infinite;
  animation: ${pulse} 2s infinite;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
`;

const ProductsSection = styled.section`
  padding: 6rem 0;
  background: white;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(
      to bottom,
      rgba(102, 126, 234, 0.1),
      transparent
    );
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: #1f2937;
  animation: ${fadeInUp} 1s ease-out;
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 4rem;
  color: #6b7280;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  align-items: start; /* 카드들을 상단 정렬 */

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(249, 115, 22, 0.12);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  position: relative;
  animation: ${fadeInUp} 1s ease-out;
  border: 1px solid rgba(249, 115, 22, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%; /* 전체 높이 사용 */
  min-height: 480px; /* 최소 높이 지정 */

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 48px rgba(249, 115, 22, 0.25);
    border-color: rgba(249, 115, 22, 0.3);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
    transform: scaleX(0);
    transition: transform 0.4s ease;
    transition: transform 0.4s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(249, 115, 22, 0.03) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 280px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  height: 280px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(14, 165, 233, 0.1),
      rgba(99, 102, 241, 0.1) rgba(14, 165, 233, 0.1),
      rgba(99, 102, 241, 0.1)
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    transition: opacity 0.4s ease;
  }

  &:hover img {
    transform: scale(1.08);
    transform: scale(1.08);
  }

  &:hover::after {
    opacity: 1;
  }
`;

const ProductInfo = styled.div`
  padding: 2rem 1.5rem;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
  backdrop-filter: blur(10px);
  flex: 1; /* 남은 공간 모두 차지 */
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1f2937;
  line-height: 1.4;
  transition: color 0.3s ease;
  min-height: 3.2rem; /* 최소 2줄 높이 확보 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 2줄로 제한 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #f97316;
  }
`;

const ProductPrice = styled.p`
  color: #f97316;
  font-weight: 800;
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #f97316, #dc2626);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProductDescription = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: auto; /* 자동 마진으로 버튼을 아래로 푸시 */
  line-height: 1.6;
  flex: 1; /* 남은 공간 차지 */
`;

const ViewMoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #f97316;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.2);
  margin-top: 1rem; /* 상단 마진 추가 */

  &:hover {
    color: #dc2626;
    background: rgba(220, 38, 38, 0.15);
    border-color: rgba(220, 38, 38, 0.3);
    transform: translateX(5px);
  }

  i {
    transition: transform 0.3s ease;
  }

  &:hover i {
    transform: translateX(3px);
  }

  i {
    transition: transform 0.3s ease;
  }

  &:hover i {
    transform: translateX(3px);
  }
`;

const FeaturesSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  position: relative;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FeatureCard = styled.div`
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(249, 115, 22, 0.12);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 1s ease-out;
  border: 1px solid rgba(249, 115, 22, 0.1);

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 48px rgba(249, 115, 22, 0.25);
    border-color: rgba(249, 115, 22, 0.3);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
    transform: scaleX(0);
    transition: transform 0.4s ease;
    transition: transform 0.4s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(249, 115, 22, 0.03) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const FeatureIcon = styled.div`
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  margin: 0 auto 2rem;
  color: white;
  font-size: 2.2rem;
  box-shadow: 0 12px 32px rgba(249, 115, 22, 0.4);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: scale(1.15) rotate(5deg);
    transform: scale(1.15) rotate(5deg);
    animation: ${pulse} 0.6s ease-in-out;
    box-shadow: 0 16px 40px rgba(249, 115, 22, 0.5);
  }

  &:hover::before {
    opacity: 0.3;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  color: #1f2937;
  transition: color 0.3s ease;

  &:hover {
    color: #f97316;
  }
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.7;
  font-size: 1rem;
  line-height: 1.7;
  font-size: 1rem;
`;

const CTASection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 30% 30%,
        rgba(249, 115, 22, 0.15) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 70%,
        rgba(239, 68, 68, 0.1) 0%,
        transparent 50%
      );
  }
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff, #fef3c7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTASubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
`;

const CTAButton = styled(Link)`
  background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(249, 115, 22, 0.3);
  position: relative;
  z-index: 2;
  overflow: hidden;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 40px rgba(249, 115, 22, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }
`;

const HighlightsSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  position: relative;
`;

const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const HighlightCard = styled.div`
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(249, 115, 22, 0.12);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 1s ease-out;
  border: 1px solid rgba(249, 115, 22, 0.1);

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 48px rgba(249, 115, 22, 0.25);
    border-color: rgba(249, 115, 22, 0.3);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
    transform: scaleX(0);
    transition: transform 0.4s ease;
    transition: transform 0.4s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(249, 115, 22, 0.03) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const HighlightIcon = styled.div`
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  margin: 0 auto 2rem;
  color: white;
  font-size: 2.2rem;
  box-shadow: 0 12px 32px rgba(249, 115, 22, 0.4);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: scale(1.15) rotate(5deg);
    transform: scale(1.15) rotate(5deg);
    animation: ${pulse} 0.6s ease-in-out;
    box-shadow: 0 16px 40px rgba(249, 115, 22, 0.5);
  }

  &:hover::before {
    opacity: 0.3;
  }
`;

const HighlightTitle = styled.h3`
  font-size: 1.4rem;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  color: #1f2937;
  transition: color 0.3s ease;

  &:hover {
    color: #f97316;
  }
`;

const HighlightDescription = styled.p`
  color: #6b7280;
  line-height: 1.7;
  font-size: 1rem;
  line-height: 1.7;
  font-size: 1rem;
`;

const HomePage: FC = () => {
  const { user } = useAuth();
  const [popularProducts, setPopularProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 인기 상품 데이터 가져오기 (wishNumber 기준 정렬)
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ProductService.getFilteredProducts({
          sort: "popular",
          size: 4, // 상위 4개 상품만
          page: 0,
        });
        setPopularProducts(response.content);
      } catch (err) {
        console.error("인기 상품 조회 실패:", err);
        setError("인기 상품을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  // 가격 포맷팅 함수
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString()}원`;
  };

  return (
    <HomeContainer>
      <HeroSection>
        <Container>
          <HeroContent>
            <Title>FeedShop</Title>
            <Subtitle>스마트한 쇼핑 경험을 위한 최고의 선택</Subtitle>
            <ButtonGroup>
              {user ? (
                <>
                  {user.userType === "admin" ? (
                    <PrimaryButton to="/admin/dashboard">
                      <i
                        className="fas fa-chart-line"
                        style={{ marginRight: "8px" }}
                      ></i>
                      관리자 대시보드
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton to="/products">
                      <i
                        className="fas fa-shopping-bag"
                        style={{ marginRight: "8px" }}
                      ></i>
                      쇼핑 시작하기
                    </PrimaryButton>
                  )}
                  <SecondaryButton to="/products">
                    <i
                      className="fas fa-th-large"
                      style={{ marginRight: "8px" }}
                    ></i>
                    상품 둘러보기
                  </SecondaryButton>
                  {user.userType === "admin" && (
                    <SecondaryButton to="/store">
                      <i
                        className="fas fa-store"
                        style={{ marginRight: "8px" }}
                      ></i>
                      스토어 관리
                    </SecondaryButton>
                  )}
                </>
              ) : (
                <>
                  <PrimaryButton to="/login">
                    <i
                      className="fas fa-sign-in-alt"
                      style={{ marginRight: "8px" }}
                    ></i>
                    로그인하기
                  </PrimaryButton>
                  <SecondaryButton to="/store">
                    <i
                      className="fas fa-store"
                      style={{ marginRight: "8px" }}
                    ></i>
                    스토어 입장하기
                  </SecondaryButton>
                </>
              )}
            </ButtonGroup>
          </HeroContent>
        </Container>
      </HeroSection>

      <ProductsSection>
        <Container>
          <SectionTitle>인기 상품</SectionTitle>
          <SectionSubtitle>
            고객들이 가장 많이 찾는 인기 상품들을 만나보세요
          </SectionSubtitle>
          <ProductsGrid>
            {loading ? (
              // 로딩 상태 표시
              Array.from({ length: 4 }).map((_, index) => (
                <ProductCard
                  key={`loading-${index}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductImage
                    style={{
                      background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: "#9ca3af",
                        fontSize: "1rem",
                      }}
                    >
                      로딩 중...
                    </div>
                  </ProductImage>
                  <ProductInfo>
                    <div
                      style={{
                        height: "20px",
                        background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                        borderRadius: "4px",
                        marginBottom: "0.75rem",
                      }}
                    ></div>
                    <div
                      style={{
                        height: "24px",
                        background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                        borderRadius: "4px",
                        marginBottom: "0.75rem",
                        width: "60%",
                      }}
                    ></div>
                  </ProductInfo>
                </ProductCard>
              ))
            ) : error ? (
              // 에러 상태 표시
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "2rem",
                  color: "#ef4444",
                  fontSize: "1.1rem",
                }}
              >
                {error}
                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={() => window.location.reload()}
                    style={{
                      background: "#f97316",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : popularProducts.length === 0 ? (
              // 상품이 없는 경우
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "2rem",
                  color: "#6b7280",
                  fontSize: "1.1rem",
                }}
              >
                현재 인기 상품이 없습니다.
              </div>
            ) : (
              // 정상적인 상품 목록 표시
              popularProducts.map((product, index) => (
                <ProductCard
                  key={product.productId}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductImage>
                    {product.mainImageUrl ? (
                      <img
                        src={toUrl(product.mainImageUrl)}
                        alt={product.name}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #f8fafc, #e2e8f0)",
                          color: "#9ca3af",
                          fontSize: "1rem",
                        }}
                      >
                        <i
                          className="fas fa-image"
                          style={{ marginRight: "0.5rem" }}
                        ></i>
                        이미지 없음
                      </div>
                    )}
                  </ProductImage>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>
                      {product.discountPrice > 0 &&
                      product.discountPrice < product.price ? (
                        <>
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#9ca3af",
                              fontSize: "0.9rem",
                              marginRight: "0.5rem",
                            }}
                          >
                            {formatPrice(product.price)}
                          </span>
                          {formatPrice(product.discountPrice)}
                        </>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </ProductPrice>
                    <ProductDescription>{product.storeName}</ProductDescription>
                    <ViewMoreButton to={`/products/${product.productId}`}>
                      자세히 보기
                      <i className="fas fa-arrow-right"></i>
                    </ViewMoreButton>
                  </ProductInfo>
                </ProductCard>
              ))
            )}
          </ProductsGrid>
        </Container>
      </ProductsSection>

      <FeaturesSection>
        <Container>
          <SectionTitle>주요 기능</SectionTitle>
          <SectionSubtitle>
            FeedShop만의 특별한 기능들로 더 나은 비즈니스를 경험하세요
          </SectionSubtitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-store"></i>
              </FeatureIcon>
              <FeatureTitle>스마트 스토어</FeatureTitle>
              <FeatureDescription>
                실시간 재고 관리와 주문 처리를 위한 최적의 솔루션으로 효율적인
                비즈니스 운영을 지원합니다.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-users"></i>
              </FeatureIcon>
              <FeatureTitle>커뮤니티 피드</FeatureTitle>
              <FeatureDescription>
                사용자들이 상품 리뷰와 경험을 공유하는 활발한 커뮤니티로 신뢰할
                수 있는 구매 정보를 제공합니다.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </Container>
      </FeaturesSection>

      <CTASection>
        <Container>
          <CTATitle>지금 바로 시작하세요</CTATitle>
          <CTASubtitle>
            FeedShop과 함께라면 더 스마트하고 효율적인 비즈니스 운영이
            가능합니다. 지금 바로 무료로 시작해보세요.
          </CTASubtitle>
          <ButtonGroup>
            {user ? (
              <>
                {user.userType === "admin" ? (
                  <>
                    <CTAButton to="/admin/dashboard">
                      <i
                        className="fas fa-chart-line"
                        style={{ marginRight: "8px" }}
                      ></i>
                      관리자 대시보드
                    </CTAButton>
                    <SecondaryButton to="/store">
                      <i
                        className="fas fa-store"
                        style={{ marginRight: "8px" }}
                      ></i>
                      스토어 관리
                    </SecondaryButton>
                  </>
                ) : (
                  <CTAButton to="/become-seller">
                    <i
                      className="fas fa-user-shield"
                      style={{ marginRight: "8px" }}
                    ></i>
                    판매자 되기
                  </CTAButton>
                )}
                <SecondaryButton to="/products">
                  <i
                    className="fas fa-shopping-bag"
                    style={{ marginRight: "8px" }}
                  ></i>
                  쇼핑하기
                </SecondaryButton>
              </>
            ) : (
              <>
                <CTAButton to="/login">
                  <i
                    className="fas fa-sign-in-alt"
                    style={{ marginRight: "8px" }}
                  ></i>
                  로그인하기
                </CTAButton>
                <SecondaryButton to="/store">
                  <i
                    className="fas fa-store"
                    style={{ marginRight: "8px" }}
                  ></i>
                  스토어 둘러보기
                </SecondaryButton>
              </>
            )}
          </ButtonGroup>
        </Container>
      </CTASection>
    </HomeContainer>
  );
};

export default HomePage;
