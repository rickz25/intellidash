import { Head } from '@inertiajs/react';
import CrudManagementPage, { StatusBadge } from '@/components/crud-management-page';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Categories', href: '/categories' }];

export default function CategoriesIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <CrudManagementPage
                title="Categories"
                subtitle="Manage product categories used for inventory classification."
                endpoint="/api/categories"
                entityName="Category"
                searchKeys={['name', 'description']}
                emptyForm={{ name: '', description: '', status: true }}
                fields={[
                    { name: 'name', label: 'Name', placeholder: 'Beverages' },
                    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Category description' },
                    { name: 'status', label: 'Status', type: 'boolean' },
                ]}
                columns={[
                    { key: 'name', label: 'Category' },
                    { key: 'products_count', label: 'Products' },
                    { key: 'status', label: 'Status', render: (item) => <StatusBadge active={Boolean(item.status)} /> },
                ]}
            />
        </AppLayout>
    );
}
