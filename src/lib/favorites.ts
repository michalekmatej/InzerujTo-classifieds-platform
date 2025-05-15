"use client";

import { useState, useEffect } from "react";
import type { Classified } from "./types";
import { getClassifiedById } from "./api";

// Store only IDs in global state and localStorage
let globalFavoriteIds: string[] = [];
// Cache for currently loaded classified objects
let classifiedsCache: Map<
    string,
    { data: Classified | null; timestamp: number }
> = new Map();
// Cache expiration time (15 minutes)
const CACHE_EXPIRATION = 15 * 60 * 1000;
// Listeners for state changes
let listeners: Function[] = [];

const notifyListeners = () => {
    listeners.forEach((listener) => listener(globalFavoriteIds));
};

export function useFavorites() {
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<Classified[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Initialize from localStorage once on mount
    useEffect(() => {
        try {
            // Only load from localStorage on first mount
            if (globalFavoriteIds.length === 0) {
                const storedFavoriteIds = localStorage.getItem("favoriteIds");
                if (storedFavoriteIds) {
                    globalFavoriteIds = JSON.parse(storedFavoriteIds);
                }
            }

            // Set the initial state from global
            setFavoriteIds([...globalFavoriteIds]);

            // Register this component as a listener
            const listenerCallback = (newFavoriteIds: string[]) => {
                setFavoriteIds([...newFavoriteIds]);
            };

            listeners.push(listenerCallback);

            // Clean up listener on unmount
            return () => {
                listeners = listeners.filter((l) => l !== listenerCallback);
            };
        } catch (error) {
            console.error("Error initializing favorites:", error);
            setFavoriteIds([]);
        }
    }, []);

    // Load full classified data whenever the favoriteIds change
    useEffect(() => {
        let isMounted = true;

        const loadFavorites = async () => {
            if (favoriteIds.length === 0) {
                setFavorites([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            try {
                // Use Promise.all to run requests in parallel
                const classifiedsPromises = favoriteIds.map(async (id) => {
                    // Check cache first
                    const cached = classifiedsCache.get(id);
                    const now = Date.now();

                    // If we have a valid cache entry, use it
                    if (cached && now - cached.timestamp < CACHE_EXPIRATION) {
                        return cached.data;
                    }

                    // Otherwise fetch from API
                    const classified = await getClassifiedById(id);

                    // Update cache with new data
                    if (classified) {
                        classifiedsCache.set(id, {
                            data: classified,
                            timestamp: now,
                        });
                    }

                    return classified;
                });

                const results = await Promise.all(classifiedsPromises);

                // Filter out null values (inzeráty, které již neexistují)
                const validClassifieds = results.filter(
                    (c): c is Classified => c !== null
                );

                if (isMounted) {
                    setFavorites(validClassifieds);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error loading favorite classifieds:", error);
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadFavorites();

        return () => {
            isMounted = false;
        };
    }, [favoriteIds]);

    const saveFavoriteIds = (newFavoriteIds: string[]) => {
        try {
            globalFavoriteIds = newFavoriteIds;
            localStorage.setItem("favoriteIds", JSON.stringify(newFavoriteIds));
            notifyListeners();
        } catch (error) {
            console.error("Error saving favorites:", error);
        }
    };

    const addFavorite = (classified: Classified) => {
        // Add to cache immediately for faster UI response
        classifiedsCache.set(classified.id, {
            data: classified,
            timestamp: Date.now(),
        });

        // Update IDs array if not already included
        if (!globalFavoriteIds.includes(classified.id)) {
            const updatedFavoriteIds = [...globalFavoriteIds, classified.id];
            saveFavoriteIds(updatedFavoriteIds);
        }
    };

    const removeFavorite = (id: string) => {
        const updatedFavoriteIds = globalFavoriteIds.filter(
            (favoriteId) => favoriteId !== id
        );
        saveFavoriteIds(updatedFavoriteIds);
    };

    const toggleFavorite = (classified: Classified) => {
        if (isFavorite(classified.id)) {
            removeFavorite(classified.id);
        } else {
            addFavorite(classified);
        }
    };

    const isFavorite = (id: string) => {
        return globalFavoriteIds.includes(id);
    };

    const clearCache = () => {
        classifiedsCache.clear();
    };

    return {
        favorites,
        favoriteIds,
        isLoading,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearCache,
    };
}
