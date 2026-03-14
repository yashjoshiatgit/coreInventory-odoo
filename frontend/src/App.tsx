import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Operations from './pages/Operations';
import MoveHistory from './pages/MoveHistory';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="products" element={<Products />} />
              <Route path="operations">
                <Route index element={<Navigate to="/operations/receipts" replace />} />
                <Route path="all" element={<Operations title="All Operations" />} />
                <Route path="receipts" element={<Operations title="Receipts" docType="receipt" />} />
                <Route path="deliveries" element={<Operations title="Delivery Orders" docType="delivery" />} />
                <Route path="transfers" element={<Operations title="Internal Transfers" docType="internal_transfer" />} />
                <Route path="adjustments" element={<Operations title="Stock Adjustments" docType="adjustment" />} />
              </Route>
              <Route path="history" element={<MoveHistory />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
