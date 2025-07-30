import React from 'react';
import styled from 'styled-components';

// 예시 데이터
const user = {
  name: '홍길동',
  profileImg: '/assets/profile.jpg',
  recentOrders: [
    { id: 1, thumbnail: '/assets/item1.jpg', name: '트렌디 셔츠', date: '2025-07-28', status: '배송 완료' },
    { id: 2, thumbnail: '/assets/item2.jpg', name: '여름 팬츠', date: '2025-07-25', status: '처리 중' },
    { id: 3, thumbnail: '/assets/item3.jpg', name: '스니커즈', date: '2025-07-20', status: '배송 완료' },
  ],
  feedCount: 12,
  wishlistCount: 5,
  couponCount: 3,
};

const feeds = [
  { id: 1, image: '/assets/feed1.jpg', title: 'OOTD #1' },
  { id: 2, image: '/assets/feed2.jpg', title: 'OOTD #2' },
  { id: 3, image: '/assets/feed3.jpg', title: 'OOTD #3' },
];

const Container = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  font-family: 'Pretendard', 'sans-serif';
  background: #f7f8fa;
`;

const Sidebar = styled.nav`
  background: #fff;
  border-right: 1px solid #eee;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  color: #333;
  cursor: pointer;
  padding: 12px 24px;
  border-radius: 24px;
  transition: background 0.2s;
  &:hover {
    background: #f0f2f5;
  }
`;

const Main = styled.main`
  padding: 48px 48px 32px 48px;
`;

const ProfileSection = styled.section`
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 32px;
`;

const ProfileImg = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e0e4ea;
`;

const Welcome = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: #222;
`;

const EditBtn = styled.button`
  margin-left: 24px;
  padding: 8px 20px;
  border-radius: 24px;
  border: none;
  background: #222;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #444;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 32px 24px;
  text-align: center;
  font-size: 1.1rem;
  color: #333;
`;

const CardTitle = styled.div`
  font-size: 1rem;
  color: #888;
  margin-bottom: 8px;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #222;
`;

const OrdersTable = styled.table`
  width: 100%;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 32px;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
`;

const OrdersRow = styled.tr`
  border-bottom: 1px solid #eee;
`;

const OrdersCell = styled.td`
  padding: 16px;
  font-size: 1rem;
  color: #444;
  vertical-align: middle;
`;

const FeedCarousel = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const FeedCard = styled.div`
  min-width: 160px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
  text-align: center;
`;

const FeedImg = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const FeedTitle = styled.div`
  padding: 12px 0;
  font-size: 1rem;
  color: #333;
`;

function MyPage() {
  return (
    <Container>
      <Sidebar>
        <NavItem>👤 프로필</NavItem>
        <NavItem>📦 주문내역</NavItem>
        <NavItem>📰 내 피드</NavItem>
        <NavItem>💖 위시리스트</NavItem>
        <NavItem>🎟️ 쿠폰/포인트</NavItem>
        <NavItem>⚙️ 설정</NavItem>
      </Sidebar>
      <Main>
        <ProfileSection>
          <ProfileImg src={user.profileImg} alt="프로필" />
          <Welcome>안녕하세요, {user.name}님!</Welcome>
          <EditBtn>프로필 관리</EditBtn>
        </ProfileSection>

        <DashboardGrid>
          <Card>
            <CardTitle>최근 주문</CardTitle>
            <CardValue>{user.recentOrders.length}건</CardValue>
          </Card>
          <Card>
            <CardTitle>내 피드 수</CardTitle>
            <CardValue>{user.feedCount}</CardValue>
          </Card>
          <Card>
            <CardTitle>위시리스트 상품</CardTitle>
            <CardValue>{user.wishlistCount}</CardValue>
          </Card>
          <Card>
            <CardTitle>사용 가능 쿠폰</CardTitle>
            <CardValue>{user.couponCount}</CardValue>
          </Card>
        </DashboardGrid>

        <SectionTitle>최근 주문</SectionTitle>
        <OrdersTable>
          <tbody>
            {user.recentOrders.map(order => (
              <OrdersRow key={order.id}>
                <OrdersCell>
                  <img src={order.thumbnail} alt={order.name} style={{ width: 48, borderRadius: 12 }} />
                </OrdersCell>
                <OrdersCell>{order.name}</OrdersCell>
                <OrdersCell>{order.date}</OrdersCell>
                <OrdersCell>{order.status}</OrdersCell>
              </OrdersRow>
            ))}
          </tbody>
        </OrdersTable>

        <SectionTitle>내 피드</SectionTitle>
        <FeedCarousel>
          {feeds.map(feed => (
            <FeedCard key={feed.id}>
              <FeedImg src={feed.image} alt={feed.title} />
              <FeedTitle>{feed.title}</FeedTitle>
            </FeedCard>
          ))}
        </FeedCarousel>
      </Main>
    </Container>
  );
}

export default MyPage;