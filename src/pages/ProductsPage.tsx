import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? "#87CEEB" : "#f5f5f5")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: ${(props) => (props.active ? "#5fb4d9" : "#e5e5e5")};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ProductCard = styled(Link)`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #333;
`;

const ProductPrice = styled.p`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #87ceeb;
`;

const ProductDescription = styled.p`
  margin: 10px 0 0 0;
  font-size: 0.9rem;
  color: #666;
`;

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const ProductsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 임시 상품 데이터
  const products: Product[] = [
    {
      id: "1",
      name: "프리미엄 티셔츠",
      price: 29000,
      description: "부드러운 코튼 소재의 프리미엄 티셔츠",
      image: "https://via.placeholder.com/300x200",
      category: "clothing",
    },
    {
      id: "2",
      name: "스니커즈",
      price: 89000,
      description: "편안한 착용감의 캐주얼 스니커즈",
      image: "https://via.placeholder.com/300x200",
      category: "shoes",
    },
    {
      id: "3",
      name: "청바지",
      price: 59000,
      description: "클래식한 디자인의 슬림핏 청바지",
      image: "https://via.placeholder.com/300x200",
      category: "clothing",
    },
    {
      id: "4",
      name: "가죽 자켓",
      price: 159000,
      description: "고급스러운 가죽 자켓",
      image: "https://via.placeholder.com/300x200",
      category: "clothing",
    },
    {
      id: "5",
      name: "스포츠 모자",
      price: 19000,
      description: "가볍고 통기성 좋은 스포츠 모자",
      image: "https://via.placeholder.com/300x200",
      category: "accessories",
    },
    {
      id: "6",
      name: "가방",
      price: 79000,
      description: "실용적인 수납공간의 캐주얼 가방",
      image: "https://via.placeholder.com/300x200",
      category: "accessories",
    },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <ProductsContainer>
      <Header>
        <Title>상품 목록</Title>
      </Header>
      <FilterContainer>
        <FilterButton
          active={selectedCategory === "all"}
          onClick={() => setSelectedCategory("all")}
        >
          전체
        </FilterButton>
        <FilterButton
          active={selectedCategory === "clothing"}
          onClick={() => setSelectedCategory("clothing")}
        >
          의류
        </FilterButton>
        <FilterButton
          active={selectedCategory === "shoes"}
          onClick={() => setSelectedCategory("shoes")}
        >
          신발
        </FilterButton>
        <FilterButton
          active={selectedCategory === "accessories"}
          onClick={() => setSelectedCategory("accessories")}
        >
          액세서리
        </FilterButton>
      </FilterContainer>
      <ProductGrid>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} to={`/products/${product.id}`}>
            <ProductImage src={product.image} alt={product.name} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
              <ProductDescription>{product.description}</ProductDescription>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </ProductsContainer>
  );
};

export default ProductsPage;
