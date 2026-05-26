import Modal from '@/components/modal';

interface DropDriver {
    product_id: number;
    product_name?: string;
    yesterday_qty: number;
    today_qty: number;
    drop_qty: number;
}

interface SalesInsightData {
    drop_percent: number;
    recommendation: string;
    insights: string[];
    root_causes: string[];
    drop_drivers: DropDriver[];
}

interface Props {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    data: SalesInsightData | null;
}

export default function SalesInsightModal({
    open,
    onClose,
    loading,
    data,
}: Props) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Sales Drop Analysis"
        >
            {loading && (
                <p className="text-sm text-gray-400">
                    Loading insights...
                </p>
            )}

            {!loading && data && (
                <div className="space-y-5 text-sm">

                    {/* SUMMARY */}
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                        <p className="text-2xl font-bold text-red-400">
                            {data.drop_percent}% Drop
                        </p>

                        <p className="mt-2 text-sm text-gray-600">
                            {data.recommendation}
                        </p>
                    </div>

                    {/* INSIGHTS */}
                    <div className="rounded-xl border bg-white p-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Insights
                        </h3>

                        <ul className="space-y-2">
                            {data.insights.map((i, idx) => (
                                <li
                                    key={idx}
                                    className="flex gap-2 text-gray-600"
                                >
                                    <span className="mt-1 h-2 w-2 rounded-full bg-red-400" />
                                    <span>{i}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ROOT CAUSES */}
                    <div className="rounded-xl border bg-white p-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Root Causes
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {data.root_causes.map((c, idx) => (
                                <span
                                    key={idx}
                                    className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-500"
                                >
                                    {c.replaceAll('_', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="rounded-xl border bg-white p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">
                                Top Affected Products
                            </h3>

                            <span className="text-xs text-gray-400">
                                Top 10 products
                            </span>
                        </div>

                        <div className="max-h-80 overflow-auto rounded-lg border">
                            <table className="w-full text-xs">
                                <thead className="sticky top-0 bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-3 py-2 text-left">
                                            Product
                                        </th>

                                        <th className="px-3 py-2 text-center">
                                            Yesterday
                                        </th>

                                        <th className="px-3 py-2 text-center">
                                            Today
                                        </th>

                                        <th className="px-3 py-2 text-center">
                                            Drop
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.drop_drivers
                                        ?.slice(0, 10)
                                        .map((p) => (
                                            <tr
                                                key={p.product_id}
                                                className="border-t"
                                            >
                                                <td className="px-3 py-2 text-gray-700">
                                                    {p.product_name ?? `#${p.product_id}`}
                                                </td>

                                                <td className="px-3 py-2 text-center">
                                                    {p.yesterday_qty}
                                                </td>

                                                <td className="px-3 py-2 text-center">
                                                    {p.today_qty}
                                                </td>

                                                <td className="px-3 py-2 text-center font-semibold text-red-500">
                                                    -{p.drop_qty}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}