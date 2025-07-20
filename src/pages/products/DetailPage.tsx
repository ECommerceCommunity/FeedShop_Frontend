"use client";

import { Fragment, useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import {
  HeartIcon as OutlineHeartIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ShoppingBagIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/24/solid";
import reviews from "../data/reviews/reviews.json";
import products from "../data/products/products.json";
import discounts from "../data/products/discounts.json";
import brands from "../data/products/brands.json";
import SelectSize from "pages/products/SelectSize";
import Fail from "../../components/modal/Fail";
import Warning from "../../components/modal/Warning";
import BackToTop from "components/rollback/BackToTop";
import EditProductsModal from "./editProduct/EditProductsModal";
import { isDiscountValid } from "utils/discount";
import { getDiscountPrice } from "utils/price";
import { useLocalLike } from "hooks/useLocalLike";
import { addToRecentView } from "utils/recentview";
import { toUrl } from "utils/images";

type SelectedItem = {
  size: string;
  stock: number;
  quantity: number;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const thumbnailsPerPage = 6;
  const [startIndex, setStartIndex] = useState(0);
  const [showFailModal, setShowFailModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showEmptySelectionModal, setShowEmptySelectionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const productData = products.find((p) => String(p.id) === id);
  const brandData = brands.find(
    (b) => String(b.store_id) === String(productData?.store_id)
  );

  // 최근 본 상품에 추가
  useEffect(() => {
    if (productData) {
      addToRecentView(productData.id);
    }
  }, [productData]);

  const productReviews = useMemo(() => {
    return reviews.filter((r) => r.product_id === productData?.id);
  }, [productData?.id]);

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return total / productReviews.length;
  }, [productReviews]);

  const originalPrice = Number(
    typeof productData?.price === "number" ? productData.price : 0
  );
  const discountDataRaw = discounts.find((d) => d.product_id === Number(id));
  const discountDataTyped = discountDataRaw
    ? {
        ...discountDataRaw,
        discount_type: (discountDataRaw.discount_type ?? "정률") as
          | "정률"
          | "정액",
      }
    : undefined;
  const safeDiscount = isDiscountValid(discountDataTyped)
    ? discountDataTyped
    : undefined;
  const discountPrice = getDiscountPrice(originalPrice, safeDiscount);

  const isDiscounted = discountPrice < originalPrice;

  const itemsPerSlide = 6;
  const [colorStartIndex, setColorStartIndex] = useState(0);

  const sizeOptions =
    productData?.size_stock_list?.map((item: any) => ({
      size: item.size,
      stock: item.stock_quantity,
      disabled: item.stock_quantity === 0, // 품절 여부
    })) ?? [];

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const handleRemove = (size: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.size !== size));
  };

  const maxQuantity = 5;

  const handleQuantityChange = (size: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.size === size) {
          const newQuantity = item.quantity + delta;
          if (newQuantity > maxQuantity) {
            setShowFailModal(true);
            return item;
          }
          return {
            ...item,
            quantity: Math.max(1, Math.min(newQuantity, item.stock)),
          };
        }
        return item;
      })
    );
  };

  const localStorageKey = productData ? `liked_product_${productData.id}` : "";
  const { likes, toggleLike, hasLiked } = useLocalLike(localStorageKey);
  const liked = productData ? hasLiked(productData.id) : false;
  const likesCount = likes.size;

  // 후기 영역에 대한 ref 생성 (must be unconditional)
  const reviewRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const detailImageRef = useRef<HTMLDivElement>(null);

  if (!productData) {
    return (
      <div className="p-10 text-red-600">해당 상품을 찾을 수 없습니다.</div>
    );
  }

  // 스크롤을 후기 영역으로 이동하는 함수
  const handleScrollToReview = () => {
    if (reviewRef.current) {
      reviewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToDescription = () => {
    descriptionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDetailImage = () => {
    detailImageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const product = {
    id: productData.id, // number
    name: productData.name, // string
    price: originalPrice,
    rating: 4,
    likes: productData.product_likes ?? 0,
    images: Array.isArray(productData.main_image_urls?.map(toUrl))
      ? productData.main_image_urls?.map(toUrl).map((url: string, idx: number) => ({
          id: idx,
          name: `${productData.name} 이미지 ${idx + 1}`,
          src: toUrl(url),
          alt: productData.name,
        }))
      : [],
    description: productData.description || "",
    detail_image_urls: productData.detail_image_urls?.map(toUrl) || [],
  };

  const handlePrev = () => {
    if (colorStartIndex > 0)
      setColorStartIndex(colorStartIndex - itemsPerSlide);
  };

  const handleNext = () => {
    if (
      productData?.color_info?.other_color_products &&
      colorStartIndex + itemsPerSlide <
        productData.color_info.other_color_products.length
    ) {
      setColorStartIndex(colorStartIndex + itemsPerSlide);
    }
  };

  const handleUp = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleDown = () => {
    if (startIndex + thumbnailsPerPage < product.images.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handleCart = () => {
    if (selectedItems.length === 0) {
      setShowEmptySelectionModal(true);
      return;
    }

    addCart();

    // 여기서 navigate('/cart') 대신 Warning 모달 열기
    setShowWarning(true);
  };

  const addCart = () => {
    // 장바구니 추가 로직
    const currentCart = JSON.parse(localStorage.getItem("cart") ?? "[]");
    const newItems = selectedItems.map((item) => ({
      id: `${product.id}-${item.size}`,
      name: product.name,
      option: item.size,
      price: Math.floor(discountPrice),
      originalPrice: product.price,
      discount: isDiscounted
        ? Math.round(((product.price - discountPrice) / product.price) * 100)
        : 0,
      quantity: item.quantity,
      image: product.images?.[0]?.src || "",
      selected: true,
    }));

    const updatedCart = [...currentCart, ...newItems];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleOrder = () => {
    if (selectedItems.length === 0) {
      setShowEmptySelectionModal(true);
      return;
    }

    const newItems = selectedItems.map((item) => ({
      id: `${product.id}-${item.size}`,
      name: product.name,
      option: item.size,
      price: Math.floor(discountPrice),
      originalPrice: product.price,
      discount: isDiscounted
        ? Math.round(((product.price - discountPrice) / product.price) * 100)
        : 0,
      quantity: item.quantity,
      image: product.images[0]?.src || "",
      selected: true,
    }));

    navigate("/payment", {
      state: {
        products: newItems,
      },
    });
  };

  const handleReviewEdit = () => {
    navigate("/reviews/edit");
  };

  return (
    <>
      {showFailModal && (
        <Fail
          title="갯수 한정 초과"
          message="한 사이즈당 최대 5개까지만 선택할 수 있습니다."
          onClose={() => setShowFailModal(false)}
        />
      )}
      {showDuplicateModal && (
        <Fail
          title="중복 선택"
          message="이미 선택한 사이즈입니다."
          onClose={() => setShowDuplicateModal(false)}
        />
      )}
      {showEmptySelectionModal && (
        <Fail
          title="옵션 선택 필요"
          message="사이즈를 선택해주세요."
          onClose={() => setShowEmptySelectionModal(false)}
        />
      )}
      {showWarning && (
        <Warning
          open={showWarning}
          title="장바구니 담기 완료"
          message="장바구니로 이동하시겠습니까?"
          onConfirm={() => {
            setShowWarning(false);
            navigate("/cart");
          }}
          onCancel={() => {
            setShowWarning(false);
          }}
        />
      )}
      {showEditModal && (
        <EditProductsModal
          product={productData}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteWarning && (
        <Warning
          open={showDeleteWarning}
          title="상품 삭제"
          message="정말로 이 상품을 삭제하시겠습니까?"
          onConfirm={() => {
            setShowDeleteWarning(false);
            console.log("Deleting product:", productData.id);
            navigate("/products");
          }}
          onCancel={() => {
            setShowDeleteWarning(false);
          }}
        />
      )}
      <div className="bg-white mx-auto">
        <div className="lg:grid lg:grid-cols-[1.7fr_1px_1fr] lg:items-start gap-4">
          <div className="col-span-1 p-5">
            <TabGroup as={Fragment}>
              <>
                <div className="lg:flex gap-4">
                  <div className="pl-5 pr-1 flex flex-col items-center">
                    <button
                      onClick={handleUp}
                      disabled={startIndex === 0}
                      className="mb-2 text-gray-900 hover:text-indigo-500 disabled:opacity-50"
                      title="위로 이동"
                    >
                      <ChevronUpIcon className="size-6" />
                    </button>

                    <TabList className="flex flex-col space-y-4">
                      {product.images.map((image, idx) => {
                        const isVisible =
                          idx >= startIndex &&
                          idx < startIndex + thumbnailsPerPage;
                        return (
                          <Tab
                            key={image.id}
                            className={classNames(
                              "group relative h-24 w-24 cursor-pointer rounded-md bg-white text-sm font-medium text-gray-900 ring-2 ring-transparent data-[selected]:ring-indigo-500 ring-offset-2 box-border hover:bg-gray-50 transition",
                              isVisible ? "" : "hidden"
                            )}
                          >
                            <img
                              src={toUrl(image.src)}
                              alt={image.alt}
                              className="h-full w-full object-cover rounded-md"
                            />
                          </Tab>
                        );
                      })}
                    </TabList>

                    <button
                      onClick={handleDown}
                      disabled={
                        startIndex + thumbnailsPerPage >= product.images.length
                      }
                      className="mt-2 text-gray-900 hover:text-indigo-500 disabled:opacity-50"
                      title="아래로 이동"
                    >
                      <ChevronDownIcon className="size-6" />
                    </button>
                  </div>

                  <TabPanels className="flex-1 flex justify-center items-center">
                    {product.images.map((image) => (
                      <TabPanel key={image.id}>
                        <img
                          src={toUrl(image.src)}
                          alt={image.alt}
                          className="w-[720px] h-[720px] object-cover rounded-lg"
                        />
                      </TabPanel>
                    ))}
                  </TabPanels>
                </div>

                <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
                  <div className="flex bg-gray-100 text-gray-500 text-sm font-medium border-b border-gray-200">
                    {product.description &&
                      product.description.trim() !== "" &&
                      product.description.trim() !== "N/A" && (
                        <button
                          className="flex-1 py-3 text-black font-semibold border-r border-gray-300"
                          onClick={scrollToDescription}
                        >
                          상세 정보
                        </button>
                      )}
                    {Array.isArray(product.detail_image_urls) &&
                      product.detail_image_urls.length > 0 && (
                        <button
                          className="flex-1 py-3 text-black font-semibold border-r border-gray-300"
                          onClick={scrollToDetailImage}
                        >
                          자세한 이미지
                        </button>
                      )}
                    {productReviews.length > 0 && (
                      <button
                        className="flex-1 py-3 text-black font-semibold"
                        onClick={handleScrollToReview}
                      >
                        리뷰·후기{" "}
                        <span className="ml-1 text-indigo-600">
                          {productReviews.length}
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="p-4 bg-gray-500">
                    {product.description &&
                      product.description.trim() !== "" &&
                      product.description.trim() !== "N/A" && (
                        <div
                          ref={descriptionRef}
                          className="px-4 mx-auto bg-white border border-gray-300 rounded-md p-5 shadow-sm"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            상세 설명
                          </h3>
                          <div className="-mx-4 border-t border-gray-300 my-4" />

                          <div className="text-base text-gray-700 space-y-4 prose prose-sm">
                            <ReactMarkdown>{product.description}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                    {Array.isArray(product.detail_image_urls) &&
                      product.detail_image_urls.length > 0 && (
                        <div
                          ref={detailImageRef}
                          className="mt-6 px-4 mx-auto bg-white border border-gray-300 rounded-md p-5 shadow-sm"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            자세한 이미지
                          </h3>

                          {/* ✅ 가로선: 좌우 여백 제거 (-mx-5), 박스와 붙게 */}
                          <div className="-mx-4 border-t border-gray-300 my-4" />

                          <div className="grid gap-0 sm:grid-cols-2">
                            {product.detail_image_urls.map(
                              (url: string, idx: number) => {
                                const isLeft = idx % 2 === 0;
                                const roundedClass = isLeft
                                  ? "rounded-tl-md rounded-bl-md"
                                  : "rounded-tr-md rounded-br-md";
                                return (
                                  <img
                                    key={url}
                                    src={toUrl(url)}
                                    alt={`자세한 이미지 ${idx + 1}`}
                                    className={`w-full object-cover block ${roundedClass}`}
                                  />
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    <div ref={reviewRef}>
                      {productReviews.length > 0 && (
                        <div className="mt-6 px-4 mx-auto bg-white border border-gray-300 rounded-md p-5 shadow-sm">
                          <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            리뷰
                          </h2>
                          <button
                            onClick={handleReviewEdit}
                            type="button"
                            className="bg-[#87CEEB] text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors"
                          >
                            리뷰 작성
                          </button>
                          {/* ✅ 제목 아래 가로선, 좌우 여백 제거 */}
                          <div className="-mx-4 border-t border-gray-300 my-4" />

                          <ul className="space-y-6 -mx-4">
                            {productReviews.map((review) => (
                              <li
                                key={review.id}
                                className="border-b last:border-b-0 pb-4 px-5"
                              >
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={toUrl(review.userImage)}
                                    alt={`${review.userName} 프로필`}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {review.userName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {review.date}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, idx) => (
                                      <StarIcon
                                        key={`review-${review.id}-star-${idx}`}
                                        className={`w-4 h-4 ${
                                          idx < review.rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <p className="mt-2 text-gray-700 text-sm">
                                    {review.content}
                                  </p>
                                  {review.images &&
                                    review.images.length > 0 && (
                                      <div className="mt-3 flex flex-wrap gap-2">
                                        {review.images.map((img, idx) => (
                                          <img
                                            key={`review-${review.id}-image-${idx}`}
                                            src={toUrl(img)}
                                            alt={`리뷰 이미지 ${idx + 1}`}
                                            className="w-24 h-24 object-cover rounded"
                                          />
                                        ))}
                                      </div>
                                    )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            </TabGroup>
          </div>

          <div className="hidden lg:block h-full w-px bg-gray-300" />

          <div className="mt-10 sm:mt-16 sm:px-0 lg:mt-0 lg:col-span-1 p-5">
            <div className="mb-4 flex items-center justify-between">
              {/* 뒤로가기 버튼 */}
              <button
                onClick={() => {
                  navigate("/products", {
                    state: {
                      selectedStoreId: brandData?.store_id,
                    },
                  });
                }}
                className="flex items-center text-gray-600 hover:text-indigo-600"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">뒤로가기</span>
              </button>

              {/* 상품 수정 버튼 */}
              {productData && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteWarning(true)}
                    className="inline-block text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-100 text-red-600"
                  >
                    상품 삭제
                  </button>

                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-block text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-700"
                  >
                    상품 수정
                  </button>
                </div>
              )}
            </div>
            {brandData && (
              <button
                type="button"
                className="mb-2 flex items-center space-x-2 cursor-pointer bg-transparent border-none p-0"
                onClick={() =>
                  navigate("/products", {
                    state: {
                      selectedStoreId: brandData.store_id,
                    },
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate("/products", {
                      state: {
                        selectedStoreId: brandData.store_id,
                      },
                    });
                  }
                }}
                title={`${brandData.store_name} 상품 목록으로 이동`}
                tabIndex={0}
              >
                <img
                  src={toUrl(
                    toUrl(brandData.brand_logo_url)?.startsWith("//")
                      ? `https:${toUrl(brandData.brand_logo_url)}`
                      : toUrl(brandData.brand_logo_url)
            )}
                  alt={`${brandData.store_name} 로고`}
                  className="w-6 h-6 object-contain bg-black rounded-full"
                />
                <span className="text-sm font-medium text-gray-700 underline hover:text-indigo-600">
                  {brandData.store_name}
                </span>
              </button>
            )}
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <div className="space-y-1 mt-1">
              {isDiscounted ? (
                <>
                  <p className="text-xs text-gray-500 line-through">
                    {product.price.toLocaleString()}원
                  </p>
                  <p className="text-xl font-semibold text-red-600">
                    {Math.floor(discountPrice).toLocaleString()}원
                  </p>
                </>
              ) : (
                <p className="text-xl tracking-tight text-gray-900">
                  {product.price.toLocaleString()}원
                </p>
              )}
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2">
                {/* 별점 아이콘 */}
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((i) => {
                    const diff = averageRating - i;
                    const isFull = diff >= 1;
                    const isHalf = diff > 0 && diff < 1;

                    let starIcon;
                    if (isFull) {
                      starIcon = (
                        <StarIcon className="w-5 h-5 text-indigo-500" />
                      );
                    } else if (isHalf) {
                      starIcon = (
                        <StarIcon
                          className="w-5 h-5 text-indigo-500"
                          style={{ clipPath: "inset(0 50% 0 0)" }}
                        />
                      );
                    } else {
                      starIcon = <StarIcon className="w-5 h-5 text-gray-300" />;
                    }
                    return <span key={i}>{starIcon}</span>;
                  })}
                </div>

                {/* 후기 개수 클릭 시 스크롤 이동 */}
                <button
                  type="button"
                  className="text-sm text-gray-600 cursor-pointer hover:underline bg-transparent border-none p-0"
                  onClick={handleScrollToReview}
                >
                  후기 {productReviews.length}개
                </button>
              </div>
            </div>

            {productData.color_info?.other_color_products?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">색상</h4>
                <div className="flex items-center gap-2">
                  {/* 왼쪽 화살표 */}
                  {productData.color_info.other_color_products.length >
                    itemsPerSlide && (
                    <button
                      onClick={handlePrev}
                      disabled={colorStartIndex === 0}
                      className="p-1 text-gray-500 disabled:opacity-30 hover:text-indigo-500"
                      title="이전"
                    >
                      <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                  )}

                  {/* 썸네일 슬라이드 */}
                  <div className="flex gap-2 overflow-hidden">
                    {productData.color_info.other_color_products
                      .slice(colorStartIndex, colorStartIndex + itemsPerSlide)
                      .map((item: any, idx: number) => (
                        <a
                          key={item.product_id}
                          href={`/products/${item.product_id}`}
                          className="w-16 h-16 border rounded overflow-hidden transition flex-shrink-0"
                          title={`상품 ID: ${item.product_id}`}
                        >
                          <img
                            src={item.thumbnail_url.startsWith("//")
                                ? toUrl(`https:${item.thumbnail_url}`)
                                : toUrl(item.thumbnail_url)
                            }
                            alt={`다른 색상 ${item.product_id}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                  </div>

                  {/* 오른쪽 화살표 */}
                  {productData.color_info.other_color_products.length >
                    itemsPerSlide && (
                    <button
                      onClick={handleNext}
                      disabled={
                        colorStartIndex + itemsPerSlide >=
                        productData.color_info.other_color_products.length
                      }
                      className="p-1 text-gray-500 disabled:opacity-30 hover:text-indigo-500"
                      title="다음"
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 사이즈 선택 영역 */}
            {sizeOptions.length > 0 && (
              <div className="mt-6">
                <SelectSize
                  options={sizeOptions}
                  onChange={(option) => {
                    if (!option) return;

                    const exists = selectedItems.find(
                      (item) => item.size === option.size
                    );

                    if (exists) {
                      // 중복 사이즈 선택 시 모달 열기
                      setShowDuplicateModal(true);
                    } else {
                      setSelectedItems([
                        ...selectedItems,
                        { ...option, quantity: 1 },
                      ]);
                    }
                  }}
                />
              </div>
            )}

            {selectedItems.map((item) => (
              <div
                key={item.size}
                className="mt-4 border border-gray-200 bg-gray-50 rounded-md p-4 flex justify-between items-center"
              >
                <div>
                  {/* 사이즈 라벨 + 삭제 버튼 */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-base">{item.size}</span>
                    <button
                      onClick={() => handleRemove(item.size)}
                      className="text-gray-400 hover:text-red-400"
                      title="사이즈 선택 제거"
                      aria-label="사이즈 선택 제거"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 수량 조절 버튼 + 최대 수량 한 줄 정렬 */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item.size, -1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 text-black bg-white font-bold disabled:text-gray-500 disabled:bg-gray-100 border-r border-gray-300"
                      >
                        –
                      </button>

                      <span className="px-4 text-center border-gray-300">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(item.size, 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-3 py-1 text-black bg-white font-bold disabled:text-gray-500 disabled:bg-gray-100 border-l border-gray-300"
                      >
                        +
                      </button>
                    </div>

                    <span className="ml-4 text-sm text-gray-400 whitespace-nowrap">
                      최대 {maxQuantity}개
                    </span>
                  </div>
                </div>

                <p className="text-lg font-semibold">
                  {Math.floor(discountPrice * item.quantity).toLocaleString()}원
                </p>
              </div>
            ))}

            <div className="mt-6 p-4 bg-white border border-gray-300 rounded-md space-y-2">
              {/* 총 수량 */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-700">
                  총 수량
                </span>
                <span className="text-base text-gray-800">
                  {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
                  개
                </span>
              </div>

              {/* 가로선 - 양 옆 여백 제거 */}
              <div className="-mx-4 border-t border-gray-200 my-2" />

              {/* 총 합계 */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-700">
                  총 합계
                </span>
                <span className="text-xl font-semibold text-indigo-600">
                  {selectedItems
                    .reduce(
                      (total, item) =>
                        total + Math.floor(discountPrice * item.quantity),
                      0
                    )
                    .toLocaleString()}
                  원
                </span>
              </div>
            </div>

            <form className="mt-6">
              <div className="mt-10 flex items-center gap-4 overflow-hidden">
                <button
                  type="button"
                  onClick={handleCart}
                  className="flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  <ShoppingBagIcon
                    className="w-5 h-5 mr-2"
                    aria-hidden="true"
                  />
                  장바구니
                </button>

                {/* 구매하기 버튼 */}
                <button
                  type="button"
                  onClick={handleOrder}
                  className="flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  <WalletIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  구매하기
                </button>
                <button
                  type="button"
                  onClick={() => toggleLike(productData.id)}
                  className={`ml-4 flex items-center justify-center rounded-md px-3 py-3 transition-transform duration-200 ease-in-out ${
                    liked
                      ? "scale-110 text-red-500"
                      : "text-gray-400 hover:text-red-400 hover:scale-105"
                  }`}
                >
                  {liked ? (
                    <SolidHeartIcon
                      aria-hidden="true"
                      className="size-6 shrink-0"
                    />
                  ) : (
                    <OutlineHeartIcon
                      aria-hidden="true"
                      className="size-6 shrink-0"
                    />
                  )}
                  <span className="ml-1 text-sm text-gray-700">
                    {likesCount}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  );
}
