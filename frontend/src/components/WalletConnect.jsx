import React, { useState } from 'react';
import '../Theme.css';

const WalletConnect = ({ account, network, connectWallet, disconnectWallet }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getNetworkName = (chainId) => {
        switch (chainId) {
            case 80002: return "Polygon Amoy";
            case 137: return "Polygon Mainnet";
            case 1: return "Ethereum";
            default: return "Unknown Network";
        }
    };

    const isAmoy = network?.chainId === 80002;

    return (
        <div className="wallet-wrapper">
            {account ? (
                <div
                    className="glass-panel wallet-card"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="wallet-status">
                        <span className={`status-dot ${isAmoy ? 'online' : 'error'}`}></span>
                        <span className="network-label">{network ? getNetworkName(network.chainId) : '...'}</span>
                    </div>

                    {isHovered ? (
                        <button className="disconnect-btn" onClick={disconnectWallet}>
                            Disconnect
                        </button>
                    ) : (
                        <span className="account-address">
                            {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                        </span>
                    )}
                </div>
            ) : (
                <button onClick={connectWallet} className="glass-btn connect-btn">
                    Connect Wallet
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
