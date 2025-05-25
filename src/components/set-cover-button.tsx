"use client";

import { Button } from "@/components/ui/button";
import { Image as ImageType } from "@/lib/types";
import { Image as ImageIcon } from "lucide-react";

interface SetCoverButtonProps {
    imageId: string;
    isCover: boolean;
    onSetCover: (imageId: string) => void;
    disabled?: boolean;
}

export default function SetCoverButton({
    imageId,
    isCover,
    onSetCover,
    disabled = false,
}: SetCoverButtonProps) {
    return isCover ? (
        <span className="absolute bottom-1 left-1 rounded-sm bg-primary px-1 py-0.5 text-[10px] font-medium text-primary-foreground">
            Hlavní
        </span>
    ) : (
        <Button
            variant="outline"
            size="sm"
            className="absolute bottom-1 left-1 h-6 px-2 py-1 text-[10px] bg-white/80 hover:bg-white"
            onClick={() => onSetCover(imageId)}
            disabled={disabled}
        >
            <ImageIcon className="mr-1 h-3 w-3" />
            Nastavit jako hlavní
        </Button>
    );
}
