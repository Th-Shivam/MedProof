import React, { useState, useEffect } from 'react';
import '../../assets/css/Theme.css';
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

            // Destructure carefully based on contract return values
            const [isValid, isExpired, isRecalled, rawMedicineName, manufacturerName, ipfsHash] = data;

            let medicineName = rawMedicineName;
            let distributorName = null;

            if (rawMedicineName.includes('||')) {
                const parts = rawMedicineName.split('||');
                medicineName = parts[0];
                distributorName = parts[1];
            }

            if (!isValid) {
                setError("❌ VERIFICATION FAILED: Batch ID not found in the Decentralized Registry.");
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
            setError("Error connecting to Polygon Blockchain node.");
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
    };

    return (
        <div className="verify-container">
            <div className="glass-panel verify-card">
                <h2>🕵️‍♀️ Public Authenticity Verification</h2>
                <p>Verify medicine legitimacy via the secure blockchain ledger.</p>

                {/* Camera Scanner Section - Integrated into Glass UI */}
                <div className="scan-controls" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    {!isScanning ? (
                        <button
                            className="glass-btn"
                            onClick={() => setIsScanning(true)}
                            style={{ background: '#4f46e5', width: '100%', justifyContent: 'center' }}
                        >
                            Activate Camera Scanner
                        </button>
                    ) : (
                        <button
                            className="glass-btn"
                            onClick={() => setIsScanning(false)}
                            style={{ background: '#dc2626', width: '100%', justifyContent: 'center' }}
                        >
                            Stop Scanning
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
                        <p style={{ color: 'white', marginTop: '10px', fontSize: '0.9rem' }}>Align QR Code within frame...</p>
                    </div>
                )}

                <div className="search-section">
                    <div className="glass-input-wrapper">
                        <input
                            className="glass-input"
                            type="text"
                            placeholder="Input Batch Verification Code"
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
                        />
                    </div>
                    <button className="glass-btn verify-btn" onClick={() => verifyBatch()} disabled={loading}>
                        {loading ? 'Querying Ledger...' : 'Verify Authenticity'}
                    </button>
                </div>

                {error && <div className="result-card error-card glass-panel" style={{ marginTop: '1.5rem' }}><h3>{error}</h3></div>}

                {result && (
                    <div className={`result-card glass-panel ${result.isRecalled ? 'recalled-card' : result.isExpired ? 'expired-card' : 'valid-card'}`} style={{ marginTop: '1.5rem', border: result.isRecalled ? '3px solid red' : '' }}>

                        {result.isRecalled ? (
                            <div className="status-header recalled" style={{ background: 'rgba(255, 0, 0, 0.1)', padding: '15px', borderRadius: '10px', border: '1px solid red' }}>
                                <h3 style={{ color: 'red', fontSize: '1.5rem' }}>⛔ CRITICAL: BATCH RECALLED</h3>
                                <p style={{ color: 'darkred', fontWeight: 'bold' }}>DO NOT CONSUME. This batch has been flagged as UNSAFE by the manufacturer.</p>
                            </div>
                        ) : result.isExpired ? (
                            <div className="status-header expired">
                                <h3>⚠️ ALERT: EXPIRY DATE EXCEEDED</h3>
                                <p>This product is no longer safe for consumption.</p>
                            </div>
                        ) : (
                            <div className="status-header valid">
                                <h3>✅ VERIFIED AUTHENTIC</h3>
                                <div className="trust-badges">
                                    <span className="badge">✔ Blockchain Secured</span>
                                    <span className="badge">✔ Manufacturer Signed</span>
                                </div>
                            </div>
                        )}

                        <div className="details-grid" style={{ marginTop: '1.5rem' }}>
                            <div className="detail-item"><strong>Medicine Name:</strong> <span>{result.medicineName}</span></div>
                            <div className="detail-item"><strong>Batch UID:</strong> <span>{result.batchId}</span></div>
                            <div className="detail-item"><strong>Expiry Date:</strong> <span>{result.formattedDate}</span></div>
                            <div className="detail-item"><strong>Manufacturer:</strong> <span>{result.manufacturerName}</span></div>

                            {result.distributorName && (
                                <div className="detail-item" style={{ gridColumn: '1 / -1', background: 'rgba(255, 153, 51, 0.1)', border: '1px solid var(--gov-orange)' }}>
                                    <strong>Logistics Partner:</strong> <span style={{ color: '#d35400' }}>🚚 {result.distributorName}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            {result.ipfsHash ? (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ marginBottom: '10px', fontWeight: '600', color: 'var(--gov-blue)' }}>📄 Quality Assurance Certificate (IPFS):</p>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        <a
                                            href={`https://ipfs.io/ipfs/${result.ipfsHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-btn view-cert-btn"
                                            style={{ flex: 1, minWidth: '120px', justifyContent: 'center' }}
                                        >
                                            Mirror 1
                                        </a>
                                        <a
                                            href={`https://dweb.link/ipfs/${result.ipfsHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-btn view-cert-btn"
                                            style={{ flex: 1, minWidth: '120px', justifyContent: 'center' }}
                                        >
                                            Mirror 2
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ color: 'red' }}>⚠️ Certificate Hash Missing</p>
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
                                {showProMode ? '🔽 Hide Technical Metadata' : '▶️ View Technical Proof (Hospital Mode)'}
                            </div>

                            {showProMode && (
                                <div className="glass-panel" style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.03)', fontSize: '0.85rem', textAlign: 'left', padding: '1rem' }}>
                                    <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>⛓️ On-Chain Proof</h4>

                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>Ledger Status:</strong> <span style={{ color: 'green' }}>Immutable / Finalized</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>Contract:</strong> <span style={{ fontFamily: 'monospace' }}>{contract.address}</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>Signer:</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.manufacturerName}</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>Integrity Check:</strong> PASSED
                                    </div>
                                    <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#888' }}>
                                        * Data retrieved directly from Polygon Network.
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
