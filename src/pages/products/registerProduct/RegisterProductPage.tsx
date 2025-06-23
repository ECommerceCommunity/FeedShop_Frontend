import { useState, FC, ChangeEvent, FormEvent } from "react";
import { XMarkIcon } from '@heroicons/react/24/outline'

type ProductUploadPageProps = {
  onClose?: () => void;
};

const ProductUploadPage: FC<ProductUploadPageProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    images: [] as File[],
    detailImages: [] as File[],
    colors: [] as { name: string; image?: File }[], // 변경됨
    colorInput: "",
    sizes: [] as { size: string; stock: number }[],
    sizeInput: "",
    stockInput: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "images" | "detailImages"
  ) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        [type]: Array.from(e.target.files as FileList),
      }));
    }
  };

  const renderImagePreview = (files: File[]) => {
    return files.map((file, idx) => (
      <img
        key={idx}
        src={URL.createObjectURL(file)}
        alt={`preview-${idx}`}
        className="w-24 h-24 object-cover rounded border"
      />
    ));
  };

  const handleColorAdd = () => {
    const newColor = formData.colorInput.trim();
    if (
      newColor &&
      !formData.colors.some((c) => c.name === newColor)
    ) {
      setFormData((prev) => ({
        ...prev,
        colorInput: "",
        colorImageInput: null,
      }));
    }
  };

  const handleColorRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleSizeAdd = () => {
    const size = formData.sizeInput.trim();
    const stock = parseInt(formData.stockInput.trim(), 10);

    if (
      size &&
      !isNaN(stock) &&
      !formData.sizes.some((s) => s.size === size)
    ) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, { size, stock }],
        sizeInput: "",
        stockInput: "",
      }));
    }
  };

  const handleSizeRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onClose?.();
  };

  return (
    <div className="mx-auto h-[90vh] flex flex-col relative">
      {/* 상단 고정 영역 */}
      <div className="flex p-6 justify-between items-center mb-4 sticky top-0 bg-white z-50 border-b">
        <h1 className="text-2xl font-bold text-gray-800">상품 등록</h1>
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
          {/* 상품명 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              상품명
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2 text-sm"
            />
          </div>

          {/* 가격 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="text-sm font-medium text-gray-700">
              가격
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2 text-sm"
            />
          </div>

          {/* 신발 종류 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">
              신발 종류
            </label>
            <input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2 text-sm"
            />
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              상품 설명
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-4 py-2 text-sm min-h-[150px]"
            />
          </div>

          {/* 색상 입력 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">색상</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="colorInput"
                value={formData.colorInput}
                onChange={handleChange}
                placeholder="예: 블랙"
                className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleColorAdd}
                className="bg-gray-200 px-4 py-2 text-sm rounded hover:bg-gray-300"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {color.name}
                  {color.image && (
                    <img
                      src={URL.createObjectURL(color.image)}
                      alt={color.name}
                      className="w-5 h-5 object-cover rounded"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleColorRemove(index)}
                    className="ml-1 text-red-500 hover:underline"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 사이즈/재고 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">사이즈 & 재고</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="sizeInput"
                value={formData.sizeInput}
                onChange={handleChange}
                placeholder="예: 270"
                className="w-1/2 border border-gray-300 rounded px-4 py-2 text-sm"
              />
              <input
                type="number"
                name="stockInput"
                value={formData.stockInput}
                onChange={handleChange}
                placeholder="재고 수량"
                className="w-1/2 border border-gray-300 rounded px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleSizeAdd}
                className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
              >
                추가
              </button>
            </div>
            <ul className="text-sm text-gray-800 space-y-1">
              {formData.sizes.map((s, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded">
                  <span>{s.size} 사이즈 - {s.stock}개</span>
                  <button onClick={() => handleSizeRemove(index)} className="text-red-500 text-xs hover:underline">삭제</button>
                </li>
              ))}
            </ul>
          </div>

          {/* 대표 이미지 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="images" className="text-sm font-medium text-gray-700">
              대표 이미지
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={(e) => handleImageChange(e, "images")}
              required
              className="border border-gray-300 rounded px-4 py-2 text-sm"
            />
            <div className="flex gap-2 mt-2">
              {renderImagePreview(formData.images)}
            </div>
          </div>

          {/* 상세 이미지 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="detailImages" className="text-sm font-medium text-gray-700">
              상세 이미지
            </label>
            <input
              type="file"
              id="detailImages"
              multiple
              accept="image/*"
              onChange={(e) => handleImageChange(e, "detailImages")}
              className="border border-gray-300 rounded px-4 py-2 text-sm"
            />
            <div className="flex gap-2 mt-2">
              {renderImagePreview(formData.detailImages)}
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            상품 등록하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductUploadPage;
