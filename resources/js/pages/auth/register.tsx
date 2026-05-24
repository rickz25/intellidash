import { Head, useForm } from '@inertiajs/react';
import {
    LoaderCircle,
    LockKeyhole,
    Mail,
    User,
    ShieldCheck,
} from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    [key: string]: string | boolean;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
                {/* Background Glow */}
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>

                <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-lg">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Create Account
                        </h1>

                        <p className="mt-2 text-sm text-slate-300">
                            Join and start managing your dashboard
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={submit}>
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-200">
                                Full Name
                            </Label>

                            <div className="relative">
                                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    placeholder="John Doe"
                                    className="h-12 border-white/10 bg-white/5 pl-11 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>

                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-200">
                                Email Address
                            </Label>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    placeholder="email@example.com"
                                    className="h-12 border-white/10 bg-white/5 pl-11 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>

                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-200">
                                Password
                            </Label>

                            <div className="relative">
                                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Enter password"
                                    className="h-12 border-white/10 bg-white/5 pl-11 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>

                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-slate-200"
                            >
                                Confirm Password
                            </Label>

                            <div className="relative">
                                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    disabled={processing}
                                    placeholder="Confirm password"
                                    className="h-12 border-white/10 bg-white/5 pl-11 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>

                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:from-cyan-400 hover:to-indigo-500"
                            tabIndex={5}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <TextLink
                            href={route('login')}
                            tabIndex={6}
                            className="font-medium text-cyan-400 hover:text-cyan-300"
                        >
                            Log in
                        </TextLink>
                    </div>
                </div>
            </div>
        </>
    );
}


// ## Features

// * Modern glassmorphism UI
// * Gradient login button
// * Animated glowing background
// * Responsive mobile-friendly layout
// * Better spacing and typography
// * Icons inside inputs
// * Professional dashboard-style appearance
