"use client";

import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ThemeSwitcher from "@/components/widget/theme-switcher";
import TimezoneSearch from "@/components/widget/timezone-search";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const handleTimezoneSelect = (timezone: string) => {
        // Trigger a custom event to notify other components
        window.dispatchEvent(
            new CustomEvent("timezoneChanged", { detail: timezone }),
        );
    };

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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="default">
                                Register / Log in
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    Interested in Time Spot?
                                </DialogTitle>
                                <DialogDescription>
                                    This is a experimental project. If you are
                                    interested in Time Spot, please use this
                                    form to contact us.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-2">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <Label>Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label>Contact</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter your contact"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Contact can be email, telegram, etc.
                                        </p>
                                    </div>
                                </div>
                                <Button variant="default">Submit</Button>
                            </div>
                            <DialogFooter className="sm:justify-start">
                                <p className="text-xs text-muted-foreground">
                                    By continuing, you agree to our Terms and
                                    Privacy Policy.
                                </p>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
