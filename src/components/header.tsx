"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/auth";
import Image from "next/image";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, signIn, signOut } = useAuth();

    return (
        <header className="border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                    />
                    <span className="text-xl font-bold text-orange-600">
                        InzerujTo.cz
                    </span>
                </Link>

                <div className="hidden items-center gap-4 md:flex">
                    <nav className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-medium">
                            Domů
                        </Link>
                        <Link
                            href="/categories"
                            className="text-sm font-medium"
                        >
                            Kategorie
                        </Link>
                        <Link
                            href="/favorites"
                            className="text-sm font-medium flex items-center gap-1"
                        >
                            Oblíbené
                        </Link>
                        {user && (
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium"
                            >
                                Nástěnka
                            </Link>
                        )}
                        {user?.role === "admin" && (
                            <Link href="/admin" className="text-sm font-medium">
                                Admin
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        {user ? (
                            <Button variant="outline" onClick={signOut}>
                                Odhlásit se
                            </Button>
                        ) : (
                            <Button
                                onClick={signIn}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                Přihlásit se
                            </Button>
                        )}
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {isMenuOpen && (
                <div className="container mx-auto px-4 pb-4 md:hidden">
                    <nav className="flex flex-col gap-2">
                        <Link
                            href="/"
                            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Domů
                        </Link>
                        <Link
                            href="/categories"
                            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Kategorie
                        </Link>
                        <Link
                            href="/favorites"
                            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent flex items-center gap-1"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Heart className="h-3 w-3" /> Oblíbené
                        </Link>
                        {user && (
                            <Link
                                href="/dashboard"
                                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Nástěnka
                            </Link>
                        )}
                        {user?.role === "admin" && (
                            <Link
                                href="/admin"
                                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Admin
                            </Link>
                        )}
                        <div className="flex items-center gap-2 pt-2">
                            <ModeToggle />
                            {user ? (
                                <Button
                                    variant="outline"
                                    onClick={signOut}
                                    className="w-full"
                                >
                                    Odhlásit se
                                </Button>
                            ) : (
                                <Button
                                    onClick={signIn}
                                    className="w-full bg-orange-600 hover:bg-orange-700"
                                >
                                    Přihlásit se
                                </Button>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
