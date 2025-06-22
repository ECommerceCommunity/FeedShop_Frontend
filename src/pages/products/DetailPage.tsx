'use client'

import { Tab } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import {
  HeartIcon as OutlineHeartIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ShoppingBagIcon,
  WalletIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'
import { Fragment, useState, MouseEvent } from 'react'
import products from './data/products.json'
import discounts from './data/discounts.json'
import { useParams, useNavigate } from 'react-router-dom'
import brands from './data/brands.json'
import SelectSize from 'pages/products/SelectSize'
import Fail from '../../components/modal/Fail'
import BackToTop from 'components/rollback/BackToTop'
import { isDiscountValid } from 'utils/discount';
import { getDiscountPrice } from 'utils/price'
import { useLocalLike } from 'hooks/useLocalLike'

type SelectedItem = {
  size: string
  stock: number
  quantity: number
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>()
  const thumbnailsPerPage = 6
  const [startIndex, setStartIndex] = useState(0)
  const [showFailModal, setShowFailModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const productData = products.find((p) => String(p.id) === id)
  const discountData = discounts.find((d) => d.product_id === Number(id));
  const brandData = brands.find((b) => String(b.store_id) === String(productData?.store_id))

  console.log('Product Data:', productData)
  console.log('Discount Data:', discountData)

  const originalPrice = Number(typeof productData?.price === 'number'
    ? productData.price
    : 0
  )
  const discountDataRaw = discounts.find((d) => d.product_id === Number(id));
  const discountDataTyped = discountDataRaw
    ? {
      ...discountDataRaw,
      discount_type: discountDataRaw.discount_type as '정률' | '정액', // or as DiscountType if imported
    }
    : undefined;
  const safeDiscount = isDiscountValid(discountDataTyped)
    ? discountDataTyped
    : undefined;
  const discountPrice = getDiscountPrice(originalPrice, safeDiscount);

  const isDiscounted = discountPrice < originalPrice;

  const itemsPerSlide = 6
  const [colorStartIndex, setColorStartIndex] = useState(0)

  const sizeOptions = productData?.size_stock_list?.map((item: any) => ({
    size: item.size,
    stock: item.stock_quantity
  })) ?? []

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

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

  const localStorageKey = productData ? `liked_product_${productData.id}` : '';
  const { likes, toggleLike, hasLiked } = useLocalLike(
    localStorageKey
  );
  const liked = productData ? hasLiked(productData.id) : false;
  const likesCount = likes.size;

  if (!productData) {
    return <div className="p-10 text-red-600">해당 상품을 찾을 수 없습니다.</div>
  }

  const product = {
    id: productData.id, // number
    name: productData.name, // string
    price: originalPrice,
    rating: 4,
    likes: productData.product_likes ?? 0,
    images: Array.isArray(productData.main_image_urls)
      ? productData.main_image_urls.map((url: string, idx: number) => ({
        id: idx,
        name: `${productData.name} 이미지 ${idx + 1}`,
        src: url,
        alt: productData.name,
      }))
      : [],
    description: productData.description || '',
    detail_image_urls: productData.detail_image_urls || [],
  }

  const handlePrev = () => {
    if (colorStartIndex > 0) setColorStartIndex(colorStartIndex - itemsPerSlide)
  }

  const handleNext = () => {
    if (
      productData?.color_info?.other_color_products &&
      colorStartIndex + itemsPerSlide < productData.color_info.other_color_products.length
    ) {
      setColorStartIndex(colorStartIndex + itemsPerSlide)
    }
  }

  const handleUp = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1)
  }

  const handleDown = () => {
    if (startIndex + thumbnailsPerPage < product.images.length) {
      setStartIndex(startIndex + 1)
    }
  }

  const handleCart = () => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');

    const newItems = selectedItems.map(item => ({
      id: `${product.id}-${item.size}`,
      name: product.name,
      option: item.size,
      price: Math.floor(discountPrice),
      originalPrice: product.price,
      discount: isDiscounted
        ? Math.round(((product.price - discountPrice) / product.price) * 100)
        : 0,
      quantity: item.quantity,
      image: product.images[0]?.src || '',
    }));

    const updatedCart = [...currentCart, ...newItems];
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    navigate('/cart'); // 페이지 이동
  }

  const handleOrder = () => {
    const newItems = selectedItems.map(item => ({
      id: `${product.id}-${item.size}`,
      name: product.name,
      option: item.size,
      price: Math.floor(discountPrice),
      originalPrice: product.price,
      discount: isDiscounted
        ? Math.round(((product.price - discountPrice) / product.price) * 100)
        : 0,
      quantity: item.quantity,
      image: product.images[0]?.src || '',
    }));

    // 페이지 이동 시 state로 상품 정보 전달
    navigate('/orders', {
      state: {
        products: newItems,
      },
    });
  }

  function handleBuyNow(event: MouseEvent<HTMLButtonElement>): void {
    throw new Error('Function not implemented.')
  }

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
      <div className="bg-white mx-auto">
        <div className="lg:grid lg:grid-cols-[1.7fr_1px_1fr] lg:items-start gap-4">
          <div className="col-span-1 p-5">
            <Tab.Group as={Fragment}>
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

                    <Tab.List className="flex flex-col space-y-4">
                      {product.images.map((image, idx) => {
                        const isVisible = idx >= startIndex && idx < startIndex + thumbnailsPerPage
                        return (
                          <Tab
                            key={image.id}
                            className={classNames(
                              'group relative h-24 w-24 cursor-pointer rounded-md bg-white text-sm font-medium text-gray-900 ring-2 ring-transparent data-[selected]:ring-indigo-500 ring-offset-2 box-border hover:bg-gray-50 transition',
                              isVisible ? '' : 'hidden'
                            )}
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="h-full w-full object-cover rounded-md"
                            />
                          </Tab>
                        )
                      })}
                    </Tab.List>

                    <button
                      onClick={handleDown}
                      disabled={startIndex + thumbnailsPerPage >= product.images.length}
                      className="mt-2 text-gray-900 hover:text-indigo-500 disabled:opacity-50"
                      title="아래로 이동"
                    >
                      <ChevronDownIcon className="size-6" />
                    </button>
                  </div>

                  <Tab.Panels className="flex-1 flex justify-center items-center">
                    {product.images.map((image) => (
                      <Tab.Panel key={image.id}>
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-[720px] h-[720px] object-cover rounded-lg"
                        />
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </div>

                <div className="mt-6 px-4 bg-gray-50 border border-gray-200 rounded-md pb-6">
                  {(product.description && product.description.trim() !== '' && product.description.trim() !== 'N/A') && (
                    <div className="mt-6 px-4 mx-auto bg-white border border-gray-300 rounded-md p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">상세 설명</h3>
                      <div
                        className="text-base text-gray-700 space-y-4"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    </div>
                  )}

                  <div className="mt-6 px-4 mx-auto bg-white border border-gray-300 rounded-md p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">자세한 이미지</h3>
                    <div className="grid gap-0 sm:grid-cols-2">
                      {(Array.isArray(product.detail_image_urls) ? product.detail_image_urls : []).map((url: string, idx: number) => {
                        const isLeft = idx % 2 === 0
                        const roundedClass = isLeft
                          ? 'rounded-tl-md rounded-bl-md'
                          : 'rounded-tr-md rounded-br-md'
                        return (
                          <img
                            key={idx}
                            src={url}
                            alt={`자세한 이미지 ${idx + 1}`}
                            className={`w-full object-cover block ${roundedClass}`}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </>
            </Tab.Group>
          </div>

          <div className="hidden lg:block h-full w-px bg-gray-300" />

          <div className="mt-10 sm:mt-16 sm:px-0 lg:mt-0 lg:col-span-1 p-5">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center text-gray-600 hover:text-indigo-600"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">뒤로가기</span>
            </button>
            {brandData && (
              <div className="mb-2 flex items-center space-x-2">
                <img
                  src={brandData.brand_logo_url?.startsWith('//') ? `https:${brandData.brand_logo_url}` : brandData.brand_logo_url}
                  alt={`${brandData.store_name} 로고`}
                  className="w-6 h-6 object-contain bg-black rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{brandData.store_name}</span>
              </div>
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
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    aria-hidden="true"
                    className={classNames(
                      product.rating > rating
                        ? 'text-indigo-500'
                        : 'text-gray-300',
                      'size-5 shrink-0'
                    )}
                  />
                ))}
              </div>
              <p className="sr-only">{product.rating} out of 5 stars</p>
            </div>

            {productData.color_info?.other_color_products?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">색상</h4>
                <div className="flex items-center gap-2">
                  {/* 왼쪽 화살표 */}
                  {productData.color_info.other_color_products.length > itemsPerSlide && (
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
                          key={idx}
                          href={`/products/${item.product_id}`}
                          className="w-16 h-16 border rounded overflow-hidden transition flex-shrink-0"
                          title={`상품 ID: ${item.product_id}`}
                        >
                          <img
                            src={
                              item.thumbnail_url.startsWith('//')
                                ? `https:${item.thumbnail_url}`
                                : item.thumbnail_url
                            }
                            alt={`다른 색상 ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      ))}
                  </div>

                  {/* 오른쪽 화살표 */}
                  {productData.color_info.other_color_products.length > itemsPerSlide && (
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

                    const exists = selectedItems.find((item) => item.size === option.size);

                    if (exists) {
                      // 중복 사이즈 선택 시 모달 열기
                      setShowDuplicateModal(true);
                    } else {
                      setSelectedItems([...selectedItems, { ...option, quantity: 1 }]);
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
                      최대 {item.stock}개
                    </span>
                  </div>
                </div>

                <p className="text-lg font-semibold">
                  {(Math.floor(discountPrice * item.quantity)).toLocaleString()}원
                </p>
              </div>
            ))}

            <div className="mt-6 p-4 bg-white border border-gray-300 rounded-md space-y-2">
              {/* 총 수량 */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-700">총 수량</span>
                <span className="text-base text-gray-800">
                  {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}개
                </span>
              </div>

              {/* 가로선 - 양 옆 여백 제거 */}
              <div className="-mx-4 border-t border-gray-200 my-2" />

              {/* 총 합계 */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-700">총 합계</span>
                <span className="text-xl font-semibold text-indigo-600">
                  {selectedItems
                    .reduce((total, item) => total + Math.floor(discountPrice * item.quantity), 0)
                    .toLocaleString()}
                  원
                </span>
              </div>
            </div>

            <form className="mt-6">
              <div className="mt-10 flex items-center gap-4">
                {/* 장바구니 담기 */}
                <button
                  type="button"
                  onClick={handleOrder}
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  주문하기
                </button>

                <button
                  type="button"
                  onClick={handleCart}
                  className="flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  장바구니
                </button>

                {/* 구매하기 버튼 */}
                <button
                  type="button"
                  onClick={handleBuyNow} // 여기에 실제 구매 로직 연결
                  className="flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <WalletIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  구매하기
                </button>
                <button
                  type="button"
                  onClick={() => toggleLike(productData.id)}
                  className={`ml-4 flex items-center justify-center rounded-md px-3 py-3 transition-transform duration-200 ease-in-out ${liked
                    ? 'scale-110 text-red-500'
                    : 'text-gray-400 hover:text-red-400 hover:scale-105'
                    }`}
                >
                  {liked ? (
                    <SolidHeartIcon aria-hidden="true" className="size-6 shrink-0" />
                  ) : (
                    <OutlineHeartIcon aria-hidden="true" className="size-6 shrink-0" />
                  )}
                  <span className="ml-1 text-sm text-gray-700">{likesCount}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  )
}
