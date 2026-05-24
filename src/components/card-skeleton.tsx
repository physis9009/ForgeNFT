export default function CardSkeleton() {
    return (
        <div className="border border-wht-gr rounded-lg p-4 shadow-inner shadow-wht-gr break-inside-avoid animate-pulse">
            <div className="mb-3 overflow-hidden rounded bg-wht-gr aspect-square" />
            <div className="flex items-center justify-between gap-2">
                <div className="h-5 flex-1 rounded bg-wht-gr" />
                <div className="h-6 w-14 rounded bg-pnk-gr/50" />
            </div>
        </div>
    );
}