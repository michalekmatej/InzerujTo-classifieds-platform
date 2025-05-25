import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import { ArrowLeft, MapPin, User } from "lucide-react";
import { formatPrice } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FavoriteButton from "@/components/favorite-button";
import ClassifiedActions from "@/components/classified-actions";
import { ClassifiedService } from "@/lib/db/models/classified";
import { UserService } from "@/lib/db/models/user";
import CategoryBadge from "@/components/category-badge";
import PhotoGallery from "@/components/photo-gallery";
import ContactSellerButton from "@/components/contact-seller-button";

interface ClassifiedPageProps {
    params: {
        id: string;
    };
}

export default async function ClassifiedPage({ params }: ClassifiedPageProps) {
    const classifiedsService = await ClassifiedService.getInstance();
    const { id } = await params;
    const classified = await classifiedsService.findById(id);

    console.log(classified);
    if (!classified) {
        notFound();
    }

    const {
        title,
        description,
        price,
        category,
        location,
        createdAt,
        images,
        userId,
    } = classified;

    const userService = await UserService.getInstance();
    const user = await userService.findById(userId);

    const formattedDate = formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
        locale: cs,
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Zpět na seznam
                </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <PhotoGallery images={images || []} title={title} />

                <div className="flex flex-col">
                    <div className="mb-4 flex items-start justify-between">
                        <h1 className="text-2xl font-bold md:text-3xl">
                            {title}
                        </h1>
                        <FavoriteButton classifiedId={id} />
                    </div>

                    <div className="mb-4 flex items-center gap-2">
                        <CategoryBadge categorySlug={category} />
                        <span className="inline-flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            {location}
                        </span>
                    </div>

                    <div className="mb-6">
                        <span className="text-3xl font-bold text-orange-600">
                            {formatPrice(price)}
                        </span>
                    </div>

                    <Separator className="mb-4" />

                    <div className="mb-6">
                        <h2 className="mb-2 text-lg font-semibold">Popis</h2>
                        <p className="whitespace-pre-line text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    <div className="mt-auto space-y-4">
                        <div className="flex items-center justify-between">
                            {user && (
                                <div className="inline-flex items-center text-sm text-muted-foreground">
                                    <User className="mr-1 h-4 w-4" />
                                    Uživatel: {user.name || user.email}
                                </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                                Přidáno {formattedDate}
                            </div>
                        </div>

                        <ClassifiedActions classified={classified} />

                        <ContactSellerButton
                            user={
                                user
                                    ? {
                                          name: user.name,
                                          email: user.email,
                                      }
                                    : null
                            }
                            location={location}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
