import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MedRegistryABI from './contracts/MedRegistry.json'; // Updated ABI

import WalletConnect from './components/WalletConnect';
import ManufacturerDashboard from './components/ManufacturerDashboard';
import PatientVerify from './components/PatientVerify';
import LandingPage from './components/LandingPage';
import './App.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [network, setNetwork] = useState(null);
    const [view, setView] = useState('consumer'); // 'consumer' or 'manufacturer'

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
        // Optional: clear local storage if you were persisting logic
    };

    useEffect(() => {
        if (window.ethereum && window.ethereum.selectedAddress) {
            connectWallet();
        }

        // Simple URL routing for /verify/BATCH-ID
        const path = window.location.pathname;
        if (path.includes('/verify')) {
            setView('consumer');
        }
    }, []);

    return (
        <div className="App">
            {!account ? (
                <LandingPage connectWallet={connectWallet} />
            ) : (
                <>
                    <header className="App-header">
                        <div className="logo-area">
                            <h1>🏥 MedProof</h1>
                            <span className="subtitle">Pharmacy Trust Infrastructure</span>
                        </div>
                        <div className="header-controls">
                            <button onClick={() => setView('consumer')} className={view === 'consumer' ? 'active' : ''}>For Patients</button>
                            <button onClick={() => setView('manufacturer')} className={view === 'manufacturer' ? 'active' : ''}>For Manufacturers</button>
                            <WalletConnect account={account} network={network} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />
                        </div>
                    </header>
                    <main>
                        <div className="content-area">
                            {view === 'manufacturer' && <ManufacturerDashboard contract={contract} account={account} />}
                            {view === 'consumer' && <PatientVerify contract={contract} />}
                        </div>
                    </main>
                </>
            )}
        </div>
    );
}

export default App;
