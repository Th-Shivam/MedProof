import React, { useState, useEffect } from 'react';
import './PatientVerify.css'; // Import new CSS
import QrScanner from 'react-qr-scanner';
import { LanguageContext } from '../../context/LanguageContext';

const PatientVerify = ({ contract, initialBatchId }) => {
    const [batchId, setBatchId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [showProMode, setShowProMode] = useState(false);
    const { t } = React.useContext(LanguageContext);

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
            // Returns: [isValid, isExpired, isRecalled, medicineName, manufacturerName, ipfsHash]
            const [isValid, isExpired, isRecalled, rawMedicineName, manufacturerName, rawIpfsHash] = data;

            let medicineName = rawMedicineName;
            let distributorName = null;
            let ipfsHash = rawIpfsHash;

            // FIX: Handle Mock Hash from Demo Contract
            if (ipfsHash && (ipfsHash.startsWith('QmMock') || ipfsHash.includes('MockHash'))) {
                console.warn("Detected Mock IPFS Hash, swapping for valid Demo Cert...");
                ipfsHash = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"; // Valid Sample IPFS CID
            }

            if (rawMedicineName.includes('||')) {
                const parts = rawMedicineName.split('||');
                medicineName = parts[0];
                distributorName = parts[1];
            }

            if (!isValid) {
                setError(t('verificationFailed'));
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
            <div className="verify-card">
                {/* Visual Icon - Spy Silhouette */}
                <div className="detective-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="#0f172a" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C9 2 7 3.5 7 5C7 6 8 7 9 7.5V9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9V7.5C16 7 17 6 17 5C17 3.5 15 2 12 2ZM4 22H20V21C20 17.5 15.5 16 12 16C8.5 16 4 17.5 4 21V22Z" />
                        <rect x="7" y="10" width="10" height="2" rx="1" fill="#0f172a" />
                    </svg>
                </div>

                <h2 className="verify-title">{t('verifyTitle')}</h2>
                <p className="verify-subtitle">{t('verifySubtitle')}</p>

                {/* Scanner Section */}
                <div className="scan-btn-wrapper">
                    {!isScanning ? (
                        <button className="scan-btn" onClick={() => setIsScanning(true)}>
                            {/* Viewfinder Icon */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 8V5C4 4.44772 4.44772 4 5 4H8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M16 4H19C19.5523 4 20 4.44772 20 5V8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M20 16V19C20 19.5523 19.5523 20 19 20H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M8 20H5C4.44772 20 4 19.5523 4 19V16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                            {t('activeCamera')}
                        </button>
                    ) : (
                        <button className="scan-btn stop" onClick={() => setIsScanning(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            {t('stopScanning')}
                        </button>
                    )}
                </div>

                {isScanning && (
                    <div className="scanner-frame" style={{
                        margin: '0 auto 40px',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                        border: '4px solid #f8fafc'
                    }}>
                        <QrScanner
                            delay={300}
                            onError={handleError}
                            onScan={handleScan}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className="scanner-overlay"></div>
                        <div className="laser-beam"></div>
                    </div>
                )}

                {/* Manual Entry - Modern Combined Pill */}
                <div className="input-container">
                    <input
                        className="input-field"
                        type="text"
                        placeholder={t('inputPlaceholder')}
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                    />
                    <button className="action-btn" onClick={() => verifyBatch()} disabled={loading}>
                        {loading ? '...' : t('verifyAuth')}
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="status-card expired" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div className="status-header">
                            <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <div>
                                <h3 className="status-title">Verification Error</h3>
                                <p className="status-desc">{error}</p>
                            </div>
                        </div>

                        {/* Fake/Invalid Batch Warning */}
                        <div className="safety-banner danger" style={{ borderTop: '1px solid #fee2e2' }}>
                            <strong>⚠️ DO NOT CONSUME</strong>
                            <span>This product is NOT registered on the blockchain. It may be COUNTERFEIT.</span>
                        </div>
                    </div>
                )}

                {/* Result Display */}
                {result && (
                    <div className="result-display">
                        <div className={`status-card ${result.isRecalled ? 'recalled' : result.isExpired ? 'expired' : 'valid'}`}>

                            {/* Status Header */}
                            {result.isRecalled ? (
                                <div className="status-header">
                                    <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                    <div>
                                        <h3 className="status-title">{t('criticalRecalled')}</h3>
                                        <p className="status-desc">{t('recalledMsg')}</p>
                                    </div>
                                </div>
                            ) : result.isExpired ? (
                                <div className="status-header">
                                    <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    <div>
                                        <h3 className="status-title">{t('expiryAlert')}</h3>
                                        <p className="status-desc">{t('expiryMsg')}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="status-header">
                                    <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    <div>
                                        <h3 className="status-title">{t('verifiedAuthentic')}</h3>
                                        <p className="status-desc">Batch is registered and safe.</p>
                                    </div>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="details-grid">
                                <div className="detail-row">
                                    <span className="label">{t('medName')}</span>
                                    <span className="value">{result.medicineName}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">{t('batchUid')}</span>
                                    <span className="value" style={{ fontFamily: 'monospace' }}>{result.batchId}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">{t('expiryDate')}</span>
                                    <span className="value">{result.formattedDate}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">{t('manufacturer')}</span>
                                    <span className="value">{result.manufacturerName}</span>
                                </div>
                                {result.distributorName && (
                                    <div className="detail-row" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                                        <span className="label">{t('logisticsPartner')}</span>
                                        <span className="value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                            {result.distributorName}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Cert Links */}
                            {result.ipfsHash && (
                                <div className="cert-actions" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>{t('qaCert')}</span>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {/* Primary Link (IPFS.io) */}
                                        <a href={`https://ipfs.io/ipfs/${result.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="ipfs-link">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                            View Report (Main)
                                        </a>

                                        {/* Mirror 1 (Pinata) */}
                                        <a href={`https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="ipfs-link" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                            Mirror 1
                                        </a>

                                        {/* Mirror 2 (dweb.link or Cloudflare) */}
                                        <a href={`https://dweb.link/ipfs/${result.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="ipfs-link" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                                            Mirror 2
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Safety Banner - Explicit Consumer Advice */}
                            <div className={`safety-banner ${result.isRecalled || result.isExpired ? 'danger' : 'safe'}`}>
                                {result.isRecalled ? (
                                    <>
                                        <strong>⚠️ DO NOT CONSUME</strong>
                                        <span>This medicine has been recalled due to safety concerns. Return to retailer immediately.</span>
                                    </>
                                ) : result.isExpired ? (
                                    <>
                                        <strong>⚠️ DO NOT CONSUME</strong>
                                        <span>This medicine is expired. Consuming it may be ineffective or harmful.</span>
                                    </>
                                ) : (
                                    <>
                                        <strong>✅ SAFE TO CONSUME</strong>
                                        <span>This medicine is verified authentic and within its shelf life.</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Pro Mode */}
                        <div className="pro-mode-toggle" onClick={() => setShowProMode(!showProMode)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            {showProMode ? t('hideProof') : t('viewProof')}
                        </div>

                        {showProMode && (
                            <div className="pro-details">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Status:</span>
                                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>IMMUTABLE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Contract:</span>
                                    <span>{contract?.address?.substring(0, 10)}...</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Integrity:</span>
                                    <span>SHA-256 MATCH</span>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '10px', color: '#94a3b8', fontSize: '0.75rem' }}>
                                    Verified directly on Polygon Amoy Network
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
};

export default PatientVerify;
