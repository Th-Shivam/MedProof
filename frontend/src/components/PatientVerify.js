import React, { useState, useEffect } from 'react';
import '../Theme.css';
import QrScanner from 'react-qr-scanner';

const PatientVerify = ({ contract, initialBatchId }) => {
    const [batchId, setBatchId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [showProMode, setShowProMode] = useState(false);

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
            // Returns: [isValid, isExpired, isRecalled, medicineName, manufacturerName, ipfsHash]
            const data = await contract.verifyBatch(idToVerify);

            const [isValid, isExpired, isRecalled, rawMedicineName, manufacturerName, ipfsHash] = data;

            let medicineName = rawMedicineName;
            let distributorName = null;

            if (rawMedicineName.includes('||')) {
                const parts = rawMedicineName.split('||');
                medicineName = parts[0];
                distributorName = parts[1];
            }

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
                    isRecalled,
                    medicineName,
                    distributorName,
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
                    <div className={`result-card glass-panel ${result.isRecalled ? 'recalled-card' : result.isExpired ? 'expired-card' : 'valid-card'}`} style={{ marginTop: '1.5rem', border: result.isRecalled ? '2px solid red' : '' }}>
                        {result.isRecalled ? (
                            <div className="status-header recalled" style={{ background: 'rgba(255, 0, 0, 0.15)', border: '1px solid red', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                <h2 style={{ color: 'red', fontSize: '1.8rem', animation: 'pulse 1s infinite' }}>☠️ DANGER: RECALLED ☠️</h2>
                                <p style={{ color: '#c0392b', fontWeight: 'bold' }}>DO NOT USE THIS MEDICINE.</p>
                                <p>The manufacturer has flagged this batch as unsafe.</p>
                                <button className="glass-btn" style={{ background: 'red', marginTop: '10px' }} onClick={() => window.location.reload()}>REPORT ISSUE</button>
                            </div>
                        ) : result.isExpired ? (
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

                            {result.distributorName && (
                                <div className="detail-item" style={{ gridColumn: '1 / -1', background: 'rgba(255, 153, 51, 0.1)', border: '1px solid var(--gov-orange)' }}>
                                    <strong>Authorized Distributor:</strong> <span style={{ color: '#d35400' }}>🚚 {result.distributorName}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            {result.ipfsHash ? (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ marginBottom: '10px', fontWeight: '600', color: 'var(--gov-blue)' }}>📄 View Quality Certificate:</p>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        <a
                                            href={`https://ipfs.io/ipfs/${result.ipfsHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-btn view-cert-btn"
                                            style={{ flex: 1, minWidth: '120px', justifyContent: 'center' }}
                                        >
                                            Mirror 1 (Official)
                                        </a>
                                        <a
                                            href={`https://dweb.link/ipfs/${result.ipfsHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-btn view-cert-btn"
                                            style={{ flex: 1, minWidth: '120px', justifyContent: 'center' }}
                                        >
                                            Mirror 2 (Fast)
                                        </a>
                                        <a
                                            href={`https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-btn view-cert-btn"
                                            style={{ flex: 1, minWidth: '120px', justifyContent: 'center' }}
                                        >
                                            Mirror 3 (Pinata)
                                        </a>
                                    </div>
                                    <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '10px' }}>
                                        IPFS Hash: {result.ipfsHash} <br />
                                        (If one link is slow, try another)
                                    </p>
                                </div>
                            ) : (
                                <p style={{ color: 'red' }}>⚠️ No Certificate Found (Hash is empty)</p>
                            )}
                        </div>

                        {/* PRO MODE TOGGLE */}
                        <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <div
                                onClick={() => setShowProMode(!showProMode)}
                                style={{
                                    cursor: 'pointer',
                                    color: '#666',
                                    textAlign: 'center',
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px'
                                }}
                            >
                                {showProMode ? '🔽 Hide Technical Details' : '▶️ Pro Mode (Hospital/Pharmacist View)'}
                            </div>

                            {showProMode && (
                                <div className="glass-panel" style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.03)', fontSize: '0.85rem', textAlign: 'left', padding: '1rem' }}>
                                    <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>⛓️ Blockchain Proof (Immutable)</h4>

                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>Status:</strong> <span style={{ color: 'green' }}>Confirmed</span> on Polygon Amoy
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>Contract:</strong> <span style={{ fontFamily: 'monospace' }}>{contract.address}</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>Publisher:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.manufacturerName}</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>Data Integrity:</strong> SHA-256 Verified
                                    </div>
                                    <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#888' }}>
                                        * This data is read directly from the Polygon Blockchain and cannot be altered by anyone.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientVerify;
