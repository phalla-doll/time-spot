"use client";

import { CornerDownRight } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimezoneSearch from "@/components/widget/timezone-search";

interface CityTimezone {
    timezone: string;
    displayName: string;
}

export default function MiniTime() {
    // Mounted guard to avoid hydration mismatches
    const [mounted, setMounted] = useState(false);
    // Persist user's system timezone so it always appears in the list (stable SSR default)
    const [systemTimezone, setSystemTimezone] = useState<string>("UTC");
    const [activeTimezone, setActiveTimezone] = useState<string>(() => "UTC");
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState<DateTime>(
        DateTime.now().setZone("UTC"),
    );
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

    // On mount, determine actual timezones and start the clock
    useEffect(() => {
        setMounted(true);
        // Resolve browser timezone ASAP and persist to state
        try {
            const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (browserTz) {
                setSystemTimezone(browserTz);
            }
        } catch {}

        try {
            const favRaw =
                typeof window !== "undefined"
                    ? localStorage.getItem("FAVORITE_CITIES")
                    : null;
            if (favRaw) {
                const favs = JSON.parse(favRaw);
                if (Array.isArray(favs) && favs.length > 0) {
                    setActiveTimezone(favs[0] as string);
                }
            } else if (typeof Intl !== "undefined") {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (tz) setActiveTimezone(tz);
            }
        } catch {}

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

    // Initialize FAVORITE_CITIES on first load or normalize existing (guarded)
    const initFavoritesDoneRef = useRef(false);
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (initFavoritesDoneRef.current) return;
        initFavoritesDoneRef.current = true;
        try {
            const ensureFour = (arr: string[], detectedSystemTz: string) => {
                const defaults = [
                    detectedSystemTz,
                    ...defaultCities.map((c) => c.timezone),
                ];
                // Always prioritize detectedSystemTz first when normalizing
                const withoutSystem = arr.filter(
                    (tz) => tz !== detectedSystemTz,
                );
                const unique = Array.from(
                    new Set([detectedSystemTz, ...withoutSystem, ...defaults]),
                );
                if (unique.length < 4 && !unique.includes("UTC"))
                    unique.push("UTC");
                return unique.slice(0, 4);
            };

            // Compute browser timezone locally to avoid re-runs when state updates
            let detectedSystemTz = "UTC";
            try {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (tz) detectedSystemTz = tz;
            } catch {}

            const raw = localStorage.getItem("FAVORITE_CITIES");
            let initial = [] as string[];
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) initial = parsed as string[];
            }

            // Only initialize if empty; otherwise, normalize minimally
            if (initial.length === 0) {
                initial = ensureFour(
                    [detectedSystemTz, ...defaultCities.map((c) => c.timezone)],
                    detectedSystemTz,
                );
            } else {
                // If first is UTC but we know system tz, promote it
                if (
                    initial[0] === "UTC" &&
                    detectedSystemTz &&
                    detectedSystemTz !== "UTC"
                ) {
                    initial = [
                        detectedSystemTz,
                        ...initial.filter((tz) => tz !== detectedSystemTz),
                    ];
                }
                initial = ensureFour(initial, detectedSystemTz);
            }

            setFavoriteTimezones(initial);
            localStorage.setItem("FAVORITE_CITIES", JSON.stringify(initial));
            window.dispatchEvent(
                new CustomEvent("favoritesChanged", { detail: initial }),
            );
        } catch {}
    }, [defaultCities]);

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
    const favoriteCities = mounted
        ? favoriteTimezones.slice(0, 4).map((tz) => ({
              ...getTimezoneData(tz, getDisplayNameForTimezone(tz)),
              timezone: tz,
          }))
        : [];

    return (
        <div className="container mx-2 sm:mx-auto my-10 sm:my-15">
            <div className="flex justify-between items-center mx-4 mb-10">
                <h1
                    className="text-2xl sm:text-5xl font-medium tracking-tight"
                    suppressHydrationWarning
                >
                    {mounted ? formatTimezoneDisplay(activeTimezone) : ""}
                </h1>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(true)}
                >
                    <CornerDownRight className="size-4" />
                    Change city
                </Button>
                <TimezoneSearch open={isOpen} onOpenChange={setIsOpen} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mounted && favoriteCities.length > 0
                    ? favoriteCities.map((city) => (
                          <Card
                              key={city.timezone}
                              className="shadow-none border-border/80 rounded-2xl hover:bg-foreground hover:text-background cursor-pointer transition-colors"
                              onClick={() =>
                                  handleTimezoneChange(city.timezone)
                              }
                          >
                              <CardHeader>
                                  <div className="flex justify-between items-center">
                                      <CardTitle
                                          className="text-lg sm:text-xl font-medium tracking-tight"
                                          suppressHydrationWarning
                                      >
                                          {city.city}
                                      </CardTitle>
                                      <p
                                          className="text-sm text-muted-foreground"
                                          suppressHydrationWarning
                                      >
                                          {city.offset}
                                      </p>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <div className="flex justify-between items-center">
                                      <h1
                                          className="text-4xl font-normal tracking-tight"
                                          suppressHydrationWarning
                                      >
                                          {city.time}
                                      </h1>
                                      <p
                                          className="text-sm text-muted-foreground"
                                          suppressHydrationWarning
                                      >
                                          {city.period}
                                      </p>
                                  </div>
                              </CardContent>
                          </Card>
                      ))
                    : Array.from({ length: 4 }).map((_, idx) => (
                          <Card
                              key={`placeholder-${idx}`}
                              className="shadow-none border-border/80 rounded-2xl"
                          >
                              <CardHeader>
                                  <div className="flex justify-between items-center">
                                      <CardTitle className="text-lg sm:text-xl font-medium tracking-tight text-muted-foreground">
                                          N/A
                                      </CardTitle>
                                      <p className="text-sm text-muted-foreground">
                                          GMT
                                      </p>
                                  </div>
                              </CardHeader>
                              <CardContent>
                                  <div className="flex justify-between items-center">
                                      <h1 className="text-4xl font-normal tracking-tight text-muted-foreground">
                                          --:--
                                      </h1>
                                      <p className="text-sm text-muted-foreground">
                                          N/A
                                      </p>
                                  </div>
                              </CardContent>
                          </Card>
                      ))}
            </div>
        </div>
    );
}
