export interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
}

export interface Classified {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    location: string;
    imageUrl: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
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
