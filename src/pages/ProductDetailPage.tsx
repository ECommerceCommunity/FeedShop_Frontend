import React, { useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";

const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProductName = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: #333;
`;

const ProductPrice = styled.p`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #87ceeb;
`;

const ProductDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  background-color: #f5f5f5;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e5e5e5;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const BuyButton = styled(Button)`
  background-color: #87ceeb;
  color: white;
  flex: 2;
`;

const CartButton = styled(Button)`
  background-color: #f5f5f5;
  color: #333;
  flex: 1;
`;

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  // 임시 상품 데이터
  const product: Product = {
    id: id || "1",
    name: "프리미엄 티셔츠",
    price: 29000,
    description:
      "부드러운 코튼 소재의 프리미엄 티셔츠입니다. 일상적인 착용에 최적화된 편안한 착용감을 제공하며, 다양한 스타일링이 가능한 기본 아이템입니다.",
    image: "https://via.placeholder.com/600x600",
    category: "clothing",
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleBuy = () => {
    console.log("구매하기:", { product, quantity });
  };

  const handleAddToCart = () => {
    console.log("장바구니 담기:", { product, quantity });
  };

  return (
    <ProductDetailContainer>
      <ProductImage src={product.image} alt={product.name} />
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
        <ProductDescription>{product.description}</ProductDescription>
        <QuantityContainer>
          <QuantityButton onClick={() => handleQuantityChange(quantity - 1)}>
            -
          </QuantityButton>
          <QuantityInput
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            min="1"
          />
          <QuantityButton onClick={() => handleQuantityChange(quantity + 1)}>
            +
          </QuantityButton>
        </QuantityContainer>
        <ButtonGroup>
          <BuyButton onClick={handleBuy}>구매하기</BuyButton>
          <CartButton onClick={handleAddToCart}>장바구니</CartButton>
        </ButtonGroup>
      </ProductInfo>
    </ProductDetailContainer>
  );
};

export default ProductDetailPage;
