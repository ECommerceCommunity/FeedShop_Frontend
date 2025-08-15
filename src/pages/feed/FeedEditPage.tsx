import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FeedService from "../../api/feedService";

interface EditForm {
  title: string;
  content: string;
  instagramId: string;
  hashtags: string[];
}

const FeedEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const feedId = Number(searchParams.get("id"));

  const [form, setForm] = useState<EditForm>({
    title: "",
    content: "",
    instagramId: "",
    hashtags: [],
  });
  const [hashtagsInput, setHashtagsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!feedId) {
      navigate("/feeds");
      return;
    }
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const detail = await FeedService.getFeed(feedId);
        setForm({
          title: detail.title || "",
          content: detail.content || "",
          instagramId: detail.instagramId || "",
          hashtags: (detail.hashtags || []).map((h: any) => h.tag).filter(Boolean),
        });
        setHashtagsInput(((detail.hashtags || []).map((h: any) => h.tag).filter(Boolean)).join(" "));
      } catch (e: any) {
        setError(e?.response?.data?.message || "피드 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [feedId, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const parseHashtags = (raw: string): string[] => {
    // 공백/콤마/해시 제거 후 중복 제거, 빈값 제거
    const tokens = raw
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith("#") ? t.slice(1) : t));
    return Array.from(new Set(tokens));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("제목은 필수입니다.");
      return;
    }
    try {
      setSaving(true);
      const hashtags = parseHashtags(hashtagsInput);
      await FeedService.updateFeed(feedId, {
        title: form.title.trim(),
        content: form.content,
        instagramId: form.instagramId,
        hashtags,
      });
      setToastMessage("피드가 수정되었습니다.");
      setShowToast(true);
      setTimeout(() => navigate('/feeds'), 1200);
    } catch (e: any) {
      setError(e?.response?.data?.message || "피드 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;
  if (error) (
    // 단순 에러 표시
    console.error(error)
  );

  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">피드 수정</h2>
      <div className="space-y-4">
        <input
          className="w-full border rounded px-4 py-2"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="제목"
          maxLength={100}
        />
        <textarea
          className="w-full border rounded px-4 py-2"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="내용(최대 2000자)"
          maxLength={2000}
          rows={8}
        />
        <input
          className="w-full border rounded px-4 py-2"
          name="instagramId"
          value={form.instagramId}
          onChange={handleChange}
          placeholder="인스타그램 ID (선택)"
        />
        <input
          className="w-full border rounded px-4 py-2"
          name="hashtags"
          value={hashtagsInput}
          onChange={(e) => setHashtagsInput(e.target.value)}
          placeholder="#태그1 #태그2 (공백 또는 콤마로 구분)"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex gap-2 mt-4">
          <button
            className="bg-[#87CEEB] text-white px-6 py-2 rounded hover:bg-blue-400 disabled:opacity-60"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "저장 중..." : "저장"}
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
            onClick={() => navigate('/feeds')}
          >
            취소
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-[#87CEEB] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center">
            <i className="fas fa-check-circle mr-1"></i>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedEditPage; 