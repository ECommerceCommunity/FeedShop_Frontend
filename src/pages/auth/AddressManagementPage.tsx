import React, { useState } from "react";
import styled from "styled-components";

// 예시 데이터 (향후 API 연동 필요)
const initialAddresses = [
  {
    id: 1,
    name: "집",
    recipient: "홍길동",
    address: "서울시 강남구 테헤란로 123",
    phone: "010-1234-5678",
    isDefault: true,
  },
  {
    id: 2,
    name: "회사",
    recipient: "홍길동",
    address: "서울시 서초구 서초대로 456",
    phone: "010-8765-4321",
    isDefault: false,
  },
];

const Container = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: white;
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AddressCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const AddressInfo = styled.div`
  p {
    margin: 0.5rem 0;
    color: rgba(255, 255, 255, 0.9);
  }
  strong {
    color: white;
  }
`;

const AddressName = styled.span`
  font-weight: 700;
  font-size: 1.2rem;
  margin-right: 1rem;
`;

const DefaultBadge = styled.span`
  background: #f97316;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid #f97316;
  color: #f97316;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #f97316;
    color: white;
  }
`;

const AddButton = styled(ActionButton)`
  background: #f97316;
  color: white;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
`;

const AddressManagementPage = () => {
  const [addresses, setAddresses] = useState(initialAddresses);

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({ ...addr, isDefault: addr.id === id }))
    );
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <Container>
      <Title>주소록 관리</Title>
      <AddressList>
        {addresses.map((addr) => (
          <AddressCard key={addr.id}>
            <AddressInfo>
              <div>
                <AddressName>{addr.name}</AddressName>
                {addr.isDefault && <DefaultBadge>기본 배송지</DefaultBadge>}
              </div>
              <p>
                <strong>받는 분:</strong> {addr.recipient}
              </p>
              <p>
                <strong>주소:</strong> {addr.address}
              </p>
              <p>
                <strong>연락처:</strong> {addr.phone}
              </p>
            </AddressInfo>
            <ButtonGroup>
              {!addr.isDefault && (
                <ActionButton onClick={() => handleSetDefault(addr.id)}>
                  기본으로 설정
                </ActionButton>
              )}
              <ActionButton>수정</ActionButton>
              <ActionButton onClick={() => handleDelete(addr.id)}>
                삭제
              </ActionButton>
            </ButtonGroup>
          </AddressCard>
        ))}
      </AddressList>
      <AddButton>새 배송지 추가</AddButton>
    </Container>
  );
};

export default AddressManagementPage;
