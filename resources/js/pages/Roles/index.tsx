import { Head } from '@inertiajs/react';
import CrudManagementPage from '@/components/crud-management-page';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles', href: '/roles' }];

export default function RolesIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <CrudManagementPage
                title="Roles"
                subtitle="Manage role names and permission keys used by access control."
                endpoint="/api/roles"
                entityName="Role"
                searchKeys={['name']}
                emptyForm={{ name: '', permissions: '' }}
                fields={[
                    { name: 'name', label: 'Role Name', placeholder: 'Manager' },
                    { name: 'permissions', label: 'Permissions', type: 'permissions', placeholder: 'branches.read\nproducts.read\nsales.create' },
                ]}
                columns={[
                    { key: 'name', label: 'Role' },
                    { key: 'permissions', label: 'Permissions', render: (item) => Array.isArray(item.permissions) ? item.permissions.length : 0 },
                    { key: 'users_count', label: 'Users' },
                ]}
            />
        </AppLayout>
    );
}
