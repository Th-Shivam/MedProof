import React, { useState, useEffect } from 'react';

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
        <div className="panel verify-panel">
            <h2>🕵️‍♀️ Consumer Verification</h2>
            <p>Scan the QR code or enter the Batch ID manually to verify authenticity.</p>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Enter Batch ID (e.g. BATCH-001)"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                />
                <button onClick={verifyBatch} disabled={loading}>
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
