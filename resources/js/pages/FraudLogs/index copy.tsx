import { Head } from '@inertiajs/react';
import CrudManagementPage from '@/components/crud-management-page';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Fraud Logs', href: '/fraud-logs' }];


export default function FraudLogsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fraud Logs" />
            <CrudManagementPage
                title="Fraud Logs"
                subtitle="Manage individual fraud logs."
                endpoint="/api/fraud-logs"
                entityName="Fraud Log"
                paginated
                perPage={10}
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
                        render: (item) => (
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


