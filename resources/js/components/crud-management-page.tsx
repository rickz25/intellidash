import axios from 'axios';
import { Edit3, Loader2, Plus, Search, Trash2, X } from 'lucide-react';
import { FormEvent, ReactNode, useEffect, useMemo, useState, useCallback } from 'react';

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

type CrudValue = string | number | boolean | string[] | null;
type CrudRecord = Record<string, unknown>;
type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'boolean' | 'datetime-local' | 'permissions';

interface FieldOption {
    label: string;
    value: string | number | boolean;
}

interface FieldConfig {
    name: string;
    label: string;
    type?: FieldType;
    placeholder?: string;
    options?: FieldOption[];
    lookup?: string;
    optionLabel?: string;
    optionValue?: string;
}

interface ColumnConfig {
    key: string;
    label: string;
    render?: (item: CrudRecord) => ReactNode;
}

interface CrudManagementPageProps {
    title: string;
    subtitle: string;
    endpoint: string;
    entityName: string;
    searchKeys: string[];
    fields: FieldConfig[];
    columns: ColumnConfig[];
    emptyForm: Record<string, CrudValue>;
    paginated?: boolean;
    perPage?: number;
}

interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
}

interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

interface PaginatedResponse {
    data: CrudRecord[];
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export default function CrudManagementPage({
    title,
    subtitle,
    endpoint,
    entityName,
    searchKeys,
    fields,
    columns,
    emptyForm,
    paginated = false,
    perPage = 10,
}: CrudManagementPageProps) {
    // sorting state (not implemented in UI, but can be used for future enhancements)
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const [items, setItems] = useState<CrudRecord[]>([]);
    const [form, setForm] = useState<Record<string, CrudValue>>(emptyForm);
    const [editingItem, setEditingItem] = useState<CrudRecord | null>(null);
    const [lookups, setLookups] = useState<Record<string, CrudRecord[]>>({});
    const [search, setSearch] = useState(() => {
        if (typeof window === 'undefined') return '';

        return new URLSearchParams(window.location.search).get('search') ?? '';
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);

    const loadItems = useCallback(async (targetPage = page) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get<CrudRecord[] | PaginatedResponse>(
                buildListUrl(endpoint, paginated, targetPage, perPage, sortKey, sortDirection),
                { timeout: 10000 },
            );

            if (isPaginatedResponse(response.data)) {
                setItems(response.data.data);
                setPagination({
                    current_page: response.data.current_page,
                    from: response.data.from,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    to: response.data.to,
                    total: response.data.total,
                });
            } else {
                setItems(response.data);
                setPagination(null);
            }
        } catch (err) {
            setError(getErrorMessage(err, `Unable to load ${entityName.toLowerCase()} records.`));
        } finally {
            setLoading(false);
        }
    }, [
        page,
        endpoint,
        paginated,
        perPage,
        sortKey,
        sortDirection,
        entityName
    ]);

    const loadLookups = useCallback(async () => {
        const lookupFields = fields.filter((field) => field.lookup);

        await Promise.all(
            lookupFields.map(async (field) => {
                if (!field.lookup) return;

                const response = await axios.get<CrudRecord[]>(field.lookup, { timeout: 10000 });

                setLookups((current) => ({
                    ...current,
                    [field.name]: response.data,
                }));
            }),
        );
    }, [fields]);

    useEffect(() => {
        loadItems(page);
    }, [page, loadItems]);

    useEffect(() => {
        loadLookups().catch((err) =>
            setError(getErrorMessage(err, 'Unable to load form options.')),
        );
    }, [loadLookups]);

    const displayedItems = useMemo(() => {
        const term = search.trim().toLowerCase();

        // 1. filter first
        let data = items;

        if (term) {
            data = data.filter((item) =>
                searchKeys
                    .map((key) => String(getNestedValue(item, key) ?? ''))
                    .join(' ')
                    .toLowerCase()
                    .includes(term),
            );
        }

        // 2. sort next
        if (sortKey) {
            data = [...data].sort((a, b) => {
                const aValue = getNestedValue(a, sortKey);
                const bValue = getNestedValue(b, sortKey);

                if (aValue == null) return 1;
                if (bValue == null) return -1;

                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortDirection === 'asc'
                        ? aValue - bValue
                        : bValue - aValue;
                }

                return sortDirection === 'asc'
                    ? String(aValue).localeCompare(String(bValue))
                    : String(bValue).localeCompare(String(aValue));
            });
        }

        return data;
    }, [items, search, searchKeys, sortKey, sortDirection]);

    const resetForm = () => {
        setEditingItem(null);
        setForm(emptyForm);
        setFieldErrors({});
        setError(null);
    };

    const editItem = (item: CrudRecord) => {
        const nextForm = { ...emptyForm };

        fields.forEach((field) => {
            const value = item[field.name] as CrudValue;
            nextForm[field.name] = formatFormValue(field, value ?? emptyForm[field.name]);
        });

        setEditingItem(item);
        setForm(nextForm);
        setFieldErrors({});
        setMessage(null);
        setError(null);
    };

    const submitItem = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setSaving(true);
            setMessage(null);
            setError(null);
            setFieldErrors({});

            const payload = buildPayload(fields, form);

            if (editingItem) {
                await axios.put(buildResourceUrl(endpoint, editingItem.id), payload, { timeout: 10000 });
                setMessage(`${entityName} updated successfully.`);
            } else {
                await axios.post(buildResourceUrl(endpoint), payload, { timeout: 10000 });
                setMessage(`${entityName} created successfully.`);
            }

            resetForm();
            await loadItems(page);
        } catch (err) {
            const apiError = getApiError(err);
            setError(apiError.message ?? `Unable to save ${entityName.toLowerCase()}.`);
            setFieldErrors(apiError.errors ?? {});
        } finally {
            setSaving(false);
        }
    };

    const deleteItem = async (item: CrudRecord) => {
        if (!window.confirm(`Delete this ${entityName.toLowerCase()}? This cannot be undone.`)) return;

        try {
            setDeletingId(item.id);
            setMessage(null);
            setError(null);

            await axios.delete(buildResourceUrl(endpoint, item.id), { timeout: 10000 });
            setMessage(`${entityName} deleted successfully.`);
            await loadItems(page);
        } catch (err) {
            setError(getErrorMessage(err, `Unable to delete ${entityName.toLowerCase()}.`));
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Management</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                </div>

                <div className="rounded-lg border bg-white/5 px-4 py-2 text-right">
                    <p className="text-xl font-semibold">{pagination?.total ?? items.length}</p>
                    <p className="text-xs text-muted-foreground">Total records</p>
                </div>
            </div>

            {(message || error) && (
                <div className={`rounded-lg border px-4 py-3 text-sm ${error ? 'border-red-500/30 bg-red-500/10 text-red-500' : 'border-green-500/30 bg-green-500/10 text-green-500'}`}>
                    {error ?? message}
                </div>
            )}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div className="rounded-xl border bg-white/5">
                    <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-sm font-semibold">Directory</h2>
                            <p className="text-xs text-muted-foreground">
                                {pagination ? `${pagination.from ?? 0}-${pagination.to ?? 0} of ${pagination.total} records` : `${displayedItems.length} of ${items.length} records shown`}
                            </p>
                        </div>

                        <div className="relative sm:w-80">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} className="pl-9" />
                        </div>
                    </div>

                    <div className="p-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableHead
                                            key={column.key}
                                            onClick={() => handleSort(column.key)}
                                            className="cursor-pointer select-none"
                                        >
                                            {column.label}
                                            {sortKey === column.key && (
                                                <span className="ml-1 text-xs">
                                                    {sortDirection === 'asc' ? '▲' : '▼'}
                                                </span>
                                            )}
                                        </TableHead>
                                    ))}
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={columns.length + 1} className="h-32 text-center text-muted-foreground">Loading records...</TableCell></TableRow>
                                ) : displayedItems.length === 0 ? (
                                    <TableRow><TableCell colSpan={columns.length + 1} className="h-32 text-center text-muted-foreground">No records found.</TableCell></TableRow>
                                ) : displayedItems.map((item) => (
                                    <TableRow key={item.id}>
                                        {columns.map((column) => (
                                            <TableCell key={column.key}>{column.render ? column.render(item) : String(getNestedValue(item, column.key) ?? '')}</TableCell>
                                        ))}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button type="button" variant="ghost" size="icon" onClick={() => editItem(item)} title="Edit">
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => deleteItem(item)} disabled={deletingId === item.id} title="Delete" className="text-red-500 hover:text-red-500">
                                                    {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {pagination && pagination.last_page > 1 && (
                            <div className="flex flex-col gap-3 border-t px-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </p>

                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" size="sm" disabled={loading || pagination.current_page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                                        Previous
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" disabled={loading || pagination.current_page >= pagination.last_page} onClick={() => setPage((current) => Math.min(pagination.last_page, current + 1))}>
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-semibold">{editingItem ? `Edit ${entityName}` : `Create ${entityName}`}</h2>
                            <p className="text-xs text-muted-foreground">{editingItem ? 'Update the selected record.' : 'Add a new record.'}</p>
                        </div>

                        {editingItem ? (
                            <Button type="button" variant="ghost" size="icon" onClick={resetForm} title="Cancel edit"><X className="h-4 w-4" /></Button>
                        ) : (
                            <div className="rounded-lg border bg-white/5 p-2"><Plus className="h-4 w-4 text-cyan-500" /></div>
                        )}
                    </div>

                    <form onSubmit={submitItem} className="space-y-4">
                        {fields.map((field) => (
                            <FormField key={field.name} field={field} value={form[field.name]} error={fieldErrors[field.name]?.[0]} options={getOptions(field, lookups[field.name] ?? [])} onChange={(value) => setForm((current) => ({ ...current, [field.name]: value }))} />
                        ))}

                        <div className="flex gap-2 pt-2">
                            <Button type="submit" disabled={saving} className="flex-1">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                {editingItem ? 'Save Changes' : `Create ${entityName}`}
                            </Button>
                            {editingItem && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export function StatusBadge({ active, trueLabel = 'Active', falseLabel = 'Inactive' }: { active: boolean; trueLabel?: string; falseLabel?: string }) {
    return (
        <Badge variant="outline" className={active ? 'border-green-500/30 bg-green-500/10 text-green-500' : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500'}>
            {active ? trueLabel : falseLabel}
        </Badge>
    );
}

function FormField({ field, value, error, options, onChange }: { field: FieldConfig; value: CrudValue; error?: string; options: FieldOption[]; onChange: (value: CrudValue) => void }) {
    const type = field.type ?? 'text';

    return (
        <label className="block space-y-2">
            <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
            {type === 'textarea' || type === 'permissions' ? (
                <Textarea value={Array.isArray(value) ? value.join('\n') : String(value ?? '')} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} />
            ) : type === 'select' || type === 'boolean' ? (
                <select value={type === 'boolean' ? (value ? '1' : '0') : String(value ?? '')} onChange={(event) => onChange(type === 'boolean' ? event.target.value === '1' : event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    {type === 'select' && <option value="">Select {field.label}</option>}
                    {type === 'boolean' ? (
                        <>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </>
                    ) : options.map((option) => <option key={String(option.value)} value={String(option.value)}>{option.label}</option>)}
                </select>
            ) : (
                <Input type={type} value={String(value ?? '')} onChange={(event) => onChange(type === 'number' ? Number(event.target.value) : event.target.value)} placeholder={field.placeholder} />
            )}
            {error && <span className="block text-xs text-red-500">{error}</span>}
        </label>
    );
}

function buildListUrl(endpoint: string, paginated: boolean, page: number, perPage: number, sortKey: string | null, sortDirection: string | null) {
    if (!paginated) return endpoint;

    const separator = endpoint.includes('?') ? '&' : '?';

    let url = `${endpoint}${separator}page=${page}&per_page=${perPage}`;

    if (sortKey && sortDirection) {
        url += `&sort=${sortKey}&direction=${sortDirection}`;
    }

    return url;
}

function buildResourceUrl(endpoint: string, id?: number) {
    const baseEndpoint = endpoint.split('?')[0];

    return id ? `${baseEndpoint}/${id}` : baseEndpoint;
}

function isPaginatedResponse(data: CrudRecord[] | PaginatedResponse): data is PaginatedResponse {
    return !Array.isArray(data) && Array.isArray(data.data) && typeof data.current_page === 'number';
}

// function getOptions(field: FieldConfig, lookupItems: CrudRecord[]): FieldOption[] {
//     if (field.type === 'boolean') {
//         return [{ label: 'Active', value: true }, { label: 'Inactive', value: false }];
//     }

//     if (field.options) return field.options;

//     return lookupItems.map((item) => ({
//         label: String(getNestedValue(item, field.optionLabel ?? 'name') ?? item.id),
//         value: getNestedValue(item, field.optionValue ?? 'id') ?? item.id,
//     }));
// }

function getOptions(field: FieldConfig, lookupItems: unknown): FieldOption[] {
    if (field.type === 'boolean') {
        return [
            { label: 'Active', value: true },
            { label: 'Inactive', value: false }
        ];
    }

    if (field.options) return field.options;

    const items: CrudRecord[] = Array.isArray(lookupItems)
        ? lookupItems
        : lookupItems
            ? [lookupItems as CrudRecord]
            : [];

    return items.map((item) => ({
        label: String(getNestedValue(item, field.optionLabel ?? 'name') ?? item.id),
        value: getNestedValue(item, field.optionValue ?? 'id') ?? item.id,
    }));
}

function buildPayload(fields: FieldConfig[], form: Record<string, CrudValue>) {
    return fields.reduce<Record<string, CrudValue>>((payload, field) => {
        const value = form[field.name];

        if (field.type === 'permissions') {
            payload[field.name] = String(value ?? '').split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
            return payload;
        }

        payload[field.name] = value;
        return payload;
    }, {});
}

function formatFormValue(field: FieldConfig, value: CrudValue): CrudValue {
    if (field.type === 'datetime-local' && typeof value === 'string') {
        return value.slice(0, 16);
    }

    if (field.type === 'permissions' && Array.isArray(value)) {
        return value.join('\n');
    }

    return value;
}

function getNestedValue(item: CrudRecord, key: string) {
    return key.split('.').reduce<unknown>((value, part) => {
        if (value && typeof value === 'object' && part in value) {
            return (value as CrudRecord)[part];
        }

        return undefined;
    }, item);
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

