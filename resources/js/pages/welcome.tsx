import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    Brain,
    Boxes,
    ShieldCheck,
    Zap,
    TrendingUp,
} from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="IntelliDash AI ERP" />

            <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
                {/* Background Glow */}
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

                {/* Navbar */}
                <header className="relative flex items-center justify-between px-6 py-5">
                    <h1 className="text-xl font-bold tracking-tight">
                        IntelliDash <span className="text-cyan-400">AI ERP</span>
                    </h1>

                    <div className="flex gap-3">
                        <Button variant="ghost" asChild>
                            <Link href={route('login')}>Login</Link>
                        </Button>

                        <Button className="bg-gradient-to-r from-cyan-500 to-indigo-600" asChild>
                            <Link href={route('register')}>Get Started</Link>
                        </Button>
                    </div>
                </header>

                {/* Hero */}
                <section className="relative mx-auto max-w-5xl px-6 py-20 text-center">
                    <h2 className="text-4xl font-bold leading-tight md:text-6xl">
                        Smart ERP powered by <span className="text-cyan-400">AI Intelligence</span>
                    </h2>

                    <p className="mt-6 text-slate-300">
                        Predict sales, automate workflows, detect fraud, and optimize inventory in real time.
                    </p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-indigo-600" asChild>
                            <Link href={route('login')}>Start Dashboard</Link>
                        </Button>

                        <Button size="lg" variant="outline" asChild>
                            <Link
                                href={route('register')}
                                className="text-black hover:text-gray-500 dark:text-white dark:hover:text-gray-300"
                            >
                                Create Account
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <Brain className="h-8 w-8 text-cyan-400" />
                        <h3 className="mt-4 text-lg font-semibold">AI Predictions</h3>
                        <p className="mt-2 text-sm text-slate-300">
                            Forecast sales and inventory trends using machine learning models.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <BarChart3 className="h-8 w-8 text-indigo-400" />
                        <h3 className="mt-4 text-lg font-semibold">Real-time Analytics</h3>
                        <p className="mt-2 text-sm text-slate-300">
                            Monitor business KPIs with live dashboards and insights.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <ShieldCheck className="h-8 w-8 text-emerald-400" />
                        <h3 className="mt-4 text-lg font-semibold">Fraud Detection</h3>
                        <p className="mt-2 text-sm text-slate-300">
                            Detect anomalies and suspicious transactions instantly.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <Boxes className="h-8 w-8 text-yellow-400" />
                        <h3 className="mt-4 text-lg font-semibold">Inventory Control</h3>
                        <p className="mt-2 text-sm text-slate-300">
                            Prevent stockouts with automated replenishment suggestions.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <Zap className="h-8 w-8 text-pink-400" />
                        <h3 className="mt-4 text-lg font-semibold">Automation</h3>
                        <p className="mt-2 text-sm text-slate-300">
                            Streamline operations with AI-powered workflows.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <TrendingUp className="h-8 w-8 text-blue-400" />
                        <h3 className="mt-4 text-lg font-semibold">Growth Insights</h3>
                        <p className="mt-2 text-sm text-slate-300">
                            Identify opportunities to scale your business faster.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-10 border-t border-white/10 py-8 text-center text-sm text-slate-400">
                    © {new Date().getFullYear()} IntelliDash AI ERP. All rights reserved.
                </footer>
            </div>
        </>
    );
}
