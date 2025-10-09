"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Weather from "@/components/widget/weather";

export default function MainTime() {
    const [timezone, setTimezone] = useState<string>(() => {
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
    const [now, setNow] = useState(() => DateTime.now().setZone(timezone));
    const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");

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

    // Listen for timezone changes
    useEffect(() => {
        const handleTimezoneChange = (e: CustomEvent) => {
            setTimezone(e.detail);
        };

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "ACTIVE_TIME_ZONE" && e.newValue) {
                setTimezone(e.newValue);
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

    return (
        <div className="mx-4 sm:mx-auto border-b border-gray">
            <div className="flex justify-center items-center my-20">
                <h1 className="text-7xl sm:text-[18rem] lg:text-[26rem] font-bold tabular-nums tracking-tighter select-none">
                    {timeFormat === "24h"
                        ? now.toFormat("HH:mm:ss")
                        : now.toFormat("hh:mm:ss")}
                </h1>
            </div>
            <div className="container mx-4 sm:mx-auto mb-10">
                <div className="flex justify-end items-center gap-x-6">
                    <div className="flex gap-2 text-sm sm:text-base">
                        <div className="flex flex-col">
                            <span className="text-muted-foreground">
                                {now.toLocaleString(DateTime.DATE_HUGE)}
                            </span>
                            <Weather />
                        </div>
                        <span className="text-muted-foreground">
                            {now.toFormat("ZZZZ")}
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
