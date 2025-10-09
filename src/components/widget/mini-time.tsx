"use client";

import { PlusIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(DateTime.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Listen for timezone changes
    useEffect(() => {
        const handleTimezoneChange = (e: CustomEvent) => {
            setActiveTimezone(e.detail);
        };

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "ACTIVE_TIME_ZONE" && e.newValue) {
                setActiveTimezone(e.newValue);
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener(
                "timezoneChanged",
                handleTimezoneChange as EventListener,
            );
            window.addEventListener("storage", handleStorageChange);

            return () => {
                window.removeEventListener(
                    "timezoneChanged",
                    handleTimezoneChange as EventListener,
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
            time: time.toFormat("HH:mm"),
            period: time.hour >= 6 && time.hour < 18 ? "Day" : "Night",
        };
    };

    // Get current user timezone info
    const userTimezone = currentTime.setZone(activeTimezone);
    const userCity = formatTimezoneDisplay(activeTimezone).split(", ")[0];
    const userOffset = userTimezone.toFormat("ZZZZ");
    const userTime = userTimezone.toFormat("HH:mm");
    const userPeriod =
        userTimezone.hour >= 6 && userTimezone.hour < 18 ? "Day" : "Night";

    // Get data for popular cities
    const tokyo = getTimezoneData("Asia/Tokyo", "Tokyo");
    const newYork = getTimezoneData("America/New_York", "New York");
    const paris = getTimezoneData("Europe/Paris", "Paris");

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
                <Card className="shadow-none border-border/80 rounded-2xl hover:bg-foreground hover:text-background">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg sm:text-xl font-medium tracking-tight">
                                {userCity}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {userOffset}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-normal tracking-tight">
                                {userTime}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {userPeriod}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-border/80 rounded-2xl hover:bg-foreground hover:text-background">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg sm:text-xl font-medium tracking-tight">
                                {tokyo.city}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {tokyo.offset}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-normal tracking-tight">
                                {tokyo.time}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {tokyo.period}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-border/80 rounded-2xl hover:bg-foreground hover:text-background">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg sm:text-xl font-medium tracking-tight">
                                {newYork.city}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {newYork.offset}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-normal tracking-tight">
                                {newYork.time}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {newYork.period}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-border/80 rounded-2xl hover:bg-foreground hover:text-background">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg sm:text-xl font-medium tracking-tight">
                                {paris.city}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {paris.offset}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-normal tracking-tight">
                                {paris.time}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {paris.period}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
