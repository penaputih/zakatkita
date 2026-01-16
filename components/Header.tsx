import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    backUrl?: string;
}

export function Header({ title, showBack, backUrl = "/" }: HeaderProps) {
    const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (
        <header className="px-6 pt-8 pb-4 flex items-center justify-between bg-white dark:bg-slate-950 bg-opacity-95 backdrop-blur-sm border-b border-border/40">
            <div className="flex items-center gap-4">
                {showBack && (
                    <Link href={backUrl}>
                        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8">
                            <ChevronLeft className="size-5" />
                        </Button>
                    </Link>
                )}

                {title ? (
                    <h1 className="text-xl font-bold text-foreground">{title}</h1>
                ) : (
                    <div>
                        <p className="text-muted-foreground text-xs font-medium mb-0.5">
                            Assalamualaikum,
                        </p>
                        <h1 className="text-xl font-bold text-foreground">Hamba Allah</h1>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                {today}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {!title && (
                <div className="flex items-center gap-3">
                    <button className="relative p-1.5 rounded-full hover:bg-muted/50 transition-colors">
                        <Bell className="size-5 text-foreground" />
                        <span className="absolute top-1.5 right-1.5 size-1.5 bg-destructive rounded-full border border-white"></span>
                    </button>
                    <Avatar className="size-9 border-2 border-background shadow-sm">
                        <AvatarImage src="/images/avatar-default.png" alt="@user" />
                        <AvatarFallback>HA</AvatarFallback>
                    </Avatar>
                </div>
            )}
        </header>
    );
}
