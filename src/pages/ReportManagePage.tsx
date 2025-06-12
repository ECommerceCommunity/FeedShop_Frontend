// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from "react";

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("1week");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

  // 가상의 신고 데이터
  const reports: Report[] = [
    {
      id: "R-2025-0001",
      reportDate: "2025-06-06 14:23",
      reporter: {
        id: "user123",
        name: "김민수",
        profileImage:
          "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20asian%20man%20with%20short%20black%20hair%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1001&orientation=squarish",
      },
      reportedUser: {
        id: "user456",
        name: "이지은",
        profileImage:
          "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20asian%20woman%20with%20medium%20length%20black%20hair%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1002&orientation=squarish",
      },
      messageContent: "야 너 진짜 XX야, 다시는 여기 오지마",
      reason: "욕설/비방",
      status: "대기중",
      chatRoom: "일반 대화방",
      handler: null,
      handledDate: null,
      handlerComment: null,
    },
    {
      id: "R-2025-0002",
      reportDate: "2025-06-05 10:15",
      reporter: {
        id: "user789",
        name: "박준호",
        profileImage:
          "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20asian%20man%20with%20glasses%20and%20short%20black%20hair%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1003&orientation=squarish",
      },
      reportedUser: {
        id: "user101",
        name: "최유진",
        profileImage:
          "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20asian%20woman%20with%20long%20black%20hair%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1004&orientation=squarish",
      },
      messageContent:
        "여기 클릭하면 무료 아이템 받을 수 있어요! http://scam-link.com",
      reason: "스팸",
      status: "처리중",
      chatRoom: "게임 토론방",
      handler: "관리자1",
      handledDate: "2025-06-06 09:30",
      handlerComment: "확인 중입니다.",
    },
    {
      id: "R-2025-0003",
      reportDate: "2025-06-04 18:45",
      reporter: {
        id: "user202",
        name: "정수민",
        profileImage:
          "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20asian%20woman%20with%20short%20black%20hair%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1005&orientation=squarish",
      },
      reportedUser: {
        id: "user303",
        name: "강현우",
        profileImage:
          "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20asian%20man%20with%20medium%20length%20black%20hair%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1006&orientation=squarish",
      },
      messageContent: "개인 연락처 공유합니다. 010-1234-5678로 연락주세요.",
      reason: "개인정보 침해",
      status: "처리완료",
      chatRoom: "음악 공유방",
      handler: "관리자2",
      handledDate: "2025-06-05 11:20",
      handlerComment:
        "개인정보 노출로 확인되어 해당 메시지 삭제 및 사용자에게 경고 조치하였습니다.",
    },
    {
      id: "R-2025-0004",
      reportDate: "2025-06-03 09:12",
      reporter: {
        id: "user404",
        name: "이승훈",
        profileImage:
          "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20asian%20man%20with%20short%20black%20hair%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1007&orientation=squarish",
      },
      reportedUser: {
        id: "user505",
        name: "한지민",
        profileImage:
          "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20asian%20woman%20with%20long%20black%20hair%20tied%20back%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1008&orientation=squarish",
      },
      messageContent: "이 사진 어때요? (부적절한 이미지)",
      reason: "부적절한 콘텐츠",
      status: "처리완료",
      chatRoom: "여행 이야기",
      handler: "관리자1",
      handledDate: "2025-06-03 14:35",
      handlerComment: "부적절한 이미지로 확인되어 삭제 조치하였습니다.",
    },
    {
      id: "R-2025-0005",
      reportDate: "2025-06-02 16:50",
      reporter: {
        id: "user606",
        name: "김태희",
        profileImage:
          "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20asian%20woman%20with%20medium%20length%20black%20hair%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1009&orientation=squarish",
      },
      reportedUser: {
        id: "user707",
        name: "박지성",
        profileImage:
          "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20young%20asian%20man%20with%20short%20black%20hair%20and%20glasses%2C%20neutral%20expression%2C%20simple%20background%2C%20high%20quality%20professional%20headshot&width=40&height=40&seq=1010&orientation=squarish",
      },
      messageContent:
        "이 채팅방 사람들 다 바보 같아. 여기 있는 사람들 전부 싫어.",
      reason: "욕설/비방",
      status: "대기중",
      chatRoom: "맛집 추천",
      handler: null,
      handledDate: null,
      handlerComment: null,
    },
  ];

  // 필터링된 신고 목록
  const filteredReports = reports.filter((report) => {
    // 상태 필터
    if (selectedStatus !== "all" && report.status !== selectedStatus)
      return false;

    // 신고 유형 필터
    if (selectedType !== "all" && report.reason !== selectedType) return false;

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.id.toLowerCase().includes(query) ||
        report.reporter.name.toLowerCase().includes(query) ||
        report.reportedUser.name.toLowerCase().includes(query) ||
        report.messageContent.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // 페이지네이션
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 신고 상세 정보 모달 열기
  const openDetailModal = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  // 처리 상태 변경 모달 열기
  const openStatusModal = (report: Report) => {
    setSelectedReport(report);
    setIsStatusModalOpen(true);
  };

  // 처리 상태 변경 함수
  const handleStatusChange = (newStatus: string) => {
    if (selectedReport) {
      // 실제 구현에서는 API 호출로 상태 변경
      console.log(`신고 ID ${selectedReport.id}의 상태를 ${newStatus}로 변경`);
      setIsStatusModalOpen(false);
    }
  };

  // 필터 적용 함수
  const applyFilters = () => {
    setCurrentPage(1);
  };

  // 필터 초기화 함수
  const resetFilters = () => {
    setSelectedStatus("all");
    setSelectedType("all");
    setSearchQuery("");
    setDateRange("1week");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* 모바일 메뉴 버튼 */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none cursor-pointer !rounded-button whitespace-nowrap"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
              {/* 로고 */}
              <div className="flex-shrink-0 flex items-center ml-2 md:ml-0">
                <span className="text-2xl font-bold text-[#87CEEB]">
                  채팅 서비스
                </span>
              </div>
              {/* 데스크톱 네비게이션 */}
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <a
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  채팅방
                </a>
                <a
                  href="#"
                  className="border-[#87CEEB] text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  신고 관리
                </a>
              </nav>
            </div>
            {/* 우측 사용자 메뉴 */}
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none cursor-pointer !rounded-button whitespace-nowrap">
                <i className="fas fa-bell text-lg"></i>
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button className="flex text-sm rounded-full focus:outline-none cursor-pointer !rounded-button whitespace-nowrap">
                    <div className="h-8 w-8 rounded-full bg-[#87CEEB] flex items-center justify-center text-white">
                      <i className="fas fa-user"></i>
                    </div>
                  </button>
                  <span className="ml-2 hidden md:block text-sm font-medium text-gray-700">
                    사용자
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* 이하 전체 JSX는 첨부된 신고-목록-관리-페이지.tsx return문 전체와 동일하게 복사 */}
      {/* ... (생략) ... */}
    </div>
  );
};

// 타입 정의
interface User {
  id: string;
  name: string;
  profileImage: string;
}

interface Report {
  id: string;
  reportDate: string;
  reporter: User;
  reportedUser: User;
  messageContent: string;
  reason: string;
  status: string;
  chatRoom: string;
  handler: string | null;
  handledDate: string | null;
  handlerComment: string | null;
}

export default App;
