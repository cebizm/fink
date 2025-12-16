import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import type { Transaction } from '../../types';
import './AddTransactionModal.css';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Transaction | null;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, initialData }) => {
    const { addTransaction, updateTransaction } = useFinance();
    const [formData, setFormData] = useState({
        type: 'expense' as 'income' | 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    // Populate form when initialData changes
    React.useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.type,
                amount: initialData.amount.toString(),
                category: initialData.category,
                description: initialData.description,
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
        } else {
            // Reset if opening as clean "Add"
            setFormData({
                type: 'expense',
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (initialData) {
            // Update Mode
            updateTransaction(initialData.id, {
                type: formData.type,
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description,
                date: formData.date
            });
        } else {
            // Create Mode
            addTransaction({
                type: formData.type,
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description,
                date: formData.date,
            });
        }

        onClose();
        // Form clears on next re-open due to useEffect
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <header className="modal-header">
                    <h3 className="modal-title">{initialData ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle'}</h3>
                    <button onClick={onClose} className="modal-close">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Tür</label>
                        <div className="type-toggle">
                            <button
                                type="button"
                                className={`type-btn income ${formData.type === 'income' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, type: 'income' })}
                            >
                                Gelir
                            </button>
                            <button
                                type="button"
                                className={`type-btn expense ${formData.type === 'expense' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, type: 'expense' })}
                            >
                                Gider
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Tutar</label>
                        <input
                            type="number"
                            id="amount"
                            required
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Kategori</label>
                        <input
                            type="text"
                            id="category"
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Örn. Yemek, Kira, Maaş"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Açıklama (İsteğe bağlı)</label>
                        <input
                            type="text"
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Örn. Arkadaşlarla yemek"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Tarih</label>
                        <input
                            type="date"
                            id="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            İptal
                        </button>
                        <button type="submit" className="btn-primary">
                            {initialData ? 'Güncelle' : 'Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
