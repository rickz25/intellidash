type KpiCardProps = {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color?: string;
    prefix?: string;
};
export default function KpiCard({
    title,
    value,
    icon: Icon,
    color = "text-green-400",
    prefix = "",
}: KpiCardProps) {
    const formattedValue = (() => {
        const num = Number(value);

        if (!isNaN(num)) {
            return num.toLocaleString();
        }

        return value;
    })();

    return (
        <div className="rounded-2xl border bg-white/5 p-4">
            <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                    {title}
                </p>

                {Icon && (
                    <Icon className={`h-4 w-4 ${color}`} />
                )}
            </div>

            <h2 className="mt-2 text-xl font-bold">
                {prefix}{formattedValue}
            </h2>
        </div>
    );
}