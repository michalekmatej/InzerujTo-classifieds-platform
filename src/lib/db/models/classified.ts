import { Collection, ObjectId } from "mongodb";
import { getClassifiedCollection } from "@/lib/db/db";
import { Classified, ClassifiedFilter } from "@/lib/types";

// Centralized classified logic
export class ClassifiedService {
    private classifiedCollection: Collection<Classified>;
    private static instance: ClassifiedService;

    private constructor(classifiedCollection: Collection<Classified>) {
        this.classifiedCollection = classifiedCollection;
    }

    public static async getInstance(): Promise<ClassifiedService> {
        if (!ClassifiedService.instance) {
            const classifiedCollection = await getClassifiedCollection();
            ClassifiedService.instance = new ClassifiedService(
                classifiedCollection
            );
        }
        return ClassifiedService.instance;
    }

    async findById(id: string): Promise<Classified | null> {
        try {
            const objectId = new ObjectId(id);
            const classified = await this.classifiedCollection.findOne({ _id: objectId });
            
            if (!classified) {
                return null;
            }
            
            // Transform MongoDB _id to id expected by frontend
            const { _id, ...rest } = classified as any;
            return {
                id: _id.toString(),
                ...rest
            };
        } catch (error) {
            console.error("Invalid ObjectId format", error);
            return null;
        }
    }

    async listClassifieds(filter?: ClassifiedFilter): Promise<Classified[]> {
        try {
            let query: any = {};

            // Apply filters
            if (filter?.category) {
                query.category = filter.category;
            }

            if (filter?.userId) {
                query.userId = filter.userId;
            }

            if (filter?.query) {
                // Text search across multiple fields
                const searchRegex = new RegExp(filter.query, "i");
                query.$or = [
                    { title: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                    { location: { $regex: searchRegex } },
                ];
            }

            // Create and execute query
            const limit = filter?.limit || 20;
            const skip = filter?.skip || 0;

            const classifieds = await this.classifiedCollection
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .toArray();

            return classifieds.map(classified => {
                const { _id, ...rest } = classified as any;
                return {
                    id: _id.toString(),
                    ...rest
                };
            });
        } catch (error) {
            console.error("Error listing classifieds:", error);
            return [];
        }
    }

    async createClassified(
        classifiedData: Omit<Classified, "id" | "createdAt" | "updatedAt">
    ): Promise<{ success: boolean; classified?: Classified; error?: string }> {
        try {
            const newClassified: Omit<Classified, "id"> = {
                ...classifiedData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const result = await this.classifiedCollection.insertOne(
                newClassified as any
            );

            if (!result.insertedId) {
                return { success: false, error: "Failed to create classified" };
            }

            const createdClassified = await this.classifiedCollection.findOne({
                _id: result.insertedId,
            });

            if (!createdClassified) {
                return {
                    success: false,
                    error: "Classified created but unable to retrieve",
                };
            }

            return { success: true, classified: createdClassified };
        } catch (error) {
            console.error("Error creating classified:", error);
            return {
                success: false,
                error: "An error occurred during classified creation",
            };
        }
    }

    async updateClassified(
        id: string,
        updates: Partial<
            Omit<Classified, "id" | "userId" | "createdAt" | "updatedAt">
        >
    ): Promise<{ success: boolean; classified?: Classified; error?: string }> {
        try {
            const objectId = new ObjectId(id);

            const updateData = {
                ...updates,
                updatedAt: new Date().toISOString(),
            };

            const result = await this.classifiedCollection.findOneAndUpdate(
                { _id: objectId },
                { $set: updateData },
                { returnDocument: "after" }
            );

            if (!result) {
                return { success: false, error: "Classified not found" };
            }

            return { success: true, classified: result };
        } catch (error) {
            console.error("Error updating classified:", error);
            return { success: false, error: "Failed to update classified" };
        }
    }

    async deleteClassified(
        id: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const objectId = new ObjectId(id);
            const result = await this.classifiedCollection.deleteOne({
                _id: objectId,
            });

            if (result.deletedCount === 0) {
                return {
                    success: false,
                    error: "Classified not found or already deleted",
                };
            }

            return { success: true };
        } catch (error) {
            console.error("Error deleting classified:", error);
            return { success: false, error: "Failed to delete classified" };
        }
    }

    async countClassifieds(filter?: ClassifiedFilter): Promise<number> {
        try {
            let query: any = {};

            // Apply filters
            if (filter?.category) {
                query.category = filter.category;
            }

            if (filter?.userId) {
                query.userId = filter.userId;
            }

            if (filter?.query) {
                const searchRegex = new RegExp(filter.query, "i");
                query.$or = [
                    { title: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                    { location: { $regex: searchRegex } },
                ];
            }

            return await this.classifiedCollection.countDocuments(query);
        } catch (error) {
            console.error("Error counting classifieds:", error);
            return 0;
        }
    }

    async listClassifiedsByUser(
        userId: string,
        limit: number = 20,
        skip: number = 0
    ): Promise<Classified[]> {
        try {
            const classifieds = await this.classifiedCollection
                .find({ userId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .toArray();

            // Transform MongoDB _id to id expected by frontend
            return classifieds.map((classified) => {
                const { _id, ...rest } = classified as any;
                return {
                    id: _id.toString(),
                    ...rest,
                };
            });
        } catch (error) {
            console.error("Error listing classifieds by user:", error);
            return [];
        }
    }
}
