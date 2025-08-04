import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import reviewsData from "../../pages/data/reviews/reviews.json";

interface Review {
  id: number;
  product_id: number;
  userName: string;
  userImage: string;
  date: string;
  content: string;
  rating: number;
  images?: string[];
}

interface ProductReviewsProps {
  productId: number;
  productImage?: string;
}

const ReviewsContainer = styled.div`
  margin-top: 60px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const ReviewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
`;

const ReviewsTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const ReviewCount = styled.span`
  font-size: 16px;
  color: #6b7280;
  margin-left: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  `
      : `
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
    
    &:hover {
      border-color: #3b82f6;
      color: #3b82f6;
    }
  `}
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ReviewItem = styled.div`
  padding: 24px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f1f5f9;
`;

const UserDetails = styled.div``;

const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ReviewDate = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${(props) => (props.filled ? "#fbbf24" : "#e5e7eb")};
  font-size: 16px;
`;

const ReviewContent = styled.p`
  color: #374151;
  line-height: 1.6;
  margin: 0;
  font-size: 15px;
`;

const ReviewImages = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const ReviewImage = styled.img`
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 16px;
  margin: 0;
`;

const SummaryStats = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
`;

const AverageRating = styled.div`
  text-align: center;
`;

const RatingNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 2px;
  justify-content: center;
  margin-bottom: 4px;
`;

const RatingText = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productImage,
}) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Filter reviews for this product
    const productReviews = reviewsData.filter(
      (review: any) => review.product_id === productId
    );
    setReviews(productReviews);
  }, [productId]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const handleWriteReview = () => {
    navigate("/reviews/edit", {
      state: {
        productId,
        productImage,
      },
    });
  };

  const handleViewAllReviews = () => {
    navigate("/reviews", {
      state: {
        productId,
      },
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < rating}>
        ★
      </Star>
    ));
  };

  return (
    <ReviewsContainer>
      <ReviewsHeader>
        <div>
          <ReviewsTitle>
            상품 리뷰
            <ReviewCount>({reviews.length}개)</ReviewCount>
          </ReviewsTitle>
        </div>
        <ActionButtons>
          <ActionButton variant="secondary" onClick={handleViewAllReviews}>
            전체 리뷰 보기
          </ActionButton>
          <ActionButton variant="primary" onClick={handleWriteReview}>
            리뷰 작성하기
          </ActionButton>
        </ActionButtons>
      </ReviewsHeader>

      {reviews.length > 0 && (
        <SummaryStats>
          <AverageRating>
            <RatingNumber>{averageRating.toFixed(1)}</RatingNumber>
            <RatingStars>{renderStars(Math.round(averageRating))}</RatingStars>
            <RatingText>전체 평점</RatingText>
          </AverageRating>
        </SummaryStats>
      )}

      <ReviewsList>
        {reviews.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📝</EmptyIcon>
            <EmptyText>
              아직 작성된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
            </EmptyText>
          </EmptyState>
        ) : (
          reviews.slice(0, 3).map(
            (
              review // Show only first 3 reviews
            ) => (
              <ReviewItem key={review.id}>
                <ReviewHeader>
                  <UserInfo>
                    <UserAvatar
                      src={productImage || review.userImage}
                      alt={review.userName}
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                    />
                    <UserDetails>
                      <UserName>{review.userName}</UserName>
                      <ReviewDate>
                        {new Date(review.date).toLocaleDateString()}
                      </ReviewDate>
                    </UserDetails>
                  </UserInfo>
                  <RatingContainer>
                    {renderStars(review.rating)}
                  </RatingContainer>
                </ReviewHeader>

                <ReviewContent>{review.content}</ReviewContent>

                {review.images && review.images.length > 0 && (
                  <ReviewImages>
                    {review.images.slice(0, 3).map((image, index) => (
                      <ReviewImage
                        key={index}
                        src={productImage} // Use product image as specified
                        alt={`리뷰 이미지 ${index + 1}`}
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden";
                        }}
                      />
                    ))}
                  </ReviewImages>
                )}
              </ReviewItem>
            )
          )
        )}
      </ReviewsList>
    </ReviewsContainer>
  );
};
