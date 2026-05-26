import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'System Appearance',
        href: '/settings/appearance',
    },
];

export default function AppearanceSettings() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Appearance" />

            <SettingsLayout>
                <div className="space-y-8">
                    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                        <HeadingSmall
                            title="System Appearance"
                            description="Customize the IntelliDash AI ERP interface, theme, and display preferences."
                        />

                        <div className="mt-6">
                            <AppearanceTabs />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-muted/30 p-5">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold tracking-wide text-foreground">
                                Display Preferences
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Choose between light mode, dark mode, or system theme to match your workflow and
                                improve visual comfort while using IntelliDash AI ERP.
                            </p>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}