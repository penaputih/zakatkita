"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, KeyRound, Loader2, LogOut, Phone, User as UserIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { changePassword, logout, updateProfile } from "./actions";
import { ImageUpload } from "@/components/ImageUpload";
import { toast } from "sonner"; // Assuming sonner or use window.alert if not available

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    image?: string | null;
    role: string;
}

export function ProfileForm({ user }: { user: UserProfile }) {
    const [isPending, startTransition] = useTransition();
    const [editOpen, setEditOpen] = useState(false);
    const [passwordOpen, setPasswordOpen] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await updateProfile(formData);
            if (res.success) {
                setEditOpen(false);
                alert("Profil berhasil diperbarui");
            } else {
                alert(res.error);
            }
        });
    };

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            const res = await changePassword(formData);
            if (res.success) {
                setPasswordOpen(false);
                alert("Password berhasil diubah");
            } else {
                alert(res.error);
            }
        });
    };

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center relative">
                    <div className="relative mb-4">
                        <Avatar className="size-24 border-4 border-white shadow-lg">
                            <AvatarImage src={user.image || "/images/avatar-default.png"} className="object-cover" />
                            <AvatarFallback className="text-2xl">{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-0 right-0 rounded-full h-8 w-8 border-2 border-white shadow-sm"
                            onClick={() => setEditOpen(true)}
                        >
                            <Camera className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h2>
                    <p className="text-muted-foreground text-sm mb-2">{user.email}</p>
                    {user.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground bg-slate-50 px-3 py-1 rounded-full mb-2">
                            <Phone className="size-3" />
                            <span>{user.phone}</span>
                        </div>
                    )}
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold tracking-wider uppercase">
                        {user.role}
                    </span>
                </CardContent>
            </Card>

            <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12 bg-white text-slate-700 border-slate-200" onClick={() => setEditOpen(true)}>
                    <UserIcon className="size-4 mr-3 text-primary" />
                    <span className="font-medium">Edit Profil</span>
                </Button>

                <Button variant="outline" className="w-full justify-start h-12 bg-white text-slate-700 border-slate-200" onClick={() => setPasswordOpen(true)}>
                    <KeyRound className="size-4 mr-3 text-primary" />
                    <span className="font-medium">Ganti Password</span>
                </Button>

                <form action={logout}>
                    <Button variant="outline" className="w-full justify-start h-12 bg-white border-destructive/20 hover:bg-destructive/5 text-destructive">
                        <LogOut className="size-4 mr-3" />
                        <span className="font-medium">Keluar Aplikasi</span>
                    </Button>
                </form>
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Edit Profil</DialogTitle>
                        <DialogDescription>
                            Ubah informasi profil Anda di sini.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                        <div className="flex justify-center mb-4">
                            <ImageUpload
                                id="image"
                                name="image"
                                label=""
                                defaultImage={user.image}
                                folder="avatars"
                                className="w-32 h-32 rounded-full mx-auto"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" name="name" defaultValue={user.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">No. WhatsApp</Label>
                            <Input id="phone" name="phone" defaultValue={user.phone || ""} placeholder="081234567890" />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                                Simpan Perubahan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Ganti Password</DialogTitle>
                        <DialogDescription>
                            Masukkan password saat ini dan password baru.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Password Saat Ini</Label>
                            <Input id="currentPassword" name="currentPassword" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Password Baru</Label>
                            <Input id="newPassword" name="newPassword" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" required />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                                Ganti Password
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
