import { Head } from '@inertiajs/react';
import CrudManagementPage, { StatusBadge } from '@/components/crud-management-page';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Uploaded Reports', href: '/uploaded-reports' }];

export default function UploadedReportsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Uploaded Reports" />
            <CrudManagementPage
                title="Uploaded Reports"
                subtitle="Track uploaded business reports and processing results."
                endpoint="/api/uploaded-reports"
                entityName="Uploaded Report"
                searchKeys={['file_name', 'report_type', 'status', 'user.name']}
                emptyForm={{ file_name: '', file_path: '', report_type: '', total_rows: 0, processed_rows: 0, failed_rows: 0, status: 'processing', remarks: '', uploaded_at: new Date().toISOString().slice(0, 16) }}
                fields={[
                    { name: 'file_name', label: 'File Name', placeholder: 'sales-import.csv' },
                    { name: 'file_path', label: 'File Path', placeholder: 'reports/sales-import.csv' },
                    { name: 'report_type', label: 'Report Type', placeholder: 'Sales' },
                    { name: 'total_rows', label: 'Total Rows', type: 'number' },
                    { name: 'processed_rows', label: 'Processed Rows', type: 'number' },
                    { name: 'failed_rows', label: 'Failed Rows', type: 'number' },
                    { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Processing', value: 'processing' }, { label: 'Completed', value: 'completed' }, { label: 'Failed', value: 'failed' }] },
                    { name: 'remarks', label: 'Remarks', type: 'textarea' },
                    { name: 'uploaded_at', label: 'Uploaded At', type: 'datetime-local' },
                ]}
                columns={[
                    { key: 'file_name', label: 'File' },
                    { key: 'report_type', label: 'Type' },
                    { key: 'processed_rows', label: 'Processed', render: (item) => `${item.processed_rows ?? 0}/${item.total_rows ?? 0}` },
                    { key: 'failed_rows', label: 'Failed' },
                    { key: 'status', label: 'Status', render: (item) => <StatusBadge active={item.status === 'completed'} trueLabel={String(item.status)} falseLabel={String(item.status)} /> },
                ]}
            />
        </AppLayout>
    );
}
