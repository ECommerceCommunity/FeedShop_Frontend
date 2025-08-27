import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { pointService, PointBalance, PointTransaction } from "../../api/pointService";

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2rem;
  color: white;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const BalanceContainer = styled.div`
  background: linear-gradient(135deg, #4a5568, #2d3748);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const CurrentPoints = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: #f97316;
  margin-bottom: 0.5rem;
`;

const PointsLabel = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #f97316;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
`;

const TabButton = styled.button<{ isActive: boolean }>`
  background: transparent;
  border: none;
  color: ${(props) =>
    props.isActive ? "#f97316" : "rgba(255, 255, 255, 0.7)"};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 0;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #f97316;
    transform: ${(props) => (props.isActive ? "scaleX(1)" : "scaleX(0)")};
    transition: transform 0.3s ease-out;
  }
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TransactionCard = styled.div<{ type: "EARN" | "USE" }>`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid ${(props) => (props.type === "EARN" ? "#10b981" : "#ef4444")};
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionDescription = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const TransactionDate = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const TransactionAmount = styled.div<{ type: "EARN" | "USE" }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${(props) => (props.type === "EARN" ? "#10b981" : "#ef4444")};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  background: ${(props) => (props.disabled ? "rgba(255, 255, 255, 0.1)" : "#f97316")};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const PageInfo = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const NoTransactionsMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: rgba(255, 255, 255, 0.7);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: rgba(255, 255, 255, 0.7);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 4rem;
  color: #f87171;
`;

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 포인트 포맷팅 함수
const formatPoints = (points: number): string => {
  return points.toLocaleString();
};

const PointsPage = () => {
  const [activeTab, setActiveTab] = useState<"balance" | "transactions">("balance");
  const [balance, setBalance] = useState<PointBalance | null>(null);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 포인트 잔액 로드
  const loadBalance = async () => {
    try {
      const balanceData = await pointService.getPointBalance();
      setBalance(balanceData);
    } catch (err: any) {
      console.error("포인트 잔액 로드 실패:", err);
      setError("포인트 잔액을 불러오는데 실패했습니다.");
    }
  };

  // 포인트 거래 내역 로드
  const loadTransactions = async (page: number = 0) => {
    try {
      const transactionData = await pointService.getPointTransactions(page, 10);
      setTransactions(transactionData.transactions);
      setTotalPages(transactionData.totalPages);
      setTotalElements(transactionData.totalElements);
      setCurrentPage(page);
    } catch (err: any) {
      console.error("포인트 거래 내역 로드 실패:", err);
      setError("포인트 거래 내역을 불러오는데 실패했습니다.");
    }
  };

  // 초기 데이터 로드
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([loadBalance(), loadTransactions()]);
    } catch (err: any) {
      console.error("데이터 로드 실패:", err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadTransactions(newPage);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <Container>
        <Title>포인트 관리</Title>
        <LoadingMessage>
          <p>포인트 정보를 불러오는 중...</p>
        </LoadingMessage>
      </Container>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Container>
        <Title>포인트 관리</Title>
        <ErrorMessage>
          <p>{error}</p>
          <button
            onClick={loadData}
            style={{
              background: "#f97316",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              marginTop: "1rem",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>포인트 관리</Title>

      {/* 포인트 잔액 섹션 */}
      {balance && (
        <BalanceContainer>
          <CurrentPoints>{formatPoints(balance.currentPoints)}</CurrentPoints>
          <PointsLabel>현재 보유 포인트</PointsLabel>
          <StatsGrid>
            <StatCard>
              <StatNumber>{formatPoints(balance.totalEarnedPoints)}</StatNumber>
              <StatLabel>총 적립 포인트</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{formatPoints(balance.totalUsedPoints)}</StatNumber>
              <StatLabel>총 사용 포인트</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>{formatPoints(balance.totalExpiredPoints)}</StatNumber>
              <StatLabel>총 만료 포인트</StatLabel>
            </StatCard>
          </StatsGrid>
        </BalanceContainer>
      )}

      {/* 탭 */}
      <TabContainer>
        <TabButton
          isActive={activeTab === "balance"}
          onClick={() => setActiveTab("balance")}
        >
          포인트 잔액
        </TabButton>
        <TabButton
          isActive={activeTab === "transactions"}
          onClick={() => setActiveTab("transactions")}
        >
          거래 내역
        </TabButton>
      </TabContainer>

      {/* 거래 내역 섹션 */}
      {activeTab === "transactions" && (
        <>
          {transactions.length > 0 ? (
            <>
              <TransactionList>
                {transactions.map((transaction) => (
                  <TransactionCard key={transaction.transactionId} type={transaction.type}>
                    <TransactionInfo>
                      <TransactionDescription>
                        {transaction.description}
                      </TransactionDescription>
                      <TransactionDate>
                        {formatDate(transaction.transactionDate)}
                      </TransactionDate>
                    </TransactionInfo>
                    <TransactionAmount type={transaction.type}>
                      {transaction.type === "EARN" ? "+" : "-"}
                      {formatPoints(transaction.amount)}
                    </TransactionAmount>
                  </TransactionCard>
                ))}
              </TransactionList>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <PaginationContainer>
                  <PaginationButton
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    이전
                  </PaginationButton>
                  <PageInfo>
                    {currentPage + 1} / {totalPages} 페이지
                  </PageInfo>
                  <PaginationButton
                    disabled={currentPage === totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    다음
                  </PaginationButton>
                </PaginationContainer>
              )}
            </>
          ) : (
            <NoTransactionsMessage>
              <p>포인트 거래 내역이 없습니다.</p>
            </NoTransactionsMessage>
          )}
        </>
      )}
    </Container>
  );
};

export default PointsPage;
