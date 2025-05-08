"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  signIn: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const signIn = () => {
    // Mock sign in - in a real app, this would authenticate with a backend
    const mockUser: User = {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

// For server components
export async function getCurrentUser(): Promise<User | null> {
  // In a real app, this would verify the session/token with the backend
  // For now, we'll just return a mock user
  return {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
  }
}
