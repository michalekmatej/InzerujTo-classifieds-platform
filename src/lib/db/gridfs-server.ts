"use server";

import GridFSService from "@/lib/db/gridfs";
import { Image } from "@/lib/types";

export async function storeFileInGridFS(
    file: Buffer,
    filename: string,
    contentType: string,
    metadata: Record<string, any> = {}
): Promise<Image | null> {
    const service = await GridFSService.getInstance();
    return service.storeFile(file, filename, contentType, metadata);
}

/**
 * Get file information from GridFS
 */
export async function getFileInfoFromGridFS(id: string): Promise<Image | null> {
    const service = await GridFSService.getInstance();
    return service.getFileInfo(id);
}

/**
 * Get file stream from GridFS
 */
export async function getFileStreamFromGridFS(id: string) {
    const service = await GridFSService.getInstance();
    return service.getFileStream(id);
}

/**
 * Delete file from GridFS
 */
export async function deleteFileFromGridFS(id: string): Promise<boolean> {
    const service = await GridFSService.getInstance();
    return service.deleteFile(id);
}

/**
 * Get all files for a classified from GridFS
 */
export async function getFilesForClassifiedFromGridFS(classifiedId: string): Promise<Image[]> {
    const service = await GridFSService.getInstance();
    return service.getFilesForClassified(classifiedId);
}
