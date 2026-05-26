import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';

type CrudRecord = Record<string, unknown>;

export function useCrudTable(endpoint: string, paginated = false, perPage = 10) {
    const [items, setItems] = useState<CrudRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Record<string, unknown> | null>(null);

    // ✅ fetch data (NOW includes search)
    const loadItems = useCallback(
        async (targetPage: number = page, searchTerm: string = search) => {
            try {
                setLoading(true);

                const params = new URLSearchParams();

                if (paginated) {
                    params.append('page', String(targetPage));
                    params.append('per_page', String(perPage));
                }

                if (searchTerm.trim()) {
                    params.append('search', searchTerm.trim());
                }

                const url = params.toString()
                    ? `${endpoint}?${params.toString()}`
                    : endpoint;

                const res = await axios.get(url);

                if (Array.isArray(res.data)) {
                    setItems(res.data);
                    setPagination(null);
                } else {
                    setItems(res.data.data);
                    setPagination(res.data);
                }
            } finally {
                setLoading(false);
            }
        },
        [endpoint, paginated, perPage, page, search]
    );

    // ✅ reload on page change OR search change
    useEffect(() => {
        loadItems(page, search);
    }, [page, search, loadItems]);

    // ✅ reset page when search changes
    useEffect(() => {
        setPage(1);
    }, [search]);

    // optional reset when endpoint changes
    useEffect(() => {
        setItems([]);
        setPage(1);
        setPagination(null);
    }, [endpoint]);

    const reload = useCallback(() => {
        loadItems(page, search);
    }, [loadItems, page, search]);

    return {
        items,
        loading,
        search,
        setSearch,
        page,
        setPage,
        pagination,
        reload,
    };
}