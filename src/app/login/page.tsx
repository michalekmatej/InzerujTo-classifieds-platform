"use client";

import { useState, useEffect } from "react";
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

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect");
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await login(email, password, redirectPath || undefined);
        } catch (error) {
            toast({
                title: "Přihlášení selhalo",
                description: "Zkontrolujte své údaje a zkuste to znovu.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto flex justify-center items-center min-h-[80vh] px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                        Přihlášení
                    </CardTitle>
                    <CardDescription>
                        Zadejte své přihlašovací údaje pro přístup k účtu
                        {/* {redirectPath && (
                            <div className="mt-2 text-sm text-muted-foreground">
                                Po přihlášení budete přesměrováni na požadovanou stránku.
                            </div>
                        )} */}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-4">
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Heslo</Label>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-3">
                        <Button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "Přihlašování..." : "Přihlásit se"}
                        </Button>
                        <div className="text-center text-sm">
                            Nemáte účet?{" "}
                            <Link
                                href={
                                    redirectPath
                                        ? `/register?redirect=${encodeURIComponent(
                                              redirectPath
                                          )}`
                                        : "/register"
                                }
                                className="text-orange-600 hover:underline font-medium"
                            >
                                Registrovat se
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
