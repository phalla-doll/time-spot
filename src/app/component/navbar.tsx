import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center p-4">
                <div className="">
                    <h1 className="text-xl font-bold tracking-tight">Time Spot</h1>
                </div>
                <div className="flex gap-4">
                    <Button size="sm" variant="outline">Login</Button>
                    <Button size="sm" variant="default">Register</Button>
                </div>
            </div>
        </div>
    )
}