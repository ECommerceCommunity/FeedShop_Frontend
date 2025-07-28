import { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { EventType } from "../../types/types";

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
  const { id } = useParams<{ id: string }>();
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
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
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: EventType) => {
    setForm(prev => ({ ...prev, type }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.purchaseStartDate || !form.purchaseEndDate || !form.eventStartDate || !form.eventEndDate || !form.announcement || !form.participationMethod || !form.rewards || !form.selectionCriteria || !form.precautions) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
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

      await axiosInstance.put(`/api/events/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("이벤트가 성공적으로 수정되었습니다.");
      navigate(`/events/${id}`);
    } catch (error) {
      console.error("이벤트 수정 실패:", error);
      alert("이벤트 수정에 실패했습니다.");
    } finally {
      setLoading(false);
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

  if (loading && !form.title) {
    return <div className="p-5">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500">{error}</div>;
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">이벤트 수정</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">이벤트 제목 *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">이벤트 유형 *</label>
            <div className="flex gap-2">
              {(["BATTLE", "MISSION", "MULTIPLE"] as EventType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={`px-4 py-2 rounded ${form.type === type ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {getTypeText(type)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">구매 시작일 *</label>
            <input
              type="datetime-local"
              name="purchaseStartDate"
              value={form.purchaseStartDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">구매 종료일 *</label>
            <input
              type="datetime-local"
              name="purchaseEndDate"
              value={form.purchaseEndDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">이벤트 시작일 *</label>
            <input
              type="datetime-local"
              name="eventStartDate"
              value={form.eventStartDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">이벤트 종료일 *</label>
            <input
              type="datetime-local"
              name="eventEndDate"
              value={form.eventEndDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">발표일 *</label>
          <input
            type="datetime-local"
            name="announcement"
            value={form.announcement}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">이벤트 설명 *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">참여 방법 *</label>
          <textarea
            name="participationMethod"
            value={form.participationMethod}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">상품 정보 *</label>
          <textarea
            name="rewards"
            value={form.rewards}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="상품명, 브랜드, 가격 등을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">선정 기준 *</label>
          <textarea
            name="selectionCriteria"
            value={form.selectionCriteria}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">주의사항 *</label>
          <textarea
            name="precautions"
            value={form.precautions}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">최대 참여자 수 *</label>
          <input
            type="number"
            name="maxParticipants"
            value={form.maxParticipants}
            onChange={handleChange}
            min="1"
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">이벤트 이미지</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {form.imagePreview && (
            <img src={form.imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "수정 중..." : "이벤트 수정"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/events/${id}`)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventEditPage;
