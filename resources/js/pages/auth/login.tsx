import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: string | boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
                {/* Background Glow */}
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>

                <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-lg">
                            <LockKeyhole className="h-8 w-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-sm text-slate-300">
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-400">
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-5" onSubmit={submit}>
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
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                    className="h-12 border-white/10 bg-white/5 pl-11 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>

                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-200">
                                    Password
                                </Label>

                                {canResetPassword && (
                                    <TextLink
                                        href={route('password.request')}
                                        className="text-sm text-cyan-400 hover:text-cyan-300"
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>

                            <div className="relative">
                                <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    className="h-12 border-white/10 bg-white/5 pl-11 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                                />
                            </div>

                            <InputError message={errors.password} />
                        </div>

                        {/* Remember */}
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) =>
                                        setData('remember', checked as boolean)
                                    }
                                    tabIndex={3}
                                />

                                <Label
                                    htmlFor="remember"
                                    className="text-sm text-slate-300"
                                >
                                    Remember me
                                </Label>
                            </div>
                        </div>

                        {/* Button */}
                        <Button
                            type="submit"
                            className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:from-cyan-400 hover:to-indigo-500"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <TextLink
                            href={route('register')}
                            tabIndex={5}
                            className="font-medium text-cyan-400 hover:text-cyan-300"
                        >
                            Create account
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
