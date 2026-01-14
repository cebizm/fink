import React, { useState } from 'react';
import { X, Mail, MessageSquare, HelpCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

export const Contact: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'general',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send to a backend
        alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
        setFormData({ name: '', email: '', subject: 'general', message: '' });
    };

    return (
        <div className="legal-overlay">
            <div className="legal-modal contact-modal">
                <button className="legal-close-btn" onClick={() => navigate(-1)}>
                    <X size={24} />
                </button>

                <h1 className="legal-main-title">İLETİŞİM</h1>

                <div className="legal-content">
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '2px solid #f59e0b' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e', fontWeight: 600 }}>
                            ⚠️ <strong>ÖNEMLİ:</strong> Fink bir test projesidir. Destek talepleri için yanıt garantisi verilmemektedir.
                            Uygulama kullanımından kaynaklanan hiçbir sorumluluk kabul edilmez.
                        </p>
                    </div>
                    <div className="contact-grid">
                        {/* Contact Info Section */}
                        <div className="contact-info-section">
                            <h2 className="legal-section-title"><span className="highlight">BİZE ULAŞIN</span></h2>

                            <div className="contact-card">
                                <div className="contact-card-icon">
                                    <Mail size={24} />
                                </div>
                                <div className="contact-card-content">
                                    <h3>Genel Sorular</h3>
                                    <a href="mailto:info@fink.app">info@fink.app</a>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-card-icon">
                                    <HelpCircle size={24} />
                                </div>
                                <div className="contact-card-content">
                                    <h3>Destek</h3>
                                    <a href="mailto:destek@fink.app">destek@fink.app</a>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-card-icon">
                                    <MessageSquare size={24} />
                                </div>
                                <div className="contact-card-content">
                                    <h3>İş Birlikleri</h3>
                                    <a href="mailto:isbirligi@fink.app">isbirligi@fink.app</a>
                                </div>
                            </div>

                            <div className="contact-response-time">
                                <p>📩 Ortalama yanıt süresi: <strong>24 saat</strong></p>
                            </div>
                        </div>

                        {/* Contact Form Section */}
                        <div className="contact-form-section">
                            <h2 className="legal-section-title"><span className="highlight">MESAJ GÖNDERMEK</span></h2>

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-group">
                                    <label>Ad Soyad</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Adınızı girin"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>E-posta</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="E-posta adresiniz"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Konu</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    >
                                        <option value="general">Genel Soru</option>
                                        <option value="support">Teknik Destek</option>
                                        <option value="billing">Ödeme/Fatura</option>
                                        <option value="feedback">Öneri/Geri Bildirim</option>
                                        <option value="partnership">İş Birliği</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Mesajınız</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Mesajınızı buraya yazın..."
                                        rows={5}
                                        required
                                    />
                                </div>

                                <button type="submit" className="contact-submit-btn">
                                    <Send size={18} />
                                    <span>Gönder</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
