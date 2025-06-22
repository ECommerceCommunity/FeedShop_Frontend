import { useState, useEffect, FC, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackToTop from 'components/rollback/BackToTop'
import products from '../data/products/products.json';

const ProductEditPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    shoes_type: "",
    mainImageFiles: [] as File[],
    detailImageFiles: [] as File[],
    existingImages: [] as string[],
    detailImages: [] as string[],
    sizes: [] as { size: string; stock_quantity: number }[],
  });

  useEffect(() => {
    const product = products.find((p) => String(p.id) === id);

    if (product) {
      setFormData({
        title: product.name || '',
        price: String(product.price || ''),
        description: product.description || '',
        shoes_type: product.shoes_type || '',
        existingImages: Array.isArray(product.main_image_urls) ? product.main_image_urls : [],
        sizes: product.size_stock_list || [],
        detailImages: Array.isArray(product.detail_image_urls) ? product.detail_image_urls : [],
        mainImageFiles: [],
        detailImageFiles: [],
      });
    }
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/products/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">상품 수정</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 상품명 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            상품명
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />http://localhost:3000/products/edit/4798797
        </div>

        {/* 신발 종류 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">
            신발 종류
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.shoes_type}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 상품 설명 */}
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
            className="border border-gray-300 rounded px-4 py-2 text-sm min-h-[150px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 사이즈 목록 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">사이즈 목록</label>
          <table className="table-auto border w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-2 py-2 w-1/4">사이즈</th>
                <th className="border px-2 py-2 w-1/4">재고 수량</th>
                <th className="border px-2 py-2 w-1/4">삭제</th>
              </tr>
            </thead>
            <tbody>
              {formData.sizes.map((s, i) => (
                <tr key={i}>
                  <td className="border px-2 py-2">
                    <input
                      type="text"
                      value={s.size}
                      placeholder="사이즈 입력"
                      onChange={(e) => {
                        const newSizes = [...formData.sizes];
                        newSizes[i].size = e.target.value;
                        setFormData((prev) => ({ ...prev, sizes: newSizes }));
                      }}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-2">
                    <input
                      type="number"
                      value={s.stock_quantity}
                      placeholder="재고 수량"
                      onChange={(e) => {
                        const newSizes = [...formData.sizes];
                        newSizes[i].stock_quantity = parseInt(e.target.value) || 0;
                        setFormData((prev) => ({ ...prev, sizes: newSizes }));
                      }}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </td>
                  <td className="border px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const newSizes = formData.sizes.filter((_, idx) => idx !== i);
                        setFormData((prev) => ({ ...prev, sizes: newSizes }));
                      }}
                      className="text-red-500 text-sm"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 추가 버튼 */}
          <div className="flex justify-start mt-4">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  sizes: [...prev.sizes, { size: '', stock_quantity: 0 }],
                }))
              }
              className="w-full bg-blue-600 text-white px-6 py-3 rounded text-sm font-semibold hover:bg-blue-700 transition"
            >
              + 사이즈 추가
            </button>
          </div>
        </div>

        {/* 상세 이미지 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">상세 이미지</label>
          <table className="table-auto w-full border text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2 w-3/4 text-left">이미지</th>
                <th className="border px-4 py-2 w-1/4 text-center">삭제</th>
              </tr>
            </thead>
            <tbody>
              {formData.detailImages.map((img, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">
                    <img src={img} alt={`상세 이미지 ${i + 1}`} className="w-24 h-24 object-cover rounded" />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const newDetails = formData.detailImages.filter((_, idx) => idx !== i);
                        setFormData((prev) => ({ ...prev, detailImages: newDetails }));
                      }}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 상세 이미지 업로드 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="detailImageFiles" className="text-sm font-medium text-gray-700">
            상세 이미지 추가
          </label>
          <input
            type="file"
            id="detailImageFiles"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setFormData((prev) => ({
                  ...prev,
                  detailImageFiles: Array.from(e.target.files ?? []),
                }));
              }
            }}
            className="border border-gray-300 rounded px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* 기존 이미지 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">기존 이미지</label>
          <table className="table-auto w-full border text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2 w-3/4 text-left">이미지</th>
                <th className="border px-4 py-2 w-1/4 text-center">삭제</th>
              </tr>
            </thead>
            <tbody>
              {formData.existingImages.map((img, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">
                    <img src={img} alt={`기존 이미지 ${i + 1}`} className="w-24 h-24 object-cover rounded" />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const newExisting = formData.existingImages.filter((_, idx) => idx !== i);
                        setFormData((prev) => ({ ...prev, existingImages: newExisting }));
                      }}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 기존 이미지 업로드 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="mainImageFiles" className="text-sm font-medium text-gray-700">
            기존 이미지 추가
          </label>
          <input
            type="file"
            id="mainImageFiles"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setFormData((prev) => ({
                  ...prev,
                  mainImageFiles: Array.from(e.target.files!),
                }));
              }
            }}
            className="border border-gray-300 rounded px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          상품 수정하기
        </button>
      </form>
      <BackToTop />
    </div>
  );
};

export default ProductEditPage;
