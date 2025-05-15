import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <h1 className="mb-2 text-4xl font-bold text-orange-600">404</h1>
            <h2 className="mb-6 text-2xl font-medium">Stránka nenalezena</h2>
            <p className="mb-8 max-w-md text-muted-foreground">
                Omlouváme se, ale stránka, kterou hledáte, neexistuje nebo byla
                přesunuta.
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                    <Link href="/">Zpět na hlavní stránku</Link>
                </Button>
            </div>
        </div>
    );
}
