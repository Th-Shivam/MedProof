import React from 'react';
import './LandingPage.css';

const LandingPage = ({ connectWallet, enterPublicMode, isConnecting }) => {
    return (
        <div className="landing-container">
            {/* 1. Cyber Marquee */}
            <div className="updates-marquee">
                <div className="marquee-content">
                    <span>
                        <strong>MedProof:</strong> Blockchain-Based Medicine Authenticity & Expiry Verification. &nbsp;&nbsp; /// &nbsp;&nbsp;
                        <strong>Atmanirbhar Bharat:</strong> Building India's Trust Infrastructure. &nbsp;&nbsp; /// &nbsp;&nbsp;
                        <strong>Team Rooted:</strong> Theme-3 (MedTech) Solution.
                    </span>
                </div>
            </div>

            {/* 2. Holographic Hero Section */}
            <section className="hero-section">
                <div className="hero-content-wrapper">
                    {/* Left: Text Content */}
                    <div className="hero-text-block">
                        <span className="hero-tag">THEME ID: TH03 (MEDTECH) | TEAM: ROOTED</span>
                        <h1 className="hero-title">Ideas Powering Atmanirbhar Bharat</h1>
                        <p className="hero-subtitle">
                            A Decentralized Authenticity Protocol. Bridging the physical medicine box to an immutable digital record to protect the "Pharmacy of the World".
                        </p>

                        <div className="hero-btn-group">
                            <button className="primary-cta" onClick={enterPublicMode} disabled={isConnecting}>
                                {isConnecting ? (
                                    <>
                                        <div className="spinner-border" style={{ width: '20px', height: '20px', border: '3px solid rgba(0,0,0,0.3)', borderTop: '3px solid black', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '10px' }}></div>
                                        <span>INITIALIZING...</span>
                                    </>
                                ) : (
                                    <>🔍 Public Scanner</>
                                )}
                            </button>
                            <button className="secondary-cta" onClick={connectWallet}>
                                Manufacturer Node
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
                        <h2>The Problem: "Pharmacy of the World" at Risk</h2>
                        <p>
                            India is the global leader in generics, yet our reputation is threatened by a flood of counterfeit and expired medicines.
                            Rural patients often cannot distinguish between a fake strip of antibiotics and a real one.
                        </p>
                        <p>
                            <strong style={{ color: '#00f2ea' }}>The Solution:</strong> MedProof acts as a "Digital Notary", ensuring that if the blockchain says "Expired", the medicine is unsafe—regardless of the printed label.
                        </p>
                    </div>

                    {/* Tech Specs */}
                    <div className="glass-card tech-info">
                        <h2>⚙️ System Architecture</h2>
                        <ul className="tech-list">
                            <li><span>Network</span> <span className="tech-val">Polygon Amoy</span></li>
                            <li><span>Storage</span> <span className="tech-val">IPFS (Pinata)</span></li>
                            <li><span>Contract</span> <span className="tech-val">OpenZeppelin v0.8.20</span></li>
                            <li><span>Security</span> <span className="tech-val">SHA-256 Hash</span></li>
                        </ul>
                        <div style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.6, letterSpacing: '1px' }}>
                            // POWERED_BY_TEAM_ROOTED
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Glowing Workflow Steps */}
            <section className="workflow-section">
                <h2 className="section-head-center">Protocol Workflow</h2>
                <div className="steps-row">
                    <div className="step-box">
                        <span className="step-num">01</span>
                        <h4>Source of Truth</h4>
                        <p>Manufacturers (e.g. Cipla, Sun Pharma) input Batch ID & CoA. A 'Batch Hash' is minted to the Registry.</p>
                    </div>
                    <div className="step-box">
                        <span className="step-num">02</span>
                        <h4>Immutable Link</h4>
                        <p>Metadata includes "Intended Distributor" and IPFS Hash, creating a digital link fraudsters cannot guess.</p>
                    </div>
                    <div className="step-box">
                        <span className="step-num">03</span>
                        <h4>The "Trust Check"</h4>
                        <p>Patients scan the QR code. The Smart Contract instantly validates Expiry, Recalls, and Authenticity.</p>
                    </div>
                </div>
            </section>

            {/* 5. Neon Features */}
            <section className="info-section" style={{ background: 'transparent' }}>
                <h2 className="section-head-center">Project Impact Pillars</h2>
                <div className="features-container">
                    <div className="feature-tile">
                        <div className="f-icon">🛡️</div>
                        <h3>National Security</h3>
                        <p style={{ color: '#a0a0a0' }}>Reduces dependency on foreign centralized servers. Protects India's ₹3 Lakh Crore Pharma Industry from reputation damage.</p>
                    </div>
                    <div className="feature-tile">
                        <div className="f-icon">🤝</div>
                        <h3>Economic Trust</h3>
                        <p style={{ color: '#a0a0a0' }}>Restores faith in the "Made in India" label by eliminating the possibility of undetected counterfeits entering the supply chain.</p>
                    </div>
                    <div className="feature-tile">
                        <div className="f-icon">🌾</div>
                        <h3>Rural Empowerment</h3>
                        <p style={{ color: '#a0a0a0' }}>Democratizes health safety. Allows anyone with a basic smartphone to verify medicine quality instantly, democratizing health safety.</p>
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
