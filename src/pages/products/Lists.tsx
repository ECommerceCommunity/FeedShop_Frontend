'use client'

import { useEffect, useState } from 'react'
import { ChevronDownIcon, PlusIcon, HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import productsData from './data/products.json'
import brands from './data/brands.json'
import filters from './data/filters.json'
import discounts from './data/discounts.json'

type Product = typeof productsData[number]
type Filter = typeof filters[number]
type Brand = typeof brands[number]

export default function ProductPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({})
  const [selectedFilters, setSelectedFilters] = useState<Record<string, Set<string>>>({})
  const [selectedBrandId, setSelectedBrandId] = useState<number>(1001)
  const [likedBrands, setLikedBrands] = useState<Set<number>>(new Set())

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

  const getDiscountPrice = (product: Product): number => {
    const discount = discounts.find(d => d.product_id === product.id)

    const originalPrice = Number(
      typeof product.price === 'string'
        ? product.price.replace(/[^\d]/g, '')
        : product.price
    )

    const isDiscountValid =
      discount &&
      (discount.discount_type === '정률' || discount.discount_type === '정액') &&
      typeof discount.discount_value === 'number' &&
      !!discount.discount_start &&
      !!discount.discount_end

    if (!isDiscountValid) return originalPrice

    return discount.discount_type === '정률'
      ? Math.floor(originalPrice * (1 - discount.discount_value / 100))
      : originalPrice - discount.discount_value
  }

  const toggleLike = (storeId: number) => {
    setLikedBrands(prev => {
      const updated = new Set(prev)
      if (updated.has(storeId)) updated.delete(storeId)
      else updated.add(storeId)
      return updated
    })
  }

  const getBrandLikes = (brand: Brand) => {
    return brand.brand_likes + (likedBrands.has(brand.store_id) ? 1 : 0)
  }

  const getStoreName = (storeId: number): string =>
    brands.find((b) => b.store_id === storeId)?.store_name || 'Unknown'

  const filteredProducts: Product[] = productsData.filter(product => {
    if (selectedBrandId !== null && product.store_id !== selectedBrandId) return false
    return Object.entries(selectedFilters).every(([filterId, values]) => {
      if (values.size === 0) return true
      return values.has(String(product[filterId as keyof Product]))
    })
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const filtersWithoutBrand = filters.filter(f => f.id !== 'brand')

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
                        const value = typeof option === 'string' ? option : String(option.id)
                        const label = typeof option === 'string' ? option : option.name
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
                          onClick={() => toggleLike(brand.store_id)}
                          className={`flex items-center justify-center rounded-md px-2 py-1 transition-transform duration-200 ease-in-out ${likedBrands.has(brand.store_id)
                            ? 'scale-110 text-red-500'
                            : 'text-gray-400 hover:text-red-400 hover:scale-105'
                            }`}
                        >
                          {likedBrands.has(brand.store_id) ? (
                            <SolidHeartIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
                          ) : (
                            <OutlineHeartIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
                          )}
                          <span className="ml-1 text-sm text-gray-700">
                            {getBrandLikes(brand).toLocaleString()}
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
                      const value = typeof option === 'string' ? option : String(option.id)
                      const label = typeof option === 'string' ? option : option.name
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
                            {label}
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
                          const discount = discounts.find(d => d.product_id === product.id)
                          const discountPrice = getDiscountPrice(product)
                          const originalPrice = Number(
                            typeof product.price === 'string'
                              ? product.price.replace(/[^\d]/g, '')
                              : product.price
                          )

                          const isDiscounted = discount && discountPrice < originalPrice

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
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-black text-white' : 'bg-white text-gray-700'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}