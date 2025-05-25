import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(
    price: number,
    withCurrency: boolean = true
): string {
    const formattedPrice = price.toLocaleString("cs-CZ", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return withCurrency ? `${formattedPrice} Kč` : formattedPrice;
}
