import Modal from '@/components/modal';

interface PredictiveData {
    insight: string;
    average_daily_sales: number;
    trend_per_day: number;
    forecast_next_7_days: number[];
}

interface Props {
    open: boolean;
    onClose: () => void;
    predictive: PredictiveData | null | undefined;
    formatPHP: (value: number) => string;
}

export default function SalesForecastModal({
    open,
    onClose,
    predictive,
    formatPHP,
}: Props) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Sales Forecast"
        >
            <div className="space-y-5">

                {/* AI INSIGHT */}
                <div className="rounded-xl border bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 p-4">
                    <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                        AI Insight
                    </div>

                    <div className="text-base font-semibold text-gray-800">
                        {predictive?.insight ?? 'No insight available'}
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-xl border bg-white p-4">
                        <div className="text-xs text-gray-500">
                            Avg Daily Sales
                        </div>

                        <div className="mt-1 text-xl font-bold text-gray-900">
                            {formatPHP(
                                predictive?.average_daily_sales ?? 0
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-4">
                        <div className="text-xs text-gray-500">
                            Trend / Day
                        </div>

                        <div className="mt-1">
                            <span
                                className={
                                    (predictive?.trend_per_day ?? 0) > 0
                                        ? 'font-semibold text-green-500'
                                        : 'font-semibold text-red-500'
                                }
                            >
                                {(predictive?.trend_per_day ?? 0) > 0
                                    ? '↗ Upward Trend'
                                    : '↘ Downward Trend'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* FORECAST */}
                <div className="rounded-xl border bg-white p-4">

                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-900">
                            Next 7 Days Forecast
                        </div>

                        <div className="text-xs text-gray-400">
                            AI Projection
                        </div>
                    </div>

                    <div className="space-y-2">
                        {(predictive?.forecast_next_7_days ?? []).map(
                            (value: number, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                                >
                                    <span className="text-sm text-gray-500">
                                        Day {idx + 1}
                                    </span>

                                    <span className="text-sm font-semibold text-gray-800">
                                        {formatPHP(value)}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}