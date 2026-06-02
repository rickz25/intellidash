import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import {
    Brain,
    TrendingUp,
    Boxes,
    ShieldCheck,
    BarChart3,
    ShoppingCart,
    AlertTriangle,
    PieChart,
} from 'lucide-react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import type { ChartOptions } from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

import KpiCard from '@/components/KpiCard';
import ChartCard from '@/components/ChartCard';
import { formatPHP } from '@/utils/format';
import SalesInsightModal from '@/components/dashboard/SalesInsightModal';
import SalesForecastModal from '@/components/dashboard/SalesForecastModal';
import RestockRecommendationModal from '@/components/dashboard/RestockRecommendationModal';


/*
|--------------------------------------------------------------------------
| TYPES (ENTERPRISE SAFE CONTRACT)
|--------------------------------------------------------------------------
*/

interface FraudData {
    risk_score: number;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    high_discount_alerts: number;
    sales_spikes_count: number;
    suspicious_cashiers_count: number;
}

interface SalesInsight {
    status: string;
    drop_percent: number;
    insights: string[];
    root_causes: string[];
    recommendation: string;
}

interface PredictiveData {
    model: string;
    average_daily_sales: number;
    trend_per_day: number;
    forecast_next_7_days: number[];
    insight: string;
}

interface InventoryProduct {
    id: number;
    name: string;
    stock_quantity: number;
    reorder_level: number;
}

interface InventoryRisk {
    high_risk_count: number;
    critical_product: InventoryProduct | null;
}

interface MonthlyTrend {
    month: number;
    total: number;
}

interface DailySales {
    date: string;
    total: number;
}

interface RealtimeData {
    low_stock_products: InventoryProduct[];
    revenue: number;
    sales: number;
    inventory: number;

    fraud: FraudData | null;
    sales_insight: SalesInsight | null;
    predictive: PredictiveData | null;
    inventory_risk: InventoryRisk | null;

    trends?: {
        daily_sales?: DailySales[];
    };
}

interface ExecutiveData {
    yoy_sales?: {
        growth_percent: number;
    };

    profit_margin?: number;

    cash_flow?: {
        cash_in: number;
        cash_out_inventory_value: number;
    };

    monthly_trend?: MonthlyTrend[];
}
interface ChartPayload {
    type: string;
    title: string;
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string;
        fill?: boolean;
        tension?: number;
        pointRadius?: number;
    }>;
}

interface DashboardCharts {
    sales_trend?: ChartPayload;
    revenue_by_branch?: ChartPayload;
    top_products?: ChartPayload;
    low_stock_products?: ChartPayload;
    monthly_revenue?: ChartPayload;
    payment_methods?: ChartPayload;
    fraud_risk_trend?: ChartPayload;
    sales_by_category?: ChartPayload;
}
type DashboardChartKey = keyof DashboardCharts;

interface DashboardChartConfig {
    key: DashboardChartKey;
    icon: ReactNode;
    className?: string;
    footer?: ReactNode;
}

interface AiLayer {
    status: string;
    risk_level: string;
    recommendation: string;
}

interface DashboardResponse {
    realtime: RealtimeData;
    executive: ExecutiveData;
    ai_layer: AiLayer;
    charts?: DashboardCharts;
}

/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

const currency = (value: number) =>
    `₱ ${new Intl.NumberFormat('en-PH').format(value ?? 0)}`;

const dashboardSearchUrl = (path: string, search?: unknown) => {
    const term =
        typeof search === 'string'
            ? search.trim()
            : '';

    return term
        ? `${path}?search=${encodeURIComponent(term)}`
        : path;
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

function AlertLink({
    href,
    label,
    children,
    as,
    onClick,
}: {
    href?: string;
    label: string;
    children: ReactNode;
    as?: 'button';
    onClick?: () => void;
}) {
    const className = "flex items-center justify-between gap-4 w-full rounded-lg border border-transparent px-3 py-2 text-muted-foreground transition-all duration-150 hover:border-white/10 hover:bg-white/5 active:scale-[0.99] active:opacity-80 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20";
    const left = (
        <span className="flex-1 text-left">
            {label}
        </span>
    );

    const right = (
        <span className="flex-shrink-0 text-right">
            {children}
        </span>
    );

    if (as === 'button') {
        return (
            <button
                type="button"
                onClick={onClick}
                className={className}
            >
                {left}
                {right}
            </button>
        );
    }

    return (
        <Link href={href ?? '#'} className={className}>
            {left}
            {right}
        </Link>
    );
}

export default function Dashboard() {

    const mountedRef = useRef(true);

    const [ai, setAi] = useState<DashboardResponse | null>(null);

    /*
    |--------------------------------------------------------------------------
    | LOAD DASHBOARD
    |--------------------------------------------------------------------------
    */

    const loadDashboard = async () => {
        try {

            const res = await axios.get<DashboardResponse>(
                '/api/dashboard/ai',
                {
                    timeout: 10000,
                }
            );

            if (!mountedRef.current) return;

            setAi(res.data);

        } catch (err) {

            console.error('AI Dashboard failed:', err);

        }
    };

    const dashboardChartRegistry: DashboardChartConfig[] = [
        {
            key: 'sales_trend',
            icon: <TrendingUp className="h-5 w-5 text-cyan-400" />,
            className: 'xl:col-span-2',
            footer: <Link href="/sales" className="hover:text-cyan-300">Open sales transactions</Link>,
        },
        {
            key: 'revenue_by_branch',
            icon: <BarChart3 className="h-5 w-5 text-green-400" />,
            footer: <Link href="/branches" className="hover:text-green-300">Review branch records</Link>,
        },
        {
            key: 'monthly_revenue',
            icon: <TrendingUp className="h-5 w-5 text-emerald-400" />,
            footer: <Link href="/sales" className="hover:text-emerald-300">Inspect monthly sales</Link>,
        },
        {
            key: 'top_products',
            icon: <BarChart3 className="h-5 w-5 text-indigo-400" />,
            footer: <Link href="/products" className="hover:text-indigo-300">Open product catalog</Link>,
        },
        {
            key: 'low_stock_products',
            icon: <Boxes className="h-5 w-5 text-red-400" />,
            footer: <Link href="/products?risk=high_risk" className="hover:text-red-300">View high-risk inventory</Link>,
        },
        {
            key: 'payment_methods',
            icon: <PieChart className="h-5 w-5 text-yellow-400" />,
            footer: <Link href="/sales" className="hover:text-yellow-300">Audit payment mix</Link>,
        },
        {
            key: 'fraud_risk_trend',
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            footer: <Link href="/fraud-logs" className="hover:text-red-300">Open fraud logs</Link>,
        },
        {
            key: 'sales_by_category',
            icon: <PieChart className="h-5 w-5 text-purple-400" />,
            footer: <Link href="/categories" className="hover:text-purple-300">Review categories</Link>,
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | INITIAL LOAD + POLLING
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadDashboard();

        const interval = setInterval(() => {
            loadDashboard();
        }, 30000);

        return () => {
            mountedRef.current = false;
            clearInterval(interval);
        };

    }, []);

    /*
    |--------------------------------------------------------------------------
    | SAFE DATA EXTRACTION
    |--------------------------------------------------------------------------
    */

    const realtime = ai?.realtime;
    const executive = ai?.executive;
    const aiLayer = ai?.ai_layer;
    const charts = ai?.charts;

    const fraud = realtime?.fraud;
    const salesInsight = realtime?.sales_insight;
    const predictive = realtime?.predictive;
    const inventory = realtime?.inventory_risk;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Record<string, unknown> | null>(null);
    const [openTrend, setOpenTrend] = useState(false);
    const [openRestockModal, setOpenRestockModal] = useState(false);

    const openSalesInsight = async () => {
        setOpen(true);
        setLoading(true);

        try {
            const res = await axios.get('/api/insights/sales-drop');
            setData(res.data);
        } catch (err) {
            console.error(err);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | CHART DATA
    |--------------------------------------------------------------------------
    */


    /*
    |--------------------------------------------------------------------------
    | QUICK ACTIONS
    |--------------------------------------------------------------------------
    */

    const [runningAction, setRunningAction] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const runQuickAction = async (action: 'forecast' | 'fraud' | 'inventory') => {
        try {
            setRunningAction(action);
            setActionMessage(null);

            await axios.post(`/api/dashboard/ai/actions/${action}`, {}, {
                timeout: 15000,
            });

            await loadDashboard();

            setActionMessage(
                action === 'forecast'
                    ? 'AI forecast recalculated.'
                    : action === 'fraud'
                        ? 'Fraud detection recalculated.'
                        : 'Inventory optimization recalculated.'
            );
        } catch (err) {
            console.error('Quick action failed:', err);
            setActionMessage('Quick action failed. Please try again.');
        } finally {
            setRunningAction(null);
        }
    };
    /*
    |--------------------------------------------------------------------------
    | LOADING SCREEN
    |--------------------------------------------------------------------------
    */

    if (!ai) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                Loading AI Executive Dashboard...
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">

                {/* HEADER */}
                <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Executive Dashboard
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            IntelliDash AI ERP Overview
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Real-time sales, inventory, fraud risk, and AI-driven business insights.
                        </p>
                    </div>

                    <div className="inline-flex w-fit items-center rounded-full border bg-white/5 px-3 py-1 text-xs font-medium text-green-400">
                        {aiLayer?.status === 'warning' ? 'Needs Attention' : 'System Healthy'}
                    </div>
                </div>

                {/* KPI */}
                <div className="grid gap-4 md:grid-cols-4">

                    <Link href="/sales" className="block rounded-2xl transition hover:-translate-y-0.5 hover:bg-white/5">
                        <KpiCard
                            title="Revenue"
                            value={realtime?.revenue ?? 0}
                            prefix="₱ "
                            icon={TrendingUp}
                        />
                    </Link>

                    <Link href="/sales" className="block rounded-2xl transition hover:-translate-y-0.5 hover:bg-white/5">
                        <KpiCard
                            title="Sales"
                            value={realtime?.sales ?? 0}
                            icon={ShoppingCart}
                        />
                    </Link>

                    <Link href={dashboardSearchUrl('/products', inventory?.critical_product)} className="block rounded-2xl transition hover:-translate-y-0.5 hover:bg-white/5">
                        <KpiCard
                            title="Inventory"
                            value={realtime?.inventory ?? 0}
                            prefix="₱ "
                            icon={Boxes}
                        />
                    </Link>

                    <Link href="/fraud-logs" className="block rounded-2xl transition hover:-translate-y-0.5 hover:bg-white/5">
                        <KpiCard
                            title="Fraud Alerts"
                            value={
                                fraud
                                    ? `${fraud.risk_level} (${fraud.risk_score})`
                                    : 'LOW (0)'
                            }
                            icon={AlertTriangle}
                            color={
                                fraud?.risk_level === 'HIGH'
                                    ? 'text-red-500'
                                    : fraud?.risk_level === 'MEDIUM'
                                        ? 'text-yellow-400'
                                        : 'text-green-400'
                            }
                        />
                    </Link>
                </div>

                {/* EXECUTIVE */}
                <div className="grid gap-4 md:grid-cols-3">

                    <div className="rounded-2xl border bg-white/5 p-5">

                        <h3 className="text-sm text-muted-foreground">
                            Year-over-Year Growth
                        </h3>

                        <p className="mt-2 text-3xl font-bold text-green-400">
                            {Number(
                                executive?.yoy_sales?.growth_percent ?? 0
                            ).toFixed(2)}%
                        </p>

                        <p className="mt-2 text-xs text-muted-foreground">
                            Compared to last year
                        </p>

                    </div>

                    <div className="rounded-2xl border bg-white/5 p-5">

                        <h3 className="text-sm text-muted-foreground">
                            Profit Margin
                        </h3>

                        <p className="mt-2 text-3xl font-bold text-cyan-400">
                            {executive?.profit_margin ?? 0}%
                        </p>

                        <p className="mt-2 text-xs text-muted-foreground">
                            Net profitability
                        </p>

                    </div>

                    <div className="rounded-2xl border bg-white/5 p-5">

                        <h3 className="text-sm text-muted-foreground">
                            Cash Flow
                        </h3>

                        <p className="mt-2 text-xl font-bold text-green-400">
                            {currency(
                                executive?.cash_flow?.cash_in ?? 0
                            )}
                        </p>

                        <p className="text-xs text-red-400">
                            Inventory Value:{' '}
                            {currency(
                                executive?.cash_flow?.cash_out_inventory_value ?? 0
                            )}
                        </p>

                    </div>
                </div>

                {/* AI INSIGHTS */}
                <div className="grid gap-6 md:grid-cols-3">

                    <div className="col-span-2 rounded-2xl border bg-white/5 p-5">

                        <div className="mb-4 flex items-center gap-2">
                            <Brain className="h-5 w-5 text-cyan-400" />
                            <h3 className="font-semibold">
                                AI Insights
                            </h3>
                        </div>

                        <div className="space-y-2 text-sm">
                            <AlertLink
                                as="button"
                                label="Sales status"
                                onClick={openSalesInsight}
                            >
                                <span className={salesInsight?.status === 'warning' ? 'text-red-400' : 'text-green-400'}>
                                    {salesInsight?.status ?? 'stable'} ({salesInsight?.drop_percent ?? 0}% drop)
                                </span>
                            </AlertLink>

                            <SalesInsightModal
                                open={open}
                                onClose={() => setOpen(false)}
                                loading={loading}
                                data={data}
                            />

                            <AlertLink
                                as="button"
                                label="Insight"
                                onClick={openSalesInsight}
                            >
                                <span className="text-cyan-300">
                                    {salesInsight?.insights?.[0] ?? 'No insight'}
                                </span>
                            </AlertLink>

                            <AlertLink
                                as="button"
                                label="Trend"
                                onClick={() => setOpenTrend(true)}
                            >
                                <span
                                    className={
                                        (predictive?.trend_per_day ?? 0) < 0
                                            ? 'text-red-400'
                                            : 'text-green-400'
                                    }
                                >
                                    {predictive?.insight ?? 'No trend'}
                                </span>
                            </AlertLink>

                            <SalesForecastModal
                                open={openTrend}
                                onClose={() => setOpenTrend(false)}
                                predictive={predictive}
                                formatPHP={formatPHP}
                            />
                            {/* Fraud Risk */}
                            {/* <AlertLink href="/sales?search=discount" label="Fraud risk">
                                <span
                                    className={
                                        fraud?.risk_level === 'HIGH'
                                            ? 'text-red-500'
                                            : fraud?.risk_level === 'MEDIUM'
                                            ? 'text-yellow-400'
                                            : 'text-green-400'
                                    }
                                >
                                    {fraud?.risk_level ?? 'LOW'} ({fraud?.risk_score ?? 0})
                                </span>
                            </AlertLink> */}
                            <AlertLink href="/products?risk=high_risk" label="High-risk SKUs">
                                <span className="text-yellow-400">
                                    {inventory?.high_risk_count ?? 0}
                                </span>
                            </AlertLink>


                            <AlertLink
                                href={`/products?product_name=${encodeURIComponent(
                                    inventory?.critical_product?.name ?? ''
                                )}`}
                                label="Critical product"
                            >
                                <span className="text-cyan-300">
                                    {inventory?.critical_product?.name ?? 'None'}
                                </span>
                            </AlertLink>

                            {/* <AlertLink href={aiLayer?.recommendation?.toLowerCase().includes('restock') ? dashboardSearchUrl('/products', inventory?.critical_product) : '/sales'} label="AI Recommendation">
                                <span className="text-indigo-300">
                                    {aiLayer?.recommendation ?? 'System stable'}
                                </span>
                            </AlertLink> */}

                            <AlertLink
                                as="button"
                                onClick={() => setOpenRestockModal(true)}
                                label="AI Recommendation"
                            >
                                <span className="text-indigo-300">
                                    {aiLayer?.recommendation ?? 'System stable'}
                                </span>
                            </AlertLink>

                            <RestockRecommendationModal
                                open={openRestockModal}
                                onClose={() => setOpenRestockModal(false)}
                                products={ai?.realtime?.low_stock_products ?? []}
                            />


                        </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="rounded-2xl border bg-white/5 p-5">

                        <div className="mb-4 flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-400" />
                            <h3 className="font-semibold">
                                Quick Actions
                            </h3>
                        </div>

                        <div className="flex flex-col gap-2">

                            <button
                                disabled={runningAction !== null}
                                onClick={() => runQuickAction('forecast')}
                                className="rounded-lg bg-cyan-500/10 px-3 py-2 text-left text-sm hover:bg-cyan-500/20 disabled:opacity-50"
                            >
                                {runningAction === 'forecast' ? 'Running Forecast...' : 'Run AI Forecast'}
                            </button>

                            <button
                                disabled={runningAction !== null}
                                onClick={() => runQuickAction('fraud')}
                                className="rounded-lg bg-indigo-500/10 px-3 py-2 text-left text-sm hover:bg-indigo-500/20 disabled:opacity-50"
                            >
                                {runningAction === 'fraud' ? 'Detecting Fraud...' : 'Detect Fraud'}
                            </button>

                            <button
                                disabled={runningAction !== null}
                                onClick={() => runQuickAction('inventory')}
                                className="rounded-lg bg-yellow-500/10 px-3 py-2 text-left text-sm hover:bg-yellow-500/20 disabled:opacity-50"
                            >
                                {runningAction === 'inventory' ? 'Optimizing Inventory...' : 'Optimize Inventory'}
                            </button>

                            {actionMessage && (
                                <p className="mt-3 text-xs text-muted-foreground">
                                    {actionMessage}
                                </p>
                            )}

                        </div>
                    </div>
                </div>

                {/* CHARTS */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold">
                                Business Analytics
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Sales, inventory, branch, payment, fraud, and category performance from ChartService.
                            </p>
                        </div>

                        <span className="text-xs text-muted-foreground">
                            {charts ? String(Object.keys(charts).length) + ' charts available' : 'No chart data'}
                        </span>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        {dashboardChartRegistry.map((config) => {
                            const chart = charts?.[config.key];

                            if (!chart) return null;

                            return (
                                <div key={config.key} className={config.className}>
                                    <ChartCard
                                        chart={chart}
                                        icon={config.icon}
                                        footer={config.footer}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout >
    );
}