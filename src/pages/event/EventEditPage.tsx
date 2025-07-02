import { useParams, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent } from "react";

// FormState 타입 선언
type FormState = {
  title: string;
  type: string;
  purchaseStartDate: string;
  purchaseEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  description: string;
  participationMethod: string;
  rewards: string;
  selectionCriteria: string;
  precautions: string;
  image: string;
  imageFile: File | null;
  imagePreview: string;
};

const events = [
  {
    id: 1,
    title: "여름 스타일 챌린지",
    status: "upcoming",
    type: "battle",
    description: "다가오는 여름, 나만의 스타일로 시원하고 트렌디한 여름 패션을 선보여주세요. 베스트 스타일러에게는 풍성한 경품이 준비되어 있습니다.",
    purchaseStartDate: "2025-06-25",
    purchaseEndDate: "2025-07-07",
    eventStartDate: "2025-07-08",
    eventEndDate: "2025-07-14",
    purchasePeriod: "2025.06.25 - 2025.07.07",
    votePeriod: "2025.07.08 - 2025.07.14",
    announcementDate: "2025.07.15",
    participantCount: 0,
    rewards: [
      { rank: 1, reward: "100만원 상당의 브랜드 상품권" },
      { rank: 2, reward: "50만원 상당의 브랜드 상품권" },
      { rank: 3, reward: "30만원 상당의 브랜드 상품권" }
    ],
    image: "https://readdy.ai/api/search-image?query=summer%20fashion%20collection%20display%20with%20bright%20colors%20and%20modern%20aesthetic%2C%20professional%20marketing%20campaign%2C%20clean%20minimalist%20background%20with%20summer%20vibes&width=800&height=400&seq=event1&orientation=landscape",
    participationMethod: "이벤트 기간 내 상품 구매, 착용샷 업로드 및 해시태그 추가, 다른 참여자의 착용샷에 투표하기",
    selectionCriteria: "스타일 창의성 + 유저 투표 + 운영진 평가",
    precautions: "동일한 아이템이 명확히 확인되지 않으면 제외될 수 있음"
  },
  {
    id: 2,
    title: "데일리룩 스타일링 대전",
    status: "ongoing",
    type: "mission",
    description: "일상 속 나만의 스타일을 공유해주세요. 데일리룩으로 특별한 당신의 패션 감각을 보여주세요.",
    purchaseStartDate: "2025-06-15",
    purchaseEndDate: "2025-06-30",
    eventStartDate: "2025-07-01",
    eventEndDate: "2025-07-07",
    purchasePeriod: "2025.06.15 - 2025.06.30",
    votePeriod: "2025.07.01 - 2025.07.07",
    announcementDate: "2025.07.08",
    participantCount: 1234,
    rewards: [
      { rank: 1, reward: "최신 스마트폰" },
      { rank: 2, reward: "무선이어폰" },
      { rank: 3, reward: "패션 브랜드 기프트카드" }
    ],
    image: "https://readdy.ai/api/search-image?query=casual%20daily%20fashion%20collection%20display%20with%20modern%20aesthetic%2C%20professional%20marketing%20campaign%2C%20clean%20minimalist%20background%20with%20urban%20vibes&width=800&height=400&seq=event2&orientation=landscape",
    participationMethod: "이벤트 기간 내 상품 구매, 착용샷 업로드 및 해시태그 추가, 다른 참여자의 착용샷에 투표하기",
    selectionCriteria: "스타일 창의성 + 유저 투표 + 운영진 평가",
    precautions: "동일한 아이템이 명확히 확인되지 않으면 제외될 수 있음"
  },
  {
    id: 3,
    title: "봄 패션 위크",
    status: "ended",
    type: "multiple",
    description: "봄의 설렘을 담은 패션으로 특별한 순간을 만들어보세요. 다양한 스타일로 봄의 감성을 표현해주세요.",
    purchaseStartDate: "2025-05-01",
    purchaseEndDate: "2025-05-15",
    eventStartDate: "2025-05-16",
    eventEndDate: "2025-05-22",
    purchasePeriod: "2025.05.01 - 2025.05.15",
    votePeriod: "2025.05.16 - 2025.05.22",
    announcementDate: "2025.05.23",
    participantCount: 3456,
    rewards: [
      { rank: 1, reward: "럭셔리 브랜드 가방" },
      { rank: 2, reward: "디자이너 의류 세트" },
      { rank: 3, reward: "뷰티 제품 세트" }
    ],
    image: "https://readdy.ai/api/search-image?query=spring%20fashion%20collection%20display%20with%20soft%20pastel%20colors%20and%20modern%20aesthetic%2C%20professional%20marketing%20campaign%2C%20clean%20minimalist%20background%20with%20spring%20vibes&width=800&height=400&seq=event3&orientation=landscape",
    participationMethod: "이벤트 기간 내 상품 구매, 착용샷 업로드 및 해시태그 추가, 다른 참여자의 착용샷에 투표하기",
    selectionCriteria: "스타일 창의성 + 유저 투표 + 운영진 평가",
    precautions: "동일한 아이템이 명확히 확인되지 않으면 제외될 수 있음"
  }
];

const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === Number(id));
  const [form, setForm] = useState<FormState>(event ? {
    title: event.title,
    type: event.type,
    purchaseStartDate: event.purchaseStartDate,
    purchaseEndDate: event.purchaseEndDate,
    eventStartDate: event.eventStartDate,
    eventEndDate: event.eventEndDate,
    description: event.description,
    participationMethod: event.participationMethod,
    rewards: event.rewards.map(r => r.reward).join('\n'),
    selectionCriteria: event.selectionCriteria,
    precautions: event.precautions,
    image: event.image,
    imageFile: null,
    imagePreview: event.image
  } : {
    title: "",
    type: "battle",
    purchaseStartDate: "",
    purchaseEndDate: "",
    eventStartDate: "",
    eventEndDate: "",
    description: "",
    participationMethod: "",
    rewards: "",
    selectionCriteria: "",
    precautions: "",
    image: "",
    imageFile: null,
    imagePreview: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: string; value: string };
    setForm((prev: FormState) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: string) => {
    setForm((prev: FormState) => ({ ...prev, type }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev: FormState) => ({ ...prev, imageFile: file, imagePreview: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev: FormState) => ({ ...prev, imageFile: null, imagePreview: prev.image }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.purchaseStartDate || !form.purchaseEndDate || !form.eventStartDate || !form.eventEndDate || !form.participationMethod || !form.rewards || !form.selectionCriteria || !form.precautions) {
      setError("모든 필수 항목을 입력해 주세요.");
      return;
    }
    setError("");
    const submitObj = {
      ...form,
      rewards: form.rewards.split('\n'),
      image: form.imageFile ? form.imageFile.name : form.image
    };
    console.log("이벤트 수정:", submitObj);
    alert("이벤트가 수정되었습니다! (콘솔 확인)");
    navigate(`/events/${id}`);
  };

  if (!event) {
    return <div className="p-5">존재하지 않는 이벤트입니다.</div>;
  }

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">이벤트 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">이벤트명</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
            maxLength={100}
            placeholder="이벤트명을 입력하세요"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">이벤트 유형</label>
          <div className="flex gap-2">
            <button type="button" className={`px-4 py-2 rounded border ${form.type === 'battle' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`} onClick={() => handleTypeSelect('battle')}>배틀</button>
            <button type="button" className={`px-4 py-2 rounded border ${form.type === 'mission' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`} onClick={() => handleTypeSelect('mission')}>미션</button>
            <button type="button" className={`px-4 py-2 rounded border ${form.type === 'multiple' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`} onClick={() => handleTypeSelect('multiple')}>다수</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">구매 시작일</label>
            <input type="date" name="purchaseStartDate" value={form.purchaseStartDate} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">구매 종료일</label>
            <input type="date" name="purchaseEndDate" value={form.purchaseEndDate} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">이벤트 시작일</label>
            <input type="date" name="eventStartDate" value={form.eventStartDate} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">이벤트 종료일</label>
            <input type="date" name="eventEndDate" value={form.eventEndDate} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">이벤트 설명</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required rows={3} placeholder="이벤트 설명을 입력하세요" />
        </div>
        <div>
          <label className="block mb-1 font-medium">참여 방법</label>
          <textarea name="participationMethod" value={form.participationMethod} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required rows={2} placeholder="참여 방법을 입력하세요" />
        </div>
        <div>
          <label className="block mb-1 font-medium">이벤트 혜택</label>
          <textarea name="rewards" value={form.rewards} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required rows={2} placeholder="혜택을 입력하세요 (줄바꿈으로 구분)" />
        </div>
        <div>
          <label className="block mb-1 font-medium">선정 기준</label>
          <textarea name="selectionCriteria" value={form.selectionCriteria} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required rows={2} placeholder="선정 기준을 입력하세요" />
        </div>
        <div>
          <label className="block mb-1 font-medium">유의사항</label>
          <textarea name="precautions" value={form.precautions} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required rows={2} placeholder="유의사항을 입력하세요" />
        </div>
        <div>
          <label className="block mb-1 font-medium">이벤트 이미지</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="block mb-2" />
          {form.imagePreview && (
            <img src={form.imagePreview} alt="이벤트 미리보기" className="max-h-40 rounded border" />
          )}
          <p className="text-sm text-gray-500 mt-1">권장 크기: 1200 x 600px, 최대 5MB</p>
        </div>
        {error && <div className="text-red-500 font-medium">{error}</div>}
        <div className="flex space-x-3">
          <button type="submit" className="bg-[#87CEEB] text-white px-4 py-2 rounded hover:bg-blue-400">수정 완료</button>
          <button type="button" onClick={() => navigate(-1)} className="border border-gray-300 px-4 py-2 rounded">취소</button>
        </div>
      </form>
    </div>
  );
};

export default EventEditPage;
