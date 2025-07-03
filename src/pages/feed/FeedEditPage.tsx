import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// 임시 피드 데이터 타입
interface FeedPost {
  id: number;
  username: string;
  level: number;
  profileImg: string;
  images: string[];
  productName: string;
  size: string;
  gender: string;
  height: number;
  description: string;
  likes: number;
  votes: number;
  comments: number;
  instagramId: string;
  createdAt: string;
  isLiked?: boolean;
  feedType: string;
}

const FeedEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const feedId = Number(searchParams.get("id"));

  const [form, setForm] = useState<Partial<FeedPost>>({});

  useEffect(() => {
    // localStorage에서 피드 데이터 불러오기
    const stored = JSON.parse(localStorage.getItem("localFeeds") || "[]");
    const target = stored.find((f: FeedPost) => f.id === feedId);
    if (target) {
      setForm(target);
    }
  }, [feedId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // localStorage에 수정 반영
    const stored = JSON.parse(localStorage.getItem("localFeeds") || "[]");
    const updated = stored.map((f: FeedPost) =>
      f.id === feedId ? { ...f, ...form } : f
    );
    localStorage.setItem("localFeeds", JSON.stringify(updated));
    navigate("/my-feed");
  };

  if (!form.id) return <div className="p-10 text-center">피드 정보를 불러오는 중...</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">피드 수정</h2>
      <div className="space-y-4">
        <input
          className="w-full border rounded px-4 py-2"
          name="productName"
          value={form.productName || ""}
          onChange={handleChange}
          placeholder="상품명"
        />
        <select
          className="w-full border rounded px-4 py-2"
          name="size"
          value={form.size || ""}
          onChange={handleChange}
        >
          <option value="">사이즈 선택</option>
          {[...Array(17)].map((_, i) => (
            <option key={i} value={220 + i * 5}>{220 + i * 5}</option>
          ))}
        </select>
        <input
          className="w-full border rounded px-4 py-2"
          name="gender"
          value={form.gender || ""}
          onChange={handleChange}
          placeholder="성별"
        />
        <input
          className="w-full border rounded px-4 py-2"
          name="height"
          value={form.height || ""}
          onChange={handleChange}
          placeholder="키(cm)"
        />
        <textarea
          className="w-full border rounded px-4 py-2"
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="착용 느낌, 스타일링 등"
        />
        {/* 이미지, 기타 정보 등 필요시 추가 */}
        <div className="flex gap-2 mt-4">
          <button
            className="bg-[#87CEEB] text-white px-6 py-2 rounded hover:bg-blue-400"
            onClick={handleSave}
          >
            저장
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
            onClick={() => navigate("/my-feed")}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedEditPage; 