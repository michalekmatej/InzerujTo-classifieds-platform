import type { Classified, ClassifiedFilter, Category, CategoryWithCount } from "./types";


// Vzorová data pro kategorie
export const categories: Category[] = [
    { id: "1", name: "Elektronika", slug: "elektronika" },
    { id: "2", name: "Vozidla", slug: "vozidla" },
    { id: "3", name: "Nábytek", slug: "nabytek" },
    { id: "4", name: "Bydlení", slug: "bydleni" },
    { id: "5", name: "Sport", slug: "sport" },
];


// Získat všechny inzeráty s volitelným filtrováním
export async function getClassifieds(
    filter?: ClassifiedFilter
): Promise<Classified[]> {
    // Build query string from filter
    const queryParams = new URLSearchParams();
    if (filter?.category) {
        queryParams.append("category", filter.category);
    }
    if (filter?.query) {
        queryParams.append("q", filter.query);
    }
    if (filter?.limit) {
        queryParams.append("limit", filter.limit.toString());
    }
    if (filter?.skip) {
        queryParams.append("skip", filter.skip.toString());
    }

    const queryString = queryParams.toString();
    const url = `/api/classifieds${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch classifieds");
    }

    const data = await response.json();
    return data.classifieds || [];
}

// Získat jeden inzerát podle ID
export async function getClassifiedById(
    id: string
): Promise<Classified | null> {
    try {
        const response = await fetch(`/api/classifieds/${id}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch classified");
        }

        const data = await response.json();
        return data.classified || null;
    } catch (error) {
        console.error(`Error fetching classified with ID ${id}:`, error);
        return null;
    }
}

// Real API implementations
export async function createClassified(
    classifiedData: Partial<Classified>
): Promise<Classified> {
    const response = await fetch("/api/classifieds", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(classifiedData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create classified");
    }

    const data = await response.json();
    return data.classified;
}

// Aktualizovat existující inzerát
export async function updateClassified(
    id: string,
    classifiedData: Partial<Classified>
): Promise<Classified> {
    const response = await fetch(`/api/classifieds/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(classifiedData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update classified");
    }

    const data = await response.json();
    return data.classified;
}

// Smazat inzerát
export async function deleteClassified(id: string): Promise<void> {
    const response = await fetch(`/api/classifieds/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete classified");
    }
}

// Získat všechny kategorie
export async function getCategories(): Promise<CategoryWithCount[] | null> {
    try {
        const response = await fetch("/api/categories");

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch categories");
        }

        const data = await response.json();
        return data.categories || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return null;
    }
}
