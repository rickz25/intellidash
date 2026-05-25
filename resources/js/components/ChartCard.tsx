// resources/js/components/ChartCard.tsx

import {
    Line,
    Bar,
    Doughnut,
    Pie,
} from 'react-chartjs-2';

import type { ChartOptions } from 'chart.js';
import type { ReactNode } from 'react';

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

export interface ChartDataset {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
    tension?: number;
}

export interface ChartPayload {
    type: 'line' | 'bar' | 'pie' | 'doughnut';
    title: string;
    labels: string[];
    datasets: ChartDataset[];
}

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

interface Props {
    chart: ChartPayload;
    options?: ChartOptions<any>;
    icon?: ReactNode;
    footer?: ReactNode;
}

/*
|--------------------------------------------------------------------------
| DEFAULT CHART OPTIONS (NEW - IMPORTANT IMPROVEMENT)
|--------------------------------------------------------------------------
*/

const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
        mode: 'index',
        intersect: false,
    },

    plugins: {
        legend: {
            position: 'top',
            align: 'end',
            labels: {
                color: '#6c737c',
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 8,
                boxHeight: 8,
                padding: 20,
            },
        },

        tooltip: {
            enabled: true,
            backgroundColor: '#020617',
            titleColor: '#fff',
            bodyColor: '#e5e7eb',
            borderColor: 'rgba(255,255,255,0.12)',
            borderWidth: 1,
        },
    },

    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#6c737c' },
        },
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.08)' },
            ticks: { color: '#6c737c' },
        },
    },
};

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function ChartCard({ chart, options, icon, footer }: Props) {

    const mergedOptions = {
        ...defaultOptions,
        ...options,
    };

    const data = {
        labels: chart.labels,
        datasets: chart.datasets.map((d) => ({
            ...d,
        })),
    };

    const commonProps = {
        data,
        options: mergedOptions,
    };

    const renderChart = () => {
        switch (chart.type) {
            case 'line':
                return <Line {...commonProps} />;
            case 'bar':
                return <Bar {...commonProps} />;
            case 'doughnut':
                return <Doughnut {...commonProps} />;
            case 'pie':
                return <Pie {...commonProps} />;
            default:
                return <Line {...commonProps} />;
        }
    };

    return (
        <div className="rounded-xl border bg-white/5 p-4 shadow-sm">

            {/* HEADER */}
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-sm font-semibold">
                        {chart.title}
                    </h3>
                </div>
            </div>

            {/* CHART */}
            <div className="h-[280px] sm:h-[320px]">
                {renderChart()}
            </div>

            {/* FOOTER */}
            {footer && (
                <div className="mt-3 text-xs text-muted-foreground">
                    {footer}
                </div>
            )}

        </div>
    );
}