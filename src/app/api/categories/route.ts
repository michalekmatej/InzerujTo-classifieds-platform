import { NextResponse } from "next/server";
import { ClassifiedService } from "@/lib/db/models/classified";

export async function GET() {
    try {
        const classifiedService = await ClassifiedService.getInstance();
        const categories = await classifiedService.getCategoriesWithCounts();

        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
