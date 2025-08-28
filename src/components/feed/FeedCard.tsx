import React from "react";
import styled from "styled-components";
import { FeedPost } from "../../types/feed";
import FeedUserProfile from "./FeedUserProfile";

interface FeedCardProps {
  feed: FeedPost;
  onClick?: () => void;
  children?: React.ReactNode;
  showEventBadge?: boolean;
  showUserProfile?: boolean;
  showProductInfo?: boolean;
}

const Card = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.2);
    border-color: rgba(249, 115, 22, 0.3);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const FeedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4a5568, #2d3748);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
`;

const EventBadge = styled.span<{ eventType?: string }>`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: ${props => {
    switch (props.eventType) {
      case 'BATTLE': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'RANKING': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      case 'MISSION': return 'linear-gradient(135deg, #10b981, #059669)';
      case 'CHALLENGE': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Date = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)}주 전`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)}개월 전`;
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return '날짜 오류';
  }
};

const getEventTypeText = (eventType?: string): string => {
  switch (eventType) {
    case 'BATTLE': return '배틀';
    case 'RANKING': return '랭킹';
    case 'MISSION': return '미션';
    case 'CHALLENGE': return '챌린지';
    default: return '이벤트';
  }
};

const FeedCard: React.FC<FeedCardProps> = ({ 
  feed, 
  onClick, 
  children,
  showEventBadge = true,
  showUserProfile = true,
  showProductInfo = true
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card onClick={handleClick}>
      <ImageContainer>
        {feed.images && feed.images.length > 0 ? (
          <FeedImage 
            src={feed.images[0].imageUrl} 
            alt={feed.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.setAttribute('style', 'display: flex');
            }}
          />
        ) : (
          <PlaceholderImage>
            <i className="fas fa-image"></i>
          </PlaceholderImage>
        )}
        
        {/* 이벤트 배지 */}
        {showEventBadge && feed.eventId && feed.eventTitle && (
          <EventBadge eventType={feed.eventType}>
            <i className="fas fa-star mr-1"></i>
            {getEventTypeText(feed.eventType)}
          </EventBadge>
        )}
      </ImageContainer>
      
      <Content>
        <Title>{feed.title}</Title>
        <Description>{feed.content}</Description>
        
        {/* 상품 정보 */}
        {showProductInfo && feed.orderItem && (
          <ProductInfo>
            <i className="fas fa-shoe-prints mr-1"></i>
            {feed.orderItem.productName}
            {feed.orderItem.size && (
              <span className="ml-2">사이즈: {feed.orderItem.size}mm</span>
            )}
          </ProductInfo>
        )}
        
        {/* 사용자 프로필 */}
        {showUserProfile && feed.user && (
          <FeedUserProfile
            userId={feed.user.id}
            nickname={feed.user.nickname}
            profileImageUrl={feed.user.profileImg}
            showBodyInfo={true}
            size="small"
                         onClick={() => {
               console.log('사용자 프로필 클릭:', feed.user?.nickname);
             }}
          />
        )}
        
        {/* 하위 컴포넌트들을 위한 슬롯 */}
        {children}
      </Content>
      
      <Footer>
        <Date>{formatDate(feed.createdAt)}</Date>
        <Stats>
          {feed.likeCount > 0 && (
            <Stat>
              <i className="fas fa-heart text-red-400"></i>
              {feed.likeCount}
            </Stat>
          )}
          {feed.commentCount > 0 && (
            <Stat>
              <i className="fas fa-comment text-blue-400"></i>
              {feed.commentCount}
            </Stat>
          )}
          {feed.participantVoteCount && feed.participantVoteCount > 0 && (
            <Stat>
              <i className="fas fa-vote-yea text-green-400"></i>
              {feed.participantVoteCount}
            </Stat>
          )}
        </Stats>
      </Footer>
    </Card>
  );
};

export default FeedCard; 