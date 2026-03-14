import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const [summary, setSummary] = useState<any>(null);
    const [operations, setOperations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters state
    const [filterType, setFilterType] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        Promise.all([
            api.get('/dashboard/summary'),
            api.get('/operations')
        ]).then(([summaryRes, opsRes]) => {
            setSummary(summaryRes.data);
            setOperations(opsRes.data);
        }).catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredOperations = operations.filter(op => {
        if (filterType !== 'ALL' && op.docType !== filterType) return false;
        if (filterStatus !== 'ALL' && op.status !== filterStatus) return false;
        return true;
    });

    const typeCounts = useMemo(() => {
        const base = { receipt: 0, delivery: 0, internal_transfer: 0, adjustment: 0 } as Record<string, number>;
        operations.forEach(op => {
            if (base[op.docType] !== undefined) base[op.docType] += 1;
        });
        return base;
    }, [operations]);

    const statusCounts = useMemo(() => {
        const base = { draft: 0, waiting: 0, ready: 0, done: 0, cancelled: 0 } as Record<string, number>;
        operations.forEach(op => {
            if (base[op.status] !== undefined) base[op.status] += 1;
        });
        return base;
    }, [operations]);

    const bars = [
        { label: 'Receipts', value: typeCounts.receipt, color: 'var(--primary-color)' },
        { label: 'Deliveries', value: typeCounts.delivery, color: 'var(--danger)' },
        { label: 'Transfers', value: typeCounts.internal_transfer, color: 'var(--warning)' },
        { label: 'Adjustments', value: typeCounts.adjustment, color: 'var(--info, #4c8)' },
    ];

    const statusBars = [
        { label: 'Waiting', value: statusCounts.waiting, color: 'var(--warning)' },
        { label: 'Draft', value: statusCounts.draft, color: 'var(--text-muted)' },
        { label: 'Ready', value: statusCounts.ready, color: 'var(--primary-color)' },
        { label: 'Done', value: statusCounts.done, color: 'var(--success)' },
    ];

    const safeDate = (op: any) => {
        const d = op.createdAt || op.scheduledDate || op.updatedAt;
        return d ? new Date(d).toLocaleDateString() : '-';
    };

    return (
        <div>
            {loading ? (
                <div>Loading dashboard...</div>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h1 className="page-title" style={{ margin: 0 }}>Dashboard</h1>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select className="form-input" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                                <option value="ALL">All Types</option>
                                <option value="receipt">Receipts</option>
                                <option value="delivery">Deliveries</option>
                                <option value="internal_transfer">Transfers</option>
                                <option value="adjustment">Adjustments</option>
                            </select>
                            <select className="form-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                                <option value="ALL">All Statuses</option>
                                <option value="draft">Draft</option>
                                <option value="waiting">Waiting</option>
                                <option value="ready">Ready</option>
                                <option value="done">Done</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

            <div className="dashboard-grid">
                <div className="stat-card">
                    <div className="stat-title">Total Products</div>
                    <div className="stat-value">{summary?.totalProducts || 0}</div>
                </div>
                <div className="stat-card" style={{ borderLeft: (summary?.lowStockItems > 0) ? '4px solid var(--danger)' : '' }}>
                    <div className="stat-title">Low Stock Items</div>
                    <div className="stat-value" style={{ color: (summary?.lowStockItems > 0) ? 'var(--danger)' : 'inherit' }}>
                        {summary?.lowStockItems || 0}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Pending Receipts</div>
                    <div className="stat-value" style={{ color: 'var(--warning)' }}>{summary?.pendingReceipts || 0}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Pending Deliveries</div>
                    <div className="stat-value">{summary?.pendingDeliveries || 0}</div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Recent Operations Activity</h2>
                {filteredOperations.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No operations match the selected filters.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '10px 0' }}>Ref</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOperations.slice(0, 5).map((op: any) => (
                                <tr key={op.id} style={{ borderBottom: '1px solid var(--bg-color)' }}>
                                    <td style={{ padding: '10px 0', fontWeight: 500 }}>{op.ref}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{op.docType.replace('_', ' ')}</td>
                                    <td>{safeDate(op)}</td>
                                    <td>
                                        <span className={`badge ${op.status === 'done' ? 'done' : 'draft'}`}>
                                            {op.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

                    {isAdmin && (
                        <div className="card" style={{ marginTop: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Admin Insights</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>Ops by Type</div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '160px', padding: '8px 4px' }}>
                                        {bars.map(b => (
                                            <div key={b.label} style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{ height: `${(b.value || 0) * 14 + 12}px`, minHeight: '12px', background: b.color, borderRadius: '6px', transition: 'height 0.3s' }} />
                                                <div style={{ marginTop: '6px', fontSize: '0.85rem' }}>{b.label}</div>
                                                <div style={{ fontWeight: 600 }}>{b.value || 0}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>Ops by Status</div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '160px', padding: '8px 4px' }}>
                                        {statusBars.map(b => (
                                            <div key={b.label} style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{ height: `${(b.value || 0) * 14 + 12}px`, minHeight: '12px', background: b.color, borderRadius: '6px', transition: 'height 0.3s' }} />
                                                <div style={{ marginTop: '6px', fontSize: '0.85rem' }}>{b.label}</div>
                                                <div style={{ fontWeight: 600 }}>{b.value || 0}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
