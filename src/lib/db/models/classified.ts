import { Collection, ObjectId } from "mongodb";
import { getClassifiedCollection } from "@/lib/db/db";
import { Category, Classified, ClassifiedFilter } from "@/lib/types";
import { categories } from "@/lib/api";

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
            const classified = await this.classifiedCollection.findOne({
                _id: objectId,
            });

            if (!classified) {
                return null;
            }

            // transform MongoDB _id to id expected by frontend
            const { _id, ...rest } = classified as any;
            return {
                id: _id.toString(),
                ...rest,
            };
        } catch (error) {
            console.error("Invalid ObjectId format", error);
            return null;
        }
    }

    async listClassifieds(filter?: ClassifiedFilter): Promise<Classified[]> {
        try {
            let query: any = {};

            // apply filters
            if (filter?.category) {
                query.category = filter.category;
            }

            if (filter?.userId) {
                query.userId = filter.userId;
            }

            if (filter?.query) {
                // text search across multiple fields
                const searchRegex = new RegExp(filter.query, "i");
                query.$or = [
                    { title: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } },
                    { location: { $regex: searchRegex } },
                ];
            }

            // create and execute query
            const limit = filter?.limit || 20;
            const skip = filter?.skip || 0;

            const classifieds = await this.classifiedCollection
                .find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .toArray();

            return classifieds.map((classified) => {
                const { _id, ...rest } = classified as any;
                return {
                    id: _id.toString(),
                    ...rest,
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
            const newClassified = {
                ...classifiedData,
                // userId: new ObjectId(classifiedData.userId),
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

            // Transform MongoDB _id to id expected by frontend
            const { _id, ...rest } = createdClassified as any;
            const transformedClassified = {
                id: _id.toString(),
                ...rest,
            };

            return { success: true, classified: transformedClassified };
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

            // Transform MongoDB _id to id expected by frontend
            const { _id, ...rest } = result as any;
            const transformedClassified = {
                id: _id.toString(),
                ...rest,
            };

            return { success: true, classified: transformedClassified };
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

            // transform MongoDB _id to id expected by frontend
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

    async getCategoriesWithCounts(): Promise<Category[]> {
        try {
            // aggregate classifieds to group by category and count them
            const categoryCounts = await this.classifiedCollection
                .aggregate([
                    // group by category
                    {
                        $group: {
                            _id: "$category",
                            count: { $sum: 1 },
                        },
                    },
                    // sort by category name for consistency
                    {
                        $sort: { _id: 1 },
                    },
                ])
                .toArray();

            const categoriesWithCount: Omit<Category, "name">[] =
                categoryCounts.map((result: any) => {
                    const slug = result._id;
                    return {
                        id: slug, // using slug as ID for simplicity
                        slug: slug,
                        count: result.count,
                    };
                });

            // add name from categories to categoriesWithCount
            const categoriesWithName = categoriesWithCount.map((category) => {
                const categoryData = categories.find(
                    (cat) => cat.slug === category.slug
                );
                return {
                    ...category,
                    name: categoryData ? categoryData.name : category.slug,
                };
            });
            return categoriesWithName;
        } catch (error) {
            console.error("Error getting categories with counts:", error);
            return [];
        }
    }

    async getRecentClassifieds(limit: number = 5): Promise<Classified[]> {
        try {
            const classifieds = await this.classifiedCollection
                .find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .toArray();

            return classifieds.map((classified) => {
                const { _id, ...rest } = classified as any;
                return {
                    id: _id.toString(),
                    ...rest,
                };
            });
        } catch (error) {
            console.error("Error fetching recent classifieds:", error);
            return [];
        }
    }
}
