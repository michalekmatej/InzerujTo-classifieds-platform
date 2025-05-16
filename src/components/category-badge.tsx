import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/api";

const CategoryBadge = ({ categorySlug }: { categorySlug: string }) => {
    const category = categories.find((cat) => cat.slug === categorySlug)?.name;
    if (!category) {
        return null;
    }
    return (<Badge variant="outline">{category}</Badge>)

}

export default CategoryBadge;