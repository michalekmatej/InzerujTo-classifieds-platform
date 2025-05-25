"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InfoBoxProps {
    title: string;
    icon?: LucideIcon;
    children: ReactNode;
    colorScheme: "orange" | "green" | "red";
    buttonLabel?: string;
    buttonLink?: string;
    className?: string;
}

export function InfoBox({
    title,
    icon: Icon,
    children,
    colorScheme = "green",
    buttonLabel,
    buttonLink,
    className = "",
}: InfoBoxProps) {
    const colorClasses = {
        orange: {
            bg: "bg-orange-50 dark:bg-orange-900/20",
            border: "border-orange-200 dark:border-orange-800",
            textColor: "text-orange-600 dark:text-orange-400",
        },
        green: {
            bg: "bg-green-50 dark:bg-green-900/20",
            border: "border-green-200 dark:border-green-800",
            textColor: "text-green-600 dark:text-green-400",
        },
        red: {
            bg: "bg-red-50 dark:bg-red-900/20",
            border: "border-red-200 dark:border-red-800",
            textColor: "text-red-600 dark:text-red-400",
        },
    };

    const colors = colorClasses[colorScheme];

    return (
        <div
            className={`${colors.bg} p-6 rounded-lg border ${colors.border} ${className}`}
        >
            {title && (
                <div className={Icon ? "flex items-center mb-4" : "mb-4"}>
                    {Icon && (
                        <Icon className={`h-5 w-5 mr-2 ${colors.textColor}`} />
                    )}
                    <h2 className={`text-xl font-bold ${colors.textColor}`}>
                        {title}
                    </h2>
                </div>
            )}
            <div className="mb-4">{children}</div>
            {buttonLabel && buttonLink && (
                <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={buttonLink}>{buttonLabel}</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
