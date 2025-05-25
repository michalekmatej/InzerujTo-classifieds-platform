// "use client";

// import type React from "react";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Loader2, X, Upload, Image as ImageIcon } from "lucide-react";
// import Image from "next/image";

// import { Button } from "@/components/ui/button";
// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import {
//     createClassified,
//     updateClassified,
//     getCategories,
//     uploadImages,
// } from "@/lib/api";
// import type { Classified, Category, Image as ImageType } from "@/lib/types";

// const formSchema = z.object({
//     title: z.string().min(5, "Název musí mít alespoň 5 znaků").max(100),
//     description: z.string().min(20, "Popis musí mít alespoň 20 znaků"),
//     price: z.coerce.number().positive("Cena musí být kladné číslo"),
//     category: z.string().min(1, "Vyberte prosím kategorii"),
//     location: z.string().min(3, "Lokalita musí mít alespoň 3 znaky"),
// });

// interface ClassifiedFormProps {
//     userId: string;
//     classified?: Classified;
// }

// export default function ClassifiedForm({
//     userId,
//     classified,
// }: ClassifiedFormProps) {
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [imageFiles, setImageFiles] = useState<File[]>([]);
//     const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//     const [existingImages, setExistingImages] = useState<ImageType[]>(
//         classified?.images || []
//     );
//     const [categories, setCategories] = useState<Category[]>([]);
//     const router = useRouter();
//     const { toast } = useToast();

//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             title: classified?.title || "",
//             description: classified?.description || "",
//             price: classified?.price || 0,
//             category: classified?.category || "",
//             location: classified?.location || "",
//         },
//     });

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const data = await getCategories();
//                 if (data) {
//                     setCategories(data);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch categories:", error);
//             }
//         };

//         fetchCategories();
//     }, []);

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;

//         const newImageFiles = Array.from(files);
//         setImageFiles((prev) => [...prev, ...newImageFiles]);

//         // Create previews for new files
//         for (let i = 0; i < files.length; i++) {
//             const file = files[i];
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreviews((prev) => [...prev, reader.result as string]);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const removeImagePreview = (index: number) => {
//         setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//         setImageFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     const removeExistingImage = (index: number) => {
//         setExistingImages((prev) => prev.filter((_, i) => i !== index));
//         // In a real implementation, you might want to make an API call to delete the image
//     };

//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//         setIsSubmitting(true);

//         try {
//             let classifiedData: Partial<Classified> = {
//                 ...values,
//                 userId,
//                 images: existingImages, // Include existing images that weren't removed
//             };

//             let classifiedId: string;

//             if (classified) {
//                 // Update existing classified
//                 const updatedClassified = await updateClassified(
//                     classified.id,
//                     classifiedData
//                 );
//                 classifiedId = updatedClassified.id;
//                 toast({
//                     title: "Inzerát aktualizován",
//                     description: "Váš inzerát byl úspěšně aktualizován.",
//                 });
//             } else {
//                 // Create new classified
//                 const newClassified = await createClassified(classifiedData);
//                 classifiedId = newClassified.id;
//                 toast({
//                     title: "Inzerát vytvořen",
//                     description: "Váš inzerát byl úspěšně vytvořen.",
//                 });
//             }

//             // Upload images if any
//             if (imageFiles.length > 0) {
//                 // Upload images
//                 const uploadedImages = await uploadImages(
//                     classifiedId,
//                     imageFiles,
//                     // Mark as cover if no existing images
//                     existingImages.length === 0
//                 );

//                 toast({
//                     title: "Obrázky nahrány",
//                     description: `Úspěšně nahráno ${uploadedImages.length} obrázků.`,
//                 });
//             }

//             // Redirect after successful submission
//             router.push("/dashboard");
//         } catch (error) {
//             console.error("Error submitting classified:", error);
//             toast({
//                 title: "Chyba",
//                 description:
//                     "Nepodařilo se uložit inzerát. Zkuste to prosím znovu.",
//                 variant: "destructive",
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 <FormField
//                     control={form.control}
//                     name="title"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Název</FormLabel>
//                             <FormControl>
//                                 <Input
//                                     placeholder="Zadejte název pro váš inzerát"
//                                     {...field}
//                                 />
//                             </FormControl>
//                             <FormDescription>
//                                 Jasný, stručný název přiláká více zájemců.
//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Popis</FormLabel>
//                             <FormControl>
//                                 <Textarea
//                                     placeholder="Popište detailně váš předmět nebo službu"
//                                     className="min-h-32"
//                                     {...field}
//                                 />
//                             </FormControl>
//                             <FormDescription>
//                                 Uveďte stav, vlastnosti a další relevantní
//                                 detaily.
//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <div className="grid gap-6 md:grid-cols-2">
//                     <FormField
//                         control={form.control}
//                         name="price"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Cena (Kč)</FormLabel>
//                                 <FormControl>
//                                     <Input
//                                         type="number"
//                                         min="0"
//                                         step="0.01"
//                                         {...field}
//                                     />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         control={form.control}
//                         name="category"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Kategorie</FormLabel>
//                                 <Select
//                                     onValueChange={field.onChange}
//                                     defaultValue={field.value}
//                                 >
//                                     <FormControl>
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Vyberte kategorii" />
//                                         </SelectTrigger>
//                                     </FormControl>
//                                     <SelectContent>
//                                         {categories.map((category) => (
//                                             <SelectItem
//                                                 key={category.id}
//                                                 value={category.slug}
//                                             >
//                                                 {category.name}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>

//                 <FormField
//                     control={form.control}
//                     name="location"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Lokalita</FormLabel>
//                             <FormControl>
//                                 <Input placeholder="Město, Kraj" {...field} />
//                             </FormControl>
//                             <FormDescription>
//                                 Zadejte lokalitu, kde je předmět k dispozici.
//                             </FormDescription>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <div className="space-y-4">
//                     <div>
//                         <FormLabel>Obrázky</FormLabel>
//                         <FormDescription>
//                             Nahrajte obrázky vašeho předmětu. Můžete nahrát více
//                             obrázků. První obrázek bude použit jako hlavní
//                             náhled. Max. velikost: 5MB/obrázek.
//                         </FormDescription>
//                         <div className="mt-2 grid gap-4">
//                             <Input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="cursor-pointer"
//                                 multiple
//                             />

//                             {/* Display existing images */}
//                             {existingImages.length > 0 && (
//                                 <div>
//                                     <h4 className="mb-2 font-medium">
//                                         Existující obrázky
//                                     </h4>
//                                     <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//                                         {existingImages.map((image, index) => (
//                                             <div
//                                                 key={image.id}
//                                                 className="relative aspect-square rounded-md border bg-muted"
//                                             >
//                                                 <Image
//                                                     src={image.url}
//                                                     alt={`Obrázek ${index + 1}`}
//                                                     fill
//                                                     className="object-cover rounded-md"
//                                                 />
//                                                 <Button
//                                                     variant="destructive"
//                                                     size="icon"
//                                                     className="absolute right-1 top-1 h-6 w-6"
//                                                     type="button"
//                                                     onClick={() =>
//                                                         removeExistingImage(
//                                                             index
//                                                         )
//                                                     }
//                                                 >
//                                                     <X className="h-4 w-4" />
//                                                 </Button>
//                                                 {image.isCover && (
//                                                     <span className="absolute bottom-1 left-1 rounded-sm bg-primary px-1 py-0.5 text-[10px] font-medium text-primary-foreground">
//                                                         Hlavní
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Display image previews */}
//                             {imagePreviews.length > 0 && (
//                                 <div>
//                                     <h4 className="mb-2 font-medium">
//                                         Nové obrázky
//                                     </h4>
//                                     <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//                                         {imagePreviews.map((preview, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="relative aspect-square rounded-md border bg-muted"
//                                             >
//                                                 <Image
//                                                     src={preview}
//                                                     alt={`Náhled ${index + 1}`}
//                                                     fill
//                                                     className="object-cover rounded-md"
//                                                 />
//                                                 <Button
//                                                     variant="destructive"
//                                                     size="icon"
//                                                     className="absolute right-1 top-1 h-6 w-6"
//                                                     type="button"
//                                                     onClick={() =>
//                                                         removeImagePreview(
//                                                             index
//                                                         )
//                                                     }
//                                                 >
//                                                     <X className="h-4 w-4" />
//                                                 </Button>
//                                                 {index === 0 &&
//                                                     existingImages.length ===
//                                                         0 && (
//                                                         <span className="absolute bottom-1 left-1 rounded-sm bg-primary px-1 py-0.5 text-[10px] font-medium text-primary-foreground">
//                                                             Hlavní
//                                                         </span>
//                                                     )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 <Button
//                     type="submit"
//                     className="w-full bg-orange-600 hover:bg-orange-700"
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting && (
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     )}
//                     {classified ? "Aktualizovat inzerát" : "Přidat inzerát"}
//                 </Button>
//             </form>
//         </Form>
//     );
// }
