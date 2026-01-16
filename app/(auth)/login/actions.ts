"use server";

import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { compare } from "bcryptjs";

export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email dan password wajib diisi." };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: "Email atau password salah." };
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) {
            return { error: "Email atau password salah." };
        }

        if (!user.isVerified && user.role !== "ADMIN") {
            return { error: "Akun Anda belum diverifikasi oleh admin. Harap tunggu persetujuan." };
        }

        // Create session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
        const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, expires });

        (await cookies()).set("session", session, { expires, httpOnly: true });

        return { success: true, role: user.role };
    } catch (error) {
        console.error("Login Error:", error);
        return { error: "Terjadi kesalahan saat login." };
    }
}
