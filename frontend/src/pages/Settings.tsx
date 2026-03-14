import React, { useEffect, useState } from 'react';
import api from '../services/api';
import WarehouseForm from './WarehouseForm';

export default function Settings() {
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const loadData = () => {
        setLoading(true);
        Promise.all([
            api.get('/warehouses'),
            api.get('/locations')
        ]).then(([whRes, locRes]) => {
            setWarehouses(whRes.data);
            setLocations(locRes.data);
        }).catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>Settings</h1>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div className="card">
                        <div className="flex-between" style={{ marginBottom: '15px' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Warehouses</h2>
                            <button onClick={() => setIsFormOpen(true)} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Add Warehouse</button>
                        </div>
                        {loading ? <p>Loading...</p> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                        <th style={{ padding: '10px 0' }}>Code</th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {warehouses.map(w => (
                                        <tr key={w.id} style={{ borderBottom: '1px solid var(--bg-color)' }}>
                                            <td style={{ padding: '10px 0', fontWeight: 'bold' }}>{w.shortCode}</td>
                                            <td>{w.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <div className="card">
                        <div className="flex-between" style={{ marginBottom: '15px' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Locations</h2>
                        </div>
                        {loading ? <p>Loading...</p> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                        <th style={{ padding: '10px 0' }}>Code</th>
                                        <th>Name</th>
                                        <th>Warehouse</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {locations.map(l => (
                                        <tr key={l.id} style={{ borderBottom: '1px solid var(--bg-color)' }}>
                                            <td style={{ padding: '10px 0', fontWeight: 'bold' }}>{l.code}</td>
                                            <td>{l.name}</td>
                                            <td>{l.warehouseName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {isFormOpen && (
                <WarehouseForm
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => { setIsFormOpen(false); loadData(); }}
                />
            )}
        </div>
    );
}
