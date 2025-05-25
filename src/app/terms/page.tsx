import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Podmínky služby | InzerujTo.cz",
    description: "Seznamte se s podmínkami služby platformy InzerujTo.cz",
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Podmínky služby</h1>
                <p className="text-muted-foreground">
                    Zde by byly uvedeny podmínky služby.
                </p>
            </div>
        </div>
    );
}
