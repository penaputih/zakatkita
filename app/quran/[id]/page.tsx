import { getSurahDetail } from "@/lib/api";
import { Header } from "@/components/Header";
import { AyahList } from "./ayah-list";
import { FloatingBottomNav } from "@/components/FloatingBottomNav";
import { notFound } from "next/navigation";
import { ClientQuranDetail } from "@/components/ClientQuranDetail";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function QuranDetailPage({ params }: PageProps) {
    const { id } = await params;
    const surahNumber = parseInt(id);

    if (isNaN(surahNumber)) notFound();

    const surah = await getSurahDetail(surahNumber);

    if (!surah) {
        return <ClientQuranDetail id={id} />;
    }

    return (
        <main className="min-h-screen bg-white pb-28">
            <Header title={surah.namaLatin} showBack backUrl="/quran" />

            {/* Surah Info Card */}
            <div className="bg-emerald-600 text-white px-6 pt-4 pb-8 -mt-1 rounded-b-[2rem] shadow-lg mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 text-center">
                    <h2 className="font-amiri text-3xl mb-1">{surah.nama}</h2>
                    <p className="text-emerald-100 text-sm">{surah.arti} • {surah.jumlahAyat} Ayat</p>
                    <p className="text-xs text-emerald-200/80 mt-2 max-w-xs mx-auto line-clamp-2">
                        {surah.deskripsi.replace(/<\/?[^>]+(>|$)/g, "")}
                    </p>
                </div>
            </div>

            <div className="px-4">
                <AyahList surah={surah} />
            </div>

            <FloatingBottomNav />
        </main>
    );
}
