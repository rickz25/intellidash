import { Head } from '@inertiajs/react';
import CrudManagementPage from '@/components/crud-management-page';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Sale Items', href: '/sale-items' }];

export default function SaleItemsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sale Items" />
            <CrudManagementPage
                title="Sale Items"
                subtitle="Manage individual products attached to sales transactions."
                endpoint="/api/sale-items"
                entityName="Sale Item"
                paginated
                perPage={10}
                searchKeys={['sale.invoice_no', 'product.name', 'product.sku']}
                emptyForm={{ sale_id: '', product_id: '', quantity: 1, unit_price: 0, discount: 0, total: 0 }}
                fields={[
                    { name: 'sale_id', label: 'Sale', type: 'select', lookup: '/api/sales?lookup=1', optionLabel: 'invoice_no' },
                    { name: 'product_id', label: 'Product', type: 'select', lookup: '/api/products?lookup=1', optionLabel: 'name' },
                    { name: 'quantity', label: 'Quantity', type: 'number' },
                    { name: 'unit_price', label: 'Unit Price', type: 'number' },
                    { name: 'discount', label: 'Discount', type: 'number' },
                    { name: 'total', label: 'Total', type: 'number' },
                ]}
                columns={[
                    { key: 'sale.invoice_no', label: 'Invoice' },
                    { key: 'product.name', label: 'Product' },
                    { key: 'quantity', label: 'Qty' },
                    { key: 'unit_price', label: 'Unit Price', render: (item) => `PHP ${Number(item.unit_price ?? 0).toLocaleString()}` },
                    { key: 'total', label: 'Total', render: (item) => `PHP ${Number(item.total ?? 0).toLocaleString()}` },
                ]}
            />
        </AppLayout>
    );
}


