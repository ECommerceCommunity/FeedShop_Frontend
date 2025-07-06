import { useState, FC, ChangeEvent, FormEvent } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline';

type EditStorePageeProps = {
  onClose?: () => void;
};

const EditStorePage: FC<EditStorePageeProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    store_name: "",
    brand_info: "",
    brand_logo: null as File | null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        brand_logo: e.target.files?.[0] ?? null,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // 예시 출력
    console.log({
      store_name: formData.store_name,
      brand_info: formData.brand_info,
      brand_logo: formData.brand_logo?.name ?? null,
    });

    onClose?.();
  };

  return (
    <div className="mx-auto h-[90vh] flex flex-col relative">
      <div className="flex p-6 justify-between items-center mb-4 sticky top-0 bg-white z-50 border-b">
        <h1 className="text-2xl font-bold text-gray-800">가게 등록</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          title="닫기"
          aria-label="닫기"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="overflow-y-auto px-6 pb-6 flex-1">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* 가게명 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="store_name" className="text-sm font-medium text-gray-700">
              가게명
            </label>
            <input
              id="store_name"
              name="store_name"
              value={formData.store_name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2 text-sm"
            />
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="brand_info" className="text-sm font-medium text-gray-700">
              가게 설명
            </label>
            <textarea
              id="brand_info"
              name="brand_info"
              value={formData.brand_info}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2 text-sm min-h-[150px]"
            />
          </div>

          {/* 브랜드 로고 업로드 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="brand_logo" className="text-sm font-medium text-gray-700">
              브랜드 로고
            </label>
            <input
              type="file"
              id="brand_logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="border border-gray-300 rounded px-4 py-2 text-sm"
            />
            {formData.brand_logo && (
              <img
                src={URL.createObjectURL(formData.brand_logo)}
                alt="로고 미리보기"
                className="w-24 h-24 object-contain border mt-2"
              />
            )}
          </div>

          {/* 제출 */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            가게 등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStorePage;
