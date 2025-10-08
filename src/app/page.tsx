import MainTime from "@/components/widget/main-time";
import MiniTime from "@/components/widget/mini-time";
import Navbar from "@/components/widget/navbar";

export default function Home() {
    return (
        <>
            <Navbar />
            <MainTime />
            <MiniTime />
        </>
    );
}
