"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { login as loginAction } from "./actions";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams.get("registered") === "true";
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        // ... (existing logic)
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await loginAction(null, formData);
            if (result?.error) {
                setError(result.error);
            } else if (result?.success) {
                if (result.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push("/");
                }
            }
        });
    };

    return (
        <Card className="w-full max-w-sm border-none shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-primary">Masuk Akun</CardTitle>
                <CardDescription className="text-center">
                    Masuk untuk mengakses semua fitur
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    {isRegistered && (
                        <div className="bg-emerald-50 text-emerald-800 text-sm p-4 rounded-md flex items-start gap-2 border border-emerald-200">
                            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                            <span>
                                Pendaftaran berhasil! Akun Anda sedang menunggu verifikasi admin. Silahkan cek secara berkala.
                            </span>
                        </div>
                    )}
                    {error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" id="email" type="email" placeholder="user@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input name="password" id="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full font-semibold" disabled={isPending}>
                        {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                        Masuk
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-center w-full text-muted-foreground">
                    Belum punya akun?{" "}
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        Daftar
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Suspense fallback={<Loader2 className="animate-spin" />}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
