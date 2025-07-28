import { Link } from 'react-router-dom'
import { HeartIcon } from '@heroicons/react/24/outline'
import { getDiscountPrice } from 'utils/price'
import { Discount } from 'types/types';
import { toUrl } from 'utils/images';

type ProductCardProps = {
    product: {
        id: string | number;
        name: string;
        price: number;
        main_image_urls: string[];
        gender: string;
        product_likes: number;
    };
    brandName: string;
    discount: Discount;
};

export default function ProductCard({ product, brandName, discount }: ProductCardProps) {
    const discountPrice = getDiscountPrice(product.price, discount)
    const isDiscounted = discountPrice < product.price

    return (
        <Link to={`/products/${product.id}`}>
            <div className="border p-4 rounded-lg hover:shadow flex flex-col justify-between">
                <img
                    src={toUrl(product.main_image_urls[0])}
                    alt={product.name}
                    className="aspect-[3/4] object-cover rounded"
                />
                <h3 className="mt-2 text-gray-900 line-clamp-2">{product.name}</h3>
                {isDiscounted ? (
                    <>
                        <p className="text-xs text-gray-400 line-through">{product.price.toLocaleString()}원</p>
                        <p className="text-red-600 font-semibold">{discountPrice.toLocaleString()}원</p>
                    </>
                ) : (
                    <p className="text-gray-900 font-semibold">{product.price.toLocaleString()}원</p>
                )}
                <div className="flex justify-between mt-1 text-sm text-gray-500">
                    <span>{brandName}</span>
                    <span>{product.gender}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <HeartIcon className="w-4 h-4" />
                    {product.product_likes.toLocaleString()}
                </div>
            </div>
        </Link>
    )
}
