import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function MoveHistory() {
    const [ledger, setLedger] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/ledger')
            .then(res => setLedger(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h1 className="page-title">Move History</h1>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Type</th>
                            <th>Product</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ledger.map(l => (
                            <tr key={l.id}>
                                <td>{new Date(l.createdAt).toLocaleString()}</td>
                                <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{l.reference}</td>
                                <td>
                                    <span className={`badge ${l.entryType === 'in' ? 'done' : l.entryType === 'out' ? 'cancelled' : 'waiting'}`}>
                                        {l.entryType}
                                    </span>
                                </td>
                                <td>{l.productName}</td>
                                <td>{l.fromLocation}</td>
                                <td>{l.toLocation}</td>
                                <td style={{ fontWeight: 'bold' }}>{l.quantity}</td>
                            </tr>
                        ))}
                        {ledger.length === 0 && !loading && (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>No stock movements recorded yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
