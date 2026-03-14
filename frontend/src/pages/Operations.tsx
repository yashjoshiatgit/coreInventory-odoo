import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Plus, CheckCircle, Filter } from 'lucide-react';
import OperationForm from './OperationForm';
import { useAuth } from '../context/AuthContext';

type DocType = 'receipt' | 'delivery' | 'internal_transfer' | 'adjustment';

interface Props {
    title?: string;
    docType?: DocType;
}

export default function Operations({ title = 'Operations', docType }: Props) {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [docTypeFilter, setDocTypeFilter] = useState<string>(docType || 'ALL');
    const [formDocType, setFormDocType] = useState<DocType>(docType || 'receipt');

    const fetchDocs = () => {
        setLoading(true);
        api.get('/operations')
            .then(res => setDocs(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    useEffect(() => {
        if (docType) {
            setDocTypeFilter(docType);
            setFormDocType(docType);
        }
    }, [docType]);

    const validate = async (id: number) => {
        try {
            await api.post(`/operations/${id}/validate`);
            fetchDocs();
        } catch (err: any) {
            alert(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Validation failed');
        }
    };

    const filteredDocs = useMemo(() => {
        return docs.filter(d => {
            const matchesType = docType
                ? d.docType === docType
                : (docTypeFilter === 'ALL' ? true : d.docType === docTypeFilter);
            const matchesStatus = statusFilter === 'ALL' ? true : d.status === statusFilter;
            return matchesType && matchesStatus;
        });
    }, [docs, docType, docTypeFilter, statusFilter]);

    const handleOpenForm = () => {
        const selectedType = (docType || (docTypeFilter === 'ALL' ? 'receipt' : docTypeFilter)) as DocType;
        setFormDocType(selectedType);
        setIsFormOpen(true);
    };

    const typeLabel: Record<DocType, string> = {
        receipt: 'Receipt',
        delivery: 'Delivery Order',
        internal_transfer: 'Internal Transfer',
        adjustment: 'Adjustment'
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                    <h1 className="page-title" style={{ marginBottom: 0 }}>{title}</h1>
                    {docType && (
                        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Showing only {typeLabel[docType]} documents</p>
                    )}
                </div>
                <button className="btn btn-primary" onClick={handleOpenForm}>
                    <Plus size={16} /> New {docType ? typeLabel[docType] : 'Document'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Filter size={16} color="var(--text-muted)" />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Filters</span>
                </div>
                {!docType && (
                    <select
                        value={docTypeFilter}
                        onChange={e => setDocTypeFilter(e.target.value)}
                        className="form-input"
                        style={{ minWidth: '180px' }}
                    >
                        <option value="ALL">All Types</option>
                        <option value="receipt">Receipts</option>
                        <option value="delivery">Deliveries</option>
                        <option value="internal_transfer">Transfers</option>
                        <option value="adjustment">Adjustments</option>
                    </select>
                )}
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="form-input"
                    style={{ minWidth: '180px' }}
                >
                    <option value="ALL">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="waiting">Waiting</option>
                    <option value="ready">Ready</option>
                    <option value="done">Done</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Reference</th>
                            <th>Type</th>
                            <th>Partner</th>
                            <th>Scheduled</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocs.map(d => (
                            <tr key={d.id}>
                                <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{d.ref}</td>
                                <td style={{ textTransform: 'capitalize' }}>{d.docType.replace('_', ' ')}</td>
                                <td>{d.partnerName || '-'}</td>
                                <td>{d.scheduledDate ? new Date(d.scheduledDate).toLocaleDateString() : '-'}</td>
                                <td>
                                    <span className={`badge ${d.status === 'done' ? 'done' : d.status === 'draft' ? 'draft' : 'cancelled'}`}>
                                        {d.status}
                                    </span>
                                </td>
                                <td>
                                    {d.status !== 'done' && d.status !== 'cancelled' && isAdmin && (
                                        <button onClick={() => validate(d.id)} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem', borderColor: 'var(--success)', color: 'var(--success)' }}>
                                            <CheckCircle size={14} style={{ marginRight: '4px' }} /> Validate
                                        </button>
                                    )}
                                    {d.status !== 'done' && d.status !== 'cancelled' && !isAdmin && (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Awaiting admin validation</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredDocs.length === 0 && !loading && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>No operations found.</td></tr>
                        )}
                        {loading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>Loading...</td></tr>}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <OperationForm
                    defaultDocType={formDocType}
                    lockedDocType={!!docType}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => { setIsFormOpen(false); fetchDocs(); }}
                />
            )}
        </div>
    );
}
