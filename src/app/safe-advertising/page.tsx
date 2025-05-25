"use client";

import {
    Shield,
    AlertTriangle,
    CreditCard,
    Mail,
    User,
    DollarSign,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FeatureCard } from "@/components/feature-card";

export default function SafeAdvertisingPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:items-center mt-3 mb-8 md:text-center">
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">
                        Bezpečné inzerování - Jak se vyhnout podvodům
                    </h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Informace a tipy, jak bezpečně nakupovat a prodávat
                        online a jak rozpoznat podvodníky.
                    </p>
                </div>

                <div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mb-8">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
                            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                                Upozornění
                            </h2>
                        </div>
                        <p>
                            Bohužel i v oblasti online inzerce se vyskytují
                            podvodníci, kteří se snaží zneužít důvěru uživatelů.
                            Přečtěte si prosím následující informace, které vám
                            pomohou rozpoznat nejčastější typy podvodů a
                            ochránit se před nimi.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center">
                        <Shield className="h-6 w-6 mr-2 text-primary" />
                        Nejčastější typy podvodů
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <FeatureCard
                            icon={CreditCard}
                            title="Platba předem:"
                            description="Podvodník požaduje platbu předem, často na zahraniční účet, a poté nedodá zboží nebo přestane komunikovat."
                            colorScheme="red"
                        />
                        <FeatureCard
                            icon={Mail}
                            title="Falešné emaily:"
                            description="Podvodníci se vydávají za naši platformu nebo doručovací služby a žádají o platbu nebo osobní údaje."
                            colorScheme="red"
                        />
                        <FeatureCard
                            icon={User}
                            title="Krádež identity:"
                            description="Podvodník používá ukradené fotografie a informace skutečných prodejců k vytvoření falešných inzerátů."
                            colorScheme="red"
                        />
                        <FeatureCard
                            icon={DollarSign}
                            title="Příliš výhodné nabídky:"
                            description="Nabídky zboží za extrémně nízké ceny bývají často podvodem. Pokud je cena příliš dobrá, pravděpodobně není pravdivá."
                            colorScheme="red"
                        />
                    </div>

                    <h2 className="text-3xl font-bold mt-16 mb-8 text-center">
                        Jak se chránit před podvody
                    </h2>

                    <div className="space-y-4">
                        <div className="py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">
                                    1. Osobní setkání a platba
                                </h3>
                            </div>
                            <p className="mb-4">
                                Pokud je to možné, preferujte osobní předání
                                zboží a platbu v hotovosti. Setkávejte se na
                                veřejných místech a za denního světla. Před
                                platbou si důkladně prohlédněte zboží a ujistěte
                                se, že odpovídá popisu v inzerátu.
                            </p>
                            <Separator className="mt-4" />
                        </div>

                        <div className="py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">
                                    2. Pozor na podezřelou komunikaci
                                </h3>
                            </div>
                            <p className="mb-4">
                                Buďte obezřetní, pokud prodejce nebo kupující
                                komunikuje v lámané češtině, vyhýbá se přímým
                                odpovědím nebo tlačí na rychlé uzavření obchodu.
                                Podezřelé je také, pokud protistrana odmítá
                                poskytnout dodatečné informace nebo fotografie,
                                případně se snaží vyvolat pocit naléhavosti
                                (například tvrzením, že je mnoho dalších
                                zájemců).
                            </p>
                            <Separator className="mt-4" />
                        </div>

                        <div className="py-4">
                            <h3 className="text-xl font-semibold mb-6">
                                3. Bezpečné platby
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div>
                                        <strong>
                                            Neposílejte peníze předem
                                        </strong>{" "}
                                        - platbu provádějte až po osobním
                                        převzetí zboží nebo využijte ověřené
                                        platební služby, které nabízejí ochranu
                                        kupujícího.
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <strong>
                                            Pečlivě kontrolujte platební údaje
                                        </strong>{" "}
                                        - ověřte si, že číslo účtu a jméno
                                        příjemce odpovídají údajům
                                        prodávajícího. Vyhněte se platbám na
                                        zahraniční účty nebo přes anonymní
                                        služby.
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <strong>
                                            Vždy používejte ověřené platební
                                            metody
                                        </strong>{" "}
                                        - ignorujte nabídky na platbu přes
                                        neznámé služby nebo podezřelé odkazy.
                                        Plaťte pouze prostřednictvím
                                        důvěryhodných a doporučených způsobů.
                                    </div>
                                </div>
                            </div>
                            <Separator className="mt-6" />
                        </div>

                        <div className="py-4">
                            <h3 className="text-xl font-semibold mb-4">
                                4. Prověřujte inzeráty
                            </h3>
                            <p className="mb-4">
                                Pozorně si prohlédněte fotografie - jsou
                                originální nebo stažené z internetu? Můžete
                                použít zpětné vyhledávání obrázků pro kontrolu.
                                Pokud prodejce odmítá poskytnout další
                                fotografie nebo detaily o zboží, může jít o
                                podvod. Porovnejte cenu s podobnými inzeráty,
                                extrémně nízké ceny mohou být varovným signálem.
                            </p>
                            <Separator className="mt-4" />
                        </div>

                        <div className="py-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">
                                    5. Ochrana osobních údajů
                                </h3>
                            </div>
                            <p className="mb-4">
                                Nikdy neposkytujte citlivé osobní údaje, jako
                                jsou čísla kreditních karet, hesla nebo kopie
                                dokladů. Naše platforma nikdy nebude tyto
                                informace požadovat. Buďte obezřetní, pokud vás
                                někdo žádá o přihlášení na jiné stránky nebo
                                stažení aplikací mimo oficiální obchody.
                            </p>
                            <Separator className="mt-4" />
                        </div>

                        <div className="py-4">
                            <h3 className="text-xl font-semibold mb-4">
                                6. Hlášení podvodů
                            </h3>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>
                                    Pokud narazíte na podezřelý inzerát,
                                    nahlaste jej.
                                </li>
                                <li>
                                    Pokud se stanete obětí podvodu, obraťte se
                                    na Policii ČR.
                                </li>
                                <li>
                                    Informujte o podvodu také svou banku, pokud
                                    došlo k finanční transakci.
                                </li>
                                <li>
                                    Uchovejte veškerou komunikaci s prodejcem
                                    jako důkaz.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
