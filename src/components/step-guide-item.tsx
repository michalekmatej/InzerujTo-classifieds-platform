"use client";

import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StepGuideItemProps {
    number: string | number;
    title: string;
    children: ReactNode;
    buttonLabel?: string;
    buttonLink?: string;
}

export function StepGuideItem({
    number,
    title,
    children,
    buttonLabel,
    buttonLink,
}: StepGuideItemProps) {
    return (
        <div className="py-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                    {number}. {title}
                </h3>
                {buttonLabel && buttonLink && (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={buttonLink}>{buttonLabel}</Link>
                    </Button>
                )}
            </div>
            <div className="mb-4">{children}</div>
            <Separator className="mt-4" />
        </div>
    );
}
