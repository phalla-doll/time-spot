"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Weather from "@/components/widget/weather";

export default function MainTime() {
    // Avoid hydration mismatches by using stable SSR defaults, then update on mount
    const [mounted, setMounted] = useState(false);
    const [timezone, setTimezone] = useState<string>(() => "UTC");
    const [now, setNow] = useState(() => DateTime.now().setZone("UTC"));
    const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");

    useEffect(() => {
        setMounted(true);
        // Determine initial timezone on client: favorites -> browser -> UTC
        try {
            const favRaw = typeof window !== "undefined" ? localStorage.getItem("FAVORITE_CITIES") : null;
            if (favRaw) {
                const favs = JSON.parse(favRaw);
                if (Array.isArray(favs) && favs.length > 0) {
                    setTimezone(favs[0] as string);
                }
            } else if (typeof Intl !== "undefined") {
                const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (browserTz) setTimezone(browserTz);
            }
        } catch {}
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(DateTime.now().setZone(timezone));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timezone]);

    useEffect(() => {
        try {
            const saved =
                typeof window !== "undefined"
                    ? localStorage.getItem("TIME_FORMAT")
                    : null;
            if (saved === "12h" || saved === "24h") {
                setTimeFormat(saved);
            }
        } catch {}
    }, []);

    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem("TIME_FORMAT", timeFormat);
                // Dispatch custom event to notify other components
                window.dispatchEvent(
                    new CustomEvent("timeFormatChanged", {
                        detail: timeFormat,
                    }),
                );
            }
        } catch {}
    }, [timeFormat]);

    // Listen for favorites changes
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "FAVORITE_CITIES" && e.newValue) {
                try {
                    const favs = JSON.parse(e.newValue);
                    if (Array.isArray(favs) && favs.length > 0) {
                        setTimezone(favs[0]);
                    }
                } catch {}
            }
        };

        const handleFavoritesChanged = (e: CustomEvent) => {
            const favs = e.detail;
            if (Array.isArray(favs) && favs.length > 0) {
                setTimezone(favs[0]);
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener(
                "favoritesChanged",
                handleFavoritesChanged as EventListener,
            );
            window.addEventListener("storage", handleStorageChange);

            return () => {
                window.removeEventListener(
                    "favoritesChanged",
                    handleFavoritesChanged as EventListener,
                );
                window.removeEventListener("storage", handleStorageChange);
            };
        }
    }, []);

    return (
        <div className="mx-4 sm:mx-auto border-b border-gray">
            <div className="flex justify-center items-center my-20">
                <h1 className="text-7xl sm:text-[18rem] lg:text-[26rem] font-bold tabular-nums tracking-tighter select-none" suppressHydrationWarning>
                    {mounted
                        ? timeFormat === "24h"
                            ? now.toFormat("HH:mm:ss")
                            : now.toFormat("hh:mm:ss")
                        : "--:--:--"}
                </h1>
            </div>
            <div className="container mx-4 sm:mx-auto mb-10">
                <div className="flex justify-end items-center gap-x-6">
                    <div className="flex gap-2 text-sm sm:text-base">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground" suppressHydrationWarning>
                                {mounted ? now.toLocaleString(DateTime.DATE_HUGE) : ""}
                            </span>
                            <Weather />
                        </div>
                        <span className="text-muted-foreground" suppressHydrationWarning>
                            {mounted ? now.toFormat("ZZZZ") : ""}
                        </span>
                    </div>
                    <div>
                        <ToggleGroup
                            size="sm"
                            value={timeFormat}
                            type="single"
                            variant="outline"
                            onValueChange={(val) => {
                                if (val && (val === "24h" || val === "12h")) {
                                    setTimeFormat(val);
                                }
                            }}
                        >
                            <ToggleGroupItem
                                value="24h"
                                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm font-medium"
                            >
                                24H
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="12h"
                                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm font-medium"
                            >
                                12H
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}
