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
                        <strong>{t('medProofTitle')}</strong> &nbsp;&nbsp; /// &nbsp;&nbsp;
                        <strong>{t('atmanirbhar')}</strong> &nbsp;&nbsp; /// &nbsp;&nbsp;
                        <strong>{t('teamRooted')}</strong>
                    </span>
                </div>
            </div>

            {/* 2. Holographic Hero Section */}
            <section className="hero-section">
                <div className="hero-content-wrapper">
                    {/* Left: Text Content */}
                    <div className="hero-text-block">
                        <span className="hero-tag">THEME ID: TH03 (MEDTECH) | TEAM: ROOTED</span>
                        <h1 className="hero-title">{t('heroTitle')}</h1>
                        <p className="hero-subtitle">
                            {t('heroSubtitle')}
                        </p>

                        <div className="hero-btn-group">
                            <button className="primary-cta" onClick={enterPublicMode} disabled={isConnecting}>
                                {isConnecting ? (
                                    <>
                                        <div className="spinner-border" style={{ width: '20px', height: '20px', border: '3px solid rgba(0,0,0,0.3)', borderTop: '3px solid black', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '10px' }}></div>
                                        <span>{t('initializing')}</span>
                                    </>
                                ) : (
                                    <>{t('publicScanner')}</>
                                )}
                            </button>
                            <button className="secondary-cta" onClick={connectWallet}>
                                {t('manufacturerNode')}
                            </button>
                        </div>
                    </div>

                    {/* Right: 3D Visualization */}
                    <div className="hero-graphic-container">
                        <div className="cyber-ring"></div>
                        <div className="cyber-pill">💊</div>
                    </div>
                </div>
            </section>

            {/* 3. Glassmorphism Info Grid */}
            <section className="info-section">
                <div className="info-cards-container">
                    {/* Problem/Solution */}
                    <div className="glass-card main-info">
                        <h2>{t('problemTitle')}</h2>
                        <p>
                            {t('problemDesc')}
                        </p>
                        <p>
                            <strong style={{ color: '#00f2ea' }}>{t('solutionTitle')}</strong> {t('solutionDesc')}
                        </p>
                    </div>

                    {/* Tech Specs */}
                    <div className="glass-card tech-info">
                        <h2>{t('systemArch')}</h2>
                        <ul className="tech-list">
                            <li><span>{t('network')}</span> <span className="tech-val">Polygon Amoy</span></li>
                            <li><span>{t('storage')}</span> <span className="tech-val">IPFS (Pinata)</span></li>
                            <li><span>{t('contract')}</span> <span className="tech-val">OpenZeppelin v0.8.20</span></li>
                            <li><span>{t('security')}</span> <span className="tech-val">SHA-256 Hash</span></li>
                        </ul>
                        <div style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.6, letterSpacing: '1px' }}>
                            // POWERED_BY_TEAM_ROOTED
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

            {/* 5. Neon Features */}
            <section className="info-section" style={{ background: 'transparent' }}>
                <h2 className="section-head-center">{t('impactPillars')}</h2>
                <div className="features-container">
                    <div className="feature-tile">
                        <div className="f-icon">🛡️</div>
                        <h3>{t('nationalSecurity')}</h3>
                        <p style={{ color: '#a0a0a0' }}>{t('natSecDesc')}</p>
                    </div>
                    <div className="feature-tile">
                        <div className="f-icon">🤝</div>
                        <h3>{t('economicTrust')}</h3>
                        <p style={{ color: '#a0a0a0' }}>{t('ecoTrustDesc')}</p>
                    </div>
                    <div className="feature-tile">
                        <div className="f-icon">🌾</div>
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
