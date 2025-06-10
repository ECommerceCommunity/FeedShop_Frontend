import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const chatRoomsInit = [
  {
    id: 1,
    title: "일반 대화방",
    message: "안녕하세요! 오늘 날씨가 정말 좋네요.",
    count: 42,
    time: "10:30",
  },
  {
    id: 2,
    title: "게임 토론방",
    message: "이번 업데이트 어떻게 생각하세요?",
    count: 28,
    time: "09:15",
  },
  {
    id: 3,
    title: "영화 팬클럽",
    message: "새 영화 예고편 보셨나요?",
    count: 35,
    time: "이제",
  },
  {
    id: 4,
    title: "음악 공유방",
    message: "이 노래 들어보세요, 정말 좋아요!",
    count: 19,
    time: "어제",
  },
  {
    id: 5,
    title: "여행 이야기",
    message: "제주도 여행 계획 중이에요.",
    count: 24,
    time: "2일 전",
  },
  {
    id: 6,
    title: "맛집 추천",
    message: "강남에 새로 생긴 레스토랑 가봤어요.",
    count: 31,
    time: "3일 전",
  },
];

export default function ChatRoomListPage() {
  const [chatRooms, setChatRooms] = useState(chatRoomsInit);
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDesc, setRoomDesc] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const navigate = useNavigate();

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setChatRooms([
      ...chatRooms,
      {
        id: chatRooms.length + 1,
        title: roomName,
        message: roomDesc || "새로운 채팅방입니다.",
        count: 1,
        time: "방금",
      },
    ]);
    setShowModal(false);
    setRoomName("");
    setRoomDesc("");
    setIsPublic(true);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7fafc" }}>
      {/* 사이드바 */}
      <aside
        style={{
          width: 220,
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          padding: 24,
          position: "relative",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 22,
            color: "#60a5fa",
            marginBottom: 32,
          }}
        >
          채팅 서비스
        </div>
        <div style={{ marginBottom: 16, color: "#60a5fa", fontWeight: 600 }}>
          채팅방 목록
        </div>
        <div style={{ color: "#64748b", marginBottom: 8 }}>채팅방 생성</div>
        <div style={{ color: "#64748b", marginBottom: 8 }}>신고/제재 관리</div>
        <div style={{ color: "#64748b", marginBottom: 8 }}>사용자 제재</div>
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            color: "#64748b",
            fontSize: 14,
          }}
        >
          사용자 이름
          <br />
          <span style={{ color: "#94a3b8", fontSize: 13 }}>로그아웃</span>
        </div>
      </aside>
      {/* 메인 */}
      <main style={{ flex: 1, padding: 40 }}>
        {/* 상단 네비 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 15, color: "#64748b", marginBottom: 8 }}>
            홈 &gt; 채팅방 관리 &gt;{" "}
            <span style={{ color: "#60a5fa", fontWeight: 600 }}>
              채팅방 목록
            </span>
          </div>
          <button
            style={{
              background: "linear-gradient(90deg, #60a5fa 0%, #38bdf8 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
            onClick={() => setShowModal(true)}
          >
            + 채팅방 생성
          </button>
        </div>
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 24 }}>
          채팅방 목록
        </div>
        {/* 채팅방 카드 목록 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {chatRooms.map((room) => (
            <div
              key={room.id}
              style={{
                background: "linear-gradient(135deg, #bae6fd 0%, #60a5fa 100%)",
                borderRadius: 14,
                padding: 24,
                minHeight: 160,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px #e0e7ef",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                  }}
                >
                  <svg width="32" height="32" fill="#60a5fa">
                    <circle cx="16" cy="16" r="16" fill="#e0f2fe" />
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      fontSize="18"
                      fill="#60a5fa"
                      dy=".3em"
                    >
                      💬
                    </text>
                  </svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  {room.title}
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    color: "#38bdf8",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  참여 {room.count}
                </div>
              </div>
              <div style={{ color: "#334155", fontSize: 15, marginBottom: 8 }}>
                {room.message}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/chatrooms/${room.id}`);
                  }}
                  style={{
                    color: "#38bdf8",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  입장하기
                </a>
                <span style={{ color: "#64748b" }}>{room.time}</span>
              </div>
            </div>
          ))}
        </div>
        {/* 채팅방 생성 모달 */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.18)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
                width: 420,
                padding: "32px 32px 24px 32px",
                position: "relative",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>
                새 채팅방 생성
              </div>
              <form onSubmit={handleCreateRoom}>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      fontWeight: 500,
                      fontSize: 15,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    채팅방 이름
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="채팅방 이름을 입력하세요"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      fontSize: 15,
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      fontWeight: 500,
                      fontSize: 15,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    설명 (선택사항)
                  </label>
                  <textarea
                    value={roomDesc}
                    onChange={(e) => setRoomDesc(e.target.value)}
                    placeholder="채팅방에 대한 설명을 입력하세요"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      fontSize: 15,
                      resize: "none",
                      minHeight: 60,
                    }}
                  />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      fontWeight: 500,
                      fontSize: 15,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    공개 설정
                  </label>
                  <div
                    style={{ display: "flex", gap: 18, alignItems: "center" }}
                  >
                    <label
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <input
                        type="radio"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                      />{" "}
                      공개
                    </label>
                    <label
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <input
                        type="radio"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                      />{" "}
                      비공개
                    </label>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    marginTop: 18,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      background: "#f3f4f6",
                      color: "#374151",
                      fontWeight: 500,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 20px",
                      borderRadius: 6,
                      border: "none",
                      background: "#60a5fa",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    생성하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
