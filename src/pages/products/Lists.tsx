'use client'

import { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon, PlusIcon, HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import productsData from './data/products.json'
import brands from './data/brands.json'
import filtersRaw from './data/filters.json'
import discounts from './data/discounts.json'
import colors from './data/musinsa_colors.json'
import BackToTop from 'components/rollback/BackToTop'
import { isDiscountValid } from 'utils/discount';
import { getDiscountPrice } from 'utils/price';
import { useLocalLike } from 'hooks/useLocalLike'

type Product = typeof productsData[number]
type Brand = typeof brands[number]
type Filter = {
  id: string
  name: string
  options: any[]
}

export default function ProductPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({})
  const [selectedFilters, setSelectedFilters] = useState<Record<string, Set<string>>>({})
  const [selectedBrandId, setSelectedBrandId] = useState<number>(1001)
  const { toggleLike, hasLiked } = useLocalLike('likedBrands')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const toggleFilter = (id: string) => {
    setOpenFilters(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters(prev => {
      const current = new Set(prev[filterId] || [])
      if (current.has(value)) current.delete(value)
      else current.add(value)
      return { ...prev, [filterId]: current }
    })
  }


  const toggleBrandLike = (storeId: number) => {
    toggleLike(storeId)
  }

  const getStoreName = (storeId: number): string =>
    brands.find((b) => b.store_id === storeId)?.store_name || 'Unknown'

  // 영어 컬러명을 한글로 매핑하는 객체 생성
  const colorNameMap: Record<string, string> = colors.reduce((acc, cur) => {
    const key = cur.color_name.toUpperCase() // 예: "아이보리"
    if (cur.color_image_url && cur.color_name_en) {
      acc[cur.color_name_en.toUpperCase()] = key
    }
    return acc
  }, {} as Record<string, string>)

  // 중복 제거된 productsData 생성 (id 기준)
  const uniqueProducts = Object.values(
    productsData.reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {} as Record<number, Product>)
  )

  const filteredProducts: Product[] = uniqueProducts.filter(product => {
    if (selectedBrandId !== null && product.store_id !== selectedBrandId) return false

    return Object.entries(selectedFilters).every(([filterId, values]) => {
      if (values.size === 0) return true

      if (filterId === 'color') {
        return product.color_info?.current_colors?.some((color: any) => {
          const normalize = (val: string) => {
            const isEnglish = /^[A-Za-z\s]+$/.test(val)
            return isEnglish ? val.toUpperCase() : val
          }

          if (typeof color === 'string') {
            // 영어 컬러명을 한글 컬러명으로 변환
            const mapped = colorNameMap[color.toUpperCase()]
            return mapped && values.has(mapped)
          } else if (color && typeof color === 'object' && 'color_name' in color) {
            return values.has(normalize(color.color_name))
          }
          return false
        })
      }

      // 기본 필터 비교
      return values.has(String(product[filterId as keyof Product]))
    })
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const filterBaseProducts = productsData.filter(product =>
    selectedBrandId === null || product.store_id === selectedBrandId
  )

  const availableColorOptions = colors.filter(color => {
    const targetName = color.color_name.toUpperCase()

    return filterBaseProducts.some(product =>
      product.color_info?.current_colors?.some((colorItem: any) => {
        if (typeof colorItem === 'string') {
          const mapped = colorNameMap[colorItem.toUpperCase()]
          return mapped === targetName
        } else if (colorItem && typeof colorItem === 'object' && 'color_name' in colorItem) {
          return colorItem.color_name.toUpperCase() === targetName
        }
        return false
      })
    )
  })

  const colorFilter = {
    id: 'color',
    name: '색상',
    options: availableColorOptions.map(color => ({
      name: color.color_name,
      color_image_url: color.color_image_url
    }))
  }

  const filters = [...filtersRaw, colorFilter]
  const filtersWithoutBrand = filters.filter(f => f.id !== 'brand' && f.options.length > 0)

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedFilters, selectedBrandId])

  return (
    <div className="bg-white">
      <main className="mx-auto pb-4 pl-4 pr-4">
        <div className="flex flex-col gap-4 my-6">
          {/* 브랜드 선택 버튼 */}
          <div className="flex flex-wrap gap-2">
            {brands.map((brand: Brand) => (
              <button
                key={brand.store_id}
                onClick={() => setSelectedBrandId(brand.store_id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${selectedBrandId === brand.store_id ? 'bg-black text-white' : 'text-gray-700 border-gray-300'
                  }`}
              >
                <img src={brand.brand_logo_url} alt={brand.store_name} className="w-5 h-5 bg-black p-1 rounded" />
                {brand.store_name}
              </button>
            ))}
          </div>

          {/* 모바일 필터 토글 버튼 (브랜드 아래 위치) */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="mt-4 text-sm font-medium text-gray-700"
            >
              필터 <PlusIcon className="inline-block h-4 w-4 ml-1" />
            </button>
          </div>

          {/* 모바일 필터 목록 */}
          {mobileFiltersOpen && (
            <div className="lg:hidden mt-4 border-t pt-4">
              {filtersWithoutBrand.map((filter: Filter) => (
                <div key={filter.id} className="mb-4">
                  <button
                    onClick={() => toggleFilter(filter.id)}
                    className="flex justify-between w-full text-left text-gray-900 font-medium"
                  >
                    {filter.name}
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform ${openFilters[filter.id] ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFilters[filter.id] && (
                    <ul className="mt-2 space-y-1">
                      {filter.options.map((option: any) => {
                        const value = typeof option === 'string' ? option : String(option.id || option.name)
                        const label = typeof option === 'string' ? option : option.name
                        const imageUrl = option.color_image_url // 색상 이미지가 있을 경우

                        const isChecked = selectedFilters[filter.id]?.has(value) || false

                        return (
                          <li key={value}>
                            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={isChecked}
                                onChange={() => handleFilterChange(filter.id, value)}
                              />
                              {/* 색상 이미지가 있다면 렌더링 */}
                              <img
                                src={imageUrl}
                                alt={label}
                                className="w-4 h-4 rounded border border-gray-300"
                              />
                              {label}
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 브랜드 정보 박스 */}
          {selectedBrandId !== null && (
            <div className="p-4 border rounded-md bg-gray-50">
              {brands.filter(b => b.store_id === selectedBrandId).map(brand => (
                <div key={brand.store_id}>
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={brand.brand_logo_url}
                      alt={brand.store_name}
                      className="w-10 h-10 bg-black p-1 rounded"
                    />
                    <div>
                      <h3 className="text-lg font-bold">{brand.store_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <button
                          type="button"
                          onClick={() => toggleBrandLike(brand.store_id)}
                          className={`flex items-center justify-center rounded-md px-2 py-1 transition-transform duration-200 ease-in-out 
    ${hasLiked(brand.store_id)
                              ? 'scale-110 text-red-500'
                              : 'text-gray-400 hover:text-red-400 hover:scale-105'}`}
                        >
                          {hasLiked(brand.store_id) ? (
                            <SolidHeartIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
                          ) : (
                            <OutlineHeartIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
                          )}
                          <span className="ml-1 text-sm text-gray-700">
                            {(brand.brand_likes + (hasLiked(brand.store_id) ? 1 : 0)).toLocaleString()}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{brand.brand_info}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 데스크탑 뷰: 필터 + 상품 */}
        <div className="lg:grid lg:grid-cols-4 gap-8">
          {/* 데스크탑 전용 필터 사이드바 */}
          <aside className={`hidden lg:block pr-4 border-r border-gray-300`}>
            {filtersWithoutBrand.map((filter: Filter) => (
              <div key={filter.id} className="mb-4">
                <button
                  onClick={() => toggleFilter(filter.id)}
                  className="flex justify-between w-full text-left text-gray-900 font-medium"
                >
                  {filter.name}
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform ${openFilters[filter.id] ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFilters[filter.id] && (
                  <ul className="mt-2 space-y-1">
                    {filter.options.map((option: any) => {
                      const value = typeof option === 'string' ? option : String(option.id || option.name)
                      const label = typeof option === 'string' ? option : option.name
                      const imageUrl = option.color_image_url // 색상 이미지가 있을 경우

                      const isChecked = selectedFilters[filter.id]?.has(value) || false

                      return (
                        <li key={value}>
                          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={isChecked}
                              onChange={() => handleFilterChange(filter.id, value)}
                            />
                            {/* 이미지가 있으면 이미지와 함께 텍스트 표시, 없으면 텍스트만 */}
                            {imageUrl ? (
                              <>
                                <img
                                  src={imageUrl}
                                  alt={label}
                                  className="w-4 h-4 rounded border border-gray-300"
                                />
                                <span>{label}</span>
                              </>
                            ) : (
                              <span>{label}</span>
                            )}
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ))}
          </aside>

          {/* 상품 목록 */}
          <section className="lg:col-span-3 pl-4">
            <div className="mb-4 text-sm text-gray-600">
              총 <span className="font-semibold">{filteredProducts.length}</span>개의 상품이 있습니다.
            </div>

            {currentProducts.length === 0 ? (
              <p className="text-gray-500">조건에 맞는 상품이 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map(product => (
                  <Link to={`/products/${product.id}`} key={product.id}>
                    <div className="border p-4 rounded-lg hover:shadow cursor-pointer h-full flex flex-col justify-between">
                      <div>
                        <div className="aspect-[3/4] overflow-hidden rounded-md">
                          <img
                            src={product.main_image_urls[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="mt-4 font-medium text-gray-900 line-clamp-2">{product.name}</h3>

                        {/* 가격 표시 */}
                        {(() => {
                          const discountRaw = discounts.find(d => d.product_id === product.id)
                          // Convert discount_type to the correct type if needed
                          const discount = discountRaw
                            ? {
                              ...discountRaw,
                              discount_type: discountRaw.discount_type as '정률' | '정액'
                            }
                            : undefined
                          const discountPrice = getDiscountPrice(product.price, discount)
                          const originalPrice = Number(product.price || 0)
                          const isValid = discount ? isDiscountValid(discount) : false

                          const isDiscounted = isValid && discountPrice < originalPrice

                          if (isDiscounted) {
                            let discountLabel = ''
                            if (discount?.discount_type === '정률') {
                              const discountRate = Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
                              discountLabel = `${discountRate}% 할인`
                            } else if (discount?.discount_type === '정액') {
                              const discountAmount = originalPrice - discountPrice
                              discountLabel = `${discountAmount.toLocaleString()}원 할인`
                            }

                            return (
                              <>
                                <p className="text-gray-500 line-through">{originalPrice.toLocaleString()}원</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-red-600 font-semibold">{discountPrice.toLocaleString()}원</p>
                                  <span className="text-xs text-red-500 font-bold bg-red-100 px-2 py-0.5 rounded-full">
                                    {discountLabel}
                                  </span>
                                </div>
                              </>
                            )
                          } else {
                            return (
                              <p className="text-gray-900 font-semibold">{originalPrice.toLocaleString()}원</p>
                            )
                          }
                        })()}
                      </div>

                      {/* 좋아요 + 매장 이름 + 성별 정보 */}
                      <div className="mt-2 space-y-1">
                        {/* 좋아요 */}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <OutlineHeartIcon className="w-4 h-4" />
                          <span>{product.product_likes.toLocaleString()}</span>
                        </div>

                        {/* 매장 + 성별 */}
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>{getStoreName(product.store_id)}</span>
                          <span>{product.gender}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
                {/* 모바일 이전/다음 */}
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                {/* 데스크탑 페이지네이션 */}
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                  <div>
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      {/* 이전 버튼 */}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>

                      {/* 페이지 번호들 */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0
            ${currentPage === page
                              ? 'z-10 bg-indigo-600 text-white'
                              : 'text-gray-900 hover:bg-gray-50'}`}
                        >
                          {page}
                        </button>
                      ))}

                      {/* 다음 버튼 */}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <BackToTop />
    </div>
  )
}