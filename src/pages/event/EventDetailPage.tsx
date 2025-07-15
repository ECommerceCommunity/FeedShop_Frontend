import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

interface Reward {
  rank: number;
  reward: string;
}

interface EventDetail {
  eventId: number;
  title: string;
  status: "upcoming" | "ongoing" | "ended";
  type: string;
  description: string;
  purchasePeriod: string;
  votePeriod: string;
  announcementDate: string;
  maxParticipants: number;
  rewards: Reward[];
  imageUrl: string;
}

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const nickname = user?.nickname;
  const [event, setEvent] = useState<EventDetail | null>(null);
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

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex justify-between items-center">
          <button className="text-blue-500" onClick={() => navigate(-1)}>
            ← 뒤로가기
          </button>
          <button
            className="text-white bg-[#87CEEB] px-4 py-2 rounded hover:bg-blue-400"
            onClick={() => navigate(`/events/edit/${id}`)}
          >
            이벤트 수정
          </button>
        </div>
      </div>
      <div className="relative h-56 mb-6">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm ${
            event.status === "upcoming"
              ? "bg-blue-400"
              : event.status === "ongoing"
              ? "bg-green-500"
              : "bg-gray-400"
          }`}
        >
          {event.status === "upcoming"
            ? "진행 예정"
            : event.status === "ongoing"
            ? "진행중"
            : "종료"}
        </span>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <span className="bg-[#87CEEB] bg-opacity-10 text-[#87CEEB] px-3 py-1 rounded-full text-sm font-medium">
            {event.type === "battle"
              ? "배틀"
              : event.type === "mission"
              ? "미션"
              : "다수"}
          </span>
        </div>
        {event.status === "ongoing" && (
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
            {event.maxParticipants}명 참여중
          </span>
        )}
        <p className="text-lg text-gray-600 mt-4">{event.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">참여 기간</h3>
          <p className="text-gray-900 font-medium">{event.purchasePeriod}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">투표 기간</h3>
          <p className="text-gray-900 font-medium">{event.votePeriod}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">발표일</h3>
          <p className="text-gray-900 font-medium">{event.announcementDate}</p>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">이벤트 혜택</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {event.rewards.map((reward) => (
            <div key={reward.rank} className="bg-gray-50 p-6 rounded-lg">
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
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>이벤트 기간 내 상품 구매</li>
            <li>착용샷 업로드 및 해시태그 추가</li>
            <li>다른 참여자의 착용샷에 투표하기</li>
          </ol>
        </div>
      </div>
      <div className="text-center">
        <button
          className={`px-8 py-3 rounded-lg font-bold transition duration-200 whitespace-nowrap cursor-pointer ${
            event.status === "ended"
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : event.status === "upcoming"
              ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
              : "bg-[#87CEEB] text-white hover:bg-blue-400"
          }`}
          disabled={event.status === "ended"}
          onClick={
            event.status === "ongoing" ? handleEventParticipation : undefined
          }
        >
          {event.status === "ended"
            ? "종료된 이벤트"
            : event.status === "upcoming"
            ? "알림 신청하기"
            : "이벤트 참여하기"}
        </button>
      </div>
    </div>
  );
};

export default EventDetailPage;
