"use client";

import { PlusIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CityTimezone {
    timezone: string;
    displayName: string;
}

export default function MiniTime() {
    // Persist user's system timezone so it always appears in the list
    const [systemTimezone] = useState<string>(DateTime.now().zoneName);
    const [activeTimezone, setActiveTimezone] = useState<string>(() => {
        if (typeof window !== "undefined") {
            try {
                const favRaw = localStorage.getItem("FAVORITE_CITIES");
                if (favRaw) {
                    const favs = JSON.parse(favRaw);
                    if (Array.isArray(favs) && favs.length > 0)
                        return favs[0] as string;
                }
            } catch {}
        }
        return DateTime.now().zoneName;
    });

    const [currentTime, setCurrentTime] = useState<DateTime>(DateTime.now());
    const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");

    // Favorite timezones persisted in localStorage (array of timezone strings)
    const [favoriteTimezones, setFavoriteTimezones] = useState<string[]>(() => {
        if (typeof window === "undefined") return [];
        try {
            const raw = localStorage.getItem("FAVORITE_CITIES");
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed as string[];
            }
        } catch {}
        return [];
    });

    // Default cities - can be customized by user
    const [defaultCities] = useState<CityTimezone[]>([
        { timezone: "Asia/Tokyo", displayName: "Tokyo" },
        { timezone: "America/New_York", displayName: "New York" },
        { timezone: "Europe/Paris", displayName: "Paris" },
    ]);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(DateTime.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Load time format from localStorage on mount
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

    // Initialize FAVORITE_CITIES on first load or normalize existing
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const ensureFour = (arr: string[]) => {
                const defaults = [
                    systemTimezone,
                    ...defaultCities.map((c) => c.timezone),
                ];
                const unique = Array.from(new Set([...arr, ...defaults]));
                if (unique.length < 4 && !unique.includes("UTC"))
                    unique.push("UTC");
                return unique.slice(0, 4);
            };

            const raw = localStorage.getItem("FAVORITE_CITIES");
            let initial = [] as string[];
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) initial = parsed as string[];
            }
            // Start with system + defaults if empty
            if (initial.length === 0) {
                initial = ensureFour([
                    systemTimezone,
                    ...defaultCities.map((c) => c.timezone),
                ]);
            } else {
                initial = ensureFour(initial);
            }
            setFavoriteTimezones(initial);
            localStorage.setItem("FAVORITE_CITIES", JSON.stringify(initial));
            window.dispatchEvent(
                new CustomEvent("favoritesChanged", { detail: initial }),
            );
        } catch {}
    }, [systemTimezone, defaultCities]);

    // Listen for time format changes and keep favorites/activeTimezone in sync
    useEffect(() => {
        const handleTimeFormatChange = (e: CustomEvent) => {
            setTimeFormat(e.detail);
        };

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "TIME_FORMAT" && e.newValue) {
                if (e.newValue === "12h" || e.newValue === "24h") {
                    setTimeFormat(e.newValue);
                }
            }
            if (e.key === "FAVORITE_CITIES" && e.newValue) {
                try {
                    const favs = JSON.parse(e.newValue);
                    if (Array.isArray(favs)) {
                        setFavoriteTimezones(favs);
                        if (favs.length > 0) setActiveTimezone(favs[0]);
                    }
                } catch {}
            }
        };

        const handleFavoritesChanged = (e: CustomEvent) => {
            const favs = e.detail;
            if (Array.isArray(favs)) {
                setFavoriteTimezones(favs);
                if (favs.length > 0) setActiveTimezone(favs[0]);
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener(
                "timeFormatChanged",
                handleTimeFormatChange as EventListener,
            );
            window.addEventListener(
                "favoritesChanged",
                handleFavoritesChanged as EventListener,
            );
            window.addEventListener("storage", handleStorageChange);

            return () => {
                window.removeEventListener(
                    "timeFormatChanged",
                    handleTimeFormatChange as EventListener,
                );
                window.removeEventListener(
                    "favoritesChanged",
                    handleFavoritesChanged as EventListener,
                );
                window.removeEventListener("storage", handleStorageChange);
            };
        }
    }, []);

    // Format timezone for display (e.g., "Asia/Phnom_Penh" -> "Phnom Penh, Asia")
    const formatTimezoneDisplay = (timezone: string) => {
        const parts = timezone.split("/");
        if (parts.length >= 2) {
            const city = parts[parts.length - 1].replace(/_/g, " ");
            const region = parts[0];
            return `${city}, ${region}`;
        }
        return timezone;
    };

    // Helper function to get timezone data
    const getTimezoneData = (timezone: string, displayName: string) => {
        const time = currentTime.setZone(timezone);
        return {
            city: displayName,
            offset: time.toFormat("ZZZZ"),
            time:
                timeFormat === "24h"
                    ? time.toFormat("HH:mm")
                    : time.toFormat("hh:mm"),
            period: time.hour >= 6 && time.hour < 18 ? "Day" : "Night",
        };
    };

    const getDisplayNameForTimezone = (timezone: string) => {
        const found = defaultCities.find((c) => c.timezone === timezone);
        if (found) return found.displayName;
        const parts = timezone.split("/");
        return parts.length >= 2
            ? parts[parts.length - 1].replace(/_/g, " ")
            : timezone;
    };

    // Get current user timezone info (derived as needed elsewhere)

    // Handle timezone change when clicking on a city card
    const handleTimezoneChange = (newTimezone: string) => {
        if (newTimezone !== activeTimezone) {
            setActiveTimezone(newTimezone);
        }
        // Reorder favorites so selected timezone is first
        try {
            if (typeof window !== "undefined") {
                const currentFavsRaw = localStorage.getItem("FAVORITE_CITIES");
                const currentFavs: string[] = Array.isArray(
                    currentFavsRaw ? JSON.parse(currentFavsRaw) : null,
                )
                    ? (JSON.parse(currentFavsRaw as string) as string[])
                    : favoriteTimezones;
                const next = [
                    newTimezone,
                    ...currentFavs.filter((tz) => tz !== newTimezone),
                ];
                // Ensure we still have 4 unique items, filling from defaults/UTC if needed
                const defaults = [
                    systemTimezone,
                    ...defaultCities.map((c) => c.timezone),
                ];
                const unique = Array.from(new Set([...next, ...defaults]));
                if (unique.length < 4 && !unique.includes("UTC"))
                    unique.push("UTC");
                const trimmed = unique.slice(0, 4);
                setFavoriteTimezones(trimmed);
                localStorage.setItem(
                    "FAVORITE_CITIES",
                    JSON.stringify(trimmed),
                );
                window.dispatchEvent(
                    new CustomEvent("favoritesChanged", { detail: trimmed }),
                );
            }
        } catch {}
    };

    // Derive display data from favorite timezones
    const favoriteCities = favoriteTimezones.slice(0, 4).map((tz) => ({
        ...getTimezoneData(tz, getDisplayNameForTimezone(tz)),
        timezone: tz,
    }));

    return (
        <div className="container mx-4 sm:mx-auto my-15">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl sm:text-4xl font-medium tracking-tight">
                    {formatTimezoneDisplay(activeTimezone)}
                </h1>
                <Button variant="ghost" size="sm">
                    <PlusIcon className="size-4" />
                    Add city
                </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {favoriteCities.map((city) => (
                    <Card
                        key={city.timezone}
                        className="shadow-none border-border/80 rounded-2xl hover:bg-foreground hover:text-background cursor-pointer transition-colors"
                        onClick={() => handleTimezoneChange(city.timezone)}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg sm:text-xl font-medium tracking-tight">
                                    {city.city}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {city.offset}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <h1 className="text-4xl font-normal tracking-tight">
                                    {city.time}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {city.period}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
