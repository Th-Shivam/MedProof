import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MedRegistryABI from './contracts/MedRegistry.json'; // Updated ABI

import WalletConnect from './components/WalletConnect';
import ManufacturerDashboard from './components/ManufacturerDashboard';
import PatientVerify from './components/PatientVerify';
import './App.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [network, setNetwork] = useState(null);
    const [view, setView] = useState('consumer'); // 'consumer' or 'manufacturer'
    const [initialBatchId, setInitialBatchId] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await newProvider.send("eth_requestAccounts", []);
                const newSigner = newProvider.getSigner();
                const networkInfo = await newProvider.getNetwork();

                if (networkInfo.chainId === 80002) {
                    networkInfo.name = "Amoy";
                }

                setProvider(newProvider);
                setSigner(newSigner);
                setAccount(accounts[0]);
                setNetwork(networkInfo);

                const medRegistryContract = new ethers.Contract(CONTRACT_ADDRESS, MedRegistryABI.abi, newSigner);
                setContract(medRegistryContract);

            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("MetaMask is not installed.");
        }
    };

    useEffect(() => {
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
                setView('consumer');
            }
        }
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <div className="logo-area">
                    <h1>🏥 MedProof</h1>
                    <span className="subtitle">Pharmacy Trust Infrastructure</span>
                </div>
                <div className="header-controls">
                    <button onClick={() => setView('consumer')} className={view === 'consumer' ? 'active' : ''}>For Patients</button>
                    <button onClick={() => setView('manufacturer')} className={view === 'manufacturer' ? 'active' : ''}>For Manufacturers</button>
                    <WalletConnect account={account} network={network} connectWallet={connectWallet} />
                </div>
            </header>
            <main>
                {!account ? (
                    <div className="connect-prompt">
                        <h2>Welcome to MedProof</h2>
                        <p>Please connect your wallet to access the trust network.</p>
                        <button className="big-connect-btn" onClick={connectWallet}>Connect Wallet</button>
                    </div>
                ) : (
                    <div className="content-area">
                        {view === 'manufacturer' && <ManufacturerDashboard contract={contract} account={account} />}
                        {view === 'consumer' && <PatientVerify contract={contract} initialBatchId={initialBatchId} />}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
