"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Newspaper,
    Calendar,
    Megaphone,
    Settings,
    LayoutGrid,
    LogOut,
    Menu,
    Image as ImageIcon,
    Monitor,
    Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Berita & Update", href: "/admin/news", icon: Newspaper },
    { label: "Jadwal Kajian", href: "/admin/events", icon: Calendar },
    { label: "Manajemen Menu", href: "/admin/menu", icon: LayoutGrid },
    { label: "Kategori Donasi", href: "/admin/categories", icon: Tag },
    { label: "Program Donasi", href: "/admin/campaigns", icon: Megaphone },
    { label: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background lg:flex fixed h-full z-30">
                <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
                    <Link href="/admin" className="flex items-center gap-2 font-semibold">
                        <span className="text-xl text-primary">ZakatKita Admin</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                    pathname === item.href && "bg-muted text-primary"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                        {/* Added new links */}
                        <Link
                            href="/admin/banners"
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                pathname === "/admin/banners" && "bg-muted text-primary"
                            )}
                        >
                            <ImageIcon className="h-4 w-4" />
                            Banner Widget
                        </Link>
                        <Link
                            href="/admin/widgets"
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                pathname === "/admin/widgets" && "bg-muted text-primary"
                            )}
                        >
                            <Monitor className="h-4 w-4" />
                            Kelola Widget
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t">
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">Admin User</p>
                            <p className="text-xs text-muted-foreground">admin@zakatkita.com</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start gap-2" size="sm">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Nav */}
            <div className="flex flex-col flex-1 lg:pl-64">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-6 lg:h-[60px] sticky top-0 z-20">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 lg:hidden"
                                suppressHydrationWarning
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <div className="sr-only">
                                <SheetTitle>Navigation Menu</SheetTitle>
                                <SheetDescription>
                                    Main navigation for ZakatKita Admin dashboard.
                                </SheetDescription>
                            </div>
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 text-lg font-semibold mb-4 text-primary"
                                >
                                    ZakatKita Admin
                                </Link>
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground",
                                            pathname === item.href && "bg-muted text-foreground"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <h1 className="text-lg font-semibold">{navItems.find(n => n.href === pathname)?.label || "Dashboard"}</h1>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6 mb-12">
                    {children}
                </main>
            </div>
        </div>
    );
}
