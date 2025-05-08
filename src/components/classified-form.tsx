"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createClassified, updateClassified, getCategories } from "@/lib/api";
import type { Classified, Category } from "@/lib/types";
import { useEffect } from "react";

const formSchema = z.object({
    title: z.string().min(5, "Název musí mít alespoň 5 znaků").max(100),
    description: z.string().min(20, "Popis musí mít alespoň 20 znaků"),
    price: z.coerce.number().positive("Cena musí být kladné číslo"),
    category: z.string().min(1, "Vyberte prosím kategorii"),
    location: z.string().min(3, "Lokalita musí mít alespoň 3 znaky"),
    imageUrl: z.string().optional(),
});

interface ClassifiedFormProps {
    userId: string;
    classified?: Classified;
}

export default function ClassifiedForm({
    userId,
    classified,
}: ClassifiedFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        classified?.imageUrl || null
    );
    const [categories, setCategories] = useState<Category[]>([]);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: classified?.title || "",
            description: classified?.description || "",
            price: classified?.price || 0,
            category: classified?.category || "",
            location: classified?.location || "",
            imageUrl: classified?.imageUrl || "",
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);

        try {
            // In a real app, you would upload the image to a storage service
            // and get back a URL to store in the database
            let imageUrl = values.imageUrl;
            if (imageFile) {
                // Simulate image upload
                imageUrl = URL.createObjectURL(imageFile);
            }

            const classifiedData = {
                ...values,
                imageUrl,
                userId,
            };

            if (classified) {
                await updateClassified(classified.id, classifiedData);
                toast({
                    title: "Inzerát aktualizován",
                    description: "Váš inzerát byl úspěšně aktualizován.",
                });
            } else {
                await createClassified(classifiedData);
                toast({
                    title: "Inzerát vytvořen",
                    description: "Váš inzerát byl úspěšně vytvořen.",
                });
            }

            router.push("/");
        } catch (error) {
            toast({
                title: "Chyba",
                description:
                    "Nepodařilo se uložit inzerát. Zkuste to prosím znovu.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Název</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Zadejte název pro váš inzerát"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Jasný, stručný název přiláká více zájemců.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Popis</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Popište detailně váš předmět nebo službu"
                                    className="min-h-32"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Uveďte stav, vlastnosti a další relevantní
                                detaily.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cena (Kč)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Kategorie</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Vyberte kategorii" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.slug}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lokalita</FormLabel>
                            <FormControl>
                                <Input placeholder="Město, Kraj" {...field} />
                            </FormControl>
                            <FormDescription>
                                Zadejte lokalitu, kde je předmět k dispozici.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Obrázek</FormLabel>
                            <FormControl>
                                <div className="grid gap-4">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="cursor-pointer"
                                    />
                                    {imagePreview && (
                                        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-md border">
                                            <img
                                                src={
                                                    imagePreview ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Náhled"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <Input type="hidden" {...field} />
                                </div>
                            </FormControl>
                            <FormDescription>
                                Nahrajte jasný obrázek vašeho předmětu. Max.
                                velikost: 5MB.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {classified ? "Aktualizovat inzerát" : "Přidat inzerát"}
                </Button>
            </form>
        </Form>
    );
}
