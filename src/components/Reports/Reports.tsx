import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
    groupTransactionsByPeriod,
    type PeriodType,
    calculateStatsForPeriod,
    getPeriodLabel
} from '../../utils/analytics';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Minus, Eye, EyeOff, Brain, Target, PieChart, AlignJustify, Crown } from 'lucide-react';
import './Reports.css';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, subMonths, getDate, getDaysInMonth, isSameMonth } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

export const Reports: React.FC = () => {
    const { transactions, isPrivacyMode, togglePrivacyMode } = useFinance();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<PeriodType>('monthly');
    const [categoryView, setCategoryView] = useState<'donut' | 'list'>('donut'); // Default to Donut
    const [dateA, setDateA] = useState<Date>(new Date());
    const [dateB] = useState<Date>(subMonths(new Date(), 1)); // setDateB removed
    const [filterType] = useState<'income' | 'expense' | null>(null); // setFilterType removed

    // 1. Chart Data & Stats
    const chartData = groupTransactionsByPeriod(transactions, activeTab, 6);
    const statsA = calculateStatsForPeriod(transactions, dateA, activeTab);
    const statsB = calculateStatsForPeriod(transactions, dateB, activeTab);

    // 2. Category Breakdown Logic
    const categoryStats = useMemo(() => {
        let start: Date, end: Date;
        if (activeTab === 'weekly') {
            start = startOfWeek(dateA, { weekStartsOn: 1 });
            end = endOfWeek(dateA, { weekStartsOn: 1 });
        } else if (activeTab === 'monthly') {
            start = startOfMonth(dateA);
            end = endOfMonth(dateA);
        } else {
            start = startOfYear(dateA);
            end = endOfYear(dateA);
        }

        const periodExpenses = transactions.filter(t =>
            t.type === 'expense' &&
            isWithinInterval(new Date(t.date), { start, end })
        );

        const grouped: Record<string, number> = {};
        let totalExp = 0;

        periodExpenses.forEach(t => {
            grouped[t.category] = (grouped[t.category] || 0) + t.amount;
            totalExp += t.amount;
        });

        // Convert to array and sort
        return Object.entries(grouped)
            .map(([cat, amount]) => ({
                category: cat,
                amount,
                percentage: totalExp > 0 ? (amount / totalExp) * 100 : 0
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions, dateA, activeTab]);


    // 3. Forecast Logic (Only for Monthly view & Current Month)
    const forecast = useMemo(() => {
        if (activeTab !== 'monthly' || !isSameMonth(dateA, new Date())) return null;

        const today = new Date();
        const dayOfMonth = getDate(today); // 1-31
        const daysInMonth = getDaysInMonth(today);

        // Avoid division by zero or unrealistic projection on day 1
        if (dayOfMonth <= 1) return null;

        const currentExpense = statsA.totalExpense;
        const dailyAvg = currentExpense / dayOfMonth;
        const projectedTotal = dailyAvg * daysInMonth;

        return {
            projected: projectedTotal,
            dailyAvg,
            remainingBudget: projectedTotal - currentExpense // Theoretical remaining
        };
    }, [statsA, dateA, activeTab]);


    // 4. Trend Narrative
    const calcDiff = (curr: number, prev: number) => {
        if (prev === 0) return curr === 0 ? 0 : 100;
        return Math.round(((curr - prev) / prev) * 100);
    };
    const incomeDiff = calcDiff(statsA.totalIncome, statsB.totalIncome);
    const expenseDiff = calcDiff(statsA.totalExpense, statsB.totalExpense);

    const getTrendText = () => {
        if (expenseDiff > 0) return `Geçen ${activeTab === 'monthly' ? 'aya' : 'döneme'} göre harcamaların %${Math.abs(expenseDiff)} arttı.`;
        if (expenseDiff < 0) return `Harika! Harcamaların geçen ${activeTab === 'monthly' ? 'aya' : 'döneme'} göre %${Math.abs(expenseDiff)} azaldı.`;
        return "Harcamaların geçen dönemle aynı seviyede.";
    };

    // Filter List
    const currentTransactions = useMemo(() => {
        let start: Date, end: Date;
        if (activeTab === 'weekly') {
            start = startOfWeek(dateA, { weekStartsOn: 1 });
            end = endOfWeek(dateA, { weekStartsOn: 1 });
        } else if (activeTab === 'monthly') {
            start = startOfMonth(dateA);
            end = endOfMonth(dateA);
        } else {
            start = startOfYear(dateA);
            end = endOfYear(dateA);
        }

        return transactions
            .filter(t => isWithinInterval(new Date(t.date), { start, end }))
            .filter(t => filterType ? t.type === filterType : true)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, dateA, activeTab, filterType]);

    // Helpers
    const getDiffColor = (diff: number, type: 'income' | 'expense') => {
        if (diff === 0) return 'text-muted';
        if (type === 'income') return diff > 0 ? 'text-success' : 'text-danger';
        return diff > 0 ? 'text-danger' : 'text-success';
    };
    const renderDiffIcon = (diff: number) => {
        if (diff === 0) return <Minus size={16} />;
        return diff > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
    };

    return (
        <div className="reports-page">
            {/* Header */}
            <div className="reports-header">
                <div className="reports-title-row">
                    <h2>Raporlar & Analiz</h2>
                    <button className="privacy-toggle-btn" onClick={togglePrivacyMode}>
                        {isPrivacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div className="tabs">
                    {(['weekly', 'monthly', 'yearly'] as PeriodType[]).map(t => (
                        <button
                            key={t}
                            className={`tab-btn ${activeTab === t ? 'active' : ''}`}
                            onClick={() => setActiveTab(t)}
                        >
                            {t === 'weekly' ? 'Haftalık' : t === 'monthly' ? 'Aylık' : 'Yıllık'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Smart Insight Widgets (New!) */}
            <div className="insights-grid" style={{ position: 'relative' }}>
                {!user?.isPremium && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-color)'
                    }}>
                        <Crown size={32} color="#FFD700" style={{ marginBottom: '0.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }} />
                        <span style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Premium Özellik</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Yapay zeka analizleri ve tahminler</span>
                        <button
                            onClick={() => window.location.href = '/premium'}
                            style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '99px',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                color: 'black'
                            }}
                        >
                            Yükselt
                        </button>
                    </div>
                )}

                {/* 1. Trend Narrative */}
                <div className="insight-card highlight" style={{ filter: !user?.isPremium ? 'blur(4px)' : 'none' }}>
                    <div className="insight-icon bg-blue">
                        <Brain size={24} />
                    </div>
                    <div className="insight-content">
                        <span className="insight-label">Yapay Zeka Görüşü</span>
                        <p className="insight-text">{getTrendText()}</p>
                    </div>
                </div>

                {/* 2. Forecast (Only visible if Monthly & Current) */}
                {forecast && (
                    <div className="insight-card" style={{ filter: !user?.isPremium ? 'blur(4px)' : 'none' }}>
                        <div className="insight-icon bg-purple">
                            <Target size={24} />
                        </div>
                        <div className="insight-content">
                            <span className="insight-label">Ay Sonu Tahmini (Gider)</span>
                            <span className="insight-value">
                                {isPrivacyMode ? '**** ₺' : `-${Math.round(forecast.projected).toLocaleString()}₺`}
                            </span>
                            <span className="insight-sub">Günlük Ort: {Math.round(forecast.dailyAvg)}₺</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Charts Section */}
            <div className="charts-main-grid">
                {/* Trends Bar Chart */}
                <div className="card chart-card">
                    <h3>Gelir / Gider Trendi (Son 6 Dönem)</h3>
                    <div className="bar-chart">
                        {chartData.map((data, idx) => {
                            const maxVal = Math.max(...chartData.map(d => Math.max(d.income, d.expense))) || 1;
                            const incomeH = (data.income / maxVal) * 100;
                            const expenseH = (data.expense / maxVal) * 100;
                            const isSelected = getPeriodLabel(data.date, activeTab) === getPeriodLabel(dateA, activeTab);

                            return (
                                <div
                                    key={idx}
                                    className={`chart-col ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setDateA(data.date)}
                                >
                                    <div className="bars-wrapper">
                                        <div className="bar income" style={{ height: `${incomeH}%` }} title={`Gelir: ${data.income}`}></div>
                                        <div className="bar expense" style={{ height: `${expenseH}%` }} title={`Gider: ${data.expense}`}></div>
                                    </div>
                                    <span className="chart-label">{data.label.split(' ')[0]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Financial Summary Card */}
                <div className="card category-card">
                    <div className="card-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>{categoryView === 'donut' ? 'Genel Finansal Durum' : 'Harcama Detayları'}</h3>
                        <div className="view-toggle" style={{ display: 'flex', background: 'var(--color-bg-secondary)', borderRadius: '8px', padding: '2px' }}>
                            <button
                                onClick={() => setCategoryView('donut')}
                                style={{
                                    padding: '6px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: categoryView === 'donut' ? 'var(--color-bg-card)' : 'transparent',
                                    color: categoryView === 'donut' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    boxShadow: categoryView === 'donut' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                    cursor: 'pointer'
                                }}
                                title="Genel Durum (Grafik)"
                            >
                                <PieChart size={18} />
                            </button>
                            <button
                                onClick={() => setCategoryView('list')}
                                style={{
                                    padding: '6px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: categoryView === 'list' ? 'var(--color-bg-card)' : 'transparent',
                                    color: categoryView === 'list' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    boxShadow: categoryView === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                    cursor: 'pointer'
                                }}
                                title="Harcama Detayları (Liste)"
                            >
                                <AlignJustify size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="category-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {categoryView === 'list' ? (
                            /* List View: Category Breakdown */
                            <div className="category-list" style={{ width: '100%' }}>
                                {categoryStats.length > 0 ? (
                                    <>
                                        {categoryStats.map((cat, idx) => (
                                            <div key={idx} className="category-item-row">
                                                <div className="cat-info">
                                                    <span className="cat-name">{cat.category}</span>
                                                    <div className="cat-bar-bg">
                                                        <div className="cat-bar-fill" style={{ width: `${cat.percentage}%` }}></div>
                                                    </div>
                                                </div>
                                                <span className="cat-percent">%{Math.round(cat.percentage)}</span>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p className="text-muted" style={{ padding: '1rem' }}>Bu dönem için harcama yok.</p>
                                )}
                            </div>
                        ) : (
                            /* Donut View: Income vs Expense */
                            <div className="donut-wrapper" style={{ position: 'relative', width: '220px', height: '220px' }}>
                                {(() => {
                                    const total = statsA.totalIncome + statsA.totalExpense;
                                    const incomePct = total === 0 ? 0 : (statsA.totalIncome / total) * 100;
                                    const expensePct = total === 0 ? 0 : (statsA.totalExpense / total) * 100;

                                    const size = 220;
                                    const center = size / 2;
                                    const strokeWidth = 24;
                                    const radius = (size - strokeWidth) / 2;
                                    const circumference = 2 * Math.PI * radius;

                                    return (
                                        <>
                                            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
                                                {/* Background Circle */}
                                                <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--color-bg-secondary)" strokeWidth={strokeWidth} />

                                                {/* Income Segment (Green) */}
                                                <circle
                                                    cx={center} cy={center} r={radius}
                                                    fill="none" stroke="#10b981" strokeWidth={strokeWidth}
                                                    strokeDasharray={`${(incomePct / 100) * circumference} ${circumference}`}
                                                    strokeDashoffset={0}
                                                    strokeLinecap="round"
                                                />

                                                {/* Expense Segment (Red) */}
                                                <circle
                                                    cx={center} cy={center} r={radius}
                                                    fill="none" stroke="#ef4444" strokeWidth={strokeWidth}
                                                    strokeDasharray={`${(expensePct / 100) * circumference} ${circumference}`}
                                                    strokeDashoffset={-1 * (incomePct / 100) * circumference}
                                                    strokeLinecap="round"
                                                />
                                            </svg>

                                            {/* Center Label */}
                                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Toplam Hacim</span>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                                                    {isPrivacyMode ? '**** ₺' : `${total.toLocaleString()} ₺`}
                                                </div>
                                            </div>

                                            {/* Legend */}
                                            <div className="donut-legend-mini" style={{ position: 'absolute', bottom: '-22px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
                                                    <span>Gelir</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span>
                                                    <span>Gider</span>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Comparison Cards */}
            <div className="comparison-row">
                <div className="comp-card card">
                    <div className="comp-icon-wrapper income"><ArrowDownRight size={24} /></div>
                    <div className="comp-info">
                        <span className="comp-title">Gelir Değişimi ({getPeriodLabel(dateB, activeTab)}'e göre)</span>
                        <div className="comp-values">
                            <span className="curr-val">{isPrivacyMode ? '**** ₺' : `${statsA.totalIncome.toLocaleString()} ₺`}</span>
                            <span className={`diff-badge ${getDiffColor(incomeDiff, 'income')}`}>{renderDiffIcon(incomeDiff)} %{Math.abs(incomeDiff)}</span>
                        </div>
                    </div>
                </div>
                <div className="comp-card card">
                    <div className="comp-icon-wrapper expense"><ArrowUpRight size={24} /></div>
                    <div className="comp-info">
                        <span className="comp-title">Gider Değişimi ({getPeriodLabel(dateB, activeTab)}'e göre)</span>
                        <div className="comp-values">
                            <span className="curr-val">{isPrivacyMode ? '**** ₺' : `${statsA.totalExpense.toLocaleString()} ₺`}</span>
                            <span className={`diff-badge ${getDiffColor(expenseDiff, 'expense')}`}>{renderDiffIcon(expenseDiff)} %{Math.abs(expenseDiff)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="report-transactions">
                <h3>{getPeriodLabel(dateA, activeTab)} İşlem Geçmişi</h3>
                <div className="report-list card">
                    {currentTransactions.length > 0 ? currentTransactions.map(t => (
                        <div key={t.id} className="transaction-row">
                            <div className={`row-icon ${t.type}`}>
                                {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            <div className="row-info">
                                <p className="row-desc">{t.description}</p>
                                <p className="row-cat">{t.category}</p>
                            </div>
                            <div className="row-date">{new Date(t.date).toLocaleDateString('tr-TR')}</div>
                            <div className={`row-amount ${t.type}`}>
                                {isPrivacyMode ? '**** ₺' : `${t.type === 'income' ? '+' : '-'}₺${t.amount.toLocaleString()}`}
                            </div>
                        </div>
                    )) : <p className="text-muted p-4">İşlem yok.</p>}
                </div>
            </div>
        </div>
    );
};
