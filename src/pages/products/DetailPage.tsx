'use client'

import { Tab } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import {
  HeartIcon as OutlineHeartIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'
import { Fragment, useEffect, useState } from 'react'
import products from './data/products.json'
import discounts from './data/discounts.json'
import { useParams } from 'react-router-dom'
import brands from './data/brands.json'
import colors from './data/musinsa_colors.json'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const thumbnailsPerPage = 6
  const [startIndex, setStartIndex] = useState(0)

  const productData = products.find((p) => String(p.id) === id)
  const discountData = discounts.find((d) => String(d.product_id) === id)
  const brandData = brands.find((b) => String(b.store_id) === String(productData?.store_id))

  console.log('Product Data:', productData)
  console.log('Discount Data:', discountData)

  const originalPrice = Number(
    typeof productData?.price === 'string'
      ? productData.price.replace(/[^\d]/g, '')
      : productData?.price ?? 0
  )

  const isDiscountValid =
    discountData &&
    (discountData.discount_type === '정률' || discountData.discount_type === '정액') &&
    typeof discountData.discount_value === 'number' &&
    !!discountData.discount_start &&
    !!discountData.discount_end;

  const discountPrice = isDiscountValid
    ? discountData!.discount_type === '정률'
      ? originalPrice * (1 - discountData!.discount_value! / 100)
      : originalPrice - discountData!.discount_value!
    : originalPrice;

  const localStorageKey = `liked_product_${productData?.id ?? 'unknown'}`
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(productData?.product_likes ?? 0)

  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey)
    if (stored === 'true') {
      setLiked(true)
    }
  }, [localStorageKey])

  if (!productData) {
    return <div className="p-10 text-red-600">해당 상품을 찾을 수 없습니다.</div>
  }

  const product = {
    id: productData.id,
    name: productData.name,
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

  const handleLikeToggle = () => {
    const newLiked = !liked
    setLiked(newLiked)
    localStorage.setItem(localStorageKey, String(newLiked))
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1))
  }

  const handleUp = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1)
  }

  const handleDown = () => {
    if (startIndex + thumbnailsPerPage < product.images.length) {
      setStartIndex(startIndex + 1)
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto sm:px-6 lg:px-8">
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
                          className="w-[500px] h-[720px] object-cover rounded-lg"
                        />
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </div>

                <div className="mt-6 px-4 bg-gray-50 border border-gray-200 rounded-md pb-6">
                  <div className="mt-6 px-4 mx-auto bg-white border border-gray-300 rounded-md p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">상세 설명</h3>
                    <div
                      className="text-base text-gray-700 space-y-4"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </div>

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

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 lg:col-span-1 p-5">
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
              {isDiscountValid ? (
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
                <h4 className="text-sm font-medium text-gray-700 mb-2">다른 색상 상품</h4>
                <div className="flex flex-wrap gap-2">
                  {productData.color_info.other_color_products.map((item: any, idx: number) => (
                    <a
                      key={idx}
                      href={`/products/${item.product_id}`}
                      className="block w-16 h-16 border rounded overflow-hidden hover:ring-2 hover:ring-indigo-500 transition"
                      title={`상품 ID: ${item.product_id}`}
                    >
                      <img
                        src={item.thumbnail_url.startsWith('//') ? `https:${item.thumbnail_url}` : item.thumbnail_url}
                        alt={`다른 색상 ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <form className="mt-6">
              <div className="mt-10 flex items-center">
                <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  장바구니에 담기
                </button>

                <button
                  type="button"
                  onClick={handleLikeToggle}
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
    </div>
  )
}
