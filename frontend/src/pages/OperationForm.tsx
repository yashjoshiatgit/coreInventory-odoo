import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

type DocType = 'receipt' | 'delivery' | 'internal_transfer' | 'adjustment';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
    defaultDocType?: DocType;
    lockedDocType?: boolean;
}

export default function OperationForm({ onClose, onSuccess, defaultDocType = 'receipt', lockedDocType }: Props) {
    const [docType, setDocType] = useState<DocType>(defaultDocType);
    const [partnerId, setPartnerId] = useState('1'); // Mock Vendor
    const [note, setNote] = useState('');
    const [lines, setLines] = useState([{ productId: '', quantity: 1, fromLocationId: '', toLocationId: '' }]);

    const [products, setProducts] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data)).catch(console.error);
        api.get('/locations').then(res => setLocations(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        setDocType(defaultDocType);
    }, [defaultDocType]);

    const handleAddLine = () => setLines([...lines, { productId: '', quantity: 1, fromLocationId: '', toLocationId: '' }]);
    const handleRemoveLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx));

    const handleLineChange = (idx: number, field: string, value: string | number) => {
        const newLines = [...lines];
        (newLines[idx] as any)[field] = value;
        setLines(newLines);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation mapping
        const formattedLines = lines.map(line => ({
            productId: parseInt(line.productId),
            fromLocationId: line.fromLocationId ? parseInt(line.fromLocationId) : null,
            toLocationId: line.toLocationId ? parseInt(line.toLocationId) : null,
            quantity: Number(line.quantity)
        }));

        try {
            await api.post('/operations', {
                docType,
                partnerId: parseInt(partnerId),
                scheduledDate: new Date().toISOString(),
                note,
                lines: formattedLines
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Failed to create Document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="flex-between" style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>New Document</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}><X size={20} /></button>
                </div>

                {error && <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Operation Type</label>
                            <select value={docType} onChange={e => setDocType(e.target.value as DocType)} className="form-input" disabled={lockedDocType}>
                                <option value="receipt">Receipt (IN)</option>
                                <option value="delivery">Delivery Order (OUT)</option>
                                <option value="internal_transfer">Internal Transfer</option>
                                <option value="adjustment">Inventory Adjustment</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Contact / Partner</label>
                            <select value={partnerId} onChange={e => setPartnerId(e.target.value)} className="form-input" disabled={docType === 'internal_transfer' || docType === 'adjustment'}>
                                <option value="1">Acme Supplier Corp</option>
                                <option value="2">Retail Customer</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 500 }}>Note / Ref</label>
                        <input type="text" value={note} onChange={e => setNote(e.target.value)} className="form-input" placeholder="e.g. PO-10293" />
                    </div>

                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>Line Items</h3>

                    {lines.map((line, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-end' }}>
                            <div style={{ flex: 2 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Product</label>
                                <select required value={line.productId} onChange={e => handleLineChange(idx, 'productId', e.target.value)} className="form-input">
                                    <option value="">Select Product...</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Qty</label>
                                <input type="number" required min="1" step="0.01" value={line.quantity} onChange={e => handleLineChange(idx, 'quantity', e.target.value)} className="form-input" />
                            </div>

                            {(docType === 'delivery' || docType === 'internal_transfer') && (
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>From Loc</label>
                                    <select required value={line.fromLocationId} onChange={e => handleLineChange(idx, 'fromLocationId', e.target.value)} className="form-input">
                                        <option value="">Source...</option>
                                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                            )}

                            {(docType === 'receipt' || docType === 'internal_transfer' || docType === 'adjustment') && (
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>To Loc</label>
                                    <select required value={line.toLocationId} onChange={e => handleLineChange(idx, 'toLocationId', e.target.value)} className="form-input">
                                        <option value="">Dest...</option>
                                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <button type="button" onClick={() => handleRemoveLine(idx)} className="btn btn-outline" style={{ padding: '8px', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={handleAddLine} className="btn btn-outline" style={{ marginTop: '10px', padding: '6px 12px', fontSize: '0.85rem' }}>
                        <Plus size={14} style={{ marginRight: '5px' }} /> Add Line
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Draft'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
