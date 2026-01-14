import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

export const KVKKDisclosure: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="legal-overlay">
            <div className="legal-modal">
                <button className="legal-close-btn" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>

                <h1 className="legal-main-title">AYDINLATMA METNİ</h1>

                <div className="legal-content">
                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 1<br /><span className="highlight">VERİ SORUMLUSU</span></h2>

                        <div className="legal-article">
                            <h3>1. VERİ SORUMLUSUNUN KİMLİĞİ</h3>
                            <p>
                                <strong>1.1.</strong> 6698 sayılı Kişisel Verilerin Korunması Kanunu ("<span className="highlight-text">KVKK</span>") kapsamında,
                                kişisel verileriniz veri sorumlusu sıfatıyla <span className="highlight-text">Fink</span> tarafından aşağıda açıklanan
                                kapsamda işlenebilecektir.
                            </p>
                            <p>
                                <strong>1.2.</strong> İşbu Aydınlatma Metni, KVKK'nın 10. maddesi ile Aydınlatma Yükümlülüğünün Yerine Getirilmesinde
                                Uyulacak Usul ve Esaslar Hakkında Tebliğ kapsamında hazırlanmıştır.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 2<br /><span className="highlight">TOPLANAN VERİLER</span></h2>

                        <div className="legal-article">
                            <h3>2. İŞLENEN KİŞİSEL VERİLER</h3>
                            <p>
                                <strong>2.1.</strong> <span className="highlight-text">Kimlik Bilgileri:</span> Ad, soyad
                            </p>
                            <p>
                                <strong>2.2.</strong> <span className="highlight-text">İletişim Bilgileri:</span> E-posta adresi
                            </p>
                            <p>
                                <strong>2.3.</strong> <span className="highlight-text">Finansal Bilgiler:</span> Gelir-gider kayıtları, abonelik bilgileri,
                                borç-alacak kayıtları, hedef ve yatırım bilgileri
                            </p>
                            <p>
                                <strong>2.4.</strong> <span className="highlight-text">İşlem Güvenliği:</span> Şifrelenmiş parola, oturum bilgileri, IP adresi
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 3<br /><span className="highlight">İŞLEME AMAÇLARI</span></h2>

                        <div className="legal-article">
                            <h3>3. VERİ İŞLEME AMAÇLARI</h3>
                            <p>
                                <strong>3.1.</strong> Üyelik işlemlerinin gerçekleştirilmesi ve hesap yönetimi
                            </p>
                            <p>
                                <strong>3.2.</strong> Finans yönetimi hizmetlerinin sunulması
                            </p>
                            <p>
                                <strong>3.3.</strong> Kullanıcı deneyiminin iyileştirilmesi ve kişiselleştirilmesi
                            </p>
                            <p>
                                <strong>3.4.</strong> Yasal yükümlülüklerin yerine getirilmesi
                            </p>
                            <p>
                                <strong>3.5.</strong> Bilgi güvenliğinin sağlanması ve dolandırıcılığın önlenmesi
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 4<br /><span className="highlight">HUKUKİ SEBEPLER</span></h2>

                        <div className="legal-article">
                            <h3>4. VERİ İŞLEMENİN HUKUKİ SEBEPLERİ</h3>
                            <p>
                                <strong>4.1.</strong> Sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (KVKK m.5/2-c)
                            </p>
                            <p>
                                <strong>4.2.</strong> Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi (KVKK m.5/2-ç)
                            </p>
                            <p>
                                <strong>4.3.</strong> İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun
                                meşru menfaatleri için veri işlenmesinin zorunlu olması (KVKK m.5/2-f)
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 5<br /><span className="highlight">VERİ AKTARIMI</span></h2>

                        <div className="legal-article">
                            <h3>5. KİŞİSEL VERİLERİN AKTARILMASI</h3>
                            <p>
                                <strong>5.1.</strong> Kişisel verileriniz, yukarıda belirtilen amaçlarla sınırlı olarak;
                            </p>
                            <p>
                                • Hizmet sağlayıcılarımıza (sunucu, bulut hizmeti sağlayıcıları)
                            </p>
                            <p>
                                • Yasal zorunluluk halinde yetkili kamu kurum ve kuruluşlarına
                            </p>
                            <p>
                                aktarılabilecektir.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 6<br /><span className="highlight">HAKLARINIZ</span></h2>

                        <div className="legal-article">
                            <h3>6. KVKK KAPSAMINDA HAKLARINIZ</h3>
                            <p>
                                KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:
                            </p>
                            <p>
                                <strong>a)</strong> Kişisel verilerinizin işlenip işlenmediğini öğrenme
                            </p>
                            <p>
                                <strong>b)</strong> Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme
                            </p>
                            <p>
                                <strong>c)</strong> Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
                            </p>
                            <p>
                                <strong>d)</strong> Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme
                            </p>
                            <p>
                                <strong>e)</strong> Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme
                            </p>
                            <p>
                                <strong>f)</strong> KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme
                            </p>
                            <p>
                                <strong>g)</strong> İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme
                            </p>
                            <p>
                                <strong>h)</strong> Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 7<br /><span className="highlight">SORUMLULUK REDDİ</span></h2>

                        <div className="legal-article">
                            <h3>7. VERİ GÜVENLİĞİ SORUMLULUĞU</h3>
                            <p>
                                <strong>7.1.</strong> Fink bir <span className="highlight-text">test projesidir</span> ve kişisel verilerin güvenliği konusunda <strong>profesyonel düzeyde garanti verilmemektedir</strong>.
                            </p>
                            <p>
                                <strong>7.2.</strong> Veri kaybı, yetkisiz erişim veya güvenlik ihlali durumlarında <strong>Fink hiçbir sorumluluk kabul etmez</strong>.
                            </p>
                            <p>
                                <strong>7.3.</strong> Kullanıcılar, verilerini kendi riskleri altında paylaşmaktadır.
                            </p>
                            <p>
                                <strong>7.4.</strong> Veri işleme faaliyetlerinden kaynaklanan <strong>hiçbir zarar için tazminat talep edilemez</strong>.
                            </p>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2 className="legal-section-title">BÖLÜM 8<br /><span className="highlight">BAŞVURU</span></h2>

                        <div className="legal-article">
                            <h3>8. BAŞVURU YÖNTEMİ</h3>
                            <p>
                                <strong>8.1.</strong> Yukarıda belirtilen haklarınızı kullanmak için <a href="mailto:kvkk@fink.app">kvkk@fink.app</a> adresine
                                e-posta gönderebilirsiniz.
                            </p>
                            <p>
                                <strong>8.2.</strong> Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
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
