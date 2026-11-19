export const StatusPing = ({ active = true, label }) => {
    if (!active) return null;

    return (
        <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            {label && (
                <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">
                    {label}
                </span>
            )}
        </div>
    );
};
