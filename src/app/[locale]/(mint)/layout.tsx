import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ReactNode } from "react"
import type { Locale } from '@rainbow-me/rainbowkit';
import { MintLink, GalleryLink } from "@/src/components/navLinks";
import Footer from "@/src/components/footer";
import Image from "next/image";

export default async function Layout({children, params}: {
    children: ReactNode;
    params: Promise<{locale: string}>;
}) {
    const {locale} = await params;
    const safeLocale = locale as Locale;

    return (
        <div className="min-h-screen flex flex-col"> 
            <nav className="grid grid-cols-5 justify-around justify-items-center fixed top-0 left-0 right-0 backdrop-blur-md shadow-lg items-center">
                <MintLink locale={safeLocale} />
                <GalleryLink locale={safeLocale} />
                <div className="flex flex-row gap-2">
                    <span className="font-extrabold text-2xl text-grn">ForgeNFT</span>
                    <Image src="/Cameroceras.svg" alt="Logo of Cameroceras" priority width={30} height={30}/> 
                </div>
                <div className="justify-self-end-safe col-span-2"><ConnectButton /></div>
            </nav>
            {children}
            <Footer />
        </div>
    )
}