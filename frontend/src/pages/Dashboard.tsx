import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Dashboard() {
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

    if (loading) return <div>Loading dashboard...</div>;

    const filteredOperations = operations.filter(op => {
        if (filterType !== 'ALL' && op.docType !== filterType) return false;
        if (filterStatus !== 'ALL' && op.status !== filterStatus) return false;
        return true;
    });

    return (
        <div>
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
                                    <td>{new Date(op.createdAt).toLocaleDateString()}</td>
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
        </div>
    );
}
