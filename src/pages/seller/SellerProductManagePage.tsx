import React, { useState, useEffect } from "react";
import { ProductService } from "../../api/productService";
import { CategoryService } from "../../api/categoryService";
import {
  ProductListItem,
  Category,
  CreateProductRequest,
} from "../../types/products";

// 상품 등록/수정 모달 컴포넌트
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: CreateProductRequest) => void;
  editProduct?: ProductListItem | null;
  categories: Category[];
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editProduct,
  categories,
}) => {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    price: 0,
    categoryId: 1,
    description: "",
    discountType: "NONE",
    discountValue: 0,
    images: [{ url: "images/mock/products/default/main/1.jpg", type: "MAIN" }],
    options: [{ gender: "UNISEX", size: "FREE", color: "DEFAULT", stock: 0 }],
  });

  // 수정 모드일 때 폼 데이터 초기화
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        price: editProduct.price,
        categoryId: 1, // 기본값
        description: "",
        discountType: "NONE",
        discountValue: 0,
        images: [{ url: editProduct.mainImageUrl, type: "MAIN" }],
        options: [
          { gender: "UNISEX", size: "FREE", color: "DEFAULT", stock: 10 },
        ],
      });
    } else {
      // 새 상품 등록 모드
      setFormData({
        name: "",
        price: 0,
        categoryId: 1,
        description: "",
        discountType: "NONE",
        discountValue: 0,
        images: [
          { url: "images/mock/products/default/main/1.jpg", type: "MAIN" },
        ],
        options: [
          { gender: "UNISEX", size: "FREE", color: "DEFAULT", stock: 0 },
        ],
      });
    }
  }, [editProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateMockImageUrl = (productName: string) => {
    const productId = Math.floor(Math.random() * 1000000);
    return `images/mock/products/${productId}/main/1.jpg`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {editProduct ? "상품 수정" : "상품 등록"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 상품명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* 가격 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격 (원)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
              min="0"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: Number(e.target.value) })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 상품 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품 설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={4}
            />
          </div>

          {/* 재고 수량 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재고 수량
            </label>
            <input
              type="number"
              value={formData.options[0]?.stock || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  options: [
                    { ...formData.options[0], stock: Number(e.target.value) },
                  ],
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
              min="0"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editProduct ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 메인 상품 관리 페이지 컴포넌트
const SellerProductManagePage: React.FC = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductListItem | null>(null);

  // 상품 목록 로드
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getSellerProducts(0, 100);
      setProducts(response.content || []);
    } catch (error) {
      console.error("상품 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 목록 로드
  const loadCategories = async () => {
    try {
      const categoryList = await CategoryService.getCategories();
      setCategories(categoryList);
    } catch (error) {
      console.error("카테고리 로드 실패:", error);
      setCategories(CategoryService.DEFAULT_CATEGORIES);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // 상품 등록/수정
  const handleSaveProduct = async (productData: CreateProductRequest) => {
    try {
      if (editProduct) {
        // 수정
        await ProductService.updateProduct(editProduct.productId, {
          name: productData.name,
          price: productData.price,
          categoryId: productData.categoryId,
          description: productData.description,
        });
      } else {
        // 등록
        await ProductService.createProduct(productData);
      }

      setIsModalOpen(false);
      setEditProduct(null);
      loadProducts(); // 목록 새로고침
    } catch (error) {
      console.error("상품 저장 실패:", error);
      alert("상품 저장에 실패했습니다.");
    }
  };

  // 상품 삭제
  const handleDeleteProduct = async (productId: number) => {
    try {
      await ProductService.deleteProduct(productId);
      loadProducts(); // 목록 새로고침
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert("상품 삭제에 실패했습니다.");
    }
  };

  // 상품 수정 모달 열기
  const handleEditProduct = (product: ProductListItem) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  // 새 상품 등록 모달 열기
  const handleNewProduct = () => {
    setEditProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">상품 관리</h2>
            <p className="text-gray-600">
              등록된 상품을 관리하고 새로운 상품을 추가하세요
            </p>
          </div>
          <button
            onClick={handleNewProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>상품 등록</span>
          </button>
        </div>

        {/* 상품 목록 */}
        {loading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-gray-400 text-2xl"></i>
            <p className="text-gray-600 mt-2">상품 목록을 불러오는 중...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상품 정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가격
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      스토어
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관심
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={product.mainImageUrl}
                              alt={product.name}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/64x64?text=No+Image";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {product.productId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₩{product.price.toLocaleString()}
                        </div>
                        {product.discountPrice !== product.price && (
                          <div className="text-sm text-red-600">
                            할인: ₩{product.discountPrice.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.storeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {product.storeId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <i className="fas fa-heart text-red-500 mr-1"></i>
                          <span className="text-sm text-gray-900">
                            {product.wishNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteProduct(product.productId)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="text-center py-8">
                  <i className="fas fa-box-open text-gray-400 text-4xl mb-4"></i>
                  <p className="text-gray-600">등록된 상품이 없습니다.</p>
                  <button
                    onClick={handleNewProduct}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    첫 상품 등록하기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 상품 등록/수정 모달 */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditProduct(null);
          }}
          onSave={handleSaveProduct}
          editProduct={editProduct}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default SellerProductManagePage;
