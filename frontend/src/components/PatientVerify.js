import React, { useState, useEffect } from 'react';
import '../Theme.css';

const PatientVerify = ({ contract }) => {
    const [batchId, setBatchId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const verifyBatch = async () => {
        if (!contract || !batchId) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Returns: [isValid, isExpired, medicineName, manufacturerName, ipfsHash]
            const data = await contract.verifyBatch(batchId);

            const [isValid, isExpired, medicineName, manufacturerName, ipfsHash] = data;

            if (!isValid) {
                setError("❌ ALERT: Batch ID not found in Registry. This might be a COUNTERFEIT product.");
            } else {
                // Fetch full details to get the exact expiry date
                const batchDetails = await contract.getBatch(batchId);
                // Convert BigNumber to Date
                const expiryDateObj = new Date(batchDetails.expiryDate.toNumber() * 1000);
                const formattedDate = expiryDateObj.toLocaleDateString('en-GB'); // DD-MM-YYYY format

                setResult({
                    isValid,
                    isExpired,
                    medicineName,
                    manufacturerName,
                    ipfsHash,
                    formattedDate,
                    batchId // Pass the ID for display
                });
            }

        } catch (err) {
            console.error(err);
            setError("Error connecting to blockchain.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify-container">
            <div className="glass-panel verify-card">
                <h2>🕵️‍♀️ Consumer Verification</h2>
                <p>Scan the QR code or enter the Batch ID manually to verify authenticity.</p>
    
                <div className="search-section">
                    <div className="glass-input-wrapper">
                        <input
                            className="glass-input"
                            type="text"
                            placeholder="Enter Batch ID (e.g. BATCH-001)"
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
                        />
                    </div>
                    <button className="glass-btn verify-btn" onClick={verifyBatch} disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Product'}
                    </button>
                </div>
    
                {error && <div className="result-card error-card glass-panel"><h3>{error}</h3></div>}
    
                {result && (
                    <div className={`result-card glass-panel ${result.isExpired ? 'expired-card' : 'valid-card'}`}>
                        {result.isExpired ? (
                            <div className="status-header expired">
                                <h3>⚠️ WARNING: Medicine Expired!</h3>
                                <p>Do not consume this product.</p>
                            </div>
                        ) : (
                            <div className="status-header valid">
                                <h3>✅ AUTHENTIC & SAFE</h3>
                                <div className="trust-badges">
                                    <span className="badge">✔ Blockchain Verified</span>
                                    <span className="badge">✔ Manufacturer Licensed</span>
                                </div>
                            </div>
                        )}
    
                        <div className="details-grid">
                            <div className="detail-item"><strong>Medicine:</strong> <span>{result.medicineName}</span></div>
                            <div className="detail-item"><strong>Batch ID:</strong> <span>{result.batchId}</span></div>
                            <div className="detail-item"><strong>Expiry Date:</strong> <span>{result.formattedDate}</span></div>
                            <div className="detail-item"><strong>Manufacturer:</strong> <span>{result.manufacturerName}</span></div>
                        </div>
    
                        <a
                            href={`https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-cert-btn"
                        >
                            📄 View Quality Certificate
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientVerify;
