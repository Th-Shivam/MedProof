import React from 'react';

const WalletConnect = ({ account, network, connectWallet }) => {
    const getNetworkName = (chainId) => {
        switch (chainId) {
            case 1: return "Ethereum Mainnet";
            case 137: return "Polygon Mainnet";
            case 80001: return "Mumbai Testnet";
            case 80002: return "Polygon Amoy Testnet Connected";
            case 31337: return "Hardhat Local";
            default: return `Unknown (ChainID: ${chainId})`;
        }
    };

    return (
        <div className="wallet-connector">
            {account ? (
                <div className="wallet-info">
                    <span className="network-name">{network ? getNetworkName(network.chainId) : '...'}</span>
                    <span className="account-address">
                        {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                    </span>
                </div>
            ) : (
                <button onClick={connectWallet} className="connect-button">
                    Connect Wallet
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
