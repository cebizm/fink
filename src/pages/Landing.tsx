import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TrendingUp, Wallet, CreditCard, Target, PieChart, ArrowRight, Sparkles, ChevronDown, Shield, Users, Moon, Bell } from 'lucide-react';
import './Landing.css';

export const Landing: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Wallet size={32} />,
            title: 'İşlemler',
            description: 'Gelir ve giderlerini kolayca takip et, kategorilere ayır, raporlarla analiz et.',
            color: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
        },
        {
            icon: <CreditCard size={32} />,
            title: 'Abonelikler',
            description: 'Tekrarlayan ödemelerini yönet, ödeme tarihlerini kaçırma.',
            color: 'linear-gradient(135deg, #ec4899, #f43f5e)'
        },
        {
            icon: <TrendingUp size={32} />,
            title: 'Borçlar & Alacaklar',
            description: 'Borçlarını ve alacaklarını takip et, unutma.',
            color: 'linear-gradient(135deg, #f59e0b, #ef4444)'
        },
        {
            icon: <Target size={32} />,
            title: 'Hedefler',
            description: 'Finansal hedefler belirle, birlikte hedef oluştur, ilerlemeni izle.',
            color: 'linear-gradient(135deg, #10b981, #14b8a6)'
        },
        {
            icon: <PieChart size={32} />,
            title: 'Birikimler',
            description: 'Döviz, altın, mevduat yatırımlarını takip et, kazancını gör.',
            color: 'linear-gradient(135deg, #3b82f6, #06b6d4)'
        }
    ];



    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const faqData = [
        {
            question: 'Fink nedir ve ne işe yarar?',
            answer: 'Fink, gelir-gider takibi, abonelik yönetimi, borç-alacak takibi ve finansal hedef belirleme gibi özellikleri tek bir platformda sunan modern bir kişisel finans yönetimi uygulamasıdır.'
        },
        {
            question: 'Fink\'i kullanmak ücretsiz mi?',
            answer: 'Evet, Fink\'in temel özellikleri ücretsiz olarak kullanılabilir. Gelişmiş özellikler ve premium avantajlar için ücretli paketlerimiz bulunmaktadır.'
        },
        {
            question: 'Premium üyelik ne gibi avantajlar sunar?',
            answer: 'Premium üyelik ile sınırsız işlem, gelişmiş raporlar, öncelikli destek, özel temalar, dışa aktarma özellikleri ve daha fazlasına erişebilirsiniz.'
        },
        {
            question: 'Verilerim güvende mi?',
            answer: 'Evet, verileriniz en üst düzey güvenlik protokolleri ile korunmaktadır. SSL şifreleme, Firebase güvenlik kuralları ve düzenli yedekleme ile verileriniz her zaman güvende.'
        },
        {
            question: 'Ortak hedef özelliği nasıl çalışır?',
            answer: 'Ortak hedefler ile arkadaşlarınız veya ailenizle birlikte tasarruf hedefi oluşturabilir, ilerlemeyi takip edebilir ve birlikte hedefe ulaşabilirsiniz.'
        },
        {
            question: 'Aboneliklerimi nasıl takip edebilirim?',
            answer: 'Abonelikler bölümünden tüm tekrarlayan ödemelerinizi ekleyebilir, ödeme tarihlerini görebilir ve yaklaşan ödemeler için bildirim alabilirsiniz.'
        },
        {
            question: 'Borç ve alacaklarımı nasıl yönetebilirim?',
            answer: 'Borçlar & Alacaklar bölümünden kime borçlu olduğunuzu, kimlerden alacağınız olduğunu takip edebilir, ödeme hatırlatıcıları ayarlayabilirsiniz.'
        },
        {
            question: 'Karanlık mod mevcut mu?',
            answer: 'Evet, Fink hem açık hem karanlık mod destekler. Tercihlerinize göre tema seçebilir veya sistem ayarlarınızı takip edebilir.'
        },
        {
            question: 'Mobil uygulama var mı?',
            answer: 'Fink şu anda web tabanlı bir uygulama olarak sunulmaktadır. Mobil uygulama yakında yayınlanacaktır.'
        },
        {
            question: 'Verilerimi dışa aktarabilir miyim?',
            answer: 'Premium kullanıcılar işlemlerini ve raporlarını Excel veya PDF formatında dışa aktarabilir.'
        },
        {
            question: 'Hesabımı nasıl silebilirim?',
            answer: 'Profil ayarlarından hesabınızı kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz ve tüm verileriniz silinir.'
        },
        {
            question: 'Şifremi unuttum, ne yapmalıyım?',
            answer: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz.'
        },
        {
            question: 'İşlem kategorileri özelleştirilebilir mi?',
            answer: 'Evet, varsayılan kategorilerin yanında kendi özel kategorilerinizi de oluşturabilir ve işlemlerinizi bunlara göre sınıflandırabilirsiniz.'
        },
        {
            question: 'Bildirimler nasıl çalışır?',
            answer: 'Abonelik ödemeleri, hedef ilerlemeleri ve borç hatırlatmaları için bildirim alabilirsiniz. Bildirim tercihlerinizi ayarlardan yönetebilirsiniz.'
        },
        {
            question: 'Destek almak için nasıl iletişime geçebilirim?',
            answer: 'Profil > Destek bölümünden bize ulaşabilir veya support@finkapp.com adresine e-posta gönderebilirsiniz.'
        }
    ];

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="landing-nav">
                <div className="landing-container">
                    <div className="nav-content">
                        <div className="nav-logo">
                            <span>Fink</span>
                        </div>
                        <div className="nav-actions">
                            <button className="btn-ghost" onClick={() => navigate('/login')}>
                                Giriş Yap
                            </button>
                            <button className="btn-primary" onClick={() => navigate('/register')}>
                                Kayıt Ol
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="landing-container">
                    <div className="hero-content">
                        <div className="hero-left">
                            <div className="hero-badge">
                                <Sparkles size={16} />
                                <span>Modern Finans Yönetimi</span>
                            </div>
                            <h1 className="hero-title">
                                Finansal Özgürlüğüne
                                <span className="gradient-text"> Giriş Yap</span>
                            </h1>
                            <p className="hero-subtitle">
                                Gelirlerini, giderlerini, aboneliklerini, borçlarını ve hedeflerini tek bir yerde yönet.
                                Fink ile finansal hayatın kontrolünü eline al.
                            </p>
                            <div className="hero-cta">
                                <button className="btn-hero-primary" onClick={() => navigate('/register')}>
                                    Hemen Başla
                                    <ArrowRight size={20} />
                                </button>
                                <button className="btn-hero-secondary" onClick={() => navigate('/login')}>
                                    Giriş Yap
                                </button>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <span className="stat-number">5+</span>
                                    <span className="stat-label">Özellik</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <span className="stat-number">100%</span>
                                    <span className="stat-label">Reklamsız</span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <span className="stat-number">∞</span>
                                    <span className="stat-label">Sınırsız</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual - Animated Shapes */}
                        <div className="hero-right">
                            <div className="hero-visual">
                                {/* Main Circle */}
                                <div className="visual-circle main-circle">
                                    <div className="circle-content">
                                        <TrendingUp size={48} className="visual-icon" />
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="floating-element el-1">
                                    <Wallet size={24} />
                                </div>
                                <div className="floating-element el-2">
                                    <Target size={24} />
                                </div>
                                <div className="floating-element el-3">
                                    <CreditCard size={24} />
                                </div>
                                <div className="floating-element el-4">
                                    <PieChart size={24} />
                                </div>

                                {/* Decorative Rings */}
                                <div className="deco-ring ring-1"></div>
                                <div className="deco-ring ring-2"></div>
                                <div className="deco-ring ring-3"></div>
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="hero-gradient-blob blob-purple"></div>
                            <div className="hero-gradient-blob blob-pink"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="landing-container">
                    <div className="section-header">
                        <h2 className="section-title">Her Şey Bir Arada</h2>
                        <p className="section-subtitle">
                            Finansal yaşamını yönetmek için ihtiyacın olan tüm araçlar
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon" style={{ background: feature.color, color: 'white' }}>
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section - Bento Grid */}
            <section className="benefits-section">
                <div className="landing-container">
                    <div className="section-header">
                        <h2 className="section-title">Neden Fink?</h2>
                        <p className="section-subtitle">
                            Finansal özgürlüğe giden yolda ihtiyacın olan tüm özellikleri sunuyoruz
                        </p>
                    </div>

                    <div className="bento-grid">
                        {/* Large Card - Main Feature */}
                        <div className="bento-card bento-large">
                            <div className="bento-icon-wrapper gradient-purple">
                                <Wallet size={32} />
                            </div>
                            <h3 className="bento-title">Akıllı Finans Yönetimi</h3>
                            <p className="bento-description">
                                Gelir ve giderlerini tek bir yerden takip et. Kategorize et,
                                analiz et ve finansal kararlarını veriye dayalı al.
                            </p>
                            <div className="bento-stats">
                                <div className="bento-stat">
                                    <span className="stat-value">₺12.450</span>
                                    <span className="stat-label">Örnek Bakiye</span>
                                </div>
                            </div>
                        </div>

                        {/* Medium Card - Security */}
                        <div className="bento-card bento-medium">
                            <div className="bento-icon-wrapper gradient-green">
                                <Shield size={28} />
                            </div>
                            <h3 className="bento-title">Güvenli & Gizli</h3>
                            <p className="bento-description">
                                Verileriniz en üst düzey güvenlik protokolleri ile korunur.
                            </p>
                        </div>

                        {/* Medium Card - Goals */}
                        <div className="bento-card bento-medium">
                            <div className="bento-icon-wrapper gradient-pink">
                                <Target size={28} />
                            </div>
                            <h3 className="bento-title">Hedef Belirleme</h3>
                            <p className="bento-description">
                                Finansal hedefler koy ve ilerlemenizi takip edin.
                            </p>
                        </div>

                        {/* Small Card - Shared Goals */}
                        <div className="bento-card bento-small">
                            <div className="bento-icon-wrapper gradient-blue">
                                <Users size={24} />
                            </div>
                            <h3 className="bento-title">Ortak Hedefler</h3>
                        </div>

                        {/* Small Card - Dark Mode */}
                        <div className="bento-card bento-small">
                            <div className="bento-icon-wrapper gradient-dark">
                                <Moon size={24} />
                            </div>
                            <h3 className="bento-title">Karanlık Mod</h3>
                        </div>

                        {/* Small Card - Notifications */}
                        <div className="bento-card bento-small">
                            <div className="bento-icon-wrapper gradient-orange">
                                <Bell size={24} />
                            </div>
                            <h3 className="bento-title">Bildirimler</h3>
                        </div>

                        {/* Wide Card - Ad Free (spans 3 columns) */}
                        <div className="bento-card bento-wide-3">
                            <div className="bento-icon-wrapper gradient-purple">
                                <Sparkles size={28} />
                            </div>
                            <div className="bento-wide-content">
                                <h3 className="bento-title">%100 Reklamsız Deneyim</h3>
                                <p className="bento-description">
                                    Kesintisiz, temiz ve profesyonel bir finansal yönetim deneyimi yaşayın.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="landing-container">
                    <div className="section-header">
                        <h2 className="section-title">Sıkça Sorulan Sorular</h2>
                        <p className="section-subtitle">
                            Fink hakkında merak ettikleriniz
                        </p>
                    </div>
                    <div className="faq-list">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                >
                                    <span>{faq.question}</span>
                                    <ChevronDown className="faq-icon" />
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="landing-container">
                    <div className="cta-content">
                        <h2 className="cta-title">Finansal Özgürlüğüne Bugün Başla</h2>
                        <p className="cta-subtitle">
                            Ücretsiz hesap oluştur ve finansal hayatını kontrol altına al
                        </p>
                        <div className="cta-buttons">
                            <button className="btn-cta-primary" onClick={() => navigate('/register')}>
                                Ücretsiz Kayıt Ol
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-container">
                    <div className="footer-content">
                        <div className="footer-left">
                            <div className="footer-logo">
                                <Sparkles size={20} />
                                <span>Fink</span>
                            </div>
                            <p>Modern finans yönetimi platformu</p>
                        </div>
                        <div className="footer-links">
                            <Link to="/privacy-policy">Gizlilik Politikası</Link>
                            <Link to="/terms-of-service">Kullanım Şartları</Link>
                            <Link to="/contact">İletişim</Link>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 Fink. Tüm hakları saklıdır.</p>
                        <p className="footer-disclaimer">Fink bir test projesidir. Girilen verilerin doğruluğu garanti edilmez ve finansal tavsiye niteliği taşımaz.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
