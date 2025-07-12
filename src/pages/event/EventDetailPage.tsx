import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

<<<<<<< HEAD
interface Reward {
  rank: number;
  reward: string;
}

interface EventDetail {
  id: number;
  title: string;
  status: "upcoming" | "ongoing" | "ended";
  type: string;
  description: string;
  purchasePeriod: string;
  votePeriod: string;
  announcementDate: string;
  participantCount: number;
  rewards: Reward[];
  image: string;
}
=======
const events = [
  {
    id: 1,
    title: "여름 스타일 챌린지",
    status: "upcoming",
    type: "battle",
    description:
      "다가오는 여름, 나만의 스타일로 시원하고 트렌디한 여름 패션을 선보여주세요. 베스트 스타일러에게는 풍성한 경품이 준비되어 있습니다.",
    purchasePeriod: "2025.06.25 - 2025.07.07",
    votePeriod: "2025.07.08 - 2025.07.14",
    announcementDate: "2025.07.15",
    participantCount: 0,
    rewards: [
      { rank: 1, reward: "100만원 상당의 브랜드 상품권" },
      { rank: 2, reward: "50만원 상당의 브랜드 상품권" },
      { rank: 3, reward: "30만원 상당의 브랜드 상품권" },
    ],
    image:
      "https://readdy.ai/api/search-image?query=summer%20fashion%20collection%20display%20with%20bright%20colors%20and%20modern%20aesthetic%2C%20professional%20marketing%20campaign%2C%20clean%20minimalist%20background%20with%20summer%20vibes&width=800&height=400&seq=event1&orientation=landscape",
  },
  {
    id: 2,
    title: "데일리룩 스타일링 대전",
    status: "ongoing",
    type: "mission",
    description:
      "일상 속 나만의 스타일을 공유해주세요. 데일리룩으로 특별한 당신의 패션 감각을 보여주세요.",
    purchasePeriod: "2025.06.15 - 2025.06.30",
    votePeriod: "2025.07.01 - 2025.07.07",
    announcementDate: "2025.07.08",
    participantCount: 1234,
    rewards: [
      { rank: 1, reward: "최신 스마트폰" },
      { rank: 2, reward: "무선이어폰" },
      { rank: 3, reward: "패션 브랜드 기프트카드" },
    ],
    image:
      "https://readdy.ai/api/search-image?query=casual%20daily%20fashion%20collection%20display%20with%20modern%20aesthetic%2C%20professional%20marketing%20campaign%2C%20clean%20minimalist%20background%20with%20urban%20vibes&width=800&height=400&seq=event2&orientation=landscape",
  },
  {
    id: 3,
    title: "봄 패션 위크",
    status: "ended",
    type: "multiple",
    description:
      "봄의 설렘을 담은 패션으로 특별한 순간을 만들어보세요. 다양한 스타일로 봄의 감성을 표현해주세요.",
    purchasePeriod: "2025.05.01 - 2025.05.15",
    votePeriod: "2025.05.16 - 2025.05.22",
    announcementDate: "2025.05.23",
    participantCount: 3456,
    rewards: [
      { rank: 1, reward: "럭셔리 브랜드 가방" },
      { rank: 2, reward: "디자이너 의류 세트" },
      { rank: 3, reward: "뷰티 제품 세트" },
    ],
    image:
      "https://readdy.ai/api/search-image?query=spring%20fashion%20collection%20display%20with%20soft%20pastel%20colors%20and%20modern%20aesthetic%2C%20professional%20marketing%20campaign%2C%20clean%20minimalist%20background%20with%20spring%20vibes&width=800&height=400&seq=event3&orientation=landscape",
  },
];
>>>>>>> origin/develop

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { nickname } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError("이벤트 상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);
=======
  const { user } = useAuth();

  const event = events.find((e) => e.id === Number(id));
>>>>>>> origin/develop

  if (loading) return <div className="p-5">로딩 중...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;
  if (!event) return <div className="p-5">존재하지 않는 이벤트입니다.</div>;

  const handleEventParticipation = () => {
<<<<<<< HEAD
    if (!nickname) {
      navigate('/login');
      return;
    }
=======
    if (!user?.nickname) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      navigate("/login");
      return;
    }

    // 로그인된 경우 피드 생성 페이지로 이동 (이벤트 ID와 함께)
>>>>>>> origin/develop
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
          src={event.image}
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
            {event.participantCount.toLocaleString()}명 참여중
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
