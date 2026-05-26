import { ReactNode, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCrudTable } from '@/hooks/useCrudTable';

type CrudRecord = Record<string, unknown>;
interface ColumnConfig {
    key: string;
    label: string;
    render?: (item: CrudRecord) => ReactNode;
}

interface DataTablePageProps {
    title: string;
    subtitle: string;
    endpoint: string;
    searchKeys: string[];
    columns: ColumnConfig[];
    paginated?: boolean;
    perPage?: number;
}
export default function DataTablePage({
    title,
    subtitle,
    endpoint,
    searchKeys,
    columns,
    paginated = true,
    perPage = 10,
}: DataTablePageProps) {
    const {
        items,
        loading,
        search,
        setSearch,
        page,
        setPage,
        pagination,
    } = useCrudTable(endpoint, paginated, perPage);

    // Sorting state
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

    const displayed = useMemo(() => {
        const term = search.toLowerCase();

        // 1. filter
        let data = items;

        if (term) {
            data = data.filter((item) =>
                searchKeys.some((key) =>
                    String(item[key] ?? '').toLowerCase().includes(term),
                ),
            );
        }

        // 2. sort
        if (sortKey) {
            data = [...data].sort((a, b) => {
                const aVal = a[sortKey];
                const bVal = b[sortKey];

                if (aVal == null) return 1;
                if (bVal == null) return -1;

                // number sort
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortDirection === 'asc'
                        ? aVal - bVal
                        : bVal - aVal;
                }

                // string sort
                return sortDirection === 'asc'
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
            });
        }

        return data;
    }, [items, search, searchKeys, sortKey, sortDirection]);

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <div className="flex justify-end">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                    <Input
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                    />
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((c) => (
                            <TableHead
                                key={c.key}
                                onClick={() => handleSort(c.key)}
                                className="cursor-pointer select-none"
                            >
                                {c.label}

                                {sortKey === c.key && (
                                    <span className="ml-1 text-xs">
                                        {sortDirection === 'asc' ? '▲' : '▼'}
                                    </span>
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length}>
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : (
                        displayed.map((item, i) => (
                            <TableRow key={i}>
                                {columns.map((c) => (
                                    <TableCell key={c.key}>
                                        {c.render
                                            ? c.render(item)
                                            : String(item[c.key] ?? '')}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {paginated && pagination && (
                <div className="flex items-center justify-between border-t pt-3">
                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                            Total Records: {pagination.total}
                        </p>

                        <p>
                            Page {pagination.current_page} of {pagination.last_page}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= pagination.last_page}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}