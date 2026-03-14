import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

interface ProductFormProps {
    onClose: () => void;
    onSuccess: () => void;
    product?: any;
}

type Option = { id: string | number; label: string };

export default function ProductForm({ onClose, onSuccess, product }: ProductFormProps) {
    const [sku, setSku] = useState(product?.sku || '');
    const [name, setName] = useState(product?.name || '');
    const [categoryId, setCategoryId] = useState<string>(product?.categoryId?.toString() || '');
    const [uomId, setUomId] = useState<string>(product?.uomId?.toString() || '');
    const [description, setDescription] = useState(product?.description || '');
    const [locationId, setLocationId] = useState<string>('');
    const [initialQty, setInitialQty] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [categories, setCategories] = useState<Option[]>([]);
    const [uoms, setUoms] = useState<Option[]>([]);
    const [locations, setLocations] = useState<Option[]>([]);

    const isEdit = !!product;

    React.useEffect(() => {
        const loadOptions = async () => {
            try {
                const [catRes, uomRes, locRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/uoms'),
                    api.get('/locations')
                ]);
                setCategories(catRes.data.map((c: any) => ({ id: c.id, label: c.name })));
                setUoms(uomRes.data.map((u: any) => ({ id: u.id, label: `${u.name} (${u.symbol})` })));
                setLocations(locRes.data.map((l: any) => ({ id: l.id, label: `${l.name} - ${l.warehouseName || ''}`.trim() })));

                // default selections if none
                if (!categoryId && catRes.data.length > 0) setCategoryId(String(catRes.data[0].id));
                if (!uomId && uomRes.data.length > 0) setUomId(String(uomRes.data[0].id));
                if (!locationId && locRes.data.length > 0) setLocationId(String(locRes.data[0].id));
            } catch (err) {
                console.error('Failed to load dropdown data', err);
            }
        };
        loadOptions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload: any = {
                sku,
                name,
                categoryId: categoryId ? parseInt(categoryId) : null,
                uomId: uomId ? parseInt(uomId) : null,
                description,
                locationId: locationId ? parseInt(locationId) : null,
                initialQuantity: initialQty ? parseFloat(initialQty) : null,
            };

            if (isEdit) {
                await api.put(`/products/${product.id}`, { ...payload, isActive: product.isActive });
            } else {
                await api.post('/products', payload);
            }
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="flex-between" style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{isEdit ? 'Edit Product' : 'Create Product'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}><X size={20} /></button>
                </div>

                {error && <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>SKU</label>
                        <input type="text" required value={sku} onChange={e => setSku(e.target.value)} className="form-input" placeholder="e.g. WH-CHAIR-01" />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Product Name</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="e.g. Ergonomic Office Chair" />
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Category</label>
                            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="form-input">
                                <option value="">-- Select --</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Unit of Measure</label>
                            <select value={uomId} onChange={e => setUomId(e.target.value)} className="form-input" required>
                                <option value="">-- Select --</option>
                                {uoms.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Initial Stock (optional)</label>
                            <input type="number" min="0" step="0.01" value={initialQty} onChange={e => setInitialQty(e.target.value)} className="form-input" placeholder="e.g. 10" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Location</label>
                            <select value={locationId} onChange={e => setLocationId(e.target.value)} className="form-input">
                                <option value="">-- Select --</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-input" rows={3}></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Save Product')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
