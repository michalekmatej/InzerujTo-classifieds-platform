// "use server";

// import { ModeToggle } from "@/components/mode-toggle";
// import { Button } from "@/components/ui/button";
// import { auth, logout } from "@/lib/auth";
// import Link from "next/link";
// import { redirect } from "next/navigation";

// const HeaderNavigation = async () => {
//     const sesstion = await auth();
//     const user = sesstion?.user;


//     const handleSignOut = () => {
//         logout();
//     }

//     const handleSignIn = () => {
//         redirect("/login");
//     };

//     return (
//         <div className="hidden items-center gap-4 md:flex">
//             <nav className="flex items-center gap-4">
//                 <Link href="/" className="text-sm font-medium">
//                     Domů
//                 </Link>
//                 <Link href="/categories" className="text-sm font-medium">
//                     Kategorie
//                 </Link>
//                 <Link
//                     href="/favorites"
//                     className="text-sm font-medium flex items-center gap-1"
//                 >
//                     Oblíbené
//                 </Link>
//                 {user && (
//                     <Link href="/dashboard" className="text-sm font-medium">
//                         Nástěnka
//                     </Link>
//                 )}
//                 {user?.role === "admin" && (
//                     <Link href="/admin" className="text-sm font-medium">
//                         Admin
//                     </Link>
//                 )}
//             </nav>
//             <div className="flex items-center gap-2">
//                 <ModeToggle />
//                 {user ? (
//                     <Button variant="outline" onClick={handleSignOut}>
//                         Odhlásit se
//                     </Button>
//                 ) : (
//                     <Button
//                         onClick={handleSignIn}
//                         className="bg-orange-600 hover:bg-orange-700"
//                     >
//                         Přihlásit se
//                     </Button>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default HeaderNavigation;