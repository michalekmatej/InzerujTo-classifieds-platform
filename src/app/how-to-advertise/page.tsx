"use client";

import {
    FileText,
    Camera,
    DollarSign,
    ClipboardList,
    MapPin,
    UserCheck,
    Plus,
    Info,
    Check,
    ExternalLink,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HowToAdvertisePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:items-center mb-8 md:text-center">
                    <Badge variant="outline" className="mb-4 w-fit">
                        Průvodce
                    </Badge>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">
                        Jak inzerovat - Tipy a jednoduchý návod
                    </h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Naučte se jak správně a efektivně inzerovat, aby váš
                        inzerát nezapadl v množství ostatních.
                    </p>
                </div>

                <div>
                    <p>
                        Přemýšlíte, jak co nejlépe prodat věci, které už doma
                        nepotřebujete? Nebo naopak chcete nabídnout své služby a
                        najít nové zákazníky? Ať už je váš důvod jakýkoliv,
                        správně napsaný inzerát je základ úspěchu. Věřte nám, že
                        i obyčejný předmět může najít nového majitele během pár
                        hodin - stačí vědět, jak na to!
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center">
                        <Info className="h-6 w-6 mr-2 text-primary" />
                        Proč záleží na tom, jak inzerujete?
                    </h2>
                    <p>
                        Možná si říkáte, že stačí napsat „Prodám kolo" a čekat,
                        až se někdo ozve. Jenže ve světě online inzerce je velká
                        konkurence. Každý den přibývají stovky nových nabídek a
                        vy chcete, aby ta vaše nezapadla, ale naopak zaujala na
                        první pohled. Dobře napsaný inzerát s pěknou fotkou je
                        jako výloha v obchodě - buď kolemjdoucí zaujme, nebo
                        projdou bez povšimnutí.
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                        <Check className="h-6 w-6 mr-2 text-primary" />
                        Osvědčené tipy, jak zaujmout
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <Card className="p-5 pl-3 shadow-sm border-l-4 border-l-orange-500">
                            <div className="flex items-center">
                                <FileText className="h-10 w-10 text-orange-500 mr-3" />
                                <div>
                                    <strong>Buďte upřímní a konkrétní:</strong>{" "}
                                    Nepřikrášlujte, ale ani nezamlčujte. Zájemci
                                    ocení, když ví, do čeho jdou.
                                </div>
                            </div>
                        </Card>
                        <Card className="p-5 pl-3 shadow-sm border-l-4 border-l-orange-500">
                            <div className="flex items-center">
                                <Camera className="h-10 w-10 text-orange-500 mr-3" />
                                <div>
                                    <strong>Fotka je polovina úspěchu:</strong>{" "}
                                    Klidně použijte mobil, ale fotku udělejte za
                                    denního světla a z více úhlů. Lidé chtějí
                                    vidět, co kupují.
                                </div>
                            </div>
                        </Card>
                        <Card className="p-5 pl-3 shadow-sm border-l-4 border-l-orange-500">
                            <div className="flex items-center">
                                <DollarSign className="h-10 w-10 text-orange-500 mr-3" />
                                <div>
                                    <strong>Cena? Inspirujte se:</strong>{" "}
                                    Projděte si podobné inzeráty a nastavte cenu
                                    tak, aby byla férová, ale zároveň
                                    konkurenceschopná.
                                </div>
                            </div>
                        </Card>
                        <Card className="p-5 pl-3 shadow-sm border-l-4 border-l-orange-500">
                            <div className="flex items-center">
                                <ClipboardList className="h-10 w-10 text-orange-500 mr-3" />
                                <div>
                                    <strong>Nebojte se detailů:</strong> Uveďte
                                    stáří, stav, důvod prodeje, rozměry, barvu,
                                    cokoliv, co byste sami chtěli vědět.
                                </div>
                            </div>
                        </Card>
                        <Card className="md:col-span-2 p-5 pl-3 shadow-sm border-l-4 border-l-orange-500">
                            <div className="flex items-center">
                                <MapPin className="h-10 w-10 text-orange-500 mr-3" />
                                <div>
                                    <strong>Lokalita a kontakt:</strong> Uveďte,
                                    odkud jste a jak vás mohou zájemci
                                    kontaktovat. Ušetříte si spoustu zbytečných
                                    dotazů.
                                </div>
                            </div>
                        </Card>
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-8 text-center">
                        Krok za krokem - Jak vložit inzerát
                    </h2>

                    <div className="space-y-4">
                        <div className="py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">
                                    1. Přihlaste se / zaregistrujte se
                                </h3>
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/register">Registrovat se</a>
                                </Button>
                            </div>
                            <p className="mb-4">
                                Než začnete, je potřeba mít uživatelský účet.
                                Pokud jej ještě nemáte, registrace vám zabere
                                pár minut, stačí zadat e-mail, zvolit heslo a
                                potvrdit registraci. Po přihlášení získáte
                                přístup ke všem funkcím platformy, především k
                                přidávání nových inzerátů a jejich správě.
                            </p>
                            <Separator className="mt-4" />
                        </div>

                        <div className="py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">
                                    2. Klikněte na tlačítko „Přidat inzerát"
                                </h3>
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/classifieds/new">
                                        Přidat inzerát
                                    </a>
                                </Button>
                            </div>
                            <p className="mb-4">
                                Na hlavní stránce nebo v uživatelském menu
                                najdete výrazné tlačítko „Přidat inzerát". Po
                                jeho kliknutí se otevře jednoduchý formulář, kde
                                zadáte všechny potřebné údaje o své nabídce.
                            </p>
                            <Separator className="mt-4" />
                        </div>

                        <div className="py-4">
                            <h3 className="text-xl font-semibold mb-6">
                                3. Vyplňte všechny důležité informace
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div>
                                        <strong>Název inzerátu:</strong> Buďte
                                        konkrétní a výstižní. Místo „Prodám
                                        telefon" napište například „iPhone 13
                                        Pro 128GB, stříbrný, záruka".
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <strong>Kategorie:</strong> Vyberte
                                        správnou kategorii, aby váš inzerát
                                        našli ti správní zájemci. Platforma
                                        nabízí různé kategorie (elektronika,
                                        domácnost, služby, atd.) pro větší
                                        přehlednost.
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <strong>Popis:</strong> Věnujte popisu
                                        dostatek pozornosti. Uveďte stav, stáří,
                                        případné vady, důvod prodeje a další
                                        důležité informace. Čím přesnější popis,
                                        tím méně zbytečných dotazů.
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <strong>Cena:</strong> Uveďte reálnou
                                        cenu, případně možnost dohody.
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <strong>Fotografie:</strong> Přidejte
                                        kvalitní, ostré fotografie. Inzeráty s
                                        fotkami mají několikanásobně vyšší šanci
                                        na úspěch. Vyfoťte zboží z více úhlů a
                                        nezapomeňte na detailní snímky
                                        případných vad.
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <strong>Lokalita:</strong> Zadejte město
                                        nebo kraj, kde je zboží k dispozici.
                                        Toto usnadňuje hledání zájemců v okolí.
                                    </div>
                                </div>
                            </div>
                            <Separator className="mt-6" />
                        </div>

                        <div className="py-4">
                            <h3 className="text-xl font-semibold mb-4">
                                4. Zkontrolujte a odešlete inzerát
                            </h3>
                            <p className="mb-4">
                                Před odesláním si inzerát ještě jednou přečtěte
                                a ujistěte se, že jste na nic nezapomněli. Pokud
                                je vše v pořádku, potvrďte odeslání. Váš inzerát
                                bude ihned zveřejněn případným zájemcům na
                                platformě.
                            </p>
                            <Separator className="mt-4" />
                        </div>

                        <div className="py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">
                                    5. Spravujte své inzeráty a komunikujte se
                                    zájemci
                                </h3>
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/dashboard">Správa inzerátů</a>
                                </Button>
                            </div>
                            <p className="mb-4">
                                Po vložení inzerátu můžete kdykoli upravit jeho
                                obsah, přidat další fotografie nebo změnit cenu.
                                V uživatelském profilu najdete přehled všech
                                svých inzerátů. Komunikace se zájemci bude
                                probíhat přes vámi zadaný email či telefon.
                                Odpovídejte rychle a vstřícně - zvyšujete tím
                                šanci na úspěšný obchod.
                            </p>
                            <Separator className="mt-4" />
                        </div>

                        <div className="py-4">
                            <h3 className="text-xl font-semibold mb-4">
                                6. Tipy pro úspěšné inzerování
                            </h3>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Pište stručně, jasně a pravdivě.</li>
                                <li>
                                    Nepodceňujte význam kvalitních fotografií.
                                </li>
                                <li>
                                    Sledujte aktuální ceny podobných nabídek.
                                </li>
                                <li>
                                    Reagujte na dotazy zájemců co nejdříve je
                                    možné.
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                        <h2 className="text-xl font-bold mb-4 text-orange-600 dark:text-orange-400">
                            Malý bonus na závěr
                        </h2>
                        <p className="mb-0">
                            Nebojte se inzerát průběžně aktualizovat, pokud se
                            dlouho nic neděje. A hlavně - buďte trpěliví. Někdy
                            se zájemce ozve hned, jindy to chce pár dní. Držím
                            vám palce, ať se vaše věci rychle prodají a najdou
                            nové majitele!
                        </p>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <Button size="lg" className="bg-orange-600 hover:bg-orange-700" asChild>
                            <Link href="/classifieds/new">Vytvořit nový inzerát</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
