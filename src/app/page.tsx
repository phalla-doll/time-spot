import MainTime from "@/components/widget/main-time";
import MiniTime from "@/components/widget/mini-time";
import Navbar from "@/components/widget/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "World Clock - Track Time Across Multiple Time Zones",
    description:
        "Real-time world clock showing current time in multiple cities. Track time zones for Phnom Penh, Los Angeles, London, Singapore and more. Perfect for remote teams and international coordination.",
    openGraph: {
        title: "World Clock - Track Time Across Multiple Time Zones | TimeSpot",
        description:
            "Real-time world clock showing current time in multiple cities. Track time zones for remote teams and international coordination.",
    },
};

export default function Home() {
    return (
        <main>
            <Navbar />
            <section aria-label="Current time display">
                <MainTime />
            </section>
            <section aria-label="World time zones">
                <MiniTime />
            </section>
        </main>
    );
}
