"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Calculator, ArrowRight, Upload, CheckCircle2, Loader2, X } from "lucide-react";
import { submitTransaction } from "@/app/actions";

export function CalculatorCard({ qrisImage, programId }: { qrisImage?: string; programId?: string }) {
    const [inputValue, setInputValue] = React.useState("");
    const [zakatAmount, setZakatAmount] = React.useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove non-digit characters
        const rawValue = e.target.value.replace(/\D/g, "");
        setInputValue(rawValue);

        // Calculate 2.5%
        const amount = parseInt(rawValue || "0", 10);
        setZakatAmount(Math.floor(amount * 0.025));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handlePayment = async () => {
        if (!selectedFile) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("amount", zakatAmount.toString());
        formData.append("proofImage", selectedFile.name);
        if (programId) {
            formData.append("programId", programId);
        }

        const result = await submitTransaction(formData);

        setIsSubmitting(false);
        if (result.success) {
            setIsSuccess(true);
        }
    };

    const resetForm = () => {
        setIsSuccess(false);
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const formattedValue = React.useMemo(() => {
        if (!inputValue) return "";
        return new Intl.NumberFormat("id-ID", {
            style: "decimal",
            maximumFractionDigits: 0,
        }).format(parseInt(inputValue, 10));
    }, [inputValue]);

    const formattedZakat = React.useMemo(() => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(zakatAmount);
    }, [zakatAmount]);

    return (
        <Card className="border-none shadow-xl shadow-primary/5 rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 pb-8 pt-6">
                <CardTitle className="flex items-center gap-2 text-primary text-lg">
                    <Calculator className="size-5" />
                    Hitung Zakat
                </CardTitle>
            </CardHeader>
            <CardContent className="-mt-4 space-y-6 bg-card px-6 pb-8 pt-6 rounded-t-3xl border-t border-border">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Masukkan Rezeki Hari Ini
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                            Rp
                        </span>
                        <Input
                            type="text"
                            inputMode="numeric"
                            value={formattedValue}
                            onChange={handleInputChange}
                            className="pl-12 h-14 text-lg font-semibold rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="rounded-xl bg-primary/10 p-4 flex flex-col items-center justify-center gap-1 border border-primary/20">
                    <span className="text-sm font-medium text-primary/80">
                        Zakat Kamu (2.5%)
                    </span>
                    <span className="text-2xl font-bold text-primary">
                        {formattedZakat}
                    </span>
                </div>

                <Drawer
                    open={isDrawerOpen}
                    onOpenChange={(open) => {
                        if (!open) {
                            setIsDrawerOpen(false);
                            setTimeout(resetForm, 300);
                        } else {
                            setIsDrawerOpen(true);
                        }
                    }}
                >
                    <DrawerTrigger asChild>
                        <Button
                            className="w-full h-14 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold"
                            size="lg"
                            disabled={zakatAmount <= 0}
                        >
                            Bayar Sekarang
                            <ArrowRight className="ml-2 size-5" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[85vh] flex flex-col rounded-t-[2rem]">
                        <div className="mx-auto w-full max-w-sm flex flex-col h-full min-h-0">
                            <DrawerHeader className="flex-none">
                                <DrawerTitle className="text-center text-xl">
                                    {isSuccess ? "Pembayaran Berhasil" : "Konfirmasi Pembayaran"}
                                </DrawerTitle>
                            </DrawerHeader>

                            <div className="p-4 pb-0 space-y-6 overflow-y-auto flex-1">
                                {isSuccess ? (
                                    <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                                        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="size-10 text-primary" />
                                        </div>
                                        <p className="text-center text-muted-foreground">
                                            Terima kasih! Bukti pembayaran zakat Anda telah kami terima dan
                                            sedang diverifikasi.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col items-center space-y-3">
                                            <span className="text-sm text-muted-foreground">Scan QRIS untuk membayar</span>
                                            {/* Placeholder QRIS */}
                                            <div className="w-48 h-48 bg-white border border-border rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden">
                                                {qrisImage ? (
                                                    <img src={qrisImage} alt="QRIS" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground/30 font-bold text-3xl select-none">QRIS</div>
                                                )}
                                            </div>
                                            <div className="bg-primary/5 px-4 py-2 rounded-lg">
                                                <span className="font-bold text-primary text-lg">{formattedZakat}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pb-4">
                                            <label className="text-sm font-medium block">Upload Bukti Transfer</label>
                                            <div className="flex items-center justify-center w-full">
                                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                                                    {previewUrl ? (
                                                        <div className="relative w-full h-full p-2">
                                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setPreviewUrl(null);
                                                                    setSelectedFile(null);
                                                                }}
                                                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                                                            >
                                                                <X className="size-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <Upload className="size-8 text-gray-400 dark:text-slate-500 mb-2" />
                                                            <p className="text-xs text-gray-500 dark:text-slate-400 text-center px-4">Tap to upload proof image</p>
                                                        </div>
                                                    )}
                                                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <DrawerFooter className="flex-none pt-4 pb-8 sm:pb-6 bg-white dark:bg-slate-950 border-t border-border z-10">
                                {isSuccess ? (
                                    <DrawerClose asChild>
                                        <Button className="w-full rounded-full h-12" size="lg" onClick={() => {
                                            resetForm();
                                            setInputValue("");
                                            setZakatAmount(0);
                                        }}>Tutup</Button>
                                    </DrawerClose>
                                ) : (
                                    <Button
                                        onClick={handlePayment}
                                        disabled={!selectedFile || isSubmitting}
                                        className="w-full rounded-full h-12 text-lg font-semibold"
                                        size="lg"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                                        {isSubmitting ? "Mengirim..." : "Konfirmasi Pembayaran"}
                                    </Button>
                                )}
                                {!isSuccess && (
                                    <DrawerClose asChild>
                                        <Button variant="outline" className="w-full rounded-full h-12 border-none text-muted-foreground hover:bg-transparent hover:text-foreground">Batal</Button>
                                    </DrawerClose>
                                )}
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
            </CardContent>
        </Card>
    );
}
