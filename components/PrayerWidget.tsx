"use client";

import { useState, useEffect } from "react";
import { HijriDate, PrayerTimes } from "@/lib/api";
import { MapPin, Clock, Loader2, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { fetchPrayerTimesByCoords } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface PrayerWidgetProps {
    timings: PrayerTimes;
    hijri: HijriDate;
    city?: string;
}

export function PrayerWidget({ timings: initialTimings, hijri: initialHijri, city: initialCity = "Bandung" }: PrayerWidgetProps) {
    const [timings, setTimings] = useState<PrayerTimes>(initialTimings);
    const [hijri, setHijri] = useState<HijriDate>(initialHijri);
    const [cityName, setCityName] = useState(initialCity);

    const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; diff: number } | null>(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Helper to parse time string "HH:mm" to minutes
    const timeToMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    const updateLocation = () => {
        if (!navigator.geolocation) {

            return;
        }

        setUpdateStatus('loading');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetchPrayerTimesByCoords(latitude, longitude);

                    if (res.success && res.data) {
                        setTimings(res.data.timings);
                        setHijri(res.data.date);
                        setCityName("Lokasi Anda");
                        setUpdateStatus('success');

                        // Reset back to idle after 3 seconds to show refresh icon again on hover? 
                        // Or keep success to show it worked? User asked for notification beside location.
                        // I'll keep it as success state.


                    } else {
                        throw new Error("Gagal mengambil data API");
                    }
                } catch (error) {
                    console.error("Loc Error:", error);
                    setUpdateStatus('error');

                }
            },
            (error) => {
                console.warn("Geo Error Code:", error.code, "Message:", error.message);
                setUpdateStatus('error');

                let errorMsg = "Lokasi tidak terdeteksi.";
                if (error.code === 1) errorMsg = "Izin lokasi ditolak via browser.";
                else if (error.code === 2) errorMsg = "Sinyal lokasi tidak tersedia.";
                else if (error.code === 3) errorMsg = "Timeout mencari lokasi.";


            },
            {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 60000
            }
        );
    };

    // Auto-detect on first mount only if user hasn't denied previously?
    // For now, let's just run it once or let user trigger it explicitly to avoid annoyance?
    // User request: "update Prayer Widget to use browser Geolocation"
    // Usually auto-detect is expected.
    useEffect(() => {
        // Optional: Check permission state first or just try
        // navigator.permissions.query({ name: 'geolocation' }).then(...)
        updateLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const calculateNextPrayer = () => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
            const displayNames: Record<string, string> = {
                Fajr: "Subuh",
                Dhuhr: "Dzuhur",
                Asr: "Ashar",
                Maghrib: "Maghrib",
                Isha: "Isya"
            };

            let upcoming = null;

            for (const name of prayerNames) {
                const pTime = timings[name];
                // Handle edge case where timings might not be loaded yet if error
                if (!pTime) continue;

                const pMinutes = timeToMinutes(pTime);

                if (pMinutes > currentMinutes) {
                    upcoming = {
                        name: displayNames[name],
                        time: pTime,
                        diff: pMinutes - currentMinutes
                    };
                    break;
                }
            }

            if (!upcoming && timings.Fajr) {
                const fajrMinutes = timeToMinutes(timings.Fajr);
                const minutesUntilMidnight = (24 * 60) - currentMinutes;
                const matchName = displayNames["Fajr"];
                upcoming = {
                    name: matchName,
                    time: timings.Fajr,
                    diff: minutesUntilMidnight + fajrMinutes
                };
            }

            if (upcoming) {
                setNextPrayer(upcoming);
                const hours = Math.floor(upcoming.diff / 60);
                const mins = upcoming.diff % 60;
                const secs = 59 - now.getSeconds();
                setTimeLeft(`-${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
            }
        };

        calculateNextPrayer();
        const interval = setInterval(calculateNextPrayer, 1000);
        return () => clearInterval(interval);
    }, [timings]);

    if (!nextPrayer) return null;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div
                            className="flex items-center text-emerald-100 text-xs font-medium mb-1 cursor-pointer hover:text-white transition-colors group"
                            onClick={updateLocation}
                            title="Perbarui Lokasi"
                        >
                            <MapPin className="w-3 h-3 mr-1" />
                            {cityName}, ID
                            {updateStatus === 'loading' && <Loader2 className="w-3 h-3 ml-2 animate-spin" />}
                            {updateStatus === 'success' && <CheckCircle2 className="w-3 h-3 ml-2 text-emerald-300" />}
                            {updateStatus === 'error' && <XCircle className="w-3 h-3 ml-2 text-red-300" />}
                            {updateStatus === 'idle' && <RefreshCw className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </div>
                        <h3 className="font-amiri text-lg font-bold text-white leading-none">
                            {hijri?.day} {hijri?.month?.en} {hijri?.year}
                        </h3>
                        <p className="text-[10px] text-emerald-200 mt-0.5">{hijri?.weekday?.en}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-emerald-100 text-xs">Menuju {nextPrayer.name}</p>
                        <p className="text-2xl font-bold tabular-nums tracking-tight">{timeLeft}</p>
                    </div>
                </div>

                {/* Prayer Grid */}
                <div className="grid grid-cols-5 gap-1 mt-2">
                    {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((p) => {
                        const displayNames: Record<string, string> = {
                            Fajr: "Subuh",
                            Dhuhr: "Dzuhur",
                            Asr: "Ashar",
                            Maghrib: "Maghrib",
                            Isha: "Isya"
                        };
                        const isActive = displayNames[p] === nextPrayer.name;

                        return (
                            <div
                                key={p}
                                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? "bg-white/20 ring-1 ring-white/40" : "bg-white/5"}`}
                            >
                                <span className={`text-[10px] mb-1 ${isActive ? "text-yellow-200 font-bold" : "text-emerald-100/70"}`}>
                                    {displayNames[p]}
                                </span>
                                <span className="text-xs font-semibold">{timings[p]}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    );
}
