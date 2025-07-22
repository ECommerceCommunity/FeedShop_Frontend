import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { Event, EventStatus, EventType } from "../../types/types";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error("이벤트 상세 조회 실패:", err);
        setError("이벤트 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleEventParticipation = () => {
    // 이벤트 참여 로직
    alert("이벤트 참여 기능은 준비 중입니다.");
  };

  const handleDeleteEvent = async () => {
    if (!event || !window.confirm("정말로 이 이벤트를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/events/${id}`);
      alert("이벤트가 삭제되었습니다.");
      navigate("/events");
    } catch (err) {
      console.error("이벤트 삭제 실패:", err);
      alert("이벤트 삭제에 실패했습니다.");
    }
  };

  const getStatusText = (status: EventStatus) => {
    switch (status) {
      case "UPCOMING":
        return "진행 예정";
      case "ONGOING":
        return "진행중";
      case "ENDED":
        return "종료";
      default:
        return "";
    }
  };

  const getTypeText = (type: EventType) => {
    switch (type) {
      case "BATTLE":
        return "배틀";
      case "MISSION":
        return "미션";
      case "MULTIPLE":
        return "다수";
      default:
        return "";
    }
  };

  if (loading) {
    return <div className="p-5">로딩 중...</div>;
  }

  if (error || !event) {
    return <div className="p-5 text-red-500">{error || "이벤트를 찾을 수 없습니다."}</div>;
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate("/events")}
          className="text-[#87CEEB] hover:underline font-semibold"
        >
          ← 이벤트 목록으로 돌아가기
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={event.eventDetail.imageUrl}
            alt={event.eventDetail.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              event.status === "UPCOMING" ? "bg-yellow-100 text-yellow-800" :
              event.status === "ONGOING" ? "bg-green-100 text-green-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {getStatusText(event.status)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.eventDetail.title}</h1>
              <p className="text-gray-600 mb-2">{event.eventDetail.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>유형: {getTypeText(event.type)}</span>
                <span>최대 참여자: {event.maxParticipants}명</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEventParticipation}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                이벤트 참여
              </button>
              <button
                onClick={() => navigate(`/events/${id}/edit`)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                수정
              </button>
              <button
                onClick={handleDeleteEvent}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">이벤트 일정</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">구매 기간:</span>
                  <div className="text-gray-600">
                    {new Date(event.eventDetail.purchaseStartDate).toLocaleDateString()} ~ {new Date(event.eventDetail.purchaseEndDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="font-medium">이벤트 기간:</span>
                  <div className="text-gray-600">
                    {new Date(event.eventDetail.eventStartDate).toLocaleDateString()} ~ {new Date(event.eventDetail.eventEndDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">참여 정보</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">참여 방법:</span>
                  <div className="text-gray-600">이벤트 상세 페이지에서 확인하세요</div>
                </div>
                <div>
                  <span className="font-medium">선정 기준:</span>
                  <div className="text-gray-600">이벤트 상세 페이지에서 확인하세요</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">주의사항</h3>
            <div className="text-gray-600 text-sm">
              이벤트 상세 페이지에서 확인하세요
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
