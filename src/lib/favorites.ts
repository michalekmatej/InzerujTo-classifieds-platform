"use client";

import { useState, useEffect } from "react";
import type { Classified } from "./types";

// Create a global store for favorites to ensure consistency across components
let globalFavorites: Classified[] = [];
let listeners: Function[] = [];

const notifyListeners = () => {
    listeners.forEach((listener) => listener(globalFavorites));
};

export function useFavorites() {
    const [favorites, setFavorites] = useState<Classified[]>([]);

    // Effect to initialize from localStorage once on mount
    useEffect(() => {
        try {
            // Only load from localStorage on first mount
            if (globalFavorites.length === 0) {
                const storedFavorites = localStorage.getItem("favorites");
                if (storedFavorites) {
                    globalFavorites = JSON.parse(storedFavorites);
                }
            }

            // Set the initial state from global
            setFavorites([...globalFavorites]);

            // Register this component as a listener
            const listenerCallback = (newFavorites: Classified[]) => {
                setFavorites([...newFavorites]);
            };

            listeners.push(listenerCallback);

            // Clean up listener on unmount
            return () => {
                listeners = listeners.filter((l) => l !== listenerCallback);
            };
        } catch (error) {
            console.error("Error initializing favorites:", error);
            setFavorites([]);
        }
    }, []);

    const saveFavorites = (newFavorites: Classified[]) => {
        try {
            globalFavorites = newFavorites;
            localStorage.setItem("favorites", JSON.stringify(newFavorites));
            notifyListeners();
        } catch (error) {
            console.error("Error saving favorites:", error);
        }
    };

    const addFavorite = (classified: Classified) => {
        // Use the latest global state
        const updatedFavorites = [...globalFavorites, classified];
        saveFavorites(updatedFavorites);
    };

    const removeFavorite = (id: string) => {
        // Use the latest global state
        const updatedFavorites = globalFavorites.filter(
            (item) => item.id !== id
        );
        saveFavorites(updatedFavorites);
    };

    const toggleFavorite = (classified: Classified) => {
        // Use the latest global state instead of component state
        if (globalFavorites.some((item) => item.id === classified.id)) {
            removeFavorite(classified.id);
        } else {
            addFavorite(classified);
        }
    };

    const isFavorite = (id: string) => {
        // Always check against global state for consistency
        return globalFavorites.some((item) => item.id === id);
    };

    return {
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
    };
}
