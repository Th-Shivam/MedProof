import React, { useState, useEffect } from 'react';
import '../Theme.css';
import QrScanner from 'react-qr-scanner';

const PatientVerify = ({ contract, initialBatchId }) => {
    const [batchId, setBatchId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    // Auto-verify if initialBatchId is provided (Deep Linking)
    useEffect(() => {
        if (initialBatchId) {
            setBatchId(initialBatchId);
            verifyBatch(initialBatchId);
        }
    }, [initialBatchId, contract]);

    // Modified to accept an optional ID (for auto-verify after scan)
    const verifyBatch = async (manualId) => {
        const idToVerify = manualId || batchId;
        if (!contract || !idToVerify) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Returns: [isValid, isExpired, medicineName, manufacturerName, ipfsHash]
            const data = await contract.verifyBatch(idToVerify);

            const [isValid, isExpired, medicineName, manufacturerName, ipfsHash] = data;

            if (!isValid) {
                setError("❌ ALERT: Batch ID not found in Registry. This might be a COUNTERFEIT product.");
            } else {
                // Fetch full details to get the exact expiry date
                const batchDetails = await contract.getBatch(idToVerify);
                const expiryDateObj = new Date(batchDetails.expiryDate.toNumber() * 1000);
                const formattedDate = expiryDateObj.toLocaleDateString('en-GB');

                setResult({
                    isValid,
                    isExpired,
                    medicineName,
                    manufacturerName,
                    ipfsHash,
                    formattedDate,
                    batchId: idToVerify
                });
            }

        } catch (err) {
            console.error(err);
            setError("Error connecting to blockchain.");
        } finally {
            setLoading(false);
        }
    };

    const handleScan = (data) => {
        if (data) {
            console.log("Scanned:", data.text);

            // Logic to extract Batch ID if scanned data is a URL
            let scannedId = data.text;
            if (scannedId.includes('/verify/')) {
                const parts = scannedId.split('/verify/');
                scannedId = parts[1]; // Get the part after /verify/
            } else if (scannedId.includes('/')) {
                // Fallback: If it's a URL but doesn't have /verify/, just take the last part
                const parts = scannedId.split('/');
                scannedId = parts[parts.length - 1];
            }

            setBatchId(scannedId);
            setIsScanning(false);
            verifyBatch(scannedId); // Auto-verify with extracted ID
        }
    };

    const handleError = (err) => {
        console.error(err);
        // Don't show error to user immediately to avoid flickering, just log it
    };

    return (
        <div className="verify-container">
            <div className="glass-panel verify-card">
                <h2>🕵️‍♀️ Consumer Verification</h2>
                <p>Scan the QR code or enter the Batch ID manually to verify authenticity.</p>

                {/* Camera Scanner Section - Integrated into Glass UI */}
                <div className="scan-controls" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    {!isScanning ? (
                        <button
                            className="glass-btn"
                            onClick={() => setIsScanning(true)}
                            style={{ background: '#4f46e5', width: '100%', justifyContent: 'center' }}
                        >
                            📸 Open Camera Scanner
                        </button>
                    ) : (
                        <button
                            className="glass-btn"
                            onClick={() => setIsScanning(false)}
                            style={{ background: '#dc2626', width: '100%', justifyContent: 'center' }}
                        >
                            ❌ Close Camera
                        </button>
                    )}
                </div>

                {isScanning && (
                    <div className="scanner-container" style={{ background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '12px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                        <QrScanner
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: '100%', borderRadius: '12px' }}
                        />
                        <p style={{ color: 'white', marginTop: '10px', fontSize: '0.9rem' }}>Point camera at a MedProof QR Code...</p>
                    </div>
                )}

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
                    <button className="glass-btn verify-btn" onClick={() => verifyBatch()} disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Product'}
                    </button>
                </div>

                {error && <div className="result-card error-card glass-panel" style={{ marginTop: '1.5rem' }}><h3>{error}</h3></div>}

                {result && (
                    <div className={`result-card glass-panel ${result.isExpired ? 'expired-card' : 'valid-card'}`} style={{ marginTop: '1.5rem' }}>
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
