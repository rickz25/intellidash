import Modal from '@/components/modal';

interface Product {
    id: number;
    name?: string;
    stock_quantity?: number;
    reorder_level?: number;
}

interface Props {
    open: boolean;
    onClose: () => void;
    products: Product[];
}

export default function RestockRecommendationModal({
    open,
    onClose,
    products,
}: Props) {
    const lowStockProducts = (products ?? []).filter(
        (p) => (p.stock_quantity ?? 0) <= (p.reorder_level ?? 0)
    );

    return (
        <Modal open={open} onClose={onClose} title="Restock Recommendations">
            <div className="space-y-4">

                {/* SUMMARY */}
                <div className="rounded-xl border bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-600">
                        {lowStockProducts.length} products need restocking
                    </p>
                </div>

                {/* Total received */}
                <div className="text-xs text-gray-400">
                    Total received: {products?.length ?? 0}
                </div>

                {/* TABLE */}
                <div className="max-h-96 overflow-auto rounded-xl border bg-white">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-50 text-left text-xs text-gray-500">
                            <tr>
                                <th className="px-3 py-2">Product</th>
                                <th className="px-3 py-2 text-center">Stock</th>
                                <th className="px-3 py-2 text-center">Reorder Level</th>
                                <th className="px-3 py-2 text-center">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {lowStockProducts.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="px-3 py-2">
                                        {p.name ?? `#${p.id}`}
                                    </td>

                                    <td className="px-3 py-2 text-center">
                                        {p.stock_quantity ?? 0}
                                    </td>

                                    <td className="px-3 py-2 text-center">
                                        {p.reorder_level ?? 0}
                                    </td>

                                    <td className="px-3 py-2 text-center text-red-500 font-semibold">
                                        Low Stock
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </Modal>
    );
}