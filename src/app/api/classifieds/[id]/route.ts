import { NextResponse } from "next/server";
import { ClassifiedService } from "@/lib/db/models/classified";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const classifiedService = await ClassifiedService.getInstance();
        const classified = await classifiedService.findById(id);

        if (!classified) {
            return NextResponse.json(
                { error: "Classified not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ classified });
    } catch (error) {
        console.error("Error fetching classified:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Verify the user is authenticated
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        const { id } = params;
        const data = await request.json();

        // Get the classified service
        const classifiedService = await ClassifiedService.getInstance();

        // First check if the classified exists and belongs to the user
        const existingClassified = await classifiedService.findById(id);

        if (!existingClassified) {
            return NextResponse.json(
                { error: "Classified not found" },
                { status: 404 }
            );
        }

        // Check if the user is authorized to update this classified
        if (existingClassified.userId !== user.id && user.role !== "admin") {
            return NextResponse.json(
                { error: "You are not authorized to update this classified" },
                { status: 403 }
            );
        }

        // Update the classified
        const result = await classifiedService.updateClassified(id, data);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Failed to update classified" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            classified: result.classified,
            message: "Classified updated successfully",
        });
    } catch (error) {
        console.error("Error updating classified:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Verify the user is authenticated
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        const { id } = params;

        // Get the classified service
        const classifiedService = await ClassifiedService.getInstance();

        // First check if the classified exists and belongs to the user
        const existingClassified = await classifiedService.findById(id);

        if (!existingClassified) {
            return NextResponse.json(
                { error: "Classified not found" },
                { status: 404 }
            );
        }

        // Check if the user is authorized to delete this classified
        if (existingClassified.userId !== user.id && user.role !== "admin") {
            return NextResponse.json(
                { error: "You are not authorized to delete this classified" },
                { status: 403 }
            );
        }

        // Delete the classified
        const result = await classifiedService.deleteClassified(id);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Failed to delete classified" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Classified deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting classified:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
