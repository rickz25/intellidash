import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Folder,
    BookOpen,
    Building2,
    Boxes,
    Tags,
    ShoppingCart,
    Receipt,
    ShieldCheck,
    FileUp,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },

    // ERP Modules
    {
        title: 'Branch',
        url: '/branches',
        icon: Building2,
    },
    {
        title: 'Category',
        url: '/categories',
        icon: Tags,
    },
    {
        title: 'Product',
        url: '/products',
        icon: Boxes,
    },
    {
        title: 'Sale',
        url: '/sales',
        icon: ShoppingCart,
    },
    {
        title: 'Sale Items',
        url: '/sale-items',
        icon: Receipt,
    },
    {
        title: 'Role Management',
        url: '/roles',
        icon: ShieldCheck,
    },
    {
        title: 'Uploaded Reports',
        url: '/uploaded-reports',
        icon: FileUp,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}