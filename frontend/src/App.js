import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MedRegistryABI from './contracts/MedRegistry.json'; // Updated ABI

import WalletConnect from './components/WalletConnect';
import ManufacturerDashboard from './components/ManufacturerDashboard';
import PatientVerify from './components/PatientVerify';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import './App.css';

const CONTRACT_ADDRESS = "0x8a0f815a279eD8e74406b021d8e2e6cb02937767"; // Deployed to Amoy

function App() {
    // ... (state lines 14-20) ...
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [network, setNetwork] = useState(null);
    const [view, setView] = useState('consumer'); // 'consumer' or 'manufacturer'
    const [initialBatchId, setInitialBatchId] = useState(null);
    const [isPublic, setIsPublic] = useState(false);

    // Public RPC for Read-Only Access (Amoy Testnet)
    const PUBLIC_RPC = "https://rpc-amoy.polygon.technology/";

    const enterPublicMode = async () => {
        try {
            const publicProvider = new ethers.providers.JsonRpcProvider(PUBLIC_RPC);
            const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, MedRegistryABI.abi, publicProvider);

            setProvider(publicProvider);
            setContract(readOnlyContract);
            setIsPublic(true);
            setView('consumer');
        } catch (error) {
            console.error("Error entering public mode:", error);
            alert("Could not connect to public network. Please try again later.");
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
                setSigner(newSigner);
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
        setSigner(null);
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

    return (
        <div className="App">
            {!account && !isPublic ? (
                <LandingPage connectWallet={connectWallet} enterPublicMode={enterPublicMode} />
            ) : (
                <>
                    {/* Accessibility & Settings Top Strip */}
                    <div className="gov-top-strip">
                        <div className="gov-container header-strip-inner">
                            <div className="gov-links">
                                <a href="#main">Skip to Main Content</a>
                                <span className="separator">|</span>
                                <a href="#screen-reader">Screen Reader Access</a>
                            </div>
                            <div className="gov-settings">
                                <span className="font-resize">
                                    <button>A-</button>
                                    <button>A</button>
                                    <button>A+</button>
                                </span>
                                <span className="separator">|</span>
                                <div className="lang-switch">
                                    <span>English</span> / <span>हिन्दी</span>
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
                                    <span className="gov-label">MedProof Protocol</span>
                                    <span className="ministry-label">Decentralized Authenticity Infrastructure</span>
                                </div>
                            </div>

                            <div className="azadi-logo">
                                <div className="tech-logos">
                                    <span>Secured by<br /><strong>Polygon PoS</strong></span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Standard Navbar */}
                    <nav className="nic-navbar">
                        <div className="gov-container">
                            <ul>
                                <li><a href="#" onClick={() => setView('consumer')} className={view === 'consumer' ? 'active' : ''}>Batch Verification</a></li>
                                <li><a href="#" onClick={() => setView('manufacturer')} className={view === 'manufacturer' ? 'active' : ''}>Manufacturer & Supply Chain</a></li>
                                <li><a href="#">Network Status</a></li>
                                <li><a href="#">Support</a></li>
                                <li className="right-align-btn">
                                    <WalletConnect account={account} network={network} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <main>
                        <div className="content-area">
                            {view === 'manufacturer' && <ManufacturerDashboard contract={contract} account={account} />}
                            {view === 'consumer' && <PatientVerify contract={contract} initialBatchId={initialBatchId} />}
                        </div>
                    </main>
                </>
            )}
            <Footer />
        </div>
    );
}

export default App;
