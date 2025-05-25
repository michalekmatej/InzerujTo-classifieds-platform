"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ContactSellerButtonProps {
    user: {
        name?: string;
        email: string;
    } | null;
    location: string;
}

export default function ContactSellerButton({
    user,
    location,
}: ContactSellerButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Kontaktovat prodejce
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">
                        Kontaktní údaje prodejce
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <Card className="border border-muted">
                    <CardContent className="p-4 space-y-4">
                        <div className="flex items-center">
                            <User className="w-5 h-5 mr-2 text-orange-600" />
                            <div>
                                <span className="font-medium">Prodejce:</span>{" "}
                                {user.name || "Neuvedeno"}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-orange-600" />
                            <div>
                                <span className="font-medium">Email:</span>{" "}
                                <a
                                    href={`mailto:${user.email}`}
                                    className="text-orange-600 hover:underline"
                                >
                                    {user.email}
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                            <div>
                                <span className="font-medium">Lokalita:</span>{" "}
                                {location}
                            </div>
                        </div>
                        <Separator />
                        <div className="text-sm text-muted-foreground">
                            Pro kontaktování prodejce můžete použít email.
                            Nezapomeňte uvést název inzerátu v předmětu zprávy.
                        </div>
                    </CardContent>
                </Card>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogAction className="bg-orange-600 hover:bg-orange-700">
                        Zavřít
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
