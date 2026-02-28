import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MedRegistryABI from './contracts/MedRegistry.json'; // Updated ABI

import WalletConnect from './components/common/WalletConnect';
import ManufacturerDashboard from './components/dashboard/ManufacturerDashboard';
import PatientVerify from './components/verify/PatientVerify';
import LandingPage from './components/landing/LandingPage';
import Support from './components/common/Support';
import Footer from './components/common/Footer';
import './assets/css/App.css';

import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { LanguageProvider, LanguageContext } from './context/LanguageContext';

const CONTRACT_ADDRESS = "0x8a0f815a279eD8e74406b021d8e2e6cb02937767"; // Deployed to Amoy

function AppContent() {
    // ... (state lines 14-20) ...
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [network, setNetwork] = useState(null);
    const [view, setView] = useState('consumer'); // 'consumer' or 'manufacturer'
    const [initialBatchId, setInitialBatchId] = useState(null);
    const [isPublic, setIsPublic] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const { increaseFontSize, decreaseFontSize, resetFontSize } = React.useContext(ThemeContext);
    const { language, toggleLanguage, t } = React.useContext(LanguageContext);

    // Public RPC for Read-Only Access (Amoy Testnet)
    const PUBLIC_RPC = "https://rpc-amoy.polygon.technology/";

    const enterPublicMode = async () => {
        setIsConnecting(true);
        try {
            const publicProvider = new ethers.providers.JsonRpcProvider(PUBLIC_RPC);
            const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, MedRegistryABI.abi, publicProvider);

            // Simulate a small delay for UX so users see the spinner
            await new Promise(resolve => setTimeout(resolve, 800));

            setProvider(publicProvider);
            setContract(readOnlyContract);
            setIsPublic(true);
            setView('consumer');
        } catch (error) {
            console.error("Error entering public mode:", error);
            alert("Could not connect to public network. Please try again later.");
        } finally {
            setIsConnecting(false);
        }
    };

    // ... (connectWallet lines 22-85) ...
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await newProvider.send("eth_requestAccounts", []);
                const newSigner = newProvider.getSigner();
                let networkInfo = await newProvider.getNetwork();

                if (networkInfo.chainId !== 80002) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x13882' }], // 80002
                        });
                    } catch (switchError) {
                        // This error code indicates that the chain has not been added to MetaMask.
                        if (switchError.code === 4902) {
                            try {
                                await window.ethereum.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [
                                        {
                                            chainId: '0x13882',
                                            chainName: 'Polygon Amoy Testnet',
                                            nativeCurrency: {
                                                name: 'MATIC',
                                                symbol: 'MATIC',
                                                decimals: 18,
                                            },
                                            rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                                            blockExplorerUrls: ['https://amoy.polygonscan.com/'],
                                        },
                                    ],
                                });
                            } catch (addError) {
                                console.error("Error adding Amoy network:", addError);
                            }
                        } else {
                            console.error("Error switching to Amoy network:", switchError);
                        }
                    }
                    // Refresh network info after switch
                    networkInfo = await newProvider.getNetwork();
                }

                if (networkInfo.chainId === 80002) {
                    networkInfo.name = "Amoy";
                }

                setProvider(newProvider);
                setAccount(accounts[0]);
                setNetwork(networkInfo);

                const medRegistryContract = new ethers.Contract(CONTRACT_ADDRESS, MedRegistryABI.abi, newSigner);
                setContract(medRegistryContract);
                setIsPublic(false); // Disable public mode if wallet connects

            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("MetaMask is not installed.");
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setContract(null);
        setNetwork(null);
        setIsPublic(false); // Ensure public mode is off on disconnect
        // Optional: clear local storage if you were persisting logic
    };

    useEffect(() => {
        // Auto-connect wallet if previously connected
        if (window.ethereum && window.ethereum.selectedAddress) {
            connectWallet();
        }

        // URL parsing for /verify/BATCH-ID
        const path = window.location.pathname;
        if (path.includes('/verify/')) {
            const parts = path.split('/verify/');
            if (parts.length > 1) {
                const idFromUrl = parts[1];
                setInitialBatchId(idFromUrl);

                // If checking a URL, enter public mode immediately if no wallet
                if (!account) {
                    enterPublicMode();
                }
            }
        }
    }, [account]);

    // Function 1: Check Network Status
    const checkNetworkStatus = async (e) => {
        e.preventDefault();
        if (!provider) {
            alert("⚠️ Network Status: Disconnected.\n\nPlease connect your wallet or enter Public Mode to check the Polygon Amoy connection.");
            return;
        }
        try {
            const network = await provider.getNetwork();
            const blockNumber = await provider.getBlockNumber();
            alert(`✅ Network Status: HEALTHY\n\n🔗 Connected to: ${network.name} (Chain ID: ${network.chainId})\n📦 Current Block Height: ${blockNumber}\n⚡ Latency: Low`);
        } catch (e) {
            alert("❌ Network Status: ERROR\n\nCould not reach Polygon Amoy RPC.");
        }
    };

    // Function 2: Support Popup
    // Function 2: Support Page Navigation
    const handleSupport = (e) => {
        e.preventDefault();
        setView('support');
    };

    // Function 3: Go Back to Landing Page
    const goBackToHome = (e) => {
        if (e) e.preventDefault();
        disconnectWallet(); // This resets state and shows Landing Page
    };

    // Function 4: Accessibility Handlers
    const handleScreenReader = (e) => {
        e.preventDefault();
        alert(t('screenReaderAlert') || "🔊 Screen Reader Access Enabled.\n\nThis application is optimized for screen readers (NVDA, JAWS).\n- Use Tab to navigate.\n- Semantic HTML tags are used throughout.");
    };

    return (
        <div className="App">
            {!account && !isPublic ? (
                <LandingPage connectWallet={connectWallet} enterPublicMode={enterPublicMode} isConnecting={isConnecting} />
            ) : (
                <>
                    {/* Accessibility & Settings Top Strip */}
                    <div className="gov-top-strip">
                        <div className="gov-container header-strip-inner">
                            <div className="gov-links">
                                <a href="#main-content">{t('skipToMain')}</a>
                                <span className="separator">|</span>
                                <button onClick={handleScreenReader} style={{ background: 'none', border: 'none', padding: 0, margin: 0, color: 'inherit', cursor: 'pointer' }}>{t('screenReader')}</button>
                            </div>
                            <div className="gov-settings">
                                <span className="font-resize">
                                    <button onClick={decreaseFontSize}>A-</button>
                                    <button onClick={resetFontSize}>A</button>
                                    <button onClick={increaseFontSize}>A+</button>
                                </span>
                                <span className="separator">|</span>
                                <div className="lang-switch">
                                    <span
                                        onClick={() => toggleLanguage()}
                                        style={{ cursor: 'pointer', fontWeight: language === 'en' ? 'bold' : 'normal' }}
                                    >
                                        English
                                    </span>
                                    /
                                    <span
                                        onClick={() => toggleLanguage()}
                                        style={{ cursor: 'pointer', fontWeight: language === 'hi' ? 'bold' : 'normal' }}
                                    >
                                        हिन्दी
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Main Government Standard Header */}
                    <header className="nic-header">
                        <div className="gov-container header-inner-nic">
                            <div className="logo-section">
                                <div className="emblem-placeholder">
                                    {/* Placeholder for State Emblem - Using Emoji or simple Circle usually */}
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
                                        🏛️
                                    </div>
                                </div>
                                <div className="ministry-text">
                                    <span className="gov-label" style={{ fontSize: '1.2rem', whiteSpace: 'nowrap' }}>{t('medProofTitle')}</span>
                                    <span className="ministry-label">{t('atmanirbhar')}</span>
                                </div>
                            </div>

                            <div className="azadi-logo">
                                <div className="tech-logos">
                                    <span>{t('securedBy')}<br /><strong>Polygon PoS</strong></span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Standard Navbar */}
                    <nav className="nic-navbar">
                        <div className="gov-container">
                            <button className="hamburger-menu" onClick={toggleMenu}>
                                {isMenuOpen ? '✕' : '☰'}
                            </button>
                            <ul className={isMenuOpen ? 'nav-links open' : 'nav-links'}>
                                <li><button onClick={() => { setView('consumer'); closeMenu(); }} className={`nav-btn ${view === 'consumer' ? 'active' : ''}`}>{t('batchVerification')}</button></li>
                                {!isPublic && (
                                    <li><button onClick={() => { setView('manufacturer'); closeMenu(); }} className={`nav-btn ${view === 'manufacturer' ? 'active' : ''}`}>{t('manufacturerChain')}</button></li>
                                )}
                                <li><button onClick={(e) => { checkNetworkStatus(e); closeMenu(); }} className="nav-btn">{t('networkStatus')}</button></li>
                                <li><button onClick={(e) => { handleSupport(e); closeMenu(); }} className="nav-btn">{t('support')}</button></li>
                                <li className="right-align-btn">
                                    <div onClick={closeMenu}>
                                        <WalletConnect account={account} network={network} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <main id="main-content">
                        <div className="content-area">
                            {/* Breadcrumb / Back Button for easy navigation */}
                            <div className="gov-container" style={{ padding: '10px 0' }}>
                                <button
                                    onClick={goBackToHome}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--gov-blue)',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    ← {t('backToHome') || "Back to Home"}
                                </button>
                            </div>

                            {view === 'manufacturer' && <ManufacturerDashboard contract={contract} account={account} />}
                            {view === 'consumer' && <PatientVerify contract={contract} initialBatchId={initialBatchId} />}
                            {view === 'support' && <Support onBack={() => setView('consumer')} />}
                        </div>
                    </main>
                </>
            )}
            <Footer />
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;
