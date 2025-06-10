import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

interface StyledProps {
  isMine?: boolean;
}

const ChatRoomDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  background-color: #f5f5f5;
`;

const ChatHeader = styled.div`
  background-color: white;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  margin-right: 10px;

  &:hover {
    color: #333;
  }
`;

const RoomTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
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

const MessageContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const Message = styled.div<StyledProps>`
  display: flex;
  flex-direction: ${(props) => (props.isMine ? "row-reverse" : "row")};
  margin-bottom: 20px;
  align-items: flex-start;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #87ceeb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin: 0 10px;
`;

const MessageContent = styled.div<StyledProps>`
  max-width: 70%;
`;

const SenderName = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 4px;
`;

const MessageBubble = styled.div<StyledProps>`
  background-color: ${(props) => (props.isMine ? "#87CEEB" : "white")};
  color: ${(props) => (props.isMine ? "white" : "#333")};
  padding: 10px 15px;
  border-radius: 15px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const MessageTime = styled.div<StyledProps>`
  font-size: 0.8rem;
  color: #999;
  margin-top: 4px;
  text-align: ${(props) => (props.isMine ? "right" : "left")};
`;

const InputContainer = styled.div`
  background-color: white;
  padding: 15px;
  border-top: 1px solid #ddd;
`;

const MessageForm = styled.form`
  display: flex;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #87ceeb;
  }
`;

const SendButton = styled.button`
  background-color: #87ceeb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #5fb4d9;
  }
`;

const dummyMessages = [
  {
    id: 1,
    sender: "김민수",
    content: "안녕하세요! 오늘 날씨가 정말 좋네요.",
    time: "10:30",
    likes: 3,
  },
  {
    id: 2,
    sender: "이지은",
    content: "네, 정말 좋은 날씨예요. 다들 주말 계획 있으신가요?",
    time: "10:32",
    likes: 1,
  },
  {
    id: 3,
    sender: "박준호",
    content: "저는 등산 갈 예정이에요!",
    time: "10:35",
    likes: 2,
  },
  {
    id: 4,
    sender: "최유진",
    content: "저도 야외 활동 계획 중이에요. 추천할 만한 장소 있을까요?",
    time: "10:37",
    likes: 0,
  },
  {
    id: 5,
    sender: "김민수",
    content: "북한산이 이 시즌에 정말 좋아요. 단풍도 볼 수 있고요.",
    time: "10:40",
    likes: 5,
  },
];

const ChatRoomDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState(dummyMessages);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "나",
        content: input,
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        likes: 0,
      },
    ]);
    setInput("");
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px #e0e7ef",
        minHeight: 600,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 상단 */}
      <div
        style={{
          background: "#e0f2fe",
          borderRadius: "12px 12px 0 0",
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              color: "#60a5fa",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            {">"}
          </button>
          <span style={{ fontWeight: 700, fontSize: 20 }}>일반 대화방</span>
        </div>
        <span
          style={{
            background: "#60a5fa",
            color: "#fff",
            borderRadius: 16,
            padding: "4px 16px",
            fontSize: 15,
          }}
        >
          참여 42명
        </span>
      </div>
      {/* 메시지 리스트 */}
      <div style={{ flex: 1, padding: "32px 28px", overflowY: "auto" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#e5e7eb",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 17,
                marginRight: 12,
              }}
            >
              {msg.sender[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#64748b" }}>
                {msg.sender}
              </div>
              <div
                style={{
                  background: "#f3f6fa",
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontSize: 16,
                  margin: "6px 0",
                  color: "#222",
                }}
              >
                {msg.content}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 13,
                  color: "#94a3b8",
                }}
              >
                <span>{msg.time}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: "#ef4444", fontSize: 15 }}>♥</span>{" "}
                  {msg.likes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 입력창 */}
      <form
        onSubmit={handleSend}
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: 18,
          display: "flex",
          gap: 12,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          style={{
            flex: 1,
            border: "1px solid #d1d5db",
            borderRadius: 8,
            padding: "10px 16px",
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          style={{
            background: "#60a5fa",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 28px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatRoomDetailPage;
