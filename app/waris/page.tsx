import { Header } from "@/components/Header";
import { FloatingBottomNav } from "@/components/FloatingBottomNav";
import { WarisCalculator } from "@/components/WarisCalculator";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function WarisPage() {
    const session = await getSession();

    let canAccess = false;
    let isLogin = false;

    if (session?.user?.email) {
        isLogin = true;
        // Fetch fresh user data to verify access
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (user?.role === "ADMIN" || (user as any)?.canAccessWaris) {
            canAccess = true;
        }
    }

    if (!isLogin) {
        return (
            <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 pb-28">
                <div className="print:hidden">
                    <Header
                        title="Kalkulator Waris Islam"
                        showBack
                        backUrl="/"
                    />
                </div>

                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 text-amber-600 dark:text-amber-500">
                        <LogIn className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Login Diperlukan</h2>
                    <p className="text-muted-foreground max-w-md mb-8">
                        Fitur Kalkulator Waris hanya dapat diakses oleh pengguna yang telah terdaftar dan login. Silahkan login terlebih dahulu.
                    </p>
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/login">Login Sekarang</Link>
                    </Button>
                </div>

                <div className="print:hidden">
                    <FloatingBottomNav />
                </div>
            </main>
        );
    }

    if (!canAccess) {
        return (
            <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 pb-28">
                <div className="print:hidden">
                    <Header
                        title="Kalkulator Waris Islam"
                        showBack
                        backUrl="/"
                        user={session?.user}
                    />
                </div>

                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-600 dark:text-red-500">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Akses Dibatasi</h2>
                    <p className="text-muted-foreground max-w-md mb-8">
                        Maaf, akun Anda belum memiliki izin untuk mengakses fitur Kalkulator Waris. Silahkan hubungi Admin untuk meminta akses.
                    </p>
                    <Button asChild variant="outline" className="rounded-full">
                        <Link href="/">Kembali ke Beranda</Link>
                    </Button>
                </div>

                <div className="print:hidden">
                    <FloatingBottomNav />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-slate-950 pb-28">
            <div className="print:hidden">
                <Header
                    title="Kalkulator Waris Islam"
                    showBack
                    backUrl="/"
                    user={session?.user}
                />
            </div>

            <div className="px-4 py-6 max-w-4xl mx-auto">
                <div className="mb-6 print:hidden">
                    <h2 className="text-xl font-bold mb-2">Hitung Pembagian Waris</h2>
                    <p className="text-muted-foreground text-sm">
                        Alat bantu hitung pembagian harta warisan berdasarkan Syariat Islam (Mazhab Syafi&apos;i).
                    </p>
                </div>

                <WarisCalculator />
            </div>

            <div className="print:hidden">
                <FloatingBottomNav />
            </div>
        </main>
    );
}
