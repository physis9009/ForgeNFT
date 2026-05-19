'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Oxanium } from "next/font/google";
import {type Locale} from '@rainbow-me/rainbowkit';
import { usePathname } from 'next/navigation';

const oxanium = Oxanium({
    weight: "500",
    style: "normal",
    subsets: ["latin"]
});

export function MintLink({locale}: {locale: Locale}) {
    const pathName = usePathname();

    return <Link href={`/${locale}`} className={clsx(`
        no-underline ${oxanium.className} text-left text-xl font-bold text-blk rounded-md sm:pl-4 sm:pr-4
    `, [
        pathName === `/${locale}` && 'italic cursor-default text-wht bg-grn-gr/50 pointer-events-none',
        pathName !== `/${locale}` && 'hover:shadow-inner hover:shadow-wht-gr'
    ])}>Mint</Link>
}

export function GalleryLink({locale}: {locale: Locale}) {
    const pathName = usePathname();

    return <Link href={`/${locale}/gallery`} className={clsx(`
        no-underline ${oxanium.className} text-left text-xl font-bold text-blk rounded-md sm:pl-4 sm:pr-4
    `, [
        pathName === `/${locale}/gallery` && 'italic cursor-default text-wht bg-grn-gr/50 pointer-events-none',
        pathName !== `/${locale}/gallery` && 'hover:shadow-inner hover:shadow-wht-gr'
    ])}>Gallery</Link>
}