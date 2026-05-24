import { Head } from '@inertiajs/react';
import DataTablePage from '@/components/DataTablePage';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Fraud Logs', href: '/fraud-logs' },
];

export default function FraudLogsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fraud Logs" />

            <DataTablePage
                title="Fraud Logs"
                subtitle="System fraud monitoring logs"
                endpoint="/api/fraud-logs"
                searchKeys={[
                    'risk_score',
                    'risk_level',
                    'high_discount_alerts',
                    'sales_spikes_count',
                    'suspicious_cashiers_count',
                ]}
                columns={[
                    { key: 'risk_score', label: 'Risk Score' },
                    { key: 'risk_level', label: 'Risk Level' },
                    { key: 'high_discount_alerts', label: 'High Discount Alerts' },
                    { key: 'sales_spikes_count', label: 'Sales Spikes' },
                    { key: 'suspicious_cashiers_count', label: 'Suspicious Cashiers' },
                    {
                        key: 'meta',
                        label: 'Meta',
                        render: (item: any) => (
                            <pre className="max-h-40 overflow-auto whitespace-pre-wrap">
                                {JSON.stringify(item.meta, null, 2)}
                            </pre>
                        ),
                    },
                ]}
            />

        </AppLayout>
    );
}