import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Account Settings',
        href: '/settings/profile',
    },
];

export default function ProfileSettings() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<{
        name: string;
        email: string;
        phone: string;
        company: string;
        position: string;
        bio: string;
    }>({
        name: auth.user.name ?? '',
        email: auth.user.email ?? '',
        phone: String(auth.user.phone ?? ''),
        company: String(auth.user.company ?? 'IntelliDash AI ERP'),
        position: String(auth.user.position ?? ''),
        bio: String(auth.user.bio ?? ''),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account Settings" />

            <SettingsLayout>
                <div className="space-y-8">
                    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                        <HeadingSmall
                            title="Profile Information"
                            description="Manage your IntelliDash AI ERP account details and contact information."
                        />

                        <form onSubmit={submit} className="mt-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>

                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter full name"
                                        autoComplete="name"
                                        required
                                    />

                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter email address"
                                        autoComplete="username"
                                        required
                                    />

                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>

                                    <Input
                                        id="phone"
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Enter phone number"
                                    />

                                    <InputError message={errors.phone} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="position">Position / Role</Label>

                                    <Input
                                        id="position"
                                        type="text"
                                        value={data.position}
                                        onChange={(e) => setData('position', e.target.value)}
                                        placeholder="e.g. System Administrator"
                                    />

                                    <InputError message={errors.position} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>

                                <Input
                                    id="company"
                                    type="text"
                                    value={data.company}
                                    onChange={(e) => setData('company', e.target.value)}
                                    placeholder="Company name"
                                />

                                <InputError message={errors.company} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">About</Label>

                                <Textarea
                                    id="bio"
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    placeholder="Write a short description about your role or responsibilities..."
                                    className="min-h-[120px]"
                                />

                                <InputError message={errors.bio} />
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <Button disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
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
                                        Profile updated successfully.
                                    </p>
                                </Transition>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6 shadow-sm dark:border-red-900 dark:bg-red-950/10">
                        <DeleteUser />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
