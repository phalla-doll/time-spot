"use client"

import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function MainTime() {
    const [now, setNow] = useState(DateTime.now());
    const [timeFormat, setTimeFormat] = useState<"24h" | "12h">("24h");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(DateTime.now());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        try {
            const saved = typeof window !== "undefined" ? localStorage.getItem("timeFormat") : null;
            if (saved === "12h" || saved === "24h") {
                setTimeFormat(saved);
            }
        } catch { }
    }, []);

    useEffect(() => {
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem("timeFormat", timeFormat);
            }
        } catch { }
    }, [timeFormat]);

    return (
        <div className="mx-4 sm:mx-auto border-b border-gray">
            <div className="flex justify-center items-center my-20">
                <h1 className="text-9xl sm:text-[20rem] lg:text-[28rem] font-bold tracking-tight">{timeFormat === "24h" ? now.toFormat("HH:mm:ss") : now.toFormat("hh:mm:ss a")}</h1>
            </div>
            <div className="container mx-4 sm:mx-auto mb-2">
                <div className="flex justify-end items-center gap-2">
                    <div>
                        <ToggleGroup
                            size="sm"
                            value={timeFormat}
                            type="single"
                            variant="outline"
                            onValueChange={(val) => {
                                if (val === "24h" || val === "12h") {
                                    setTimeFormat(val);
                                }
                            }}
                        >
                            <ToggleGroupItem value="24h" >24H</ToggleGroupItem>
                            <ToggleGroupItem value="12h" >12H</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
            </div>
        </div>

    )
}