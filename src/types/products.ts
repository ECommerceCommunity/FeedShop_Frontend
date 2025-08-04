export interface ProductListResponse {
    content: ProductListItem[];
    totalElement: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface ProductListItem {
    productId: number;
    name: string;
    price: number;
    discountPrice: number;
    storeId: number;
    storeName: string;
    wishNumber: number;
    mainImageUrl: string;
}

export interface ProductDetail {
    productId: number;
    name: string;
    price: number;
    discountType: "RATE_DISCOUNT" | "FIXED_DISCOUNT" | "NONE";
    discountValue: number;
    discountPrice: number;
    wishNumber: number;
    description: string;
    storeId: number;
    storeName: string;
    categoryType: string;
    categoryName: string;
    images: Array<{
        imageId: number;
        url: string;
        type: "MAIN" | "DETAIL"
    }>;
    options: Array<{
        optionId: number;
        gender: "MEN" | "WOMEN" | "UNISEX";
        size: string;
        color: string;
        stock: number;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    categoryId: number;
    type: string;
    name: string;
}

export interface CreateProductRequest {
    name: string;
    price: number;
    categoryId: number;
    description: string;
    discountType?: "RATE_DISCOUNT" | "FIXED_DISCOUNT" | "NONE";
    discountValue?: number;
    images: Array<{
        url: string;
        type: "MAIN" | "DETAIL";
    }>;
    options: Array<{
        gender: "MEN" | "WOMEN" | "UNISEX";
        size: string;
        color: string;
        stock: number;
    }>;
}

export interface UpdateProductRequest {
    name?: string;
    price?: number;
    categoryId?: number;
    description?: string;
    discountType?: "RATE_DISCOUNT" | "FIXED_DISCOUNT" | "NONE";
    discountValue?: number;
}