import React from 'react';
import '../Theme.css';

const Footer = () => {
    return (
        <footer className="gov-footer">
            <div className="footer-content">
                <div className="footer-columns">
                    <div className="footer-col">
                        <h4>MedProof Protocol</h4>
                        <p>Decentralized Drug Authenticity Infrastructure</p>
                        <p className="powered-by">Powered by <strong>Polygon PoS</strong></p>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#">Verify Medicine</a></li>
                            <li><a href="#">Manufacturer Registry</a></li>
                            <li><a href="#">API Documentation</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Policies</h4>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Use</a></li>
                            <li><a href="#">Disclaimer</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Contact</h4>
                        <p>Ministry of Health & Family Welfare</p>
                        <p>Nirman Bhawan, New Delhi</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} MedProof. All Rights Reserved.</p>
                    <p>Designed for TH05 Blockchain Hackathon.</p>
                </div>
            </div>

            <style jsx>{`
                .gov-footer {
                    background: #1a1a1a;
                    color: white;
                    padding: 3rem 0 1rem;
                    margin-top: auto;
                    border-top: 4px solid var(--gov-orange);
                }
                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }
                .footer-columns {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                    margin-bottom: 2rem;
                }
                .footer-col h4 {
                    color: white;
                    border-bottom: 1px solid #444;
                    padding-bottom: 0.5rem;
                    margin-bottom: 1rem;
                }
                .footer-col ul {
                    list-style: none;
                    padding: 0;
                }
                .footer-col li {
                    margin-bottom: 0.5rem;
                }
                .footer-col a {
                    color: #aaa;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-col a:hover {
                    color: var(--gov-orange);
                }
                .footer-bottom {
                    text-align: center;
                    border-top: 1px solid #333;
                    padding-top: 1rem;
                    color: #666;
                    font-size: 0.85rem;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
