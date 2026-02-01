import React from 'react';
import Spline from '@splinetool/react-spline';
import './LandingPage.css';

const LandingPage = ({ connectWallet }) => {
    return (
        <div className="landing-container">
            {/* Updates Marquee - Very common in Gov sites */}
            <div className="updates-marquee">
                <div className="marquee-content">
                    <span>📢 <strong>LATEST UPDATES:</strong> MedProof platform is now live for beta testing across 5 states. &nbsp;&nbsp; | &nbsp;&nbsp; 🏥 New Manufacturer Registration Guidelines released. &nbsp;&nbsp; | &nbsp;&nbsp; 🛡️ 100% Blockchain Uptime achieved this month.</span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="content-wrapper">
                    <h1 className="title">Bharatiya Aushadhi Pramaad</h1>
                    <p className="subtitle">Secure. Transparent. Trusted.</p>
                    <p style={{ marginBottom: '30px', color: '#555', fontSize: '1.2rem' }}>
                        The Official Blockchain Verification Portal by the Ministry of Health & Family Welfare
                    </p>
                    <div className="cta-container">
                        <button className="connect-wallet-btn" onClick={connectWallet}>
                            Login / Access Portal
                        </button>
                    </div>
                </div>
            </section>

            {/* Information Grid */}
            <section className="info-grid-section">
                <div className="gov-container">
                    <div className="row info-row">
                        {/* What is MedProof */}
                        <div className="col-md-8 info-card">
                            <h2 className="section-title">About the Initiative</h2>
                            <div className="info-content">
                                <p className="section-text">
                                    <strong>MedProof (Medical Proof)</strong> is a flagship initiative under the <em>Digital India Mission</em> to combat counterfeit medicines.
                                    Utilizing the immutable nature of Blockchain technology (Polygon Network), we authenticate every step of the pharmaceutical supply chain.
                                </p>
                                <p className="section-text">
                                    From the manufacturing plant to your local pharmacy, every movement is recorded. This ensures that the medicine you consume is
                                    <strong>100% Authentic</strong> and safe. We aim to zero out fake drugs from the Indian market by 2026.
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats/Notice Board style */}
                        <div className="col-md-4 notice-board-wrapper">
                            <div className="notice-board">
                                <h3>📊 National Dashboard</h3>
                                <ul>
                                    <li><strong>Registered Manufacturers:</strong> <span className="stat-val">1,240+</span></li>
                                    <li><strong>Batches Verified:</strong> <span className="stat-val">8.5 M+</span></li>
                                    <li><strong>Active Patients:</strong> <span className="stat-val">120,000+</span></li>
                                    <li><strong>States Covered:</strong> <span className="stat-val">28</span></li>
                                </ul>
                                <div className="helpline">
                                    <p><strong>Toll Free Helpline:</strong><br />1800-11-XXXX</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works - Step by Step */}
            <section className="how-it-works-section">
                <div className="gov-container">
                    <h2 className="section-title center">How to Use the Portal</h2>
                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h4>Connect Wallet</h4>
                            <p>Click on 'Login' and connect your Digital Identity (Web3 Wallet) to access the secure portal.</p>
                        </div>
                        <div className="step-arrow">➜</div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h4>Select Role</h4>
                            <p>Choose <strong>'Verify Medicine'</strong> for citizens or <strong>'Manufacturer Login'</strong> for pharma companies.</p>
                        </div>
                        <div className="step-arrow">➜</div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h4>Verify/Register</h4>
                            <p>Manufacturers upload batch data. Citizens enter Batch ID to get instant proof of authenticity.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Services/Features */}
            <section className="features-section">
                <h2 className="section-title center" style={{ width: '100%', textAlign: 'center' }}>Digital Services</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon">📜</div>
                        <h3>Digital Ledger</h3>
                        <p>Publicly verifiable immutable ledger of all pharmaceutical batches for transparency.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">✅</div>
                        <h3>Instant Verification</h3>
                        <p>Get instant "Valid" or "Expired" status with production & expiry details from the blockchain.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">🏭</div>
                        <h3>Manufacturer Direct</h3>
                        <p>Direct linkage between pharmaceutical giants and the end consumer to stop counterfeiting.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="gov-container">
                    <div className="footer-links">
                        <div className="link-group">
                            <h5>Quick Links</h5>
                            <a href="#">Home</a>
                            <a href="#">About Us</a>
                            <a href="#">Contact</a>
                            <a href="#">Help</a>
                        </div>
                        <div className="link-group">
                            <h5>Legal</h5>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms & Conditions</a>
                            <a href="#">Disclaimer</a>
                        </div>
                        <div className="link-group">
                            <h5>Related Sites</h5>
                            <a href="#">Ministry of Health</a>
                            <a href="#">Digital India</a>
                            <a href="#">MyGov.in</a>
                        </div>
                    </div>
                    <div className="copyright">
                        <p>&copy; 2024 MedProof Portal. Designed & Developed by MedProof Team.</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Content owned by Ministry of Health & Family Welfare, Govt. of India.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
