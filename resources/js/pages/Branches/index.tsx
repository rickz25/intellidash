import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
    Building2,
    CheckCircle2,
    Edit3,
    Loader2,
    MapPin,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Branch {
    id: number;
    branch_code: string;
    name: string;
    address: string;
    city: string;
    contact_number: string | null;
    email: string | null;
    manager_name: string | null;
    status: boolean;
    users_count?: number;
    products_count?: number;
    sales_count?: number;
    created_at?: string;
}

interface BranchForm {
    branch_code: string;
    name: string;
    address: string;
    city: string;
    contact_number: string;
    email: string;
    manager_name: string;
    status: boolean;
}

interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Branches', href: '/branches' },
];

const emptyForm: BranchForm = {
    branch_code: '',
    name: '',
    address: '',
    city: '',
    contact_number: '',
    email: '',
    manager_name: '',
    status: true,
};

export default function BranchesIndex() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [form, setForm] = useState<BranchForm>(emptyForm);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    const loadBranches = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get<Branch[]>('/api/branches', {
                timeout: 10000,
            });

            setBranches(response.data);
        } catch (err) {
            setError(getErrorMessage(err, 'Unable to load branches.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBranches();
    }, []);

    const filteredBranches = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return branches;

        return branches.filter((branch) =>
            [
                branch.branch_code,
                branch.name,
                branch.city,
                branch.address,
                branch.email ?? '',
                branch.manager_name ?? '',
            ]
                .join(' ')
                .toLowerCase()
                .includes(term),
        );
    }, [branches, search]);

    const activeCount = branches.filter((branch) => branch.status).length;
    const inactiveCount = branches.length - activeCount;

    const updateField = <K extends keyof BranchForm>(field: K, value: BranchForm[K]) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const resetForm = () => {
        setEditingBranch(null);
        setForm(emptyForm);
        setFieldErrors({});
        setError(null);
    };

    const editBranch = (branch: Branch) => {
        setEditingBranch(branch);
        setForm({
            branch_code: branch.branch_code,
            name: branch.name,
            address: branch.address,
            city: branch.city,
            contact_number: branch.contact_number ?? '',
            email: branch.email ?? '',
            manager_name: branch.manager_name ?? '',
            status: Boolean(branch.status),
        });
        setFieldErrors({});
        setError(null);
        setMessage(null);
    };

    const submitBranch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError(null);
            setMessage(null);
            setFieldErrors({});

            if (editingBranch) {
                await axios.put(`/api/branches/${editingBranch.id}`, form, {
                    timeout: 10000,
                });
                setMessage('Branch updated successfully.');
            } else {
                await axios.post('/api/branches', form, {
                    timeout: 10000,
                });
                setMessage('Branch created successfully.');
            }

            resetForm();
            await loadBranches();
        } catch (err) {
            const apiError = getApiError(err);
            setError(apiError.message ?? 'Unable to save branch.');
            setFieldErrors(apiError.errors ?? {});
        } finally {
            setSaving(false);
        }
    };

    const deleteBranch = async (branch: Branch) => {
        const confirmed = window.confirm(`Delete ${branch.name}? This cannot be undone.`);

        if (!confirmed) return;

        try {
            setDeletingId(branch.id);
            setError(null);
            setMessage(null);

            await axios.delete(`/api/branches/${branch.id}`, {
                timeout: 10000,
            });

            setMessage('Branch deleted successfully.');
            await loadBranches();
        } catch (err) {
            setError(getErrorMessage(err, 'Unable to delete branch.'));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Branches" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Branch Management
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                            Branches
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Maintain branch records, contact details, managers, and operating status.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center sm:min-w-[320px]">
                        <Metric label="Total" value={branches.length} />
                        <Metric label="Active" value={activeCount} tone="text-green-500" />
                        <Metric label="Inactive" value={inactiveCount} tone="text-yellow-500" />
                    </div>
                </div>

                {(message || error) && (
                    <div
                        className={`rounded-lg border px-4 py-3 text-sm ${
                            error
                                ? 'border-red-500/30 bg-red-500/10 text-red-400'
                                : 'border-green-500/30 bg-green-500/10 text-green-500'
                        }`}
                    >
                        {error ?? message}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                    <div className="rounded-xl border bg-white/5">
                        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-sm font-semibold">Branch Directory</h2>
                                <p className="text-xs text-muted-foreground">
                                    {filteredBranches.length} of {branches.length} branches shown
                                </p>
                            </div>

                            <div className="relative sm:w-80">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search branches"
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="p-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Manager</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                Loading branches...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredBranches.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                                No branches found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredBranches.map((branch) => (
                                            <TableRow key={branch.id}>
                                                <TableCell>
                                                    <div className="flex items-start gap-3">
                                                        <div className="rounded-lg border bg-white/5 p-2">
                                                            <Building2 className="h-4 w-4 text-cyan-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{branch.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {branch.branch_code}
                                                            </p>
                                                            {branch.email && (
                                                                <p className="mt-1 text-xs text-muted-foreground">
                                                                    {branch.email}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-start gap-2 text-sm">
                                                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p>{branch.city}</p>
                                                            <p className="max-w-[260px] truncate text-xs text-muted-foreground">
                                                                {branch.address}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm">{branch.manager_name || 'Unassigned'}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {branch.contact_number || 'No contact number'}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            branch.status
                                                                ? 'border-green-500/30 bg-green-500/10 text-green-500'
                                                                : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500'
                                                        }
                                                    >
                                                        {branch.status ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => editBranch(branch)}
                                                            title="Edit branch"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteBranch(branch)}
                                                            disabled={deletingId === branch.id}
                                                            title="Delete branch"
                                                            className="text-red-500 hover:text-red-500"
                                                        >
                                                            {deletingId === branch.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white/5 p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-semibold">
                                    {editingBranch ? 'Edit Branch' : 'Create Branch'}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {editingBranch ? 'Update the selected branch record.' : 'Add a new operating branch.'}
                                </p>
                            </div>

                            {editingBranch ? (
                                <Button type="button" variant="ghost" size="icon" onClick={resetForm} title="Cancel edit">
                                    <X className="h-4 w-4" />
                                </Button>
                            ) : (
                                <div className="rounded-lg border bg-white/5 p-2">
                                    <Plus className="h-4 w-4 text-cyan-500" />
                                </div>
                            )}
                        </div>

                        <form onSubmit={submitBranch} className="space-y-4">
                            <Field label="Branch Code" error={fieldErrors.branch_code?.[0]}>
                                <Input
                                    value={form.branch_code}
                                    onChange={(event) => updateField('branch_code', event.target.value)}
                                    placeholder="BR-001"
                                />
                            </Field>

                            <Field label="Branch Name" error={fieldErrors.name?.[0]}>
                                <Input
                                    value={form.name}
                                    onChange={(event) => updateField('name', event.target.value)}
                                    placeholder="Main Branch"
                                />
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                                <Field label="City" error={fieldErrors.city?.[0]}>
                                    <Input
                                        value={form.city}
                                        onChange={(event) => updateField('city', event.target.value)}
                                        placeholder="Manila"
                                    />
                                </Field>

                                <Field label="Status" error={fieldErrors.status?.[0]}>
                                    <select
                                        value={form.status ? '1' : '0'}
                                        onChange={(event) => updateField('status', event.target.value === '1')}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </Field>
                            </div>

                            <Field label="Address" error={fieldErrors.address?.[0]}>
                                <Textarea
                                    value={form.address}
                                    onChange={(event) => updateField('address', event.target.value)}
                                    placeholder="Street, barangay, building, or landmark"
                                />
                            </Field>

                            <Field label="Manager" error={fieldErrors.manager_name?.[0]}>
                                <Input
                                    value={form.manager_name}
                                    onChange={(event) => updateField('manager_name', event.target.value)}
                                    placeholder="Branch manager"
                                />
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                                <Field label="Contact Number" error={fieldErrors.contact_number?.[0]}>
                                    <Input
                                        value={form.contact_number}
                                        onChange={(event) => updateField('contact_number', event.target.value)}
                                        placeholder="0917 000 0000"
                                    />
                                </Field>

                                <Field label="Email" error={fieldErrors.email?.[0]}>
                                    <Input
                                        type="email"
                                        value={form.email}
                                        onChange={(event) => updateField('email', event.target.value)}
                                        placeholder="branch@example.com"
                                    />
                                </Field>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={saving} className="flex-1">
                                    {saving ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : editingBranch ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                    {editingBranch ? 'Save Changes' : 'Create Branch'}
                                </Button>

                                {editingBranch && (
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Metric({ label, value, tone = 'text-foreground' }: { label: string; value: number; tone?: string }) {
    return (
        <div className="rounded-lg border bg-white/5 px-3 py-2">
            <p className={`text-lg font-semibold ${tone}`}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </div>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block space-y-2">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            {children}
            {error && <span className="block text-xs text-red-500">{error}</span>}
        </label>
    );
}

function getApiError(err: unknown): ApiErrorResponse {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
        return err.response?.data ?? { message: err.message };
    }

    return { message: 'Unexpected error occurred.' };
}

function getErrorMessage(err: unknown, fallback: string): string {
    return getApiError(err).message ?? fallback;
}
