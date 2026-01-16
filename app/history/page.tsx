import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import { FloatingBottomNav } from "@/components/FloatingBottomNav";

export default async function HistoryPage() {
    const session = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const transactions = await prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            <Header title="Riwayat Donasi" showBack backUrl="/" />

            <div className="px-4 mt-4 space-y-3">
                {transactions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>Belum ada riwayat transaksi.</p>
                    </div>
                ) : (
                    transactions.map((trx) => (
                        <Card key={trx.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-lg text-primary">
                                            {formatCurrency(Number(trx.amount))}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${trx.status === "VERIFIED"
                                                ? "bg-emerald-100 text-emerald-600"
                                                : "bg-yellow-100 text-yellow-600"
                                            }`}>
                                            {trx.status === "VERIFIED" ? "Berhasil" : "Pending"}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground gap-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="size-3" />
                                            {new Date(trx.createdAt).toLocaleDateString("id-ID", {
                                                day: "numeric", month: "short", year: "numeric"
                                            })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="size-3" />
                                            {new Date(trx.createdAt).toLocaleTimeString("id-ID", {
                                                hour: "2-digit", minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                </div>
                                {trx.status === "VERIFIED" && <CheckCircle className="size-5 text-emerald-500 opacity-20" />}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <FloatingBottomNav />
        </div>
    );
}
