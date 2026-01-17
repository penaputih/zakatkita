import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Newspaper, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // 1. Fetch Stats
    const totalUsers = await prisma.user.count();

    const totalDonasiResult = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: "VERIFIED" }
    });
    const totalDonasi = Number(totalDonasiResult._sum.amount || 0);

    const activeNews = await prisma.news.count();

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const eventsThisMonth = await prisma.event.count({
        where: {
            date: {
                gte: firstDayOfMonth,
                lte: lastDayOfMonth
            }
        }
    });

    const recentTransactions = await prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { status: "VERIFIED" }, // Show verified donations in activity? Or all? Usually verified is better for "Donasi Rp..." text. Let's show all but visual indicator? User asked for "data asli", let's show verified for "recent activity" to match the "Donasi" context, or maybe all. Let's stick to verified for now as valid "Activity". Actually showing all allows seeing pending ones. Let's show all but maybe filter for 'VERIFIED' to be safe or label them. The mock says "Hamba Allah Donasi ...", implies success. I will filter VERIFIED to be safe.
        // Actually, let's show all latest attempts, maybe useful? No, "Recent Activity" usually implies successful actions. I'll stick to VERIFIED.
        include: { user: true }
    });

    const stats = [
        { label: "Total Users", value: totalUsers.toLocaleString("id-ID"), icon: Users, color: "bg-blue-100 text-blue-600" },
        { label: "Total Donasi", value: formatCurrency(totalDonasi), icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
        { label: "Berita Aktif", value: activeNews.toString(), icon: Newspaper, color: "bg-amber-100 text-amber-600" },
        { label: "Event Bulan Ini", value: eventsThisMonth.toString(), icon: Calendar, color: "bg-pink-100 text-pink-600" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.color}`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            {/* <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                            </p> */}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Overview Donasi</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg">
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity (Verified)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTransactions.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">Belum ada transaksi.</p>
                            ) : (
                                recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center gap-4">
                                        <div className="size-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200">
                                            {tx.user?.name ? tx.user.name.substring(0, 2).toUpperCase() : "HA"}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{tx.user?.name || "Hamba Allah"}</p>
                                            <p className="text-xs text-muted-foreground">Donasi {formatCurrency(Number(tx.amount))}</p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {/* Simple time ago - for now just date */}
                                            {new Date(tx.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
