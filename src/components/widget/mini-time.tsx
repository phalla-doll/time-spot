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
                                Phnom Penh
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                UTC+7
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-normal tracking-tight">
                                12:00
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Night
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-border/80 rounded-2xl hover:bg-foreground hover:text-background">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg sm:text-xl font-medium tracking-tight">
                                Los Angeles
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                UTC+7
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-normal tracking-tight">
                                10:00
                            </h1>
                            <p className="text-sm text-muted-foreground">Day</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-border/80 rounded-2xl hover:bg-foreground hover:text-background">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg sm:text-xl font-medium tracking-tight">
                                London
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                UTC+7
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-normal tracking-tight">
                                01:00
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Night
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-none border-border/80 rounded-2xl hover:bg-foreground hover:text-background">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg sm:text-xl font-medium tracking-tight">
                                Singapore
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                UTC+7
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-normal tracking-tight">
                                14:00
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Night
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
