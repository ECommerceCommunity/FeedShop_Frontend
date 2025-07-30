import { FC } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.05)" points="0,1000 1000,0 1000,1000"/></svg>');
    background-size: cover;
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
  background: linear-gradient(135deg, #ffffff, #e0f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${float} 3s ease-in-out infinite;
  text-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);

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
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  color: #667eea;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;

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
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);

    &::before {
      left: 100%;
    }
  }
`;

const SecondaryButton = styled(Link)`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

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
    transition: left 0.5s;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-3px);

    &::before {
      left: 100%;
    }
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
  background: linear-gradient(135deg, #ffffff, #e0f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${pulse} 2s infinite;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
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
  box-shadow: 0 8px 32px rgba(14, 165, 233, 0.12);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  position: relative;
  animation: ${fadeInUp} 1s ease-out;
  border: 1px solid rgba(14, 165, 233, 0.1);

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 48px rgba(14, 165, 233, 0.25);
    border-color: rgba(14, 165, 233, 0.3);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #0ea5e9, #3b82f6, #6366f1);
    transform: scaleX(0);
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
    background: radial-gradient(circle, rgba(14, 165, 233, 0.03) 0%, transparent 70%);
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
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
      rgba(99, 102, 241, 0.1)
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover img {
    transform: scale(1.08);
  }

  &:hover::after {
    opacity: 1;
  }
`;

const ProductInfo = styled.div`
  padding: 2rem 1.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
  backdrop-filter: blur(10px);
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1f2937;
  line-height: 1.4;
  transition: color 0.3s ease;

  &:hover {
    color: #3b82f6;
  }
`;

const ProductPrice = styled.p`
  color: #3b82f6;
  font-weight: 800;
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProductDescription = styled.p`
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ViewMoreButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);

  &:hover {
    color: #6366f1;
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateX(5px);
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

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(14, 165, 233, 0.12);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 1s ease-out;
  border: 1px solid rgba(14, 165, 233, 0.1);

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 48px rgba(14, 165, 233, 0.25);
    border-color: rgba(14, 165, 233, 0.3);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #0ea5e9, #3b82f6, #6366f1);
    transform: scaleX(0);
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
    background: radial-gradient(circle, rgba(14, 165, 233, 0.03) 0%, transparent 70%);
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
  background: linear-gradient(135deg, #0ea5e9, #3b82f6, #6366f1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 2.2rem;
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.4);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0ea5e9, #3b82f6, #6366f1);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: scale(1.15) rotate(5deg);
    animation: ${pulse} 0.6s ease-in-out;
    box-shadow: 0 16px 40px rgba(14, 165, 233, 0.5);
  }

  &:hover::before {
    opacity: 0.3;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: #1f2937;
  transition: color 0.3s ease;

  &:hover {
    color: #3b82f6;
  }
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.7;
  font-size: 1rem;
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 6rem 0;
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.05)" points="0,0 1000,1000 0,1000"/></svg>');
    background-size: cover;
  }
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: white;
  animation: ${fadeInUp} 1s ease-out;
`;

const CTADescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  line-height: 1.6;
  animation: ${fadeInUp} 1s ease-out 0.2s both;
`;

const Footer = styled.footer`
  background: #1f2937;
  color: white;
  padding: 3rem 0 2rem;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
  }
`;

const FooterBrand = styled.div`
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`;

const FooterBrandTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FooterBrandDescription = styled.p`
  color: #9ca3af;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    text-align: right;
  }
`;

const FooterLink = styled.a`
  color: #9ca3af;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 0;

  &:hover {
    color: #667eea;
    transform: translateX(5px);
  }
`;

const FooterCopyright = styled.div`
  border-top: 1px solid #374151;
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
  color: #9ca3af;
`;

const HomePage: FC = () => {
  const { user } = useAuth();

  // 임시 상품 데이터
  const products = [
    {
      id: 1,
      name: "프리미엄 티셔츠",
      price: "29,000원",
      description: "부드러운 코튼 소재의 프리미엄 티셔츠",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "클래식 청바지",
      price: "59,000원",
      description: "클래식한 디자인의 슬림핏 청바지",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      name: "가죽 크로스백",
      price: "89,000원",
      description: "고급스러운 가죽 소재의 크로스백",
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      name: "스니커즈",
      price: "79,000원",
      description: "편안한 착용감의 캐주얼 스니커즈",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
    },
  ];

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
                    <PrimaryButton to="/admin-dashboard">
                      <i
                        className="fas fa-chart-line"
                        style={{ marginRight: "8px" }}
                      ></i>
                      관리자 대시보드
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton to="/store-home">
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
                    <SecondaryButton to="/store-home">
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
                  <SecondaryButton to="/store-home">
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

      <StatsSection>
        <Container>
          <StatsGrid>
            <StatCard>
              <StatNumber>10,000+</StatNumber>
              <StatLabel>활성 사용자</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50,000+</StatNumber>
              <StatLabel>총 주문</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>₩2.5억</StatNumber>
              <StatLabel>총 매출</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>4.8★</StatNumber>
              <StatLabel>고객 만족도</StatLabel>
            </StatCard>
          </StatsGrid>
        </Container>
      </StatsSection>

      <ProductsSection>
        <Container>
          <SectionTitle>인기 상품</SectionTitle>
          <SectionSubtitle>
            고객들이 가장 많이 찾는 인기 상품들을 만나보세요
          </SectionSubtitle>
          <ProductsGrid>
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductImage>
                  <img src={product.image} alt={product.name} />
                </ProductImage>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>{product.price}</ProductPrice>
                  <ProductDescription>{product.description}</ProductDescription>
                  <ViewMoreButton to={`/product/${product.id}`}>
                    자세히 보기
                    <i className="fas fa-arrow-right"></i>
                  </ViewMoreButton>
                </ProductInfo>
              </ProductCard>
            ))}
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
                <i className="fas fa-chart-line"></i>
              </FeatureIcon>
              <FeatureTitle>데이터 분석</FeatureTitle>
              <FeatureDescription>
                매출과 고객 행동을 분석하여 더 나은 의사결정을 지원하는 강력한
                분석 도구를 제공합니다.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-comments"></i>
              </FeatureIcon>
              <FeatureTitle>실시간 채팅</FeatureTitle>
              <FeatureDescription>
                고객과의 즉각적인 소통을 위한 채팅 시스템으로 빠른 응답과 높은
                고객 만족도를 달성합니다.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </Container>
      </FeaturesSection>

      <CTASection>
        <Container>
          <CTATitle>지금 바로 시작하세요</CTATitle>
          <CTADescription>
            FeedShop과 함께라면 더 스마트하고 효율적인 비즈니스 운영이
            가능합니다. 지금 바로 무료로 시작해보세요.
          </CTADescription>
          <ButtonGroup>
            {user ? (
              <>
                {user.userType === "admin" ? (
                  <>
                    <PrimaryButton to="/admin-dashboard">
                      <i
                        className="fas fa-chart-line"
                        style={{ marginRight: "8px" }}
                      ></i>
                      관리자 대시보드
                    </PrimaryButton>
                    <SecondaryButton to="/store-home">
                      <i
                        className="fas fa-store"
                        style={{ marginRight: "8px" }}
                      ></i>
                      스토어 관리
                    </SecondaryButton>
                  </>
                ) : (
                  <PrimaryButton to="/become-admin">
                    <i
                      className="fas fa-user-shield"
                      style={{ marginRight: "8px" }}
                    ></i>
                    관리자 전환하기
                  </PrimaryButton>
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
                <PrimaryButton to="/login">
                  <i
                    className="fas fa-sign-in-alt"
                    style={{ marginRight: "8px" }}
                  ></i>
                  로그인하기
                </PrimaryButton>
                <SecondaryButton to="/store-home">
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

      <Footer>
        <Container>
          <FooterContent>
            <FooterBrand>
              <FooterBrandTitle>FeedShop</FooterBrandTitle>
              <FooterBrandDescription>
                스마트한 쇼핑 경험을 위한 최고의 선택. 고객과 비즈니스 모두를
                위한 혁신적인 플랫폼입니다.
              </FooterBrandDescription>
            </FooterBrand>
            <FooterLinks>
              <FooterLink href="#">이용약관</FooterLink>
              <FooterLink href="#">개인정보처리방침</FooterLink>
              <FooterLink href="#">고객센터</FooterLink>
              <FooterLink href="#">문의하기</FooterLink>
            </FooterLinks>
          </FooterContent>
          <FooterCopyright>
            <p>&copy; 2025 FeedShop. All rights reserved.</p>
          </FooterCopyright>
        </Container>
      </Footer>
    </HomeContainer>
  );
};

export default HomePage;
