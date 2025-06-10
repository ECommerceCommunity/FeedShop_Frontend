import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Banner = styled.div`
  width: 100%;
  height: 400px;
  background-color: var(--primary-color);
  border-radius: 8px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--text-color);
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const ProductCard = styled(Link)`
  text-decoration: none;
  color: var(--text-color);
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  font-size: 16px;
  margin-bottom: 8px;
`;

const ProductPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: var(--primary-color);
`;

const HomePage: React.FC = () => {
  // 임시 상품 데이터
  const products = [
    { id: 1, name: "상품 1", price: "29,000원" },
    { id: 2, name: "상품 2", price: "39,000원" },
    { id: 3, name: "상품 3", price: "49,000원" },
    { id: 4, name: "상품 4", price: "59,000원" },
  ];

  return (
    <HomeContainer>
      <Banner>쇼핑몰 메인 배너</Banner>

      <Section>
        <SectionTitle>신상품</SectionTitle>
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} to={`/products/${product.id}`}>
              <ProductImage>상품 이미지</ProductImage>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price}</ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </Section>

      <Section>
        <SectionTitle>베스트 상품</SectionTitle>
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} to={`/products/${product.id}`}>
              <ProductImage>상품 이미지</ProductImage>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price}</ProductPrice>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </Section>
    </HomeContainer>
  );
};

export default HomePage;
