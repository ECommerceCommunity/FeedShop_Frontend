import { useParams, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { EventType } from "../../types/types";

// FormState 타입 선언
type FormState = {
  title: string;
  type: EventType;
  purchaseStartDate: string;
  purchaseEndDate: string;
  eventStartDate: string;
  eventEndDate: string;
  announcement: string;
  description: string;
  participationMethod: string;
  rewards: string;
  selectionCriteria: string;
  precautions: string;
  maxParticipants: number;
  image: string;
  imageFile: File | null;
  imagePreview: string;
};

const EventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    title: "",
    type: "BATTLE",
    purchaseStartDate: "",
    purchaseEndDate: "",
    eventStartDate: "",
    eventEndDate: "",
    announcement: "",
    description: "",
    participationMethod: "",
    rewards: "",
    selectionCriteria: "",
    precautions: "",
    maxParticipants: 100,
    image: "",
    imageFile: null,
    imagePreview: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get(`/api/events/${id}`);
        const event = res.data;
        setForm({
          title: event.eventDetail.title,
          type: event.type,
          purchaseStartDate: event.eventDetail.purchaseStartDate,
          purchaseEndDate: event.eventDetail.purchaseEndDate,
          eventStartDate: event.eventDetail.eventStartDate,
          eventEndDate: event.eventDetail.eventEndDate,
          announcement: event.eventDetail.announcement,
          description: event.eventDetail.description,
          participationMethod: event.eventDetail.participationMethod,
          rewards: event.eventDetail.rewards || "",
          selectionCriteria: event.eventDetail.selectionCriteria,
          precautions: event.eventDetail.precautions,
          maxParticipants: event.maxParticipants || 100,
          image: event.eventDetail.imageUrl,
          imageFile: null,
          imagePreview: event.eventDetail.imageUrl
        });
      } catch (err) {
        console.error("이벤트 정보 조회 실패:", err);
        setError("이벤트 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: string; value: string };
    if (name === "maxParticipants") {
      setForm((prev: FormState) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setForm((prev: FormState) => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeSelect = (type: EventType) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.purchaseStartDate || !form.purchaseEndDate || !form.eventStartDate || !form.eventEndDate || !form.announcement || !form.participationMethod || !form.rewards || !form.selectionCriteria || !form.precautions) {
      setError("모든 필수 항목을 입력해 주세요.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("type", form.type);
    formData.append("purchaseStartDate", form.purchaseStartDate);
    formData.append("purchaseEndDate", form.purchaseEndDate);
    formData.append("eventStartDate", form.eventStartDate);
    formData.append("eventEndDate", form.eventEndDate);
    formData.append("announcement", form.announcement);
    formData.append("description", form.description);
    formData.append("participationMethod", form.participationMethod);
    formData.append("rewards", form.rewards);
    formData.append("selectionCriteria", form.selectionCriteria);
    formData.append("precautions", form.precautions);
    formData.append("maxParticipants", form.maxParticipants.toString());
    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }
    try {
      await axiosInstance.put(`/api/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("이벤트가 성공적으로 수정되었습니다!");
      navigate(`/events/${id}`);
    } catch (err) {
      console.error("이벤트 수정 실패:", err);
      setError("이벤트 수정에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const getTypeText = (type: EventType) => {
    switch (type) {
      case "BATTLE": return "배틀";
      case "MISSION": return "미션";
      case "MULTIPLE": return "다수";
      default: return "";
    }
  };

  if (loading) return <div className="p-5">로딩 중...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

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
            <button type="button" className={`px-4 py-2 rounded border ${form.type === 'BATTLE' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`} onClick={() => handleTypeSelect('BATTLE')}>{getTypeText('BATTLE')}</button>
            <button type="button" className={`px-4 py-2 rounded border ${form.type === 'MISSION' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`} onClick={() => handleTypeSelect('MISSION')}>{getTypeText('MISSION')}</button>
            <button type="button" className={`px-4 py-2 rounded border ${form.type === 'MULTIPLE' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`} onClick={() => handleTypeSelect('MULTIPLE')}>{getTypeText('MULTIPLE')}</button>
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
          <label className="block mb-1 font-medium">발표일</label>
          <input type="date" name="announcement" value={form.announcement} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">최대 참여자 수</label>
          <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required min="1" placeholder="최대 참여자 수를 입력하세요" />
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
