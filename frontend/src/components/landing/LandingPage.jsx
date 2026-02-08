import React from 'react';
import './LandingPage.css';
import { LanguageContext } from '../../context/LanguageContext';

const LandingPage = ({ connectWallet, enterPublicMode, isConnecting }) => {
    const { t } = React.useContext(LanguageContext);
    return (
        <div className="landing-container">
            {/* 1. Cyber Marquee */}
            <div className="updates-marquee">
                <div className="marquee-content">
                    <span>
                        <strong>{t('medProofTitle')}</strong> &nbsp;&nbsp;  &nbsp;&nbsp;
                        <strong>{t('atmanirbhar')}</strong> &nbsp;&nbsp;
                    </span>
                </div>
            </div>

            {/* 2. Holographic Hero Section */}
            <section className="hero-section">
                <div className="hero-content-wrapper">
                    {/* Left: Text Content */}
                    <div className="hero-text-block">
                        <span className="hero-tag">Theme ID: TH03 (MedTech) | Team: Rooted</span>
                        <h1 className="hero-title">{t('heroTitle')}</h1>
                        <p className="hero-subtitle">
                            {t('heroSubtitle')}
                        </p>

                        <div className="hero-btn-group">
                            <button className="primary-cta" onClick={enterPublicMode} disabled={isConnecting}>
                                {isConnecting ? (
                                    <>
                                        <div className="spinner-border" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '10px' }}></div>
                                        <span>{t('initializing')}</span>
                                    </>
                                ) : (
                                    <>{t('Verify a Medicine')}</>
                                )}
                            </button>
                            <button className="secondary-cta" onClick={connectWallet}>
                                {t('Manufacturer Portal')}
                            </button>
                        </div>
                    </div>

                    {/* Right: CSS Verification Card (Redesigned) */}
                    <div className="hero-visual-block">
                        <div className="shield-container">
                            <div className="shield-glow"></div>
                            <div className="shield-content">
                                <h2 className="shield-main-text">Scan.<br />Verify.<br />Trust.</h2>
                                <p className="shield-sub-text">Every medicine verified on<br />Polygon Blockchain.</p>
                            </div>
                            <div className="shield-footer-badge">
                                Authenticated by MedProof
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 3. Glassmorphism Info Grid */}
            <section className="info-section">
                <div className="info-cards-container">
                    {/* Problem/Solution */}
                    <div className="glass-card main-info" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div className="watermark-icon">
                            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <h2>{t('problemTitle')}</h2>
                            <p>
                                {t('problemDesc')}
                            </p>
                            <p>
                                <strong style={{ color: '#00f2ea' }}>{t('solutionTitle')}</strong> {t('solutionDesc')}
                            </p>
                        </div>
                    </div>

                    {/* Tech Specs */}
                    <div className="glass-card tech-info" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div className="watermark-icon">
                            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </div>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <h2>Built for National Deployment</h2>
                            <ul className="tech-list">
                                <li><span>Network</span> <span className="tech-val">Polygon (Government-grade scale)</span></li>
                                <li><span>Storage</span> <span className="tech-val">IPFS (Decentralized certificates)</span></li>
                                <li><span>Contract</span> <span className="tech-val">OpenZeppelin-secured registry</span></li>
                                <li><span>Security</span> <span className="tech-val">SHA-256 hashing</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Glowing Workflow Steps */}
            <section className="workflow-section">
                <h2 className="section-head-center">{t('protocolWorkflow')}</h2>
                <div className="steps-row">
                    <div className="step-box">
                        <span className="step-num">01</span>
                        <h4>{t('sourceOfTruth')}</h4>
                        <p>{t('sourceDesc')}</p>
                    </div>
                    <div className="step-box">
                        <span className="step-num">02</span>
                        <h4>{t('immutableLink')}</h4>
                        <p>{t('immutableDesc')}</p>
                    </div>
                    <div className="step-box">
                        <span className="step-num">03</span>
                        <h4>{t('trustCheck')}</h4>
                        <p>{t('trustDesc')}</p>
                    </div>
                </div>
            </section>

            {/* Why MedProof Matters for India */}
            <section className="info-section" style={{ background: '#f8fafc' }}>
                <h2 className="section-head-center">Why MedProof Matters for India ?</h2>

                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontSize: '1.2rem', color: '#4b5563', lineHeight: '1.8' }}>
                    <p>
                        As the <strong>Pharmacy of the World</strong>, India produces 20% of global generic medicines.
                        However, counterfeit drugs pose a severe threat to public health and economic reputation.
                        <strong>MedProof</strong> ensures every Indian citizen can verify the authenticity of their medicine instantly,
                        strengthening our national health infrastructure and protecting lives.
                    </p>
                </div>
            </section>

            {/* Who Uses MedProof? */}
            <section className="info-section">
                <h2 className="section-head-center">Who Uses MedProof?</h2>
                <div className="four-col-grid">
                    <div className="feature-tile" style={{ textAlign: 'center' }}>
                        <div className="f-icon" style={{ margin: '0 auto 16px', color: '#2563eb' }}>
                            {/* Patient Icon */}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </div>
                        <h3>Patients</h3>
                        <p>Scan before consuming</p>
                    </div>
                    <div className="feature-tile" style={{ textAlign: 'center' }}>
                        <div className="f-icon" style={{ margin: '0 auto 16px', color: '#ef4444' }}>
                            {/* Hospital Icon */}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M17 21v-8.66a2 2 0 0 0-1.66-2H8.66A2 2 0 0 0 7 12.34V21" /><line x1="12" y1="12" x2="12" y2="12.01" /></svg>
                        </div>
                        <h3>Hospitals</h3>
                        <p>Verify stock authenticity</p>
                    </div>
                    <div className="feature-tile" style={{ textAlign: 'center' }}>
                        <div className="f-icon" style={{ margin: '0 auto 16px', color: '#059669' }}>
                            {/* Manufacturer Icon */}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M6 21V11l.08-.01 5.06 1.25a5 5 0 0 0 5.72-3.14L20 8v13" /><path d="M6 10V3.79a2 2 0 0 1 1.09-1.8l7-3.12" /><path d="M9 14v2" /><path d="M9 18v2" /></svg>
                        </div>
                        <h3>Manufacturers</h3>
                        <p>Register batches securely</p>
                    </div>
                    <div className="feature-tile" style={{ textAlign: 'center' }}>
                        <div className="f-icon" style={{ margin: '0 auto 16px', color: '#d97706' }}>
                            {/* Regulator Icon */}
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="8.01" /><line x1="12" y1="11" x2="12" y2="17" /></svg>
                        </div>
                        <h3>Regulators</h3>
                        <p>Audit recalls & safety</p>
                    </div>
                </div>
            </section>

            {/* 5. Neon Features */}
            <section className="info-section" style={{ background: 'transparent' }}>
                <h2 className="section-head-center">{t('impactPillars')}</h2>
                <div className="features-container">
                    <div className="feature-tile">
                        <div className="f-icon" style={{ color: '#4f46e5' }}>
                            {/* Shield Icon */}
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        </div>
                        <h3>{t('nationalSecurity')}</h3>
                        <p style={{ color: '#a0a0a0' }}>{t('natSecDesc')}</p>
                    </div>
                    <div className="feature-tile">
                        <div className="f-icon" style={{ color: '#0891b2' }}>
                            {/* Handshake/Trust Icon */}
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        </div>
                        <h3>{t('economicTrust')}</h3>
                        <p style={{ color: '#a0a0a0' }}>{t('ecoTrustDesc')}</p>
                    </div>
                    <div className="feature-tile">
                        <div className="f-icon" style={{ color: '#16a34a' }}>
                            {/* Wheat/Rural Icon */}
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v19" /><path d="M5 10h14" /><path d="M5 15h14" /></svg>
                        </div>
                        <h3>{t('ruralEmpowerment')}</h3>
                        <p style={{ color: '#a0a0a0' }}>{t('ruralDesc')}</p>
                    </div>
                </div>
            </section>

            {/* Inline Keyframes for Spinner */}
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default LandingPage;
