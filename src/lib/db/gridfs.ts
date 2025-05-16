import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import getDbClient, { getClassifiedCollection } from "./db";
import { Image } from "../types";

class GridFSService {
    private static instance: GridFSService;
    private bucket: GridFSBucket | null = null;
    private client: MongoClient | null = null;

    private constructor() {}

    public static async getInstance(): Promise<GridFSService> {
        if (!GridFSService.instance) {
            GridFSService.instance = new GridFSService();
        }

        // Initialize bucket if not already done
        if (!GridFSService.instance.bucket) {
            await GridFSService.instance.initialize();
        }

        return GridFSService.instance;
    }

    private async initialize() {
        try {
            // Get MongoDB client
            this.client = await getDbClient();
            const db = this.client.db("classifieds");
            // const classifieldCollection = await getClassifiedCollection();

            // Create GridFS bucket
            this.bucket = new GridFSBucket(db, {
                bucketName: "images",
                chunkSizeBytes: 1048576, // 1MB chunks
            });
        } catch (error) {
            console.error("Error initializing GridFS bucket:", error);
            throw new Error("Failed to initialize GridFS");
        }
    }

    /**
     * Store a file in GridFS
     */
    async storeFile(
        file: Buffer,
        filename: string,
        contentType: string,
        metadata: Record<string, any> = {}
    ): Promise<Image | null> {
        if (!this.bucket) {
            await this.initialize();
        }

        try {
            // Create a unique filename to avoid collisions
            const uniqueFilename = `${Date.now()}-${filename}`;

            // Upload file to GridFS
            const uploadStream = this.bucket!.openUploadStream(uniqueFilename, {
                contentType,
                metadata: {
                    ...metadata,
                    uploadedAt: new Date(),
                },
            });

            // Convert stream to promise
            const fileId = await new Promise<ObjectId>((resolve, reject) => {
                uploadStream.on("error", reject);
                uploadStream.on("finish", () => {
                    resolve(uploadStream.id as ObjectId);
                });

                // Write file data to stream
                uploadStream.write(file);
                uploadStream.end();
            });

            // Get file info
            const fileInfo = await this.getFileInfo(fileId.toString());
            if (!fileInfo) {
                throw new Error("Failed to get file info after upload");
            }

            return fileInfo;
        } catch (error) {
            console.error("Error storing file in GridFS:", error);
            return null;
        }
    }

    /**
     * Get file information
     */
    async getFileInfo(id: string): Promise<Image | null> {
        if (!this.bucket) {
            await this.initialize();
        }

        try {
            // Find file by ID
            const db = this.client!.db("classifieds");
            const filesCollection = db.collection("images.files");
            const objectId = new ObjectId(id);

            const fileInfo = await filesCollection.findOne({ _id: objectId });
            if (!fileInfo) {
                return null;
            }

            // Transform to our Image type
            return {
                id: fileInfo._id.toString(),
                filename: fileInfo.filename,
                contentType: fileInfo.contentType,
                size: fileInfo.length,
                url: `/api/images/${fileInfo._id}`,
                isCover: fileInfo.metadata?.isCover || false,
            };
        } catch (error) {
            console.error("Error getting file info:", error);
            return null;
        }
    }

    /**
     * Get file data stream
     */
    getFileStream(id: string) {
        if (!this.bucket) {
            throw new Error("GridFS bucket not initialized");
        }

        try {
            const objectId = new ObjectId(id);
            return this.bucket.openDownloadStream(objectId);
        } catch (error) {
            console.error("Error getting file stream:", error);
            throw new Error("Failed to get file stream");
        }
    }

    /**
     * Delete file from GridFS
     */
    async deleteFile(id: string): Promise<boolean> {
        if (!this.bucket) {
            await this.initialize();
        }

        try {
            const objectId = new ObjectId(id);
            await this.bucket!.delete(objectId);
            return true;
        } catch (error) {
            console.error("Error deleting file from GridFS:", error);
            return false;
        }
    }

    /**
     * Get all files for a classified
     */
    async getFilesForClassified(classifiedId: string): Promise<Image[]> {
        if (!this.bucket) {
            await this.initialize();
        }

        try {
            const db = this.client!.db("classifieds");
            const filesCollection = db.collection("images.files");

            const files = await filesCollection
                .find({
                    "metadata.classifiedId": classifiedId,
                })
                .toArray();

            return files.map((file) => ({
                id: file._id.toString(),
                filename: file.filename,
                contentType: file.contentType,
                size: file.length,
                url: `/api/images/${file._id}`,
                isCover: file.metadata?.isCover || false,
            }));
        } catch (error) {
            console.error("Error getting files for classified:", error);
            return [];
        }
    }
}

export default GridFSService;
