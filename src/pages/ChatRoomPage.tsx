import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ChatRoomSearch from "../components/chat/ChatRoomSearch";

const ChatRoomContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin: 0;
`;

const CreateButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #45a049;
  }
`;

const ChatRoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ChatRoomCard = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ChatRoomHeader = styled.div`
  height: 120px;
  background: linear-gradient(135deg, #87ceeb, #5fb4d9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

const ChatRoomContent = styled.div`
  padding: 15px;
`;

const ChatRoomName = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
`;

const ChatRoomInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const ParticipantCount = styled.span`
  background-color: #e6f7ff;
  color: #87ceeb;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LastMessage = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TimeStamp = styled.span`
  color: #999;
  font-size: 0.8rem;
`;

interface ChatRoom {
  id: string;
  name: string;
  participants: number;
  lastMessage: string;
  time: string;
  isPublic: boolean;
  isMyRoom: boolean;
}

const ChatRoomPage: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: "1",
      name: "일반 대화방",
      participants: 42,
      lastMessage: "안녕하세요! 오늘 날씨가 정말 좋네요.",
      time: "10:30",
      isPublic: true,
      isMyRoom: false,
    },
    {
      id: "2",
      name: "게임 토론방",
      participants: 28,
      lastMessage: "이번 업데이트 어떻게 생각하세요?",
      time: "09:15",
      isPublic: true,
      isMyRoom: true,
    },
    {
      id: "3",
      name: "영화 팬클럽",
      participants: 35,
      lastMessage: "새 영화 예고편 보셨나요?",
      time: "어제",
      isPublic: false,
      isMyRoom: false,
    },
    {
      id: "4",
      name: "음악 공유방",
      participants: 19,
      lastMessage: "이 노래 들어보세요, 정말 좋아요!",
      time: "어제",
      isPublic: true,
      isMyRoom: true,
    },
    {
      id: "5",
      name: "여행 이야기",
      participants: 24,
      lastMessage: "제주도 여행 계획 중이에요.",
      time: "2일 전",
      isPublic: false,
      isMyRoom: false,
    },
    {
      id: "6",
      name: "맛집 추천",
      participants: 31,
      lastMessage: "강남에 새로 생긴 레스토랑 가봤어요.",
      time: "3일 전",
      isPublic: true,
      isMyRoom: false,
    },
  ]);

  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>(chatRooms);

  const handleSearch = (
    query: string,
    filters: {
      public: boolean;
      private: boolean;
      myRooms: boolean;
    }
  ) => {
    const filtered = chatRooms.filter((room) => {
      const matchesQuery =
        room.name.toLowerCase().includes(query.toLowerCase()) ||
        room.lastMessage.toLowerCase().includes(query.toLowerCase());

      const matchesFilters =
        (filters.public && room.isPublic) ||
        (filters.private && !room.isPublic) ||
        (filters.myRooms && room.isMyRoom);

      return matchesQuery && matchesFilters;
    });

    setFilteredRooms(filtered);
  };

  return (
    <ChatRoomContainer>
      <Header>
        <Title>채팅방 목록</Title>
        <CreateButton>
          <i className="fas fa-plus"></i>
          채팅방 생성
        </CreateButton>
      </Header>
      <ChatRoomSearch onSearch={handleSearch} />
      <ChatRoomGrid>
        {filteredRooms.map((room) => (
          <ChatRoomCard key={room.id}>
            <ChatRoomHeader>
              <i className="fas fa-comments"></i>
            </ChatRoomHeader>
            <ChatRoomContent>
              <ChatRoomName>{room.name}</ChatRoomName>
              <LastMessage>{room.lastMessage}</LastMessage>
              <ChatRoomInfo>
                <ParticipantCount>
                  <i className="fas fa-users"></i>
                  {room.participants}
                </ParticipantCount>
                <TimeStamp>{room.time}</TimeStamp>
              </ChatRoomInfo>
            </ChatRoomContent>
          </ChatRoomCard>
        ))}
      </ChatRoomGrid>
    </ChatRoomContainer>
  );
};

export default ChatRoomPage;
