import { Head } from '@inertiajs/react';
import CrudManagementPage, { StatusBadge } from '@/components/crud-management-page';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Sales', href: '/sales' }];

export default function SalesIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales" />
            <CrudManagementPage
                title="Sales"
                subtitle="Manage sales transactions, payment status, totals, and branch assignment."
                endpoint="/api/sales"
                entityName="Sale"
                paginated
                perPage={10}
                searchKeys={['invoice_no', 'customer_name', 'branch.name', 'payment_method', 'status']}
                emptyForm={{ branch_id: '', invoice_no: '', customer_name: '', transaction_date: new Date().toISOString().slice(0, 16), subtotal: 0, tax: 0, discount: 0, total_amount: 0, payment_method: 'Cash', status: 'completed' }}
                fields={[
                    { name: 'branch_id', label: 'Branch', type: 'select', lookup: '/api/branches' },
                    { name: 'invoice_no', label: 'Invoice No.', placeholder: 'INV-0001' },
                    { name: 'customer_name', label: 'Customer Name', placeholder: 'Walk-in customer' },
                    { name: 'transaction_date', label: 'Transaction Date', type: 'datetime-local' },
                    { name: 'subtotal', label: 'Subtotal', type: 'number' },
                    { name: 'tax', label: 'Tax', type: 'number' },
                    { name: 'discount', label: 'Discount', type: 'number' },
                    { name: 'total_amount', label: 'Total Amount', type: 'number' },
                    { name: 'payment_method', label: 'Payment Method', type: 'select', options: [{ label: 'Cash', value: 'Cash' }, { label: 'Card', value: 'Card' }, { label: 'GCash', value: 'GCash' }, { label: 'Bank Transfer', value: 'Bank Transfer' }] },
                    { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Completed', value: 'completed' }, { label: 'Cancelled', value: 'cancelled' }] },
                ]}
                columns={[
                    { key: 'invoice_no', label: 'Invoice' },
                    { key: 'branch.name', label: 'Branch' },
                    { key: 'customer_name', label: 'Customer' },
                    { key: 'total_amount', label: 'Total', render: (item) => `PHP ${Number(item.total_amount ?? 0).toLocaleString()}` },
                    { key: 'payment_method', label: 'Payment' },
                    { key: 'status', label: 'Status', render: (item) => <StatusBadge active={item.status === 'completed'} trueLabel="Completed" falseLabel="Cancelled" /> },
                ]}
            />
        </AppLayout>
    );
}
