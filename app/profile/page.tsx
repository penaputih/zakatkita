import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { FloatingBottomNav } from "@/components/FloatingBottomNav";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
    const session = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        redirect("/login"); // Should not happen if session valid but good safety
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
            <Header title="Akun Saya" showBack backUrl="/" />

            <div className="px-4 mt-6">
                <ProfileForm user={{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    image: user.image
                }} />
            </div>

            <FloatingBottomNav />
        </div>
    );
}
