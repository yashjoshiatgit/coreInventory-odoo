import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export default function WarehouseForm({ onClose, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/warehouses', { name, shortCode, address });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Failed to create warehouse.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="flex-between" style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Create Warehouse</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}><X size={20} /></button>
                </div>

                {error && <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Name</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="e.g. Northeast Distribution Center" />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Short Code</label>
                        <input type="text" required value={shortCode} onChange={e => setShortCode(e.target.value)} className="form-input" placeholder="e.g. NEDC" />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Address (Optional)</label>
                        <textarea value={address} onChange={e => setAddress(e.target.value)} className="form-input" rows={2}></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Warehouse'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
