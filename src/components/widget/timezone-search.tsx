"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

interface TimezoneSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTimezoneSelect?: (timezone: string) => void;
}

export default function TimezoneSearch({
    open,
    onOpenChange,
    onTimezoneSelect,
}: TimezoneSearchProps) {
    const [timezones, setTimezones] = useState<string[]>([]);

    useEffect(() => {
        // Get all available timezones using the modern Intl API
        try {
            const availableTimezones = Intl.supportedValuesOf("timeZone");
            setTimezones(availableTimezones.sort());
        } catch {
            // Fallback to common timezones if Intl.supportedValuesOf is not available
            const commonTimezones = [
                "UTC",
                "America/New_York",
                "America/Chicago",
                "America/Denver",
                "America/Los_Angeles",
                "Europe/London",
                "Europe/Paris",
                "Europe/Berlin",
                "Asia/Tokyo",
                "Asia/Shanghai",
                "Australia/Sydney",
            ];
            setTimezones(commonTimezones);
        }
    }, []);

    const handleTimezoneSelect = (timezone: string) => {
        try {
            const raw = localStorage.getItem("FAVORITE_CITIES");
            const current: string[] = Array.isArray(
                raw ? JSON.parse(raw) : null,
            )
                ? (JSON.parse(raw as string) as string[])
                : [];
            // Remove duplicate if exists, then unshift selected
            const without = current.filter((tz) => tz !== timezone);
            const next = [timezone, ...without];
            // Trim to 4 max entries (drop last)
            const trimmed = next.slice(0, 4);
            localStorage.setItem("FAVORITE_CITIES", JSON.stringify(trimmed));
            // Notify listeners
            window.dispatchEvent(
                new CustomEvent("favoritesChanged", { detail: trimmed }),
            );
        } catch {}
        onTimezoneSelect?.(timezone);
        onOpenChange(false);
    };

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Search timezones..." />
            <CommandList>
                <CommandEmpty>No timezone found.</CommandEmpty>
                <CommandGroup>
                    {timezones.map((timezone) => (
                        <CommandItem
                            key={timezone}
                            value={timezone}
                            onSelect={() => handleTimezoneSelect(timezone)}
                            className="cursor-pointer"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium">{timezone}</span>
                                <span className="text-xs text-muted-foreground">
                                    {DateTime.now()
                                        .setZone(timezone)
                                        .toFormat("HH:mm")}{" "}
                                    -{" "}
                                    {DateTime.now()
                                        .setZone(timezone)
                                        .toFormat("ZZZZ")}
                                </span>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
            <div className="p-2 flex justify-between items-center border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="hidden sm:block">Use ↑↓ to navigate</span>
                    <span className="hidden sm:block">•</span>
                    <span className="hidden sm:block">
                        Press Enter to select
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Local: {DateTime.now().toFormat("ZZZZ")}</span>
                </div>
            </div>
        </CommandDialog>
    );
}
