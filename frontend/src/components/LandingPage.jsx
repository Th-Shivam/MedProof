import React from 'react';
import Spline from '@splinetool/react-spline';
import './LandingPage.css';

const LandingPage = ({ connectWallet }) => {
    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="spline-wrapper">
                    <Spline
                        scene="https://prod.spline.design/ikx3p5jrCZoCMbnN/scene.splinecode"
                    />
                </div>
                <div className="content-wrapper">
                    <h1 className="title">MEDPROOF</h1>
                    <p className="subtitle">DeCentralized Medicine Proof</p>
                    <div className="cta-container">
                        <button className="connect-wallet-btn" onClick={connectWallet}>
                            Connect Wallet to Enter
                        </button>
                    </div>
                </div>
                <div className="scroll-indicator">
                    <span>Explore Platform</span>
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="about-section">
                <div className="section-content">
                    <div className="about-text">
                        <h2 className="section-title">Why MedProof?</h2>
                        <p className="section-description">
                            In an era of counterfeit pharmaceuticals, <strong>MedProof</strong> stands as the ultimate guardian of authenticity.
                            Built on the blockchain, we provide an immutable, transparent, and decentralized verification system
                            that connects manufacturers directly to patients.
                        </p>
                        <p className="section-description">
                            No middlemen. No tampering. Just pure trust verified by cryptography.
                        </p>
                    </div>
                    <div className="about-stats">
                        <div className="stat-card glass-panel">
                            <h3>100%</h3>
                            <p>Tamper Proof</p>
                        </div>
                        <div className="stat-card glass-panel">
                            <h3>0.0s</h3>
                            <p>Verification Time</p>
                        </div>
                        <div className="stat-card glass-panel">
                            <h3>24/7</h3>
                            <p>Global Access</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title center">The Future of Medical Safety</h2>
                <div className="features-grid">
                    <div className="feature-card glass-panel">
                        <div className="icon">🛡️</div>
                        <h3>Immutable Records</h3>
                        <p>Every medicine batch is recorded on the blockchain, creating a permanent history that cannot be altered.</p>
                    </div>
                    <div className="feature-card glass-panel">
                        <div className="icon">🔍</div>
                        <h3>Instant Verification</h3>
                        <p>Patients can instantly scan and verify the authenticity of their medicine using our decentralized app.</p>
                    </div>
                    <div className="feature-card glass-panel">
                        <div className="icon">🏭</div>
                        <h3>Manufacturer Direct</h3>
                        <p>Direct linkage between pharmaceutical giants and the end consumer, eliminating counterfeit supply chains.</p>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="landing-footer">
                <p>&copy; 2024 MedProof. Decentralized Healthcare Security.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
