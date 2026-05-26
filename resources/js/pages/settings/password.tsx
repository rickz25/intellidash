import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Security',
        href: '/settings/password',
    },
];

export default function PasswordSettings() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Security Settings" />

            <SettingsLayout>
                <div className="space-y-8">
                    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                        <HeadingSmall
                            title="Security Settings"
                            description="Update your password to keep your IntelliDash AI ERP account secure."
                        />

                        <form onSubmit={updatePassword} className="mt-6 space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">Current Password</Label>

                                <Input
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter current password"
                                />

                                <InputError message={errors.current_password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">New Password</Label>

                                <Input
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Enter new password"
                                />

                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>

                                <Input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Confirm new password"
                                />

                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <Button disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Password'}
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm font-medium text-green-600">
                                        Password updated successfully.
                                    </p>
                                </Transition>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-2xl border border-muted bg-muted/30 p-5">
                        <p className="text-sm text-muted-foreground">
                            Use a strong password with a mix of letters, numbers, and symbols to protect your account.
                        </p>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}