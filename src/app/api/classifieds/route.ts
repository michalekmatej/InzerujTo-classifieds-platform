import { NextResponse } from "next/server";
import { ClassifiedService } from "@/lib/db/models/classified";
import { getCurrentUser } from "@/lib/auth/session";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
    try {
        // Verify the user is authenticated
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Parse the request body
        const data = await request.json();

        // Validate input data
        if (
            !data.title ||
            !data.description ||
            !data.price ||
            !data.category ||
            !data.location
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get the classified service
        const classifiedService = await ClassifiedService.getInstance();


        // Add userId from the authenticated user
        const classifiedData = {
            ...data,
            userId: user.id
        };

        // Create the classified
        const result = await classifiedService.createClassified(classifiedData);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || "Failed to create classified" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                classified: result.classified,
                message: "Classified created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating classified:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        // Get URL parameters
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const query = searchParams.get("q");
        const limitParam = searchParams.get("limit");
        const skipParam = searchParams.get("skip");

        // Parse limit and skip to numbers with defaults
        const limit = limitParam ? parseInt(limitParam, 10) : 20;
        const skip = skipParam ? parseInt(skipParam, 10) : 0;

        // Get the classified service
        const classifiedService = await ClassifiedService.getInstance();

        // Set up filter object
        const filter = {
            category: category || undefined,
            query: query || undefined,
            limit,
            skip,
        };

        // Get classifieds with filters
        const classifieds = await classifiedService.listClassifieds(filter);

        // Get total count for pagination if needed
        const totalCount = await classifiedService.countClassifieds(filter);

        return NextResponse.json(
            {
                classifieds,
                meta: {
                    total: totalCount,
                    limit,
                    skip,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching classifieds:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
