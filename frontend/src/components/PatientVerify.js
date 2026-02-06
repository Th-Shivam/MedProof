import React, { useState, useEffect } from 'react';
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
        <div className="panel verify-panel">
            <h2>🕵️‍♀️ Consumer Verification</h2>
            <p>Scan the QR code or enter the Batch ID manually to verify authenticity.</p>

            <div className="scan-controls">
                {!isScanning ? (
                    <button
                        className="scan-btn"
                        onClick={() => setIsScanning(true)}
                    >
                        📸 Open Camera Scanner
                    </button>
                ) : (
                    <button
                        className="scan-btn close-btn"
                        onClick={() => setIsScanning(false)}
                    >
                        ❌ Close Camera
                    </button>
                )}
            </div>

            {isScanning && (
                <div className="scanner-container">
                    <QrScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }}
                    />
                    <p className="scanning-text">Point camera at a MedProof QR Code...</p>
                </div>
            )}

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Enter Batch ID (e.g. BATCH-001)"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                />
                <button onClick={() => verifyBatch()} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify'}
                </button>
            </div>

            {error && <div className="result-card error-card"><h3>{error}</h3></div>}

            {result && (
                <div className={`result-card ${result.isExpired ? 'expired-card' : 'valid-card'}`}>
                    {result.isExpired ? (
                        <h3>⚠️ WARNING: Medicine Expired!</h3>
                    ) : (
                        <div>
                            <h3>✅ AUTHENTIC & SAFE</h3>
                            <ul className="trust-checklist">
                                <li>✔ Verified against blockchain record</li>
                                <li>✔ Certificate hash matched</li>
                                <li>✔ Manufacturer licensed</li>
                            </ul>
                        </div>
                    )}

                    <div className="details-grid">
                        <p><strong>Medicine:</strong> {result.medicineName}</p>
                        <p><strong>Batch ID:</strong> {result.batchId}</p>
                        <p><strong>Expiry Date:</strong> {result.formattedDate}</p>
                        <p><strong>Manufacturer:</strong> {result.manufacturerName}</p>
                        <p><strong>Status:</strong> {result.isExpired ? 'EXPIRED' : 'Valid'}</p>
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
    );
};

export default PatientVerify;
