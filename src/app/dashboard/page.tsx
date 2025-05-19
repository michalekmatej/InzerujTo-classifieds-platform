import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/auth/session";
import DashboardClassifiedsList from "@/components/dashboard-classifieds-list";
import FavoritesList from "@/components/favorites-list";
import { ClassifiedService } from "@/lib/db/models/classified";

export default async function DashboardPage() {
    const user = await getCurrentUser();
    const classifiedsService = await ClassifiedService.getInstance();
    const classifieds = await classifiedsService.listClassifiedsByUser(user!.id);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Moje nástěnka</h1>
                <Link href="/classifieds/new">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Přidat nový inzerát
                    </Button>
                </Link>
            </div>

            <Tabs defaultValue="my-classifieds">
                <TabsList className="mb-4">
                    <TabsTrigger value="my-classifieds">
                        Moje inzeráty
                    </TabsTrigger>
                    <TabsTrigger value="favorites">Oblíbené</TabsTrigger>
                </TabsList>

                <TabsContent value="my-classifieds">
                    <DashboardClassifiedsList
                        classifieds={classifieds}
                    />
                </TabsContent>

                <TabsContent value="favorites">
                    <FavoritesList />
                </TabsContent>
            </Tabs>
        </div>
    );
}
