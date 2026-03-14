import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowRightLeft, History, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <div className="sidebar">
                <div className="sidebar-header">CoreInventory</div>
                <ul className="nav-links">
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={20} /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Package size={20} /> Products
                        </NavLink>
                    </li>
                    <li>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.02em', paddingLeft: '4px', margin: '12px 0 6px' }}>
                            Operations
                        </div>
                    </li>
                    <li>
                        <NavLink to="/operations/receipts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <ArrowRightLeft size={20} /> Receipts
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/operations/deliveries" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <ArrowRightLeft size={20} /> Deliveries
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/operations/transfers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <ArrowRightLeft size={20} /> Transfers
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/operations/adjustments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <ArrowRightLeft size={20} /> Adjustments
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/operations/all" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <ArrowRightLeft size={20} /> All Operations
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <History size={20} /> Move History
                        </NavLink>
                    </li>
                    {isAdmin && (
                        <li>
                            <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <Settings size={20} /> Settings
                            </NavLink>
                        </li>
                    )}
                </ul>
                <div style={{ marginTop: 'auto', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <ul className="nav-links">
                        <li>
                            <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                My Profile
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="main-content">
                <div className="top-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                        Welcome back, {user?.name || 'User'}
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '16px', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
                <div className="page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
