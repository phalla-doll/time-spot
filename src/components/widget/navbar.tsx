import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center p-4">
                <div className="">
                    <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                        <Image
                            src={"/logo/timespot-logo.svg"}
                            width={24}
                            height={24}
                            alt="TimeSpot Logo"
                            className="h-5 w-auto"
                        ></Image>
                        Time Spot
                    </h1>
                </div>
                <div className="">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="flex gap-1 opacity-70 hover:opacity-100"
                    >
                        <SearchIcon className="size-4" />
                        <span>Search</span>
                    </Button>
                </div>
                <div className="flex gap-4">
                    <Button size="sm" variant="outline">
                        Login
                    </Button>
                    <Button size="sm" variant="default">
                        Register
                    </Button>
                </div>
            </div>
        </div>
    );
}
