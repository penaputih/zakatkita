"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTransition, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { register } from "./actions";

export default function RegisterPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await register(null, formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-sm border-none shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">Daftar Akun</CardTitle>
                    <CardDescription className="text-center">
                        Buat akun untuk memantau riwayat zakat Anda
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input name="name" id="name" type="text" placeholder="Fulan bin Fulan" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" id="email" type="email" placeholder="nama@email.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input name="password" id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full font-semibold" disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Daftar
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full text-muted-foreground">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Masuk
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
