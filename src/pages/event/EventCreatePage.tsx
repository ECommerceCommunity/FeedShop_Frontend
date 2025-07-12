import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const initialForm = {
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
  image: null as File | null,
  imagePreview: ""
};

const EventCreatePage = () => {
  const [eventForm, setEventForm] = useState(initialForm);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type: string) => {
    setEventForm((prev) => ({ ...prev, type }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setEventForm((prev) => ({ ...prev, image: file, imagePreview: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setEventForm((prev) => ({ ...prev, image: null, imagePreview: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.description || !eventForm.purchaseStartDate || !eventForm.purchaseEndDate || !eventForm.eventStartDate || !eventForm.eventEndDate || !eventForm.participationMethod || !eventForm.rewards || !eventForm.selectionCriteria || !eventForm.precautions) {
      setError("모든 필수 항목을 입력해 주세요.");
      return;
    }
    setError("");

    // FormData 생성
    const formData = new FormData();
    formData.append("title", eventForm.title);
    formData.append("type", eventForm.type);
    formData.append("purchaseStartDate", eventForm.purchaseStartDate);
    formData.append("purchaseEndDate", eventForm.purchaseEndDate);
    formData.append("eventStartDate", eventForm.eventStartDate);
    formData.append("eventEndDate", eventForm.eventEndDate);
    formData.append("description", eventForm.description);
    formData.append("participationMethod", eventForm.participationMethod);
    formData.append("rewards", eventForm.rewards);
    formData.append("selectionCriteria", eventForm.selectionCriteria);
    formData.append("precautions", eventForm.precautions);
    if (eventForm.image) {
      formData.append("image", eventForm.image);
    }

    try {
      await axios.post("/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("이벤트가 성공적으로 생성되었습니다!");
      setEventForm(initialForm);
      navigate(-1);
    } catch (err) {
      console.error("이벤트 생성 실패:", err);
      setError("이벤트 생성에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">이벤트 생성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">이벤트명</label>
          <input
            type="text"
            name="title"
            value={eventForm.title}
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
            <button type="button" className={`px-4 py-2 rounded border ${eventForm.type === 'battle' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`} onClick={() => handleTypeSelect('battle')}>배틀</button>
            <button type="button" className={`px-4 py-2 rounded border ${eventForm.type === 'mission' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`} onClick={() => handleTypeSelect('mission')}>미션</button>
            <button type="button" className={`px-4 py-2 rounded border ${eventForm.type === 'multiple' ? 'bg-blue-100 border-blue-400' : 'border-gray-300'}`} onClick={() => handleTypeSelect('multiple')}>다수</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">구매 시작일</label>
            <input type="date" name="purchaseStartDate" value={eventForm.purchaseStartDate} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">구매 종료일</label>
            <input type="date" name="purchaseEndDate" value={eventForm.purchaseEndDate} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">이벤트 시작일</label>
            <input type="date" name="eventStartDate" value={eventForm.eventStartDate} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">이벤트 종료일</label>
            <input type="date" name="eventEndDate" value={eventForm.eventEndDate} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">이벤트 설명</label>
          <textarea name="description" value={eventForm.description} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required rows={3} placeholder="이벤트 설명을 입력하세요" />
        </div>
        <div>
          <label className="block mb-1 font-medium">참여 방법</label>
          <textarea name="participationMethod" value={eventForm.participationMethod} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required rows={2} placeholder="참여 방법을 입력하세요" />
        </div>
        <div>
          <label className="block mb-1 font-medium">이벤트 혜택</label>
          <textarea name="rewards" value={eventForm.rewards} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required rows={2} placeholder="혜택을 입력하세요 (줄바꿈으로 구분)" />
        </div>
        <div>
          <label className="block mb-1 font-medium">선정 기준</label>
          <textarea name="selectionCriteria" value={eventForm.selectionCriteria} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required rows={2} placeholder="선정 기준을 입력하세요" />
        </div>
        <div>
          <label className="block mb-1 font-medium">유의사항</label>
          <textarea name="precautions" value={eventForm.precautions} onChange={handleChange} className="w-full border border-gray-300 rounded px-4 py-2" required rows={2} placeholder="유의사항을 입력하세요" />
        </div>
        <div>
          <label className="block mb-1 font-medium">이벤트 이미지</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="block mb-2" />
          {eventForm.imagePreview && (
            <img src={eventForm.imagePreview} alt="이벤트 미리보기" className="max-h-40 rounded border" />
          )}
          <p className="text-sm text-gray-500 mt-1">권장 크기: 1200 x 600px, 최대 5MB</p>
        </div>
        {error && <div className="text-red-500 font-medium">{error}</div>}
        <div className="flex space-x-3">
          <button type="submit" className="bg-[#87CEEB] text-white px-4 py-2 rounded hover:bg-blue-400">생성하기</button>
          <button type="button" onClick={() => navigate(-1)} className="border border-gray-300 px-4 py-2 rounded">취소</button>
        </div>
      </form>
    </div>
  );
};

export default EventCreatePage;
