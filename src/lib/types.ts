export interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    createdAt?: string;
    updatedAt?: string;
}

export interface Classified {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    location: string;
    images: Image[];
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Image {
    id: string;
    filename: string;
    contentType: string;
    size: number;
    url: string; // URL to access the image
    isCover?: boolean; // Flag to mark the cover image
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface CategoryWithCount extends Category {
    count: number;
}

export interface ClassifiedFilter {
    category?: string | null;
    query?: string | null;
    userId?: string | null;
    limit?: number;
    skip?: number;
}

// export interface Advert {
//     id: string;
//     title: string;
//     description: string;
//     price: number;
//     category: string;
//     location: string;
//     images: string[];
//     userId: string;
//     createdAt: string;
//     updatedAt: string;
//     // isActive: boolean;
// }
