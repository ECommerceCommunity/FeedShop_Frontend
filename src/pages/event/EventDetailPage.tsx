import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { Event, EventStatus, EventType } from "../../types/types";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const nickname = user?.nickname;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("이벤트 상세 정보 조회 실패:", err);
        setError("이벤트 상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="p-5">로딩 중...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;
  if (!event) return <div className="p-5">존재하지 않는 이벤트입니다.</div>;

  const handleEventParticipation = () => {
    if (!nickname) {
      navigate('/login');
      return;
    }
    navigate(`/feed-create?eventId=${id}`);
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('정말로 이 이벤트를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/api/events/${id}`);
      alert('이벤트가 성공적으로 삭제되었습니다.');
      navigate('/events');
    } catch (err) {
      console.error('이벤트 삭제 실패:', err);
      alert('이벤트 삭제에 실패했습니다. 다시 시도해 주세요.');
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

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex justify-between items-center">
          <button className="text-blue-500" onClick={() => navigate(-1)}>
            ← 뒤로가기
          </button>
          {(nickname === "admin" || nickname === "seller") && (
            <div className="flex gap-2">
              <button
                className="text-white bg-[#87CEEB] px-4 py-2 rounded hover:bg-blue-400"
                onClick={() => navigate(`/events/edit/${id}`)}
              >
                이벤트 수정
              </button>
              <button
                className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDeleteEvent}
              >
                이벤트 삭제
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="relative h-56 mb-6">
        <img
          src={event.eventDetail.imageUrl}
          alt={event.eventDetail.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm ${
            event.status === "UPCOMING"
              ? "bg-blue-400"
              : event.status === "ONGOING"
              ? "bg-green-500"
              : "bg-gray-400"
          }`}
        >
          {getStatusText(event.status)}
        </span>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{event.eventDetail.title}</h1>
          <span className="bg-[#87CEEB] bg-opacity-10 text-[#87CEEB] px-3 py-1 rounded-full text-sm font-medium">
            {getTypeText(event.type)}
          </span>
        </div>
        {event.status === "ONGOING" && (
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
            {event.maxParticipants}명 참여중
          </span>
        )}
        <p className="text-lg text-gray-600 mt-4">{event.eventDetail.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">구매 기간</h3>
          <p className="text-gray-900 font-medium">
            {event.eventDetail.purchaseStartDate} ~ {event.eventDetail.purchaseEndDate}
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">이벤트 기간</h3>
          <p className="text-gray-900 font-medium">
            {event.eventDetail.eventStartDate} ~ {event.eventDetail.eventEndDate}
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">발표일</h3>
          <p className="text-gray-900 font-medium">{event.eventDetail.announcement}</p>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">이벤트 혜택</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {event.rewards && event.rewards.map((reward) => (
            <div key={reward.id} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="bg-[#87CEEB] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                  {reward.rank}
                </div>
                <span className="text-gray-900 font-medium">등급</span>
              </div>
              <p className="text-gray-700">{reward.reward}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">참여 방법</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="text-gray-700 whitespace-pre-line">
            {event.eventDetail.participationMethod}
          </div>
        </div>
      </div>
      {event.eventDetail.selectionCriteria && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">선정 기준</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-gray-700 whitespace-pre-line">
              {event.eventDetail.selectionCriteria}
            </div>
          </div>
        </div>
      )}
      {event.eventDetail.precautions && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">유의사항</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-gray-700 whitespace-pre-line">
              {event.eventDetail.precautions}
            </div>
          </div>
        </div>
      )}
      <div className="text-center">
        <button
          className={`px-8 py-3 rounded-lg font-bold transition duration-200 whitespace-nowrap cursor-pointer ${
            event.status === "ENDED"
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : event.status === "UPCOMING"
              ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
              : "bg-[#87CEEB] text-white hover:bg-blue-400"
          }`}
          disabled={event.status === "ENDED"}
          onClick={
            event.status === "ONGOING" ? handleEventParticipation : undefined
          }
        >
          {event.status === "ENDED"
            ? "종료된 이벤트"
            : event.status === "UPCOMING"
            ? "알림 신청하기"
            : "이벤트 참여하기"}
        </button>
      </div>
    </div>
  );
};

export default EventDetailPage;
