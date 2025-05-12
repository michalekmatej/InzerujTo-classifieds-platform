import { Collection, Db, ObjectId } from "mongodb";
import { compare, hash } from "bcryptjs";
import { getUserCollection } from "@/lib/db/db";

export interface User {
    _id?: ObjectId;
    id?: string;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    image?: string | null;
    createdAt: Date;
    updatedAt?: Date;
}

// centralized user logic
export class UserService {
    private userCollection: Collection<User>;
    private static instance: UserService;
    private constructor(userCollection: Collection<User>) {
        this.userCollection = userCollection;
    }

    public static async getInstance(): Promise<UserService> {
        if (!UserService.instance) {
            const userCollection = await getUserCollection();
            UserService.instance = new UserService(userCollection);
        }
        return UserService.instance;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userCollection.findOne({
            email: {
                $regex: new RegExp(`^${email}$`, "i"),
            },
        });
    }

    async findById(id: string): Promise<User | null> {
        try {
            const objectId = new ObjectId(id);
            return this.userCollection.findOne({ _id: objectId });
        } catch (error) {
            console.error("Invalid ObjectId format", error);
            return null;
        }
    }

    async createUser(userData: {
        name: string;
        email: string;
        password: string;
        role?: "user" | "admin";
    }): Promise<{ success: boolean; user?: User; error?: string }> {
        try {
            const existingUser = await this.findByEmail(userData.email);
            if (existingUser) {
                return { success: false, error: "User already exists" };
            }

            const hashedPassword = await hash(userData.password, 12);

            const newUser: User = {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: userData.role || "user",
                createdAt: new Date(),
            };

            const result = await this.userCollection.insertOne(newUser);

            if (!result.insertedId) {
                return { success: false, error: "Failed to create user" };
            }

            const createdUser = await this.userCollection.findOne({
                _id: result.insertedId,
            });

            if (!createdUser) {
                return {
                    success: false,
                    error: "User created but unable to retrieve",
                };
            }

            return { success: true, user: createdUser };
        } catch (error) {
            console.error("Error creating user:", error);
            return {
                success: false,
                error: "An error occurred during user creation",
            };
        }
    }

    async validateCredentials(
        email: string,
        password: string
    ): Promise<{ success: boolean; user?: User; error?: string }> {
        try {
            const user = await this.findByEmail(email);

            if (!user) {
                return { success: false, error: "User not found" };
            }

            const isPasswordValid = await compare(password, user.password);

            if (!isPasswordValid) {
                return { success: false, error: "Invalid password" };
            }

            return { success: true, user };
        } catch (error) {
            console.error("Error validating credentials:", error);
            return { success: false, error: "Authentication error" };
        }
    }

    async updateUser(
        userId: string,
        updates: Partial<Omit<User, "_id" | "id" | "password">>
    ): Promise<{ success: boolean; user?: User; error?: string }> {
        try {
            const objectId = new ObjectId(userId);

            const updateData = {
                ...updates,
                updatedAt: new Date(),
            };

            const result = await this.userCollection.findOneAndUpdate(
                { _id: objectId },
                { $set: updateData },
                { returnDocument: "after" }
            );

            if (!result) {
                return { success: false, error: "User not found" };
            }

            return { success: true, user: result };
        } catch (error) {
            console.error("Error updating user:", error);
            return { success: false, error: "Failed to update user" };
        }
    }

    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const user = await this.findById(userId);

            if (!user) {
                return { success: false, error: "User not found" };
            }

            const isPasswordValid = await compare(
                currentPassword,
                user.password
            );

            if (!isPasswordValid) {
                return {
                    success: false,
                    error: "Current password is incorrect",
                };
            }

            const hashedPassword = await hash(newPassword, 12);

            await this.userCollection.updateOne(
                { _id: user._id },
                {
                    $set: {
                        password: hashedPassword,
                        updatedAt: new Date(),
                    },
                }
            );

            return { success: true };
        } catch (error) {
            console.error("Error changing password:", error);
            return { success: false, error: "Failed to change password" };
        }
    }

    async listUsers(limit: number = 20, skip: number = 0): Promise<User[]> {
        try {
            const users = await this.userCollection
                .find({})
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .toArray();

            return users;
        } catch (error) {
            console.error("Error listing users:", error);
            return [];
        }
    }

    async deleteUser(
        userId: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const objectId = new ObjectId(userId);
            const result = await this.userCollection.deleteOne({
                _id: objectId,
            });

            if (result.deletedCount === 0) {
                return {
                    success: false,
                    error: "User not found or already deleted",
                };
            }

            return { success: true };
        } catch (error) {
            console.error("Error deleting user:", error);
            return { success: false, error: "Failed to delete user" };
        }
    }
}
