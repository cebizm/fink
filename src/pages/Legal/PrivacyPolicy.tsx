import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

export const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="legal-overlay">
            <div className="legal-modal">
                <button className="legal-close-btn" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>

                <h1 className="legal-main-title">GİZLİLİK POLİTİKASI</h1>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 1<br /><span className="highlight">GENEL HÜKÜMLER</span></h2>

                        <div className="legal-article">
                            <h3>1. TARAFLAR</h3>
                            <p>
                                <strong>1.1.</strong> İşbu Gizlilik Politikası ("Politika"); Fink uygulaması ("Fink") ile Fink
                                tarafından sunulan hizmetlerden faydalanan kişi ("<span className="highlight-text">Kullanıcı</span>") arasında akdedilmiştir. Fink ve Kullanıcı ayrı
                                ayrı "<span className="highlight-text">Taraf</span>" ve birlikte "<span className="highlight-text">Taraflar</span>" olarak anılacaklardır.
                            </p>
                            <p>
                                <strong>1.2.</strong> Fink'in iletişim bilgileri aşağıdaki gibidir;<br />
                                E-Posta adresi: <a href="mailto:info@fink.app">info@fink.app</a><br />
                                Destek Talepleri: <a href="mailto:destek@fink.app">destek@fink.app</a>
                            </p>
                            <p>
                                <strong>1.3.</strong> Kullanıcının kimliği ve iletişim bilgisi Kullanıcının Fink nezdinde hesap açarken yaptığı
                                başvuruda bildirdiği kimlik bilgisi ve iletişim bilgisidir.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 2<br /><span className="highlight">TOPLANAN VERİLER</span></h2>

                        <div className="legal-article">
                            <h3>2. VERİ KATEGORİLERİ</h3>
                            <p>
                                <strong>2.1.</strong> <span className="highlight-text">Hesap Bilgileri:</span> Ad, soyad, e-posta adresi ve şifrelenmiş parola bilgileriniz.
                            </p>
                            <p>
                                <strong>2.2.</strong> <span className="highlight-text">Finansal Veriler:</span> Gelir ve gider kayıtları, abonelikler, borçlar, hedefler ve yatırım bilgileriniz.
                            </p>
                            <p>
                                <strong>2.3.</strong> <span className="highlight-text">Kullanım Verileri:</span> Uygulama kullanım istatistikleri, oturum bilgileri ve tercihleriniz.
                            </p>
                            <p>
                                <strong>2.4.</strong> <span className="highlight-text">Cihaz Bilgileri:</span> Tarayıcı türü, işletim sistemi ve IP adresi gibi teknik bilgiler.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 3<br /><span className="highlight">VERİ GÜVENLİĞİ</span></h2>

                        <div className="legal-article">
                            <h3>3. GÜVENLİK ÖNLEMLERİ</h3>
                            <p>
                                <strong>3.1.</strong> Verilerinizin güvenliği bizim için önceliklidir. SSL/TLS şifreleme ile veri aktarımı sağlanmaktadır.
                            </p>
                            <p>
                                <strong>3.2.</strong> Firebase güvenlik kuralları ve güçlü kimlik doğrulama protokolleri uygulanmaktadır.
                            </p>
                            <p>
                                <strong>3.3.</strong> Şifreler bcrypt algoritması ile hashlenmekte, düzenli güvenlik denetimleri yapılmaktadır.
                            </p>
                            <p>
                                <strong>3.4.</strong> Kişisel verilerinizi üçüncü taraflarla <strong>satmıyor veya kiralamıyoruz</strong>.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 4<br /><span className="highlight">KVKK HAKLARI</span></h2>

                        <div className="legal-article">
                            <h3>4. KULLANICI HAKLARI</h3>
                            <p>
                                <strong>4.1.</strong> Kişisel verilerin işlenip işlenmediğini öğrenme hakkı.
                            </p>
                            <p>
                                <strong>4.2.</strong> Kişisel verilere erişme ve düzeltme talep etme hakkı.
                            </p>
                            <p>
                                <strong>4.3.</strong> Verilerin silinmesini ve aktarılmasını talep etme hakkı.
                            </p>
                            <p>
                                <strong>4.4.</strong> Veri işleme faaliyetlerine itiraz etme hakkı.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 5<br /><span className="highlight">İLETİŞİM</span></h2>

                        <div className="legal-article">
                            <h3>5. BİZE ULAŞIN</h3>
                            <p>
                                <strong>5.1.</strong> Gizlilik politikamız hakkında sorularınız için <a href="mailto:privacy@fink.app">privacy@fink.app</a> adresinden bizimle iletişime geçebilirsiniz.
                            </p>
                            <p className="legal-footer-note">
                                Son güncelleme: 14 Ocak 2026 | Fink
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
