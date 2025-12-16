import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Layout/Navbar';
import { Overview } from './components/Dashboard/Overview';
import './styles/Layout.css';
import { TransactionList } from './components/Transactions/TransactionList';
import { AddTransactionModal } from './components/Modals/AddTransactionModal';
import { SubscriptionList } from './components/Subscriptions/SubscriptionList';
import { Reports } from './components/Reports/Reports';
import { Investments } from './components/Investments/Investments';
import { Goals } from './components/Goals/Goals';
import { Debts } from './components/Debts/Debts';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile/Profile';
import { PersonalInformation } from './pages/Profile/PersonalInformation';
import { Support } from './pages/Profile/Support';
import { PrivacySettings } from './pages/Profile/PrivacySettings';
import { LanguageSettings } from './pages/Profile/LanguageSettings';
import { PremiumPage } from './pages/Premium/Premium';
import { PaymentMethods } from './pages/Profile/PaymentMethods';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminRoute } from './components/AdminRoute';
import { Plus } from 'lucide-react';

// Protected Route Wrapper
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Layout Wrapper (Navbar + Content + FAB)
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>

      <button
        className="fab-btn"
        onClick={() => setIsModalOpen(true)}
        aria-label="Add Transaction"
      >
        <Plus size={32} />
      </button>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <ThemeProvider>
          <Router>
            <div className="app">
              <Toaster position="top-right" />
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Admin Route */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />

                {/* Protected App Routes */}
                <Route path="/*" element={
                  <RequireAuth>
                    <AppLayout>
                      <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/personal" element={<PersonalInformation />} />
                        <Route path="/profile/payments" element={<PaymentMethods />} />
                        <Route path="/profile/support" element={<Support />} />
                        <Route path="/profile/privacy" element={<PrivacySettings />} />
                        <Route path="/profile/language" element={<LanguageSettings />} />
                        <Route path="/premium" element={<PremiumPage />} />
                        <Route path="/transactions" element={<TransactionList />} />
                        <Route path="/subscriptions" element={<SubscriptionList />} />
                        <Route path="/debts" element={<Debts />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/investments" element={<Investments />} />
                      </Routes>
                    </AppLayout>
                  </RequireAuth>
                } />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
