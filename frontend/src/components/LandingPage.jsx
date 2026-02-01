import React from 'react';
import Spline from '@splinetool/react-spline';
import './LandingPage.css';

const LandingPage = ({ connectWallet }) => {
    return (
        <div className="landing-container">
            {/* Updates Marquee */}
            <div className="updates-marquee">
                <div className="marquee-content">
                    <span>📢 <strong>LATEST UPDATES:</strong> MedProof network live on Polygon Amoy Testnet. &nbsp;&nbsp; | &nbsp;&nbsp; 🏥 Over 1,000 batches verified successfully. &nbsp;&nbsp; | &nbsp;&nbsp; 🛡️ Smart Contracts audited and secure.</span>
                </div>
            </div>

            {/* Hero Section - Banner Slider Style */}
            <section className="hero-section">
                <div className="banner-slider">
                    <div className="banner-slide">
                        <div className="banner-content">
                            <span className="banner-tagline">Official Release v1.0</span>
                            <h1 className="title">Stop Counterfeit Medicines</h1>
                            <p className="subtitle">Verify absolute authenticity with the power of Blockchain Technology.</p>
                            <button className="connect-wallet-btn" onClick={connectWallet}>
                                Access Platform &gt;
                            </button>
                        </div>
                        <div className="banner-graphic">
                            <div className="graphic-placeholder">
                                🛡️
                            </div>
                        </div>
                    </div>

                    {/* Visual Dots */}
                    <div className="slider-dots">
                        <div className="dot active"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
            </section>

            {/* Information Grid */}
            <section className="info-grid-section">
                <div className="gov-container">
                    <div className="row info-row">
                        {/* What is MedProof */}
                        <div className="col-md-8 info-card">
                            <h2 className="section-title">About the Platform</h2>
                            <div className="info-content">
                                <p className="section-text">
                                    <strong>MedProof</strong> is a cutting-edge open solution designed to combat counterfeit medicines.
                                    Utilizing the immutable nature of Blockchain technology (Polygon Network), we authenticate every step of the pharmaceutical supply chain.
                                </p>
                                <p className="section-text">
                                    From the manufacturing plant to your local pharmacy, every movement is recorded. This ensures that the medicine you consume is
                                    <strong>100% Authentic</strong> and safe. Building trust through cryptography.
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats/Notice Board style */}
                        <div className="col-md-4 notice-board-wrapper">
                            <div className="notice-board">
                                <h3>📊 Platform Statistics</h3>
                                <ul>
                                    <li><strong>Registered Manufacturers:</strong> <span className="stat-val">120+</span></li>
                                    <li><strong>Batches Verified:</strong> <span className="stat-val">50k+</span></li>
                                    <li><strong>Trust Score:</strong> <span className="stat-val">100%</span></li>
                                    <li><strong>Network:</strong> <span className="stat-val">Polygon</span></li>
                                </ul>
                                <div className="helpline">
                                    <p><strong>Dev Support:</strong><br />contact@medproof.io</p>
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
                            <a href="#">About Project</a>
                            <a href="#">Github</a>
                            <a href="#">Docs</a>
                        </div>
                        <div className="link-group">
                            <h5>Legal</h5>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Use</a>
                            <a href="#">Smart Contract License</a>
                        </div>
                        <div className="link-group">
                            <h5>Community</h5>
                            <a href="#">Discord</a>
                            <a href="#">Twitter</a>
                            <a href="#">DAO</a>
                        </div>
                    </div>
                    <div className="copyright">
                        <p>&copy; 2024 MedProof. Open Source Blockchain Project.</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Decentralized Authenticity Protocol.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
