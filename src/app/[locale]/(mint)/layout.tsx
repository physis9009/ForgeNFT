import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"
import { ReactNode } from "react"
import type { Locale } from '@rainbow-me/rainbowkit';

export default async function Layout({children, params}: {
    children: ReactNode;
    params: Promise<{locale: Locale}>;
}) {
    const {locale} = await params;
    return (
        <div className="min-h-screen"> 
            <nav className="flex flex-row w-[98%]">
                <Link href={`/${locale}`} className="w-1/4 shrink-0 text-center">Mint</Link>
                <Link href={`/${locale}/gallery`} className='w-1/4 shrink-0 text-center'>Gallery</Link>
                <div className="flex-1 flex justify-end"><ConnectButton /></div>
            </nav>
            {children}
        </div>
    )
}