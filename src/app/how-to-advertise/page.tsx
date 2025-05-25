"use client";

import {
    FileText,
    Camera,
    DollarSign,
    ClipboardList,
    MapPin,
    Info,
    Check,
    Shield,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/feature-card";
import { StepGuideItem } from "@/components/step-guide-item";
import { InfoBox } from "@/components/info-box";
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
                        Možná si říkáte, že stačí napsat „Prodám kolo“ a čekat,
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
                        <FeatureCard
                            icon={FileText}
                            title="Buďte upřímní a konkrétní:"
                            description="Nepřikrášlujte, ale ani nezamlčujte. Zájemci ocení, když ví, do čeho jdou."
                        />
                        <FeatureCard
                            icon={Camera}
                            title="Fotka je polovina úspěchu:"
                            description="Klidně použijte mobil, ale fotku udělejte za denního světla a z více úhlů. Lidé chtějí vidět, co kupují."
                        />
                        <FeatureCard
                            icon={DollarSign}
                            title="Cena? Inspirujte se:"
                            description="Projděte si podobné inzeráty a nastavte cenu tak, aby byla férová, ale zároveň konkurenceschopná."
                        />
                        <FeatureCard
                            icon={ClipboardList}
                            title="Nebojte se detailů:"
                            description="Uveďte stáří, stav, důvod prodeje, rozměry, barvu, cokoliv, co byste sami chtěli vědět."
                        />
                        <FeatureCard
                            icon={MapPin}
                            title="Lokalita a kontakt:"
                            description="Uveďte, odkud jste a jak vás mohou zájemci kontaktovat. Ušetříte si spoustu zbytečných dotazů."
                            fullWidth
                        />
                    </div>
                    <h2 className="text-3xl font-bold mt-16 mb-8 text-center">
                        Krok za krokem - Jak vložit inzerát
                    </h2>
                    <div className="space-y-4">
                        <StepGuideItem
                            number="1"
                            title="Přihlaste se / zaregistrujte se"
                            buttonLabel="Registrovat se"
                            buttonLink="/register"
                        >
                            <p>
                                Než začnete, je potřeba mít uživatelský účet.
                                Pokud jej ještě nemáte, registrace vám zabere
                                pár minut, stačí zadat e-mail, zvolit heslo a
                                potvrdit registraci. Po přihlášení získáte
                                přístup ke všem funkcím platformy, především k
                                přidávání nových inzerátů a jejich správě.
                            </p>
                        </StepGuideItem>

                        <StepGuideItem
                            number="2"
                            title="Klikněte na tlačítko „Přidat inzerát“"
                            buttonLabel="Přidat inzerát"
                            buttonLink="/classifieds/new"
                        >
                            <p>
                                Na hlavní stránce nebo v uživatelském menu
                                najdete výrazné tlačítko „Přidat inzerát“. Po
                                jeho kliknutí se otevře jednoduchý formulář, kde
                                zadáte všechny potřebné údaje o své nabídce.
                            </p>
                        </StepGuideItem>

                        <StepGuideItem
                            number="3"
                            title="Vyplňte všechny důležité informace"
                        >
                            <div className="space-y-6">
                                <div>
                                    <div>
                                        <strong>Název inzerátu:</strong> Buďte
                                        konkrétní a výstižní. Místo „Prodám
                                        telefon“ napište například „iPhone 13
                                        Pro 128GB, stříbrný, záruka“.
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
                        </StepGuideItem>

                        <StepGuideItem
                            number="4"
                            title="Zkontrolujte a odešlete inzerát"
                        >
                            <p>
                                Před odesláním si inzerát ještě jednou přečtěte
                                a ujistěte se, že jste na nic nezapomněli. Pokud
                                je vše v pořádku, potvrďte odeslání. Váš inzerát
                                bude ihned zveřejněn případným zájemcům na
                                platformě.
                            </p>
                        </StepGuideItem>

                        <StepGuideItem
                            number="5"
                            title="Spravujte své inzeráty a komunikujte se zájemci"
                            buttonLabel="Správa inzerátů"
                            buttonLink="/dashboard"
                        >
                            <p>
                                Po vložení inzerátu můžete kdykoli upravit jeho
                                obsah, přidat další fotografie nebo změnit cenu.
                                V uživatelském profilu najdete přehled všech
                                svých inzerátů. Komunikace se zájemci bude
                                probíhat přes vámi zadaný email či telefon.
                                Odpovídejte rychle a vstřícně - zvyšujete tím
                                šanci na úspěšný obchod.
                            </p>
                        </StepGuideItem>

                        <StepGuideItem
                            number="6"
                            title="Tipy pro úspěšné inzerování"
                        >
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
                        </StepGuideItem>
                    </div>

                    <InfoBox
                        title="Malý bonus na závěr"
                        colorScheme="orange"
                        className="mt-4"
                    >
                        <p className="mb-0">
                            Nebojte se inzerát průběžně aktualizovat, pokud se
                            dlouho nic neděje. A hlavně - buďte trpěliví. Někdy
                            se zájemce ozve hned, jindy to chce pár dní. Držím
                            vám palce, ať se vaše věci rychle prodají a najdou
                            nové majitele!
                        </p>
                    </InfoBox>

                    <InfoBox
                        title="Bezpečné inzerování"
                        icon={Shield}
                        colorScheme="green"
                        className="mt-8"
                        buttonLabel="Přečíst více o bezpečnosti"
                        buttonLink="/safe-advertising"
                    >
                        <p>
                            Při online inzerování je důležité myslet i na
                            bezpečnost. Přečtěte si naše tipy, jak se vyhnout
                            podvodům a jak bezpečně nakupovat a prodávat online.
                        </p>
                    </InfoBox>
                    <div className="mt-10 flex justify-center">
                        <Button
                            size="lg"
                            className="bg-orange-600 hover:bg-orange-700"
                            asChild
                        >
                            <Link href="/classifieds/new">
                                Vytvořit nový inzerát
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
