import React from 'react';
import '../Theme.css';

const LandingPage = ({ connectWallet, enterPublicMode }) => {
    return (
        <div className="landing-container">
            <div className="hero-section glass-panel">
                <div className="hero-content">
                    <h1 className="hero-title">MedProof <span style={{ color: 'var(--gov-orange)' }}>Protocol</span></h1>
                    <p className="hero-subtitle">
                        India's Blockchain-Powered <br />
                        <strong>Pharmaceutical Integrity Infrastructure</strong>
                    </p>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <span className="icon">🛡️</span>
                            <h3>Tamper Proof</h3>
                            <p>Secured by Polygon</p>
                        </div>
                        <div className="feature-card">
                            <span className="icon">⚡</span>
                            <h3>Instant Check</h3>
                            <p>QR Code Verification</p>
                        </div>
                        <div className="feature-card">
                            <span className="icon">🇮🇳</span>
                            <h3>Atmanirbhar</h3>
                            <p>Indigenous Tech</p>
                        </div>
                    </div>

                    <div className="cta-group" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button className="glass-btn primary-cta" onClick={enterPublicMode}>
                            🔍 Verify Medicine
                        </button>
                        <button className="glass-btn secondary-cta" onClick={connectWallet} style={{ background: 'transparent', border: '1px solid var(--gov-blue)', color: 'var(--gov-blue)' }}>
                            🔌 Connect Wallet
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .landing-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                    padding: 2rem;
                }
                .hero-section {
                    text-align: center;
                    max-width: 800px;
                    width: 100%;
                }
                .hero-title {
                    font-size: 3.5rem;
                    margin-bottom: 0.5rem;
                    background: linear-gradient(135deg, #002147 0%, #1A5F7A 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .hero-subtitle {
                    font-size: 1.5rem;
                    color: var(--text-secondary);
                    margin-bottom: 2.5rem;
                    line-height: 1.6;
                }
                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }
                .feature-card {
                    background: rgba(255,255,255,0.5);
                    padding: 1.5rem;
                    border-radius: var(--radius-md);
                    border: 1px solid rgba(255,255,255,0.6);
                    transition: transform 0.2s;
                }
                .feature-card:hover {
                    transform: translateY(-5px);
                    background: white;
                }
                .icon {
                    font-size: 2rem;
                    display: block;
                    margin-bottom: 0.5rem;
                }
                .primary-cta {
                    font-size: 1.2rem;
                    padding: 1rem 3rem;
                    width: auto;
                    margin: 0 auto;
                    background: var(--grad-orange);
                    box-shadow: 0 4px 15px rgba(255, 153, 51, 0.4);
                }
                .primary-cta:hover {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
