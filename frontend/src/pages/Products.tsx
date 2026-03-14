import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Box } from 'lucide-react';
import ProductForm from './ProductForm';
import { useAuth } from '../context/AuthContext';

export default function Products() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState<any>(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');

    // Stock Modal
    const [selectedProductStock, setSelectedProductStock] = useState<any>(null);
    const [stockLoading, setStockLoading] = useState(false);

    const loadProducts = () => {
        setLoading(true);
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleViewStock = async (product: any) => {
        setStockLoading(true);
        setSelectedProductStock({ product, stocks: [] });
        try {
            const { data } = await api.get(`/products/${product.id}/stock`);
            setSelectedProductStock({ product, stocks: data });
        } catch (err) {
            console.error('Failed to load stock data', err);
        } finally {
            setStockLoading(false);
        }
    };

    const filteredProducts = products.filter(p => {
        if (categoryFilter !== 'ALL' && p.categoryName !== categoryFilter) return false;
        if (searchTerm && !p.sku.toLowerCase().includes(searchTerm.toLowerCase()) && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const uniqueCategories = Array.from(new Set(products.map(p => p.categoryName).filter(Boolean)));

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>Products</h1>
                {isAdmin && (
                    <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}><Plus size={16} /> Create</button>
                )}
            </div>

            <div className="filters" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search SKU or Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '35px' }}
                    />
                </div>
                <select className="form-input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ maxWidth: '200px' }}>
                    <option value="ALL">All Categories</option>
                    {uniqueCategories.map((c: any) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Unit</th>
                            <th>Status</th>
                            <th>On Hand</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{p.sku}</td>
                                <td>{p.name}</td>
                                <td>{p.categoryName || '-'}</td>
                                <td>{p.uomSymbol}</td>
                                <td>
                                    <span className={`badge ${p.isActive ? 'done' : 'cancelled'}`}>
                                        {p.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleViewStock(p)}>
                                        <Box size={14} style={{ marginRight: '5px' }} /> View Stock
                                    </button>
                                    {isAdmin && (
                                        <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => setIsFormOpen(p)}>
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && !loading && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>No products found.</td></tr>
                        )}
                        {loading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>Loading...</td></tr>}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <ProductForm
                    product={typeof isFormOpen === 'object' ? isFormOpen : undefined}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => { setIsFormOpen(false); loadProducts(); }}
                />
            )}

            {selectedProductStock && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                        <div className="flex-between" style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Stock: {selectedProductStock.product.name}</h2>
                            <button onClick={() => setSelectedProductStock(null)} className="btn btn-outline" style={{ border: 'none' }}>Close</button>
                        </div>
                        {stockLoading ? <p>Loading limits...</p> : (
                            selectedProductStock.stocks.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)' }}>No stock recorded across locations.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead><tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}><th style={{ paddingBottom: '10px' }}>Location</th><th style={{ paddingBottom: '10px' }}>On Hand</th><th style={{ paddingBottom: '10px' }}>Reserved</th></tr></thead>
                                    <tbody>
                                        {selectedProductStock.stocks.map((s: any, idx: number) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--bg-color)' }}>
                                                <td style={{ padding: '10px 0' }}>{s.locationName}</td>
                                                <td><span className="badge done">{s.quantityOnHand} {selectedProductStock.product.uomSymbol}</span></td>
                                                <td>{s.reservedQuantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
