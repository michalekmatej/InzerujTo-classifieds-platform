"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/auth/auth-client";

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect");
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<string>("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPasswordError("");

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        // Check if passwords match
        if (password !== confirmPassword) {
            setPasswordError("Hesla se neshodují");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast({
                    title: "Registrace selhala",
                    description: data.message || "Něco se pokazilo",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            toast({
                title: "Účet vytvořen!",
                description: "Automaticky vás přihlašujeme...",
            });

            // Automatické přihlášení uživatele po úspěšné registraci
            try {
                await login(email, password, redirectPath || undefined);
                // Přihlášení je s redirect: true, takže se o přesměrování postará NextAuth
            } catch (error) {
                console.error("Chyba při automatickém přihlášení:", error);

                // V případě chyby při přihlášení přesměrujeme na přihlašovací stránku
                const loginPath = redirectPath
                    ? `/login?redirect=${encodeURIComponent(redirectPath)}`
                    : "/login";
                router.push(loginPath);

                toast({
                    title: "Přihlášení selhalo",
                    description: "Při přihlášení došlo k chybě. Zkuste to prosím znovu.",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Něco se pokazilo",
                description: "Zkuste to prosím později",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto flex justify-center items-center min-h-[80vh] px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                        Vytvořit účet
                    </CardTitle>
                    <CardDescription>
                        Zadejte své údaje pro vytvoření nového účtu
                        {/* {redirectPath && (
                            <div className="mt-2 text-sm text-muted-foreground">
                                Po registraci a přihlášení budete přesměrováni na požadovanou stránku.
                            </div>
                        )} */}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Jméno</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Jan Novák"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="vas@email.cz"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Heslo</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Potvrdit heslo
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className={`w-full ${
                                    passwordError ? "border-destructive" : ""
                                }`}
                            />
                            {passwordError && (
                                <p className="text-sm text-destructive">
                                    {passwordError}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-3">
                        <Button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "Vytváření účtu..." : "Registrovat"}
                        </Button>
                        <div className="text-center text-sm">
                            Již máte účet?{" "}
                            <Link
                                href={
                                    redirectPath
                                        ? `/login?redirect=${encodeURIComponent(
                                              redirectPath
                                          )}`
                                        : "/login"
                                }
                                className="text-orange-600 hover:underline font-medium"
                            >
                                Přihlásit se
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
