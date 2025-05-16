import { NextRequest, NextResponse } from "next/server";
import {
    storeFileInGridFS,
    getFilesForClassifiedFromGridFS,
} from "@/lib/db/gridfs-server";
import { getCurrentUser } from "@/lib/auth/session";

// Multipart form parser function
async function parseMultipartForm(request: NextRequest) {
    const formData = await request.formData();
    const files: { buffer: Buffer; filename: string; contentType: string }[] =
        [];
    const fields: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            const buffer = Buffer.from(await value.arrayBuffer());
            files.push({
                buffer,
                filename: value.name,
                contentType: value.type,
            });
        } else {
            fields[key] = value;
        }
    }

    return { files, fields };
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Parse multipart form data
        const { files, fields } = await parseMultipartForm(request);

        if (files.length === 0) {
            return NextResponse.json(
                { error: "No files uploaded" },
                { status: 400 }
            );
        }

        // Required field
        const classifiedId = fields.classifiedId;
        if (!classifiedId) {
            return NextResponse.json(
                { error: "Missing classifiedId" },
                { status: 400 }
            );
        } // Optional field - mark as cover image
        const isCover = fields.isCover === "true";

        // Process files
        const uploadedImages = [];

        for (const file of files) {
            // Store file in GridFS with metadata
            const result = await storeFileInGridFS(
                file.buffer,
                file.filename,
                file.contentType,
                {
                    classifiedId,
                    userId: user.id,
                    isCover: uploadedImages.length === 0 && isCover, // First image is cover by default
                }
            );

            if (result) {
                uploadedImages.push(result);
            }
        }

        if (uploadedImages.length === 0) {
            return NextResponse.json(
                { error: "Failed to upload any images" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                images: uploadedImages,
                message: "Images uploaded successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error uploading images:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Add endpoint to get all images for a classified
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const classifiedId = searchParams.get("classifiedId");

        if (!classifiedId) {
            return NextResponse.json(
                { error: "Missing classifiedId parameter" },
                { status: 400 }
            );
        }

        // Get all images for the classified
        const images = await getFilesForClassifiedFromGridFS(classifiedId);

        return NextResponse.json({ images });
    } catch (error) {
        console.error("Error fetching images:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
