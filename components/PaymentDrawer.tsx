"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { CheckCircle2, Loader2, Upload, X, ArrowRight } from "lucide-react";
import { submitTransaction } from "@/app/actions";

interface PaymentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    qrisImage?: string | null;
    bankAccount?: string | null;
    title?: string;
    programId?: string; // New prop
    suggestedAmounts?: number[];
    onSuccess?: (amount: number) => void;
}

export function PaymentDrawer({
    isOpen,
    onClose,
    qrisImage,
    bankAccount,
    title = "Donasi Wakaf",
    programId,
    onSuccess,
    suggestedAmounts = [50000, 100000, 200000, 500000],
}: PaymentDrawerProps) {
    const [step, setStep] = React.useState<"amount" | "payment">("amount");
    const [amount, setAmount] = React.useState<number>(0);
    const [customAmount, setCustomAmount] = React.useState("");

    // Payment State
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    // Reset when closed
    React.useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setStep("amount");
                setAmount(0);
                setCustomAmount("");
                setIsSuccess(false);
                setSelectedFile(null);
                setPreviewUrl(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleAmountSelect = (value: number) => {
        setAmount(value);
        setCustomAmount("");
        setStep("payment");
    };

    const handleCustomAmountSubmit = () => {
        const value = parseInt(customAmount.replace(/\D/g, "") || "0");
        if (value > 0) {
            setAmount(value);
            setStep("payment");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async () => {
        if (!selectedFile || amount <= 0) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("amount", amount.toString());
        formData.append("proofImage", selectedFile.name);
        if (programId) {
            formData.append("programId", programId);
        }
        // Note: In a real app, we might want to pass 'type' (zakat/wakaf) to the action

        const result = await submitTransaction(formData);

        setIsSubmitting(false);
        if (result.success) {
            setIsSuccess(true);
            if (onSuccess) onSuccess(amount);
        }
    };

    const formattedAmount = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="max-h-[85vh] flex flex-col rounded-t-[2rem]">
                <div className="mx-auto w-full max-w-sm flex flex-col h-full min-h-0">
                    <DrawerHeader className="flex-none">
                        <DrawerTitle className="text-center text-xl">
                            {isSuccess ? "Pembayaran Berhasil" : title}
                        </DrawerTitle>
                    </DrawerHeader>

                    <div className="p-4 pb-0 space-y-6 overflow-y-auto flex-1 h-full">
                        {isSuccess ? (
                            <div className="p-6 text-center space-y-4">
                                <div className="size-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <div className="size-8 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                                        <span className="text-emerald-600 text-lg font-bold">✓</span>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Pembayaran Berhasil</h2>
                                <p className="text-muted-foreground text-sm">
                                    Jazakumullah Khairan! donasi Anda telah kami terima dan tercatat dalam sistem. Semoga menjadi amal jariyah.
                                </p>
                            </div>
                        ) : step === "amount" ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-3">
                                    {suggestedAmounts.map((val) => (
                                        <Button
                                            key={val}
                                            variant="outline"
                                            className="h-12 hover:border-primary hover:text-primary hover:bg-primary/5"
                                            onClick={() => handleAmountSelect(val)}
                                        >
                                            <span suppressHydrationWarning>
                                                {new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(val)}
                                            </span>
                                        </Button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Atau masukkan nominal lain</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">Rp</span>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            className="pl-12 h-12 text-lg font-semibold"
                                            placeholder="0"
                                            value={customAmount ? new Intl.NumberFormat("id-ID").format(parseInt(customAmount)) : ""}
                                            onChange={(e) => setCustomAmount(e.target.value.replace(/\D/g, ""))}
                                        />
                                    </div>
                                </div>

                                <Button
                                    className="w-full rounded-full h-12 font-bold mb-4"
                                    onClick={handleCustomAmountSubmit}
                                    disabled={!customAmount || parseInt(customAmount) <= 0}
                                >
                                    Lanjut
                                    <ArrowRight className="ml-2 size-4" />
                                </Button>
                            </div>
                        ) : (
                            // Payment Step
                            <div className="animate-in slide-in-from-right-8 duration-300 pb-4">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="bg-primary/5 px-6 py-3 rounded-xl w-full text-center">
                                        <p className="text-xs text-muted-foreground mb-1">Total Wakaf</p>
                                        <span className="font-bold text-primary text-2xl" suppressHydrationWarning>{formattedAmount}</span>
                                    </div>

                                    <div className="w-full text-center space-y-2">
                                        <span className="text-sm text-muted-foreground">Scan QRIS untuk membayar</span>
                                        <div className="w-48 h-48 bg-white border border-border rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden mx-auto">
                                            {qrisImage ? (
                                                <img src={qrisImage} alt="QRIS" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-muted-foreground/30 font-bold text-3xl select-none">QRIS</div>
                                            )}
                                        </div>
                                        {bankAccount && (
                                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded-lg">
                                                {bankAccount}
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-full space-y-3 pt-2">
                                        <label className="text-sm font-medium block">Upload Bukti Transfer</label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                                {previewUrl ? (
                                                    <div className="relative w-full h-full p-2">
                                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
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
                                                        <Upload className="size-8 text-gray-400 mb-2" />
                                                        <p className="text-xs text-gray-500 text-center px-4">Upload bukti pembayaran</p>
                                                    </div>
                                                )}
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DrawerFooter className="flex-none pt-4 pb-8 sm:pb-6 bg-white dark:bg-slate-950 border-t border-border z-10">
                        {isSuccess ? (
                            <DrawerClose asChild>
                                <Button className="w-full rounded-full h-12" size="lg" onClick={onClose}>Tutup</Button>
                            </DrawerClose>
                        ) : step === "payment" ? (
                            <div className="space-y-3 w-full">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!selectedFile || isSubmitting}
                                    className="w-full rounded-full h-12 text-lg font-semibold"
                                    size="lg"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                                    {isSubmitting ? "Mengirim..." : "Konfirmasi Wakaf"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full rounded-full"
                                    onClick={() => setStep("amount")}
                                    disabled={isSubmitting}
                                >
                                    Kembali
                                </Button>
                            </div>
                        ) : (
                            <DrawerClose asChild>
                                <Button variant="ghost" className="w-full rounded-full h-12 text-muted-foreground">Batal</Button>
                            </DrawerClose>
                        )}
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
