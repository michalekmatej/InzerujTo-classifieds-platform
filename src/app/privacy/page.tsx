import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Zásady ochrany osobních údajů | InzerujTo.cz",
    description:
        "Seznamte se se zásadami ochrany osobních údajů na platformě InzerujTo.cz",
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">
                    Zásady ochrany osobních údajů
                </h1>
                <p className="text-muted-foreground">
                    Zde by byly uvedeny zásady ochrany osobních údajů.
                </p>
            </div>
        </div>
    );
}
