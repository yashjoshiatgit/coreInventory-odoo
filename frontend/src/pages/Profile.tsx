import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="page-title">My Profile</h1>

            <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '40px',
                        backgroundColor: 'var(--primary-color)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 'bold'
                    }}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{user?.name || 'Unknown User'}</h2>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>{user?.role || 'Staff'}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Email Address</label>
                    <div style={{ padding: '10px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        {user?.email || 'Not available'}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Role/Permissions</label>
                    <div style={{ padding: '10px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        <span className="badge done">{user?.role || 'System Access'}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
