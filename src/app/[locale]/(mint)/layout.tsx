import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ReactNode } from "react"
import type { Locale } from '@rainbow-me/rainbowkit';
import { MintLink, GalleryLink } from "@/src/components/navLinks";

export default async function Layout({children, params}: {
    children: ReactNode;
    params: Promise<{locale: Locale}>;
}) {
    const {locale} = await params;

    return (
        <div className="min-h-screen"> 
            <nav className="grid grid-cols-5 justify-around justify-items-center fixed top-0 left-0 right-0 backdrop-blur-md shadow-lg items-center">
                <MintLink locale={locale} />
                <GalleryLink locale={locale} />
                <span className="inline-block font-extrabold text-2xl">ForgeNFT</span>
                <div className="justify-self-end-safe col-span-2"><ConnectButton /></div>
            </nav>
            {children}
        </div>
    )
}