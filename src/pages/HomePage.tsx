import { FC } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const HomeContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const HeroSection = styled.div`
  background: linear-gradient(to right, #87ceeb, #5cacee);
  color: white;
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const HeroContent = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const PrimaryButton = styled(Link)`
  background-color: white;
  color: #87ceeb;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const SecondaryButton = styled(Link)`
  background-color: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: white;
    color: #87ceeb;
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
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
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FeatureIcon = styled.div`
  color: #87ceeb;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
`;

const CTASection = styled.section`
  background-color: #f3f4f6;
  padding: 5rem 0;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const CTADescription = styled.p`
  color: #6b7280;
  max-width: 32rem;
  margin: 0 auto 2rem;
`;

const Footer = styled.footer`
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 2rem 0;
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const FooterBrand = styled.div`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterLink = styled.a`
  color: #6b7280;
  transition: color 0.2s;

  &:hover {
    color: #87ceeb;
  }
`;

const FooterCopyright = styled.div`
  border-top: 1px solid #e5e7eb;
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
  color: #6b7280;
`;

const ProductsSection = styled.section`
  padding: 5rem 0;
  background-color: white;
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
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f3f4f6;
  border-radius: 0.5rem 0.5rem 0 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  color: #87ceeb;
  font-weight: 600;
  font-size: 1.25rem;
`;

const ProductDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ViewMoreButton = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  color: #87ceeb;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const HomePage: FC = () => {
  // 임시 상품 데이터
  const products = [
    {
      id: 1,
      name: "프리미엄 티셔츠",
      price: "29,000원",
      description: "부드러운 코튼 소재의 프리미엄 티셔츠",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      name: "클래식 청바지",
      price: "59,000원",
      description: "클래식한 디자인의 슬림핏 청바지",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      name: "가죽 크로스백",
      price: "89,000원",
      description: "고급스러운 가죽 소재의 크로스백",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 4,
      name: "스니커즈",
      price: "79,000원",
      description: "편안한 착용감의 캐주얼 스니커즈",
      image: "https://via.placeholder.com/300x200",
    },
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <Container>
          <HeroContent>
            <Title>ShopChat</Title>
            <Subtitle>스마트한 쇼핑 경험을 위한 최고의 선택</Subtitle>
            <ButtonGroup>
              <PrimaryButton to="/store-home">스토어 입장하기</PrimaryButton>
              <SecondaryButton to="/admin-dashboard">
                관리자 대시보드
              </SecondaryButton>
            </ButtonGroup>
          </HeroContent>
        </Container>
      </HeroSection>

      <ProductsSection>
        <Container>
          <SectionTitle>인기 상품</SectionTitle>
          <ProductsGrid>
            {products.map((product) => (
              <ProductCard key={product.id}>
                <ProductImage>
                  <img src={product.image} alt={product.name} />
                </ProductImage>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>{product.price}</ProductPrice>
                  <ProductDescription>{product.description}</ProductDescription>
                  <ViewMoreButton to={`/product/${product.id}`}>
                    자세히 보기
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
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-store"></i>
              </FeatureIcon>
              <FeatureTitle>스마트 스토어</FeatureTitle>
              <FeatureDescription>
                실시간 재고 관리와 주문 처리를 위한 최적의 솔루션
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-chart-line"></i>
              </FeatureIcon>
              <FeatureTitle>데이터 분석</FeatureTitle>
              <FeatureDescription>
                매출과 고객 행동을 분석하여 더 나은 의사결정을 지원
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <i className="fas fa-comments"></i>
              </FeatureIcon>
              <FeatureTitle>실시간 채팅</FeatureTitle>
              <FeatureDescription>
                고객과의 즉각적인 소통을 위한 채팅 시스템
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </Container>
      </FeaturesSection>

      <CTASection>
        <Container>
          <CTATitle>지금 바로 시작하세요</CTATitle>
          <CTADescription>
            ShopChat과 함께라면 더 스마트하고 효율적인 비즈니스 운영이
            가능합니다. 지금 바로 무료로 시작해보세요.
          </CTADescription>
          <ButtonGroup>
            <PrimaryButton to="/store-home">스토어 시작하기</PrimaryButton>
            <SecondaryButton to="/admin-dashboard">
              관리자 페이지
            </SecondaryButton>
          </ButtonGroup>
        </Container>
      </CTASection>

      <Footer>
        <Container>
          <FooterContent>
            <FooterBrand>
              <Title style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                ShopChat
              </Title>
              <FeatureDescription>
                스마트한 쇼핑 경험을 위한 최고의 선택
              </FeatureDescription>
            </FooterBrand>
            <FooterLinks>
              <FooterLink href="#">이용약관</FooterLink>
              <FooterLink href="#">개인정보처리방침</FooterLink>
              <FooterLink href="#">고객센터</FooterLink>
            </FooterLinks>
          </FooterContent>
          <FooterCopyright>
            <p>&copy; 2025 ShopChat. All rights reserved.</p>
          </FooterCopyright>
        </Container>
      </Footer>
    </HomeContainer>
  );
};

export default HomePage;
