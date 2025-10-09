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
    const [activeTimezone, setActiveTimezone] = useState<string>(() => {
        if (typeof window !== "undefined") {
            try {
                return (
                    localStorage.getItem("ACTIVE_TIME_ZONE") ||
                    DateTime.now().zoneName
                );
            } catch {
                return DateTime.now().zoneName;
            }
        }
        return DateTime.now().zoneName;
    });

    const [currentTime, setCurrentTime] = useState<DateTime>(DateTime.now());
    const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");

    // Default cities - can be customized by user
    const [selectedCities] = useState<CityTimezone[]>([
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
                    ? localStorage.getItem("timeFormat")
                    : null;
            if (saved === "12h" || saved === "24h") {
                setTimeFormat(saved);
            }
        } catch { }
    }, []);

    // Listen for timezone and time format changes
    useEffect(() => {
        const handleTimezoneChange = (e: CustomEvent) => {
            setActiveTimezone(e.detail);
        };

        const handleTimeFormatChange = (e: CustomEvent) => {
            setTimeFormat(e.detail);
        };

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "ACTIVE_TIME_ZONE" && e.newValue) {
                setActiveTimezone(e.newValue);
            }
            if (e.key === "timeFormat" && e.newValue) {
                if (e.newValue === "12h" || e.newValue === "24h") {
                    setTimeFormat(e.newValue);
                }
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener(
                "timezoneChanged",
                handleTimezoneChange as EventListener,
            );
            window.addEventListener(
                "timeFormatChanged",
                handleTimeFormatChange as EventListener,
            );
            window.addEventListener("storage", handleStorageChange);

            return () => {
                window.removeEventListener(
                    "timezoneChanged",
                    handleTimezoneChange as EventListener,
                );
                window.removeEventListener(
                    "timeFormatChanged",
                    handleTimeFormatChange as EventListener,
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
            time: timeFormat === "24h" ? time.toFormat("HH:mm") : time.toFormat("hh:mm"),
            period: time.hour >= 6 && time.hour < 18 ? "Day" : "Night",
        };
    };

    // Get current user timezone info
    const userTimezone = currentTime.setZone(activeTimezone);
    const userCity = formatTimezoneDisplay(activeTimezone).split(", ")[0];
    const userOffset = userTimezone.toFormat("ZZZZ");
    const userTime = timeFormat === "24h" ? userTimezone.toFormat("HH:mm") : userTimezone.toFormat("hh:mm");
    const userPeriod =
        userTimezone.hour >= 6 && userTimezone.hour < 18 ? "Day" : "Night";

    // Create unified array with user's current city as first item
    const favoriteCities = [
        {
            city: userCity,
            offset: userOffset,
            time: userTime,
            period: userPeriod,
            timezone: activeTimezone,
        },
        ...selectedCities.map(city => ({
            ...getTimezoneData(city.timezone, city.displayName),
            timezone: city.timezone,
        }))
    ];

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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {favoriteCities.map((city) => (
                    <Card
                        key={city.timezone}
                        className="shadow-none border-border/80 rounded-2xl hover:bg-foreground hover:text-background"
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
