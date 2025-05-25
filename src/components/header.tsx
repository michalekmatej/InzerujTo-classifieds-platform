"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { logout } from "@/lib/auth/auth-client";
import Head from "next/head";
import { cn } from "@/lib/utils";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const session = useSession();
    const user = session?.data?.user;

    const handleSignIn = () => {
        router.push("/login");
    };

    const handleRegister = () => {
        router.push("/register");
    };

    const handleSignOut = async () => {
        await logout();
    };

    return (
        <header className="border-b sticky top-0 left-0 right-0 z-50 bg-background">
            <div className="container mx-auto flex h-16 items-center px-4">
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
                <div className="hidden items-center gap-4 ml-10 md:flex justify-between flex-1">
                    <nav className="flex items-center gap-6">
                        <HeaderLink href="/">Domů</HeaderLink>
                        <HeaderLink href="/categories">Kategorie</HeaderLink>
                        <HeaderLink href="/favorites">Oblíbené</HeaderLink>
                        {user && (
                            <HeaderLink href="/dashboard">Moje</HeaderLink>
                        )}
                        {user?.role === "admin" && (
                            <HeaderLink href="/admin">Admin</HeaderLink>
                        )}
                    </nav>
                    <div className="flex items-center gap-2">
                        <HeaderLink
                            href="/how-to-advertise"
                            className="md:hidden lg:block "
                        >
                            Jak inzerovat
                        </HeaderLink>
                        <ThemeToggle />
                        {user && (
                            <span className="text-muted-foreground text-sm md:hidden lg:block mr-3">
                                {user?.name}
                            </span>
                        )}
                        {user ? (
                            <Button variant="outline" onClick={handleSignOut}>
                                Odhlásit se
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={handleRegister}
                                    variant={"link"}
                                    className="text-orange-600 -ml-3"
                                >
                                    Registrovat se
                                </Button>
                                <Button
                                    onClick={handleSignIn}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    Přihlásit se
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <div className="md:hidden">
                        <ThemeToggle />
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
            </div>
            {isMenuOpen && (
                <div className="container mx-auto px-4 pb-4 md:hidden">
                    <nav className="flex flex-col gap-2">
                        <HeaderLink
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            mobile
                        >
                            Domů
                        </HeaderLink>
                        <HeaderLink
                            href="/categories"
                            onClick={() => setIsMenuOpen(false)}
                            mobile
                        >
                            Kategorie
                        </HeaderLink>
                        <HeaderLink
                            href="/favorites"
                            onClick={() => setIsMenuOpen(false)}
                            mobile
                        >
                            Oblíbené
                        </HeaderLink>

                        {user && (
                            <HeaderLink
                                href="/dashboard"
                                onClick={() => setIsMenuOpen(false)}
                                mobile
                            >
                                Moje
                            </HeaderLink>
                        )}
                        {user?.role === "admin" && (
                            <HeaderLink
                                href="/admin"
                                onClick={() => setIsMenuOpen(false)}
                                mobile
                            >
                                Admin
                            </HeaderLink>
                        )}
                        <HeaderLink
                            href="/how-to-advertise"
                            onClick={() => setIsMenuOpen(false)}
                            mobile
                        >
                            Jak inzerovat
                        </HeaderLink>
                        <div className="flex flex-col gap-2">
                            {user ? (
                                <>
                                    <span className="text-muted-foreground text-sm text-center mb-3 mt-2">
                                        {user?.name}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={handleSignOut}
                                        className="w-full"
                                    >
                                        Odhlásit se
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={handleRegister}
                                    variant={"link"}
                                    className="text-orange-600 w-full"
                                >
                                    Registrovat se
                                </Button>
                            )}
                        </div>
                        {!user && (
                            <Button
                                onClick={handleSignIn}
                                className="bg-orange-600 hover:bg-orange-700 w-full"
                            >
                                Přihlásit se
                            </Button>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

const HeaderLink = ({
    href,
    children,
    onClick,
    mobile,
    className,
}: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    mobile?: boolean;
    className?: string;
}) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                !mobile
                    ? "text-sm font-medium hover:text-orange-600"
                    : "rounded-md px-3 py-3 text-sm text-center font-medium hover:bg-accent",
                className
            )}
        >
            {children}
        </Link>
    );
};
