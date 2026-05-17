import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"
import { ReactNode } from "react"
import type { Locale } from '@rainbow-me/rainbowkit';
import { Oxanium } from "next/font/google";

const oxanium = Oxanium({
    weight: "500",
    style: "normal",
    subsets: ["latin"]
});

export default async function Layout({children, params}: {
    children: ReactNode;
    params: Promise<{locale: Locale}>;
}) {
    const {locale} = await params;
    return (
        <div className="min-h-screen"> 
            <nav className="grid grid-cols-5 justify-around justify-items-center fixed top-0 left-0 right-0 backdrop-blur-md shadow-lg">
                <Link href={`/${locale}`} className={`
                    ${oxanium.className} text-left text-xl font-bold
                `}>Mint</Link>
                <Link href={`/${locale}/gallery`} className={`
                    ${oxanium.className} text-left text-xl font-bold
                `}>Gallery</Link>
                <span className="inline-block font-extrabold text-2xl">ForgeNFT</span>
                <div className="justify-self-end-safe col-span-2"><ConnectButton /></div>
            </nav>
            {children}
        </div>
    )
}