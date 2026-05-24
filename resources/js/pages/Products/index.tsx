import { Head, usePage } from '@inertiajs/react';
import CrudManagementPage, { StatusBadge } from '@/components/crud-management-page';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';


const breadcrumbs: BreadcrumbItem[] = [{ title: 'Products', href: '/products' }];

// export default function ProductsIndex() {
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Products" />
//             <CrudManagementPage
//                 title="Products"
//                 subtitle="Maintain inventory items, pricing, stock levels, and branch/category assignment."
//                 endpoint="/api/products"
//                 entityName="Product"
//                 searchKeys={['sku', 'barcode', 'name', 'branch.name', 'category.name']}
//                 emptyForm={{ branch_id: '', category_id: '', sku: '', barcode: '', name: '', description: '', price: 0, cost: 0, stock_quantity: 0, reorder_level: 0, image: '', status: true }}
//                 fields={[
//                     { name: 'branch_id', label: 'Branch', type: 'select', lookup: '/api/branches' },
//                     { name: 'category_id', label: 'Category', type: 'select', lookup: '/api/categories' },
//                     { name: 'sku', label: 'SKU', placeholder: 'SKU-001' },
//                     { name: 'barcode', label: 'Barcode', placeholder: 'Optional barcode' },
//                     { name: 'name', label: 'Product Name', placeholder: 'Product name' },
//                     { name: 'description', label: 'Description', type: 'textarea' },
//                     { name: 'price', label: 'Price', type: 'number' },
//                     { name: 'cost', label: 'Cost', type: 'number' },
//                     { name: 'stock_quantity', label: 'Stock Quantity', type: 'number' },
//                     { name: 'reorder_level', label: 'Reorder Level', type: 'number' },
//                     { name: 'image', label: 'Image Path', placeholder: 'Optional image path' },
//                     { name: 'status', label: 'Status', type: 'boolean' },
//                 ]}
//                 columns={[
//                     { key: 'name', label: 'Product', render: (item) => <div><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.sku}</p></div> },
//                     { key: 'branch.name', label: 'Branch' },
//                     { key: 'category.name', label: 'Category' },
//                     { key: 'stock_quantity', label: 'Stock' },
//                     { key: 'price', label: 'Price', render: (item) => `PHP ${Number(item.price ?? 0).toLocaleString()}` },
//                     { key: 'status', label: 'Status', render: (item) => <StatusBadge active={Boolean(item.status)} /> },
//                 ]}
//             />
//         </AppLayout>

export default function ProductsIndex() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/products' }
    ];
    const { url } = usePage();

    const params = new URLSearchParams(url.split('?')[1]);

    const risk = params.get('risk');
    const product_name = params.get('product_name');

    const query = new URLSearchParams();

    if (risk) query.append('risk', risk);
    if (product_name) query.append('product_name', product_name);

    const endpoint = `/api/products?${query.toString()}`;


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <CrudManagementPage
                title="Products"
                subtitle="Maintain inventory items, pricing, stock levels, and branch/category assignment."
                endpoint={endpoint}
                entityName="Product"
                paginated
                perPage={10}
                searchKeys={['sku', 'barcode', 'name', 'branch.name', 'category.name']}
                emptyForm={{
                    branch_id: '',
                    category_id: '',
                    sku: '',
                    barcode: '',
                    name: '',
                    description: '',
                    price: 0,
                    cost: 0,
                    stock_quantity: 0,
                    reorder_level: 0,
                    image: '',
                    status: true
                }}
                fields={[
                    { name: 'branch_id', label: 'Branch', type: 'select', lookup: '/api/branches' },
                    { name: 'category_id', label: 'Category', type: 'select', lookup: '/api/categories' },
                    { name: 'sku', label: 'SKU' },
                    { name: 'barcode', label: 'Barcode' },
                    { name: 'name', label: 'Product Name' },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'price', label: 'Price', type: 'number' },
                    { name: 'cost', label: 'Cost', type: 'number' },
                    { name: 'stock_quantity', label: 'Stock Quantity', type: 'number' },
                    { name: 'reorder_level', label: 'Reorder Level', type: 'number' },
                    { name: 'image', label: 'Image Path' },
                    { name: 'status', label: 'Status', type: 'boolean' },
                ]}
                columns={[
                    {
                        key: 'name',
                        label: 'Product',
                        render: (item) => (
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.sku}</p>
                            </div>
                        )
                    },
                    { key: 'branch.name', label: 'Branch' },
                    { key: 'category.name', label: 'Category' },
                    { key: 'stock_quantity', label: 'Stock' },
                    {
                        key: 'price',
                        label: 'Price',
                        render: (item) => `PHP ${Number(item.price ?? 0).toLocaleString()}`
                    },
                    {
                        key: 'status',
                        label: 'Status',
                        render: (item) => <StatusBadge active={Boolean(item.status)} />
                    },
                ]}
            />
        </AppLayout>
    );
}
