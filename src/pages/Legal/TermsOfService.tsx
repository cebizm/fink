import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

export const TermsOfService: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="legal-overlay">
            <div className="legal-modal">
                <button className="legal-close-btn" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>

                <h1 className="legal-main-title">KULLANIM ŞARTLARI</h1>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 1<br /><span className="highlight">GENEL HÜKÜMLER</span></h2>

                        <div className="legal-article">
                            <h3>1. TARAFLAR VE KAPSAM</h3>
                            <p>
                                <strong>1.1.</strong> İşbu Kullanım Şartları ("Sözleşme"); Fink uygulaması ("Fink") ile Fink
                                tarafından sunulan hizmetlerden faydalanan kişi ("<span className="highlight-text">Kullanıcı</span>") arasında akdedilmiştir.
                            </p>
                            <p>
                                <strong>1.2.</strong> Kullanıcı, Fink hizmetlerini kullanmaya başladığında işbu Sözleşme'nin
                                tüm hükümlerini okumuş, anlamış ve kabul etmiş sayılır.
                            </p>
                            <p>
                                <strong>1.3.</strong> Fink, işbu Sözleşme'nin hükümlerini dilediği zaman değiştirme hakkını saklı tutar.
                                Değişiklikler, yayınlandığı tarihte yürürlüğe girer.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 2<br /><span className="highlight">HİZMET TANIMI</span></h2>

                        <div className="legal-article">
                            <h3>2. SUNULAN HİZMETLER</h3>
                            <p>
                                <strong>2.1.</strong> <span className="highlight-text">Finansal Takip:</span> Gelir ve gider kayıtlarının tutulması, kategorize edilmesi ve raporlanması.
                            </p>
                            <p>
                                <strong>2.2.</strong> <span className="highlight-text">Abonelik Yönetimi:</span> Tekrarlayan ödemelerin takibi ve hatırlatma bildirimleri.
                            </p>
                            <p>
                                <strong>2.3.</strong> <span className="highlight-text">Borç/Alacak Takibi:</span> Borç ve alacakların yönetimi, ödeme planlaması.
                            </p>
                            <p>
                                <strong>2.4.</strong> <span className="highlight-text">Hedef Belirleme:</span> Finansal hedefler oluşturma ve ilerleme takibi.
                            </p>
                            <p>
                                <strong>2.5.</strong> <span className="highlight-text">Yatırım Takibi:</span> Döviz, altın ve diğer yatırımların izlenmesi.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 3<br /><span className="highlight">KULLANICI YÜKÜMLÜLÜKLERİ</span></h2>

                        <div className="legal-article">
                            <h3>3. KULLANICI SORUMLULUKLARI</h3>
                            <p>
                                <strong>3.1.</strong> Kullanıcı, hesap bilgilerinin gizliliğinden ve güvenliğinden sorumludur.
                            </p>
                            <p>
                                <strong>3.2.</strong> Kullanıcı, hizmeti yalnızca yasal amaçlarla kullanacağını taahhüt eder.
                            </p>
                            <p>
                                <strong>3.3.</strong> Kullanıcı, üçüncü şahısların haklarını ihlal eden içerik paylaşmayacaktır.
                            </p>
                            <p>
                                <strong>3.4.</strong> Kullanıcı, sisteme zarar verecek veya performansını olumsuz etkileyecek eylemlerden kaçınacaktır.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 4<br /><span className="highlight">ÜCRETLER VE ÖDEME</span></h2>

                        <div className="legal-article">
                            <h3>4. ÜCRETLENDİRME</h3>
                            <p>
                                <strong>4.1.</strong> Fink'in temel özellikleri <span className="highlight-text">ücretsiz</span> olarak sunulmaktadır.
                            </p>
                            <p>
                                <strong>4.2.</strong> Premium üyelik ücretleri, satın alma sırasında belirtilen şekilde tahsil edilir.
                            </p>
                            <p>
                                <strong>4.3.</strong> İade politikası, yasal düzenlemelere uygun olarak uygulanır.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 5<br /><span className="highlight">SORUMLULUK SINIRLAMASI</span></h2>

                        <div className="legal-article">
                            <h3>5. SINIRLAMALAR</h3>
                            <p>
                                <strong>5.1.</strong> Fink, hizmetin kesintisiz ve hatasız çalışacağını garanti etmez.
                            </p>
                            <p>
                                <strong>5.2.</strong> Kullanıcının girdiği verilerin doğruluğundan Fink sorumlu değildir.
                            </p>
                            <p>
                                <strong>5.3.</strong> Fink, finansal tavsiye vermez; tüm kararlar Kullanıcı'nın sorumluluğundadır.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 6<br /><span className="highlight">FESİH</span></h2>

                        <div className="legal-article">
                            <h3>6. SÖZLEŞMENİN SONA ERMESİ</h3>
                            <p>
                                <strong>6.1.</strong> Kullanıcı, dilediği zaman hesabını kapatarak Sözleşme'yi feshedebilir.
                            </p>
                            <p>
                                <strong>6.2.</strong> Fink, Sözleşme ihlali durumunda hesabı askıya alma veya kapatma hakkına sahiptir.
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
