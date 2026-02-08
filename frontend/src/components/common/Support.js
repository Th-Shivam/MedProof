import React, { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import '../../assets/css/Theme.css';

const Support = ({ onBack }) => {
    const { t } = useContext(LanguageContext);

    return (
        <div className="gov-container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={onBack} className="btn-secondary" style={{ marginBottom: '1rem' }}>
                &larr; {t('backToHome')}
            </button>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h1 style={{ borderBottom: '2px solid var(--gov-orange)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                    {t('supportTitle')}
                </h1>

                {/* Contact Section */}
                <section style={{ marginBottom: '2rem' }}>
                    <h3>📧 {t('contactUs')}</h3>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                        <p style={{ margin: 0, fontSize: '1.1rem' }}>
                            <strong>Email:</strong> <a href="mailto:medproof.contact@gmail.com" style={{ color: 'var(--gov-blue)' }}>medproof.contact@gmail.com</a>
                        </p>
                    </div>
                </section>

                {/* MetaMask Setup Guide */}
                <section style={{ marginBottom: '2rem' }}>
                    <h3>🦊 {t('metaMaskGuideTitle')}</h3>
                    <div className="guide-steps">
                        <div className="step-item">
                            <div className="step-content">
                                <h4>{t('step1Title')}</h4>
                                <p>{t('step1Desc')}</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-content">
                                <h4>{t('step2Title')}</h4>
                                <p>{t('step2Desc')}</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-content">
                                <h4>{t('step3Title')}</h4>
                                <p>{t('step3Desc')}</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-content">
                                <h4>{t('step4Title')}</h4>
                                <p>{t('step4Desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section>
                    <h3>❓ {t('faqTitle')}</h3>
                    <div className="faq-list">
                        <details>
                            <summary>{t('faq1Q')}</summary>
                            <p>{t('faq1A')}</p>
                        </details>
                        <details>
                            <summary>{t('faq2Q')}</summary>
                            <p>{t('faq2A')}</p>
                        </details>
                        <details>
                            <summary>{t('faq3Q')}</summary>
                            <p>{t('faq3A')}</p>
                        </details>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Support;
