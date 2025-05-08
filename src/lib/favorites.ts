"use client"

import { useState, useEffect } from "react"
import type { Classified } from "./types"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Classified[]>([])

  useEffect(() => {
    // Load favorites from localStorage on mount
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  const saveFavorites = (newFavorites: Classified[]) => {
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const addFavorite = (classified: Classified) => {
    saveFavorites([...favorites, classified])
  }

  const removeFavorite = (id: string) => {
    saveFavorites(favorites.filter((item) => item.id !== id))
  }

  const toggleFavorite = (classified: Classified) => {
    if (isFavorite(classified.id)) {
      removeFavorite(classified.id)
    } else {
      addFavorite(classified)
    }
  }

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  }
}
