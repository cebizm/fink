import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X } from 'lucide-react';
import './AddInvestmentModal.css';
import type { InvestmentType } from '../../types';

interface AddInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Error Boundary Component to catch crashes
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("AddInvestmentModal Crash:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', color: '#dc3545', textAlign: 'center' }}>
                    <h3>Bir hata oluştu</h3>
                    <pre style={{ fontSize: '0.8rem', marginTop: '1rem', background: 'var(--color-bg-secondary)', padding: '1rem', borderRadius: '0.5rem', color: 'var(--color-accent-danger)' }}>
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="btn-secondary"
                        style={{ marginTop: '1rem' }}
                    >
                        Tekrar Dene
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                        style={{ marginTop: '1rem', marginLeft: '0.5rem' }}
                    >
                        Sayfayı Yenile
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Internal Component with logic
const AddInvestmentModalContent: React.FC<AddInvestmentModalProps> = ({ isOpen, onClose }) => {
    const { addInvestment } = useFinance();
    const [type, setType] = useState<InvestmentType>('currency');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [maturity, setMaturity] = useState(''); // Days
    const [interestRate, setInterestRate] = useState(''); // Annual %

    // Reset fields when type changes
    useEffect(() => {
        setName('');
        setAmount('');
        setPurchasePrice('');
        setMaturity('');
        setInterestRate('');
    }, [type]);

    useEffect(() => {
        if (isOpen) {
            setType('currency');
            setName('');
            setAmount('');
            setPurchasePrice('');
            setMaturity('');
            setInterestRate('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Safety: Calculate Estimated Return
    const calculateEstimatedReturn = () => {
        if (type !== 'deposit') return 0;

        try {
            const principal = parseFloat(amount || '0');
            const rate = parseFloat(interestRate || '0');
            const days = parseFloat(maturity || '0');

            if (isNaN(principal) || isNaN(rate) || isNaN(days)) return 0;

            const grossInterest = (principal * rate * days) / 36500;
            const taxRate = 0.05;
            const netInterest = grossInterest * (1 - taxRate);

            return isNaN(netInterest) ? 0 : netInterest;
        } catch (e) {
            console.error("Calculation error", e);
            return 0;
        }
    };

    const estimatedReturn = calculateEstimatedReturn();
    const safeAmount = parseFloat(amount || '0') || 0;
    const finalTotal = safeAmount + estimatedReturn;

    const handleSubmit = (e: React.FormEvent) => {
        try {
            e.preventDefault();

            let price = parseFloat(purchasePrice) || 0;
            let currentPrice = price;
            let finalAmount = parseFloat(amount) || 0;

            if (type === 'deposit') {
                price = 1;
                if (finalAmount > 0) {
                    const totalValue = finalAmount + estimatedReturn;
                    currentPrice = totalValue / finalAmount;
                } else {
                    currentPrice = 1;
                }
            }

            addInvestment({
                type,
                name,
                amount: finalAmount,
                purchasePrice: price,
                currentPrice: currentPrice,
                date: new Date().toISOString()
            });

            onClose();
        } catch (error) {
            console.error("Form submit error", error);
            alert("Birikim eklenirken bir hata oluştu.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Yeni Birikim Ekle</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Varlık Türü</label>
                        <div className="type-buttons">
                            <button type="button" className={`type-btn ${type === 'currency' ? 'active' : ''}`} onClick={() => setType('currency')}>Döviz</button>
                            <button type="button" className={`type-btn ${type === 'gold' ? 'active' : ''}`} onClick={() => setType('gold')}>Altın</button>
                            <button type="button" className={`type-btn ${type === 'stock' ? 'active' : ''}`} onClick={() => setType('stock')}>Hisse</button>
                            <button type="button" className={`type-btn ${type === 'deposit' ? 'active' : ''}`} onClick={() => setType('deposit')}>Mevduat</button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Varlık Adı / Sembolü</label>
                        <input
                            type="text"
                            placeholder={type === 'deposit' ? 'Örn: Vadeli Mevduat, KKM' : "Örn: USD, Gram Altın, Apple"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* 
                         CRITICAL: key={type} forces React to destroy and recreate these inputs 
                         whenever the type changes. This prevents the "removeChild" error 
                         that occurs when React tries to patch the DOM between different form layouts.
                    */}
                    <div key={type} className="dynamic-inputs">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Miktar {type === 'deposit' && '(Ana Para)'}</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    step="any"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>

                            {type === 'deposit' ? (
                                <div className="form-group">
                                    <label>Faiz Oranı (%)</label>
                                    <input
                                        type="number"
                                        placeholder="50"
                                        step="0.01"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(e.target.value)}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Alış Birim Fiyatı (₺)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        step="any"
                                        value={purchasePrice}
                                        onChange={(e) => setPurchasePrice(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {type === 'deposit' && (
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label>Vade (Gün)</label>
                                <input
                                    type="number"
                                    placeholder="32"
                                    value={maturity}
                                    onChange={(e) => setMaturity(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {type === 'deposit' && (
                        <div className="deposit-summary" style={{
                            background: 'var(--color-bg-secondary)',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--color-text-secondary)' }}>Net Getiri (Tahmini):</span>
                                <span style={{ fontWeight: 600, color: 'var(--color-accent-success)' }}>+{estimatedReturn.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-secondary)' }}>Vade Sonu Toplam:</span>
                                <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{finalTotal.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ₺</span>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                                * %5 Stopaj dahildir.
                            </div>
                        </div>
                    )}

                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>İptal</button>
                        <button type="submit" className="btn-primary">Varlığı Ekle</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const AddInvestmentModal: React.FC<AddInvestmentModalProps> = (props) => {
    return (
        <ErrorBoundary>
            <AddInvestmentModalContent {...props} />
        </ErrorBoundary>
    );
};
