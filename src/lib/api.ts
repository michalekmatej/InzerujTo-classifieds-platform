import type { Classified, ClassifiedFilter, Category } from "./types";

// Vzorová data pro inzeráty
const mockClassifieds: Classified[] = [
    {
        id: "1",
        title: "iPhone 13 Pro - Výborný stav",
        description:
            "Prodávám svůj iPhone 13 Pro. Používaný 1 rok, ve výborném stavu bez škrábanců. Dodáván s původní krabicí a příslušenstvím. Zdraví baterie na 92 %.",
        price: 16990,
        category: "elektronika",
        location: "Praha, CZ",
        imageUrl: "/placeholder.svg?height=400&width=400",
        userId: "user1",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "2",
        title: "2019 Honda Civic - Nízký nájezd",
        description:
            "Honda Civic EX z roku 2019 s pouze 40 000 km. Jeden majitel, čistý technický průkaz, bez nehod. Pravidelný servis, nové pneumatiky. Prodávám, protože se stěhuji do zahraničí.",
        price: 459000,
        category: "vozidla",
        location: "Brno, CZ",
        imageUrl: "/placeholder.svg?height=400&width=400",
        userId: "user2",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "3",
        title: "Moderní pohovka - Jako nová",
        description:
            "Moderní třímístná pohovka ve světle šedé barvě. Koupena před 6 měsíci za 30 000 Kč. Velmi pohodlná a v perfektním stavu. Prodávám z důvodu stěhování do zařízeného bytu.",
        price: 20000,
        category: "nabytek",
        location: "Ostrava, CZ",
        imageUrl: "/placeholder.svg?height=400&width=400",
        userId: "user1",
        createdAt: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
    },
    {
        id: "4",
        title: "Profesionální DSLR fotoaparát",
        description:
            "Canon EOS 5D Mark IV s objektivem 24-70mm, náhradní baterií, paměťovými kartami a brašnou. Používaný pro profesionální fotografování, dobře udržovaný.",
        price: 54990,
        category: "elektronika",
        location: "Plzeň, CZ",
        imageUrl: "/placeholder.svg?height=400&width=400",
        userId: "user3",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "5",
        title: "Horské kolo - Trek X-Caliber 8",
        description:
            "Horské kolo Trek X-Caliber 8, velikost M. 2 roky staré, ale ve skvělém stavu. Nedávno servisované s novým řetězem a brzdovými destičkami.",
        price: 18900,
        category: "sport",
        location: "Liberec, CZ",
        imageUrl: "/placeholder.svg?height=400&width=400",
        userId: "user2",
        createdAt: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
    },
    {
        id: "6",
        title: "Prostorný byt 2+kk k pronájmu",
        description:
            "Krásný byt 2+kk v centru města. 65 m², dřevěné podlahy, spotřebiče z nerezové oceli, vlastní pračka. K dispozici od příštího měsíce. Bez domácích mazlíčků.",
        price: 16000,
        category: "bydleni",
        location: "Praha, CZ",
        imageUrl: "/placeholder.svg?height=400&width=400",
        userId: "user3",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

// Vzorová data pro kategorie
const mockCategories: Category[] = [
    { id: "1", name: "Elektronika", slug: "elektronika", count: 2 },
    { id: "2", name: "Vozidla", slug: "vozidla", count: 1 },
    { id: "3", name: "Nábytek", slug: "nabytek", count: 1 },
    { id: "4", name: "Bydlení", slug: "bydleni", count: 1 },
    { id: "5", name: "Sport a outdoor", slug: "sport", count: 1 },
];

// Simulace zpoždění API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
export async function getCategories(): Promise<Category[]> {
    await delay(500);
    return mockCategories;
}
