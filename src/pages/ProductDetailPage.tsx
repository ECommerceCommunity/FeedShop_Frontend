import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

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

const ReviewFormContainer = styled.div`
  grid-column: 1 / span 2;
  margin-top: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  padding: 32px 24px;
`;

const ReviewTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 18px;
  color: #333;
`;

const StarGroup = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 18px;
`;

const Star = styled.span<{ selected: boolean }>`
  font-size: 2rem;
  color: ${(props) => (props.selected ? "#FFD600" : "#ddd")};
  cursor: pointer;
`;

const ReviewTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 12px;
  font-size: 1rem;
  margin-bottom: 18px;
  resize: vertical;
`;

const ImageInput = styled.input`
  margin-bottom: 18px;
`;

const ReviewSubmitButton = styled.button`
  background: #87ceeb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 32px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #5fb4d9;
  }
`;

interface Product {
  id: string;
  name: string;
  price: number;
  original_price: number;
  description: string;
  image: string;
  category: string;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const nav = useNavigate();

  // 임시 상품 데이터
  const product: Product = {
    id: id || "1",
    name: "프리미엄 티셔츠",
    price: 29000,
    original_price: 32000,
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
    nav('/payment', {
        state: {
          products: [
            {
              id: product.id,
              name: product.name,
              option: "",
              price: product.price,
              original_price: product.original_price,
              quantity: quantity,
            },
          ],
        },
      })
  };

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
  
    const existingIndex = existingCart.findIndex((item: any) => item.id === product.id && item.option === "");
  
    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += quantity;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        option: "",
        price: product.price,
        originalPrice: product.original_price,
        discount: Math.round(((product.original_price - product.price) / product.original_price) * 100),
        quantity: quantity,
        image: product.image,
      });
    }
  
    localStorage.setItem("cart", JSON.stringify(existingCart));
    console.log("장바구니에 담겼습니다!");

    nav("/cart");
  };

  const handleReviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReviewImages(Array.from(e.target.files));
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 임시: 입력값 콘솔 출력
    console.log({
      rating: reviewRating,
      content: reviewContent,
      images: reviewImages,
    });
    alert("리뷰가 등록되었습니다! (콘솔 확인)");
    setReviewRating(0);
    setReviewContent("");
    setReviewImages([]);
  };

  return (
    <>
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
      <ReviewFormContainer>
        <form onSubmit={handleReviewSubmit}>
          <ReviewTitle>리뷰 작성</ReviewTitle>
          <StarGroup>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                selected={reviewRating >= star}
                onClick={() => setReviewRating(star)}
                role="button"
                aria-label={`${star}점`}
              >
                ★
              </Star>
            ))}
          </StarGroup>
          <ReviewTextArea
            placeholder="리뷰 내용을 입력해주세요"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            required
          />
          <div style={{ marginBottom: 18 }}>
            <ImageInput
              type="file"
              multiple
              accept="image/*"
              onChange={handleReviewImageChange}
            />
            {reviewImages.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {reviewImages.map((file, idx) => (
                  <span key={idx} style={{ fontSize: 13, color: "#666" }}>
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ReviewSubmitButton type="submit">리뷰 등록</ReviewSubmitButton>
        </form>
      </ReviewFormContainer>
    </>
  );
};

export default ProductDetailPage;
