import { NextRequest, NextResponse } from "next/server";
import {
    getFileInfoFromGridFS,
    getFileStreamFromGridFS,
} from "@/lib/db/gridfs-server";

// GET endpoint to fetch an image by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Get file info to check if it exists and get content type
        const fileInfo = await getFileInfoFromGridFS(id);

        if (!fileInfo) {
            return NextResponse.json(
                { error: "Image not found" },
                { status: 404 }
            );
        }

        // Get file stream from GridFS
        const stream = await getFileStreamFromGridFS(id);
        // Return the image as a stream
        return new NextResponse(stream as any, {
            headers: {
                "Content-Type": fileInfo.contentType,
                "Cache-Control": "public, max-age=31536000", // 1 year caching
            },
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
