import { useState } from 'react';
import { Pencil, Package, Search } from 'lucide-react';
import { useOrders, useUpdateOrder } from '../../hooks/useOrders';
import Button from '../../components/ui/Button';
import { formatPrice } from '../../utils/format';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-brand-100 text-brand-900',
    cancelled: 'bg-red-100 text-red-800',
};

const NEXT_STATUS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
};

const inputClass = (hasError) =>
    `w-full rounded-lg border bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-brand-500 ${hasError ? 'border-danger' : 'border-gray-300'
    }`;

export default function Orders() {
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, refetch } = useOrders({
        status: statusFilter,
        search: searchQuery,
        page,
    });

    const [selectedOrder, setSelectedOrder] = useState(null);
    const orders = data?.orders || [];

    return (
        <div>
            {/* Header & Filters Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-brand-900">Orders</h1>
                    <p className="mt-1 text-sm text-muted">
                        {data ? `${data.total} total orders` : 'Manage customer orders.'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            placeholder="Search order #, customer..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1); // Reset to page 1 when searching
                            }}
                            className="rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-64"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1); // Reset to page 1 when filtering status
                        }}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table Container */}
            <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
                {isLoading && <p className="px-4 py-6 text-muted">Loading orders...</p>}

                {isError && (
                    <div className="px-4 py-6">
                        <p className="text-danger">Could not load orders.</p>
                        <Button variant="outline" onClick={() => refetch()} className="mt-3">
                            Try again
                        </Button>
                    </div>
                )}

                {!isLoading && orders.length === 0 && (
                    <p className="px-4 py-6 text-muted">No orders found.</p>
                )}

                {orders.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b border-gray-100 text-muted">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Order #</th>
                                    <th className="px-4 py-3 font-medium">Customer</th>
                                    <th className="px-4 py-3 font-medium">City / Address</th>
                                    <th className="px-4 py-3 font-medium">Total</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Courier & Tracking</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-brand-900">
                                            {order.order_number}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-ink">{order.customer_name}</div>
                                            <div className="text-xs text-muted">{order.customer_phone}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-ink">{order.city}</div>
                                            <div className="text-xs text-muted truncate max-w-xs">
                                                {order.address}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-ink">
                                            {formatPrice(order.total)}
                                            <div className="text-xs text-muted uppercase">
                                                {order.payment_method}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-muted'
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted">
                                            {order.courier ? (
                                                <div>
                                                    <span className="font-medium text-ink">{order.courier}</span>
                                                    <div>{order.tracking_number || 'No tracking'}</div>
                                                </div>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <Pencil size={14} className="mr-1" /> Update
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls Footer */}
                {data?.pages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3">
                        <p className="text-sm text-muted">
                            Page <span className="font-medium text-ink">{data.page}</span> of{' '}
                            <span className="font-medium text-ink">{data.pages}</span>
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= data.pages}
                                onClick={() => setPage((p) => Math.min(p + 1, data.pages))}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {selectedOrder && (
                <OrderUpdateModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}

function OrderUpdateModal({ order, onClose }) {
    const updateMutation = useUpdateOrder();
    const [form, setForm] = useState({
        status: order.status,
        shipping: order.shipping ?? 0,
        courier: order.courier ?? '',
        tracking_number: order.tracking_number ?? '',
        notes: order.notes ?? '',
    });

    const allowedNextStatuses = NEXT_STATUS[order.status] || [];
    const isClosed = order.status === 'delivered' || order.status === 'cancelled';

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(
            {
                id: order.id,
                data: {
                    status: form.status,
                    shipping: Number(form.shipping),
                    courier: form.courier.trim() || null,
                    tracking_number: form.tracking_number.trim() || null,
                    notes: form.notes.trim() || null,
                },
            },
            {
                onSuccess: onClose,
            }
        );
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-brand-900">
                        Update Order #{order.order_number}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded p-1 text-muted hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                {isClosed && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-danger">
                        This order is closed ({order.status}) and cannot be modified.
                    </p>
                )}

                <div>
                    <label className="mb-1 block text-sm font-medium text-ink">Status</label>
                    <select
                        value={form.status}
                        disabled={isClosed}
                        onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                        className={inputClass(false)}
                    >
                        <option value={order.status}>{order.status} (Current)</option>
                        {allowedNextStatuses.map((st) => (
                            <option key={st} value={st}>
                                {st}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-ink">Shipping Fee (Rs)</label>
                    <input
                        type="number"
                        min="0"
                        disabled={isClosed}
                        value={form.shipping}
                        onChange={(e) => setForm((f) => ({ ...f, shipping: e.target.value }))}
                        className={inputClass(false)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-ink">Courier</label>
                        <input
                            type="text"
                            placeholder="e.g. TCS, Leopards"
                            disabled={isClosed}
                            value={form.courier}
                            onChange={(e) => setForm((f) => ({ ...f, courier: e.target.value }))}
                            className={inputClass(false)}
                        />
                    </div>
                    <div>
                        <label className="mb-1 background-white text-sm font-medium text-ink">Tracking Number</label>
                        <input
                            type="text"
                            placeholder="Tracking ID"
                            disabled={isClosed}
                            value={form.tracking_number}
                            onChange={(e) => setForm((f) => ({ ...f, tracking_number: e.target.value }))}
                            className={inputClass(false)}
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-ink">Notes</label>
                    <textarea
                        rows={3}
                        disabled={isClosed}
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        className={inputClass(false)}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    {!isClosed && (
                        <Button type="submit" loading={updateMutation.isPending}>
                            Save Changes
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}