"use client";

import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    colorScheme?: "orange" | "red";
    className?: string;
    fullWidth?: boolean;
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
    colorScheme = "orange",
    className,
    fullWidth = false,
}: FeatureCardProps) {
    const colorClasses = {
        orange: {
            border: "border-l-orange-500",
            iconColor: "text-orange-500",
            titleColor: "",
        },
        red: {
            border: "border-l-red-500",
            iconColor: "text-red-500",
            titleColor: "text-red-600 dark:text-red-400",
        },
    };

    const colors = colorClasses[colorScheme];

    return (
        <Card
            className={`p-5 pl-3 shadow-sm border-l-4 ${colors.border} ${
                fullWidth ? "md:col-span-2" : ""
            } ${className || ""}`}
        >
            <div className="flex items-center">
                <Icon className={`h-10 w-10 ${colors.iconColor} mr-3`} />
                <div>
                    <strong className={colors.titleColor}>{title}</strong>{" "}
                    {description}
                </div>
            </div>
        </Card>
    );
}
