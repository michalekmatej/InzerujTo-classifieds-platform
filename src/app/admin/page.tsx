"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Classified, User, CategoryWithCount } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BarChart, PieChart } from "lucide-react";

interface AdminStats {
    userCount: number;
    adminCount: number;
    classifiedCount: number;
    categoriesWithCounts: CategoryWithCount[];
}

interface RecentItems {
    classifieds: Classified[];
    users: User[];
}

export default function AdminPage() {
    const [classifieds, setClassifieds] = useState<Classified[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [recentItems, setRecentItems] = useState<RecentItems | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (!session?.user || session?.user?.role !== "admin") {
            router.push("/");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all data in parallel
                const [classifiedsResponse, usersResponse, statsResponse] =
                    await Promise.all([
                        fetch("/api/classifieds?limit=100"),
                        fetch("/api/users"),
                        fetch("/api/admin/stats"),
                    ]);

                const [classifiedsData, usersData, statsData] =
                    await Promise.all([
                        classifiedsResponse.json(),
                        usersResponse.json(),
                        statsResponse.json(),
                    ]);

                setClassifieds(classifiedsData.classifieds || []);
                setUsers(usersData.users || []);
                setStats(statsData.stats || null);
                setRecentItems(statsData.recent || null);
                setError(null);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                setError("Failed to fetch data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, session]);

    const handleDeleteClassified = async (id: string) => {
        if (!confirm("Opravdu chcete smazat tento inzerát?")) return;

        try {
            await fetch(`/api/classifieds/${id}`, {
                method: "DELETE",
            });

            // Update the list after deletion
            setClassifieds(classifieds.filter((item) => item.id !== id));

            // Show success alert using the browser's built-in alert
            alert("Inzerát byl úspěšně smazán");
        } catch (err) {
            console.error("Error deleting classified:", err);
            setError("Nepodařilo se smazat inzerát");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-center items-center h-48">
                            <div className="text-center">
                                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent mx-auto"></div>
                                <p>Načítání administračních dat...</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="border-destructive">
                    <CardContent className="pt-6">
                        <div className="flex justify-center items-center h-48">
                            <div className="text-center">
                                <p className="text-destructive">{error}</p>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="mt-4"
                                >
                                    Zkusit znovu
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-orange-600">
                Administrační panel
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border border-muted">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            Celkem inzerátů
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-orange-600">
                            {stats?.classifiedCount || classifieds.length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border border-muted">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            Celkem uživatelů
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-orange-600">
                            {stats?.userCount || users.length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border border-muted">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            Administrátoři
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-orange-600">
                            {stats?.adminCount ||
                                users.filter((user) => user.role === "admin")
                                    .length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="border border-muted">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center">
                            <BarChart className="w-4 h-4 mr-2 text-orange-600" />
                            Poslední inzeráty
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Nejnovější inzeráty na platformě
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentItems?.classifieds?.map((classified) => (
                                <div
                                    key={classified.id}
                                    className="border-b pb-2"
                                >
                                    <div className="font-medium text-sm">
                                        {classified.title}
                                    </div>
                                    <div className="flex text-xs text-muted-foreground">
                                        <span className="flex-1">
                                            {classified.category}
                                        </span>
                                        <span className="flex-1">
                                            {formatPrice(classified.price)}
                                        </span>
                                        <span className="text-end">
                                            {formatDate(classified.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-muted">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center">
                            <PieChart className="w-4 h-4 mr-2 text-orange-600" />
                            Poslední uživatelé
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Nejnovější registrovaní uživatelé
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentItems?.users?.map((user) => (
                                <div key={user.id} className="border-b pb-2">
                                    <div className="font-medium text-sm">
                                        {user.name}
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{user.email}</span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs ${
                                                user.role === "admin"
                                                    ? "bg-orange-100 text-orange-600"
                                                    : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            {user.role === "admin"
                                                ? "Admin"
                                                : "Uživatel"}
                                        </span>
                                        <span>
                                            {user.createdAt
                                                ? formatDate(user.createdAt)
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="classifieds">
                <TabsList className="mb-4">
                    <TabsTrigger value="classifieds">Inzeráty</TabsTrigger>
                    <TabsTrigger value="users">Uživatelé</TabsTrigger>
                    <TabsTrigger value="categories">Kategorie</TabsTrigger>
                </TabsList>

                <TabsContent value="classifieds">
                    <Card className="border border-muted">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                                Všechny inzeráty
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs">
                                                Název
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Kategorie
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Cena
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                ID uživatele
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Vytvořeno
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Akce
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {classifieds.map((classified) => (
                                            <TableRow key={classified.id}>
                                                <TableCell className="font-medium text-sm">
                                                    {classified.title}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {classified.category}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {formatPrice(
                                                        classified.price
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {classified.userId}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {formatDate(
                                                        classified.createdAt
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 text-xs"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/classifieds/${classified.id}`
                                                                )
                                                            }
                                                        >
                                                            Zobrazit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-8 text-xs"
                                                            onClick={() =>
                                                                handleDeleteClassified(
                                                                    classified.id
                                                                )
                                                            }
                                                        >
                                                            Smazat
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card className="border border-muted">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                                Všichni uživatelé
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs">
                                                ID
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Jméno
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Email
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Role
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Registrace
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium text-sm">
                                                    {user.id}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs ${
                                                            user.role ===
                                                            "admin"
                                                                ? "bg-orange-100 text-orange-600"
                                                                : "bg-muted text-muted-foreground"
                                                        }`}
                                                    >
                                                        {user.role === "admin"
                                                            ? "Admin"
                                                            : "Uživatel"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {user.createdAt
                                                        ? formatDate(
                                                              user.createdAt
                                                          )
                                                        : "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categories">
                    <Card className="border border-muted">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                                Přehled kategorií
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs">
                                                Název
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Slug
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Počet
                                            </TableHead>
                                            <TableHead className="text-xs">
                                                Distribuce
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stats?.categoriesWithCounts?.map(
                                            (category) => (
                                                <TableRow key={category.id}>
                                                    <TableCell className="font-medium text-sm">
                                                        {category.name}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {category.slug}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {category.count}
                                                    </TableCell>
                                                    <TableCell className="w-[300px]">
                                                        <div className="w-full bg-muted rounded-full h-2">
                                                            <div
                                                                className="bg-orange-600 h-2 rounded-full"
                                                                style={{
                                                                    width: `${
                                                                        (category.count /
                                                                            stats.classifiedCount) *
                                                                        100
                                                                    }%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
