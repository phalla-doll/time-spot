"use client";

import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/widget/theme-switcher";
import TimezoneSearch from "@/components/widget/timezone-search";
import ContactDialog from "@/components/widget/contact-dialog";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const handleTimezoneSelect = (timezone: string) => {
        // Trigger a custom event to notify other components
        window.dispatchEvent(
            new CustomEvent("timezoneChanged", { detail: timezone }),
        );
    };

    // submit logic and dialog UI moved into ContactDialog component

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center p-4">
                <div className="">
                    <h1 className="text-xl font-semibold tracking-tight flex items-center gap-x-2">
                        <Image
                            src={"/logo/timespot-logo.svg"}
                            width={24}
                            height={24}
                            alt="TimeSpot Logo"
                            className="h-5 w-auto dark:hidden"
                        ></Image>
                        <Image
                            src={"/logo/timespot-logo-white.svg"}
                            width={24}
                            height={24}
                            alt="TimeSpot Logo"
                            className="h-5 w-auto hidden dark:block"
                        ></Image>
                        <span className="hidden sm:block">Time Spot</span>
                    </h1>
                </div>
                <div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="flex gap-1 opacity-70 hover:opacity-100"
                        onClick={() => setIsOpen(true)}
                    >
                        <SearchIcon className="size-4" />
                        <span>Search</span>
                    </Button>
                    <TimezoneSearch
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        onTimezoneSelect={handleTimezoneSelect}
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <ThemeSwitcher />
                    <ContactDialog />
                </div>
            </div>
        </div>
    );
}
