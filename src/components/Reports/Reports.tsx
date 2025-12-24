import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
    groupTransactionsByPeriod,
    type PeriodType,
    calculateStatsForPeriod,
    getPeriodLabel
} from '../../utils/analytics';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Minus, Eye, EyeOff, Brain, Target, PieChart, AlignJustify, Crown, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Lightbulb, Wallet, PiggyBank } from 'lucide-react';
import './Reports.css';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, subMonths, getDate, getDaysInMonth, isSameMonth } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

// Category translation map for legacy English categories
const categoryTranslations: Record<string, string> = {
    'Debt Payment': 'Borç Ödemesi',
    'Savings': 'Birikim',
    'Food': 'Yemek',
    'Transport': 'Ulaşım',
    'Entertainment': 'Eğlence',
    'Shopping': 'Alışveriş',
    'Bills': 'Fatura',
    'Health': 'Sağlık',
    'Education': 'Eğitim',
    'Salary': 'Maaş',
    'Freelance': 'Serbest Çalışma',
    'Investment': 'Yatırım',
    'Other': 'Diğer'
};

const translateCategory = (category: string): string => {
    return categoryTranslations[category] || category;
};

export const Reports: React.FC = () => {
    const { transactions, isPrivacyMode, togglePrivacyMode, debts, goals } = useFinance();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<PeriodType>('monthly');
    const [categoryView, setCategoryView] = useState<'donut' | 'list'>('donut'); // Default to Donut
    const [hoveredSegment, setHoveredSegment] = useState<'income' | 'expense' | null>(null);
    const [aiInsightsExpanded, setAiInsightsExpanded] = useState(false);
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

    // 5. AI Insights Analysis
    const aiInsights = useMemo(() => {
        const insights: Array<{
            type: 'success' | 'warning' | 'danger' | 'info' | 'tip';
            icon: React.ReactNode;
            title: string;
            description: string;
        }> = [];

        // Calculate key metrics
        const totalDebtRemaining = debts.reduce((sum, d) => sum + d.remainingAmount, 0);
        const monthlyIncome = statsA.totalIncome;
        const monthlyExpense = statsA.totalExpense;
        const netBalance = monthlyIncome - monthlyExpense;
        const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;
        const debtToIncomeRatio = monthlyIncome > 0 ? (totalDebtRemaining / monthlyIncome) * 100 : 0;
        const activeGoals = goals.filter(g => g.status === 'active');
        const goalsProgress = activeGoals.length > 0
            ? activeGoals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount) * 100, 0) / activeGoals.length
            : 0;

        // 1. Debt Analysis - with danger level
        if (debts.length > 0) {
            if (debtToIncomeRatio < 30) {
                insights.push({
                    type: 'success',
                    icon: <CheckCircle size={20} />,
                    title: 'Sağlıklı Borç Oranı',
                    description: `Borç/gelir oranınız %${Math.round(debtToIncomeRatio)} ile ideal seviyede. Borçlarınızı kontrol altında tutuyorsunuz.`
                });
            } else if (debtToIncomeRatio < 50) {
                insights.push({
                    type: 'warning',
                    icon: <AlertTriangle size={20} />,
                    title: 'Borç Oranı Yükseliyor',
                    description: `Borç/gelir oranınız %${Math.round(debtToIncomeRatio)}. Yeni borç almadan önce mevcut borçları azaltmayı hedefleyin.`
                });
            } else {
                insights.push({
                    type: 'danger',
                    icon: <AlertTriangle size={20} />,
                    title: 'Kritik: Aşırı Borç Yükü',
                    description: `Borç/gelir oranınız %${Math.round(debtToIncomeRatio)} ile tehlikeli seviyede! Acil önlem alarak harcamaları kısın ve borç ödemelerine odaklanın.`
                });
            }

            // Check for overdue debts
            const overdueDebts = debts.filter(d => {
                if (!d.dueDate) return false;
                const dueDate = new Date(d.dueDate);
                return dueDate < new Date() && d.remainingAmount > 0;
            });

            if (overdueDebts.length > 0) {
                insights.push({
                    type: 'danger',
                    icon: <AlertTriangle size={20} />,
                    title: 'Gecikmiş Borç Ödemeleri',
                    description: `${overdueDebts.length} adet borcunuzun ödeme tarihi geçti. Faiz ve ceza ödemelerinden kaçınmak için hemen ödeme yapın.`
                });
            }

            // Check due soon debts
            const dueSoonDebts = debts.filter(d => {
                if (!d.dueDate) return false;
                const dueDate = new Date(d.dueDate);
                const now = new Date();
                const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays > 0 && diffDays <= 7 && d.remainingAmount > 0;
            });

            if (dueSoonDebts.length > 0) {
                insights.push({
                    type: 'warning',
                    icon: <AlertTriangle size={20} />,
                    title: 'Yaklaşan Borç Ödemeleri',
                    description: `${dueSoonDebts.length} adet borcunuzun ödeme tarihi 7 gün içinde. Ödemeleri planlamayı unutmayın.`
                });
            }
        }

        // 2. Savings Analysis
        if (netBalance > 0) {
            insights.push({
                type: 'success',
                icon: <PiggyBank size={20} />,
                title: 'Pozitif Nakit Akışı',
                description: `Bu dönem ${isPrivacyMode ? '****' : netBalance.toLocaleString()}₺ fazlanız var. Bu tutarı birikimlere veya yatırımlara ayırabilirsiniz.`
            });

            if (savingsRate < 10) {
                insights.push({
                    type: 'tip',
                    icon: <Lightbulb size={20} />,
                    title: 'Birikim Oranını Artırın',
                    description: `Birikim oranınız %${Math.round(savingsRate)}. Finansal güvenlik için gelirinizin en az %20'sini biriktirmeyi hedefleyin.`
                });
            } else if (savingsRate >= 20) {
                insights.push({
                    type: 'success',
                    icon: <CheckCircle size={20} />,
                    title: 'Harika Birikim Performansı',
                    description: `Gelirinizin %${Math.round(savingsRate)}'ini biriktiriyorsunuz. Bu oran finansal özgürlüğe doğru sağlam adımlar atmanızı sağlıyor.`
                });
            }
        } else if (netBalance < 0) {
            const deficit = Math.abs(netBalance);
            const deficitRatio = monthlyIncome > 0 ? (deficit / monthlyIncome) * 100 : 100;

            if (deficitRatio > 30) {
                insights.push({
                    type: 'danger',
                    icon: <Wallet size={20} />,
                    title: 'Kritik Bütçe Açığı',
                    description: `Bu dönem harcamalarınız gelirinizi ${isPrivacyMode ? '****' : deficit.toLocaleString()}₺ aştı (%${Math.round(deficitRatio)}). Acil tasarruf önlemleri alın!`
                });
            } else {
                insights.push({
                    type: 'warning',
                    icon: <Wallet size={20} />,
                    title: 'Bütçe Açığı',
                    description: `Bu dönem harcamalarınız gelirinizi ${isPrivacyMode ? '****' : deficit.toLocaleString()}₺ aştı. Gereksiz harcamaları gözden geçirin.`
                });
            }
        }

        // 3. Goals Progress
        if (activeGoals.length > 0) {
            if (goalsProgress >= 75) {
                insights.push({
                    type: 'success',
                    icon: <Target size={20} />,
                    title: 'Hedeflerinize Yaklaşıyorsunuz',
                    description: `Aktif hedeflerinizin ortalama %${Math.round(goalsProgress)}'i tamamlandı. Bu tempoda devam edin!`
                });
            } else if (goalsProgress < 25) {
                insights.push({
                    type: 'tip',
                    icon: <Target size={20} />,
                    title: 'Hedeflerinize Katkı Yapın',
                    description: `Hedeflerinize daha fazla katkı yaparak finansal hedeflerinize ulaşma sürenizi kısaltabilirsiniz.`
                });
            }
        }

        // 4. Spending Pattern
        if (expenseDiff > 50) {
            insights.push({
                type: 'danger',
                icon: <TrendingUp size={20} />,
                title: 'Aşırı Harcama Artışı',
                description: `Harcamalarınız geçen döneme göre %${expenseDiff} arttı. Bu seviye sürdürülebilir değil, acil önlem alın!`
            });
        } else if (expenseDiff > 30) {
            insights.push({
                type: 'warning',
                icon: <TrendingUp size={20} />,
                title: 'Harcama Artışı Uyarısı',
                description: `Harcamalarınız geçen döneme göre %${expenseDiff} arttı. Bu artışın nedenini analiz edin.`
            });
        } else if (expenseDiff < -20) {
            insights.push({
                type: 'success',
                icon: <TrendingDown size={20} />,
                title: 'Başarılı Tasarruf',
                description: `Tebrikler! Harcamalarınızı geçen döneme göre %${Math.abs(expenseDiff)} azalttınız. Bu disiplini sürdürün.`
            });
        }

        // 5. Subscription Analysis (from expense patterns)
        const subscriptionCategories = ['Abonelik', 'Netflix', 'Spotify', 'YouTube', 'İnternet', 'Telefon', 'Subscription'];
        const subscriptionExpenses = transactions.filter(t =>
            t.type === 'expense' &&
            subscriptionCategories.some(cat => t.category.toLowerCase().includes(cat.toLowerCase()) || t.description.toLowerCase().includes(cat.toLowerCase()))
        );

        if (subscriptionExpenses.length > 3) {
            const totalSubscriptions = subscriptionExpenses.reduce((sum, t) => sum + t.amount, 0);
            const subscriptionRatio = monthlyIncome > 0 ? (totalSubscriptions / monthlyIncome) * 100 : 0;

            if (subscriptionRatio > 10) {
                insights.push({
                    type: 'warning',
                    icon: <AlertTriangle size={20} />,
                    title: 'Yüksek Abonelik Harcaması',
                    description: `Dijital abonelikleriniz gelirinizin %${Math.round(subscriptionRatio)}'ini oluşturuyor. Kullanmadığınız abonelikleri iptal etmeyi düşünün.`
                });
            }
        }

        // 6. Bill Payment Pattern
        const billCategories = ['Fatura', 'Elektrik', 'Su', 'Doğalgaz', 'Bills'];
        const billExpenses = transactions.filter(t =>
            t.type === 'expense' &&
            billCategories.some(cat => t.category.toLowerCase().includes(cat.toLowerCase()))
        );

        if (billExpenses.length > 0) {
            insights.push({
                type: 'info',
                icon: <CheckCircle size={20} />,
                title: 'Fatura Ödemeleri',
                description: `Bu dönem ${billExpenses.length} fatura ödemesi yaptınız. Düzenli ödeme alışkanlığınız kredi notunuzu olumlu etkiler.`
            });
        }

        return insights;
    }, [debts, goals, statsA, expenseDiff, isPrivacyMode, transactions]);

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

                {/* 1. Trend Narrative - Clickable & Expandable */}
                <div
                    className={`insight-card highlight ${aiInsightsExpanded ? 'expanded' : ''}`}
                    style={{
                        filter: !user?.isPremium ? 'blur(4px)' : 'none',
                        cursor: user?.isPremium ? 'pointer' : 'default'
                    }}
                    onClick={() => user?.isPremium && setAiInsightsExpanded(!aiInsightsExpanded)}
                >
                    <div className="insight-icon bg-blue">
                        <Brain size={24} />
                    </div>
                    <div className="insight-content" style={{ flex: 1 }}>
                        <span className="insight-label">Yapay Zeka Görüşü</span>
                        <p className="insight-text">{getTrendText()}</p>
                    </div>
                    {user?.isPremium && (
                        <div className="insight-expand-icon">
                            {aiInsightsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    )}
                </div>

                {/* AI Insights Modal */}
                {aiInsightsExpanded && user?.isPremium && (
                    <div className="ai-modal-overlay" onClick={() => setAiInsightsExpanded(false)}>
                        <div className="ai-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="ai-modal-header">
                                <div className="ai-modal-title">
                                    <Brain size={24} />
                                    <span>Yapay Zeka Finansal Analizi</span>
                                </div>
                                <button className="ai-modal-close" onClick={() => setAiInsightsExpanded(false)}>
                                    <ChevronDown size={24} />
                                </button>
                            </div>
                            <div className="ai-modal-body">
                                <div className="ai-insights-grid">
                                    {aiInsights.length > 0 ? aiInsights.map((insight, idx) => (
                                        <div key={idx} className={`ai-insight-item ${insight.type}`}>
                                            <div className={`ai-insight-icon ${insight.type}`}>
                                                {insight.icon}
                                            </div>
                                            <div className="ai-insight-content">
                                                <span className="ai-insight-title">{insight.title}</span>
                                                <p className="ai-insight-desc">{insight.description}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="ai-insight-item info">
                                            <div className="ai-insight-icon info">
                                                <Lightbulb size={20} />
                                            </div>
                                            <div className="ai-insight-content">
                                                <span className="ai-insight-title">Veri Bekleniyor</span>
                                                <p className="ai-insight-desc">Daha fazla işlem ve borç verisi eklediğinizde kişiselleştirilmiş analizler burada görünecek.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Disclaimer */}
                                <div className="ai-disclaimer">
                                    <AlertTriangle size={14} />
                                    <span>Bu analizler yapay zeka tarafından oluşturulmuştur. Finansal kararlarınızda profesyonel danışmanlık almanızı öneririz.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                                    <span className="cat-name">{translateCategory(cat.category)}</span>
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
                                                    style={{ cursor: 'pointer' }}
                                                    onMouseEnter={() => setHoveredSegment('income')}
                                                    onMouseLeave={() => setHoveredSegment(null)}
                                                />

                                                {/* Expense Segment (Red) */}
                                                <circle
                                                    cx={center} cy={center} r={radius}
                                                    fill="none" stroke="#ef4444" strokeWidth={strokeWidth}
                                                    strokeDasharray={`${(expensePct / 100) * circumference} ${circumference}`}
                                                    strokeDashoffset={-1 * (incomePct / 100) * circumference}
                                                    strokeLinecap="round"
                                                    style={{ cursor: 'pointer' }}
                                                    onMouseEnter={() => setHoveredSegment('expense')}
                                                    onMouseLeave={() => setHoveredSegment(null)}
                                                />
                                            </svg>

                                            {/* Center Label - Dynamic based on hover */}
                                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', transition: 'all 0.2s ease' }}>
                                                {hoveredSegment === 'income' ? (
                                                    <>
                                                        <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>Gelir</span>
                                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                                                            {isPrivacyMode ? '**** ₺' : `+${statsA.totalIncome.toLocaleString()} ₺`}
                                                        </div>
                                                    </>
                                                ) : hoveredSegment === 'expense' ? (
                                                    <>
                                                        <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>Gider</span>
                                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>
                                                            {isPrivacyMode ? '**** ₺' : `-${statsA.totalExpense.toLocaleString()} ₺`}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Toplam Hacim</span>
                                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                                                            {isPrivacyMode ? '**** ₺' : `${total.toLocaleString()} ₺`}
                                                        </div>
                                                    </>
                                                )}
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
