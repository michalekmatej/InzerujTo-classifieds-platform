import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t">
            <div className="container mx-auto px-4 pt-6 pb-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">
                            InzerujTo.cz
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Najděte a podávejte inzeráty snadno. Spojte se s
                            kupci a prodejci ve vašem okolí.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">
                            Rychlé odkazy
                        </h3>
                        <ul className="grid gap-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Domů
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/categories"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Kategorie
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about-us"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    O platformě
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/how-to-advertise"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Jak inzerovat
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">
                            Právní informace
                        </h3>
                        <ul className="grid gap-2 text-sm">
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Podmínky služby
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Zásady ochrany osobních údajů
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} InzerujTo.cz. Všechna
                    práva vyhrazena.
                </div>
            </div>
        </footer>
    );
}
