"use client";

import { SurahDetail, Ayah } from "@/lib/api";
import { Play, Pause, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface AyahListProps {
    surah: SurahDetail;
}

export function AyahList({ surah }: AyahListProps) {
    // Audio State
    const [playingAyah, setPlayingAyah] = useState<number | null>(null);
    const [isPlayingFull, setIsPlayingFull] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Stop audio when component unmounts
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setPlayingAyah(null);
        setIsPlayingFull(false);
    };

    const toggleFullAudio = () => {
        if (isPlayingFull) {
            stopAudio();
        } else {
            stopAudio(); // Ensure other audios stop
            const audio = new Audio(surah.audioFull["05"]); // Using Misyari Rasyid
            audioRef.current = audio;
            audio.play();
            audio.onended = () => setIsPlayingFull(false);
            setIsPlayingFull(true);
        }
    };

    const toggleAyahAudio = (index: number, audioUrl: string) => {
        if (playingAyah === index) {
            stopAudio();
        } else {
            stopAudio(); // Ensure other audios stop
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            audio.play();
            audio.onended = () => setPlayingAyah(null);
            setPlayingAyah(index);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-center mb-6">
                <Button
                    onClick={toggleFullAudio}
                    className={`rounded-full gap-2 transition-all ${isPlayingFull
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg ring-4 ring-emerald-100"
                        : "bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm"
                        }`}
                >
                    {isPlayingFull ? (
                        <>
                            <Pause className="w-4 h-4 fill-current" />
                            <span className="font-medium">Jeda Murottal Full</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 fill-current" />
                            <span className="font-medium">Putar Murottal Full</span>
                        </>
                    )}
                </Button>
            </div>

            {/* Bismillah */}
            <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-100 mb-8 font-arab text-3xl text-emerald-800">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </div>

            {/* Ayah List */}
            <div className="space-y-8 divide-y divide-neutral-100">
                {surah.ayat.map((ayah, index) => (
                    <div key={ayah.nomorAyat} id={`ayah-${ayah.nomorAyat}`} className="pt-6">
                        {/* Audio & Number */}
                        <div className="flex items-center justify-between mb-4 bg-emerald-50/50 p-3 rounded-lg">
                            <span className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold rounded-full text-sm font-arab">
                                {ayah.nomorAyat}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleAyahAudio(index, ayah.audio["05"])} // 05 is Misyari Rasyid usually
                                className={`rounded-full hover:bg-emerald-100 hover:text-emerald-700 ${playingAyah === index ? "bg-emerald-100 text-emerald-700 animate-pulse" : "text-neutral-400"}`}
                            >
                                {playingAyah === index ? (
                                    <Pause className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                                <span className="ml-2 text-xs">Putar Ayat</span>
                            </Button>
                        </div>

                        {/* Arabic Text */}
                        <p
                            className="font-arab text-3xl md:text-4xl text-right leading-loose md:leading-[2.5] text-neutral-800 mb-6 px-1"
                            dir="rtl"
                        >
                            {ayah.teksArab}
                        </p>

                        {/* Translation */}
                        <div className="space-y-2 pl-2 border-l-4 border-emerald-100">
                            <p className="text-sm font-medium text-emerald-600 mb-1">
                                {ayah.teksLatin}
                            </p>
                            <p className="text-neutral-600 leading-relaxed">
                                {ayah.teksIndonesia}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Footer for Surah (Optional enhancement for later) */}
        </div>
    );
}
