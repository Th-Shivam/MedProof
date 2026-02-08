import React, { useState, useEffect } from 'react';
import '../../assets/css/Theme.css';
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
            const [isValid, isExpired, isRecalled, rawMedicineName, manufacturerName, ipfsHash] = data;

            let medicineName = rawMedicineName;
            let distributorName = null;

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
            <div className="glass-panel verify-card">
                <h2>{t('verifyTitle')}</h2>
                <p>{t('verifySubtitle')}</p>

                {/* Camera Scanner Section - Integrated into Glass UI */}
                <div className="scan-controls" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    {!isScanning ? (
                        <button
                            className="glass-btn"
                            onClick={() => setIsScanning(true)}
                            style={{ background: '#4f46e5', width: '100%', justifyContent: 'center' }}
                        >
                            {t('activeCamera')}
                        </button>
                    ) : (
                        <button
                            className="glass-btn"
                            onClick={() => setIsScanning(false)}
                            style={{ background: '#dc2626', width: '100%', justifyContent: 'center' }}
                        >
                            {t('stopScanning')}
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
                        <p style={{ color: 'white', marginTop: '10px', fontSize: '0.9rem' }}>{t('alignQr')}</p>
                    </div>
                )}

                <div className="search-section">
                    <div className="glass-input-wrapper">
                        <input
                            className="glass-input"
                            type="text"
                            placeholder={t('inputPlaceholder')}
                            value={batchId}
                            onChange={(e) => setBatchId(e.target.value)}
                        />
                    </div>
                    <button className="glass-btn verify-btn" onClick={() => verifyBatch()} disabled={loading}>
                        {loading ? t('querying') : t('verifyAuth')}
                    </button>
                </div>

                {error && <div className="result-card error-card glass-panel" style={{ marginTop: '1.5rem' }}><h3>{error}</h3></div>}

                {result && (
                    <div className={`result-card glass-panel ${result.isRecalled ? 'recalled-card' : result.isExpired ? 'expired-card' : 'valid-card'}`} style={{ marginTop: '1.5rem', border: result.isRecalled ? '3px solid red' : '' }}>

                        {result.isRecalled ? (
                            <div className="status-header recalled" style={{ background: 'rgba(255, 0, 0, 0.1)', padding: '15px', borderRadius: '10px', border: '1px solid red' }}>
                                <h3 style={{ color: 'red', fontSize: '1.5rem' }}>{t('criticalRecalled')}</h3>
                                <p style={{ color: 'darkred', fontWeight: 'bold' }}>{t('recalledMsg')}</p>
                            </div>
                        ) : result.isExpired ? (
                            <div className="status-header expired">
                                <h3>{t('expiryAlert')}</h3>
                                <p>{t('expiryMsg')}</p>
                            </div>
                        ) : (
                            <div className="status-header valid">
                                <h3>{t('verifiedAuthentic')}</h3>
                                <div className="trust-badges">
                                    <span className="badge">{t('blockchainSecured')}</span>
                                    <span className="badge">{t('manufacturerSigned')}</span>
                                </div>
                            </div>
                        )}

                        <div className="details-grid" style={{ marginTop: '1.5rem' }}>
                            <div className="detail-item"><strong>{t('medName')}</strong> <span>{result.medicineName}</span></div>
                            <div className="detail-item"><strong>{t('batchUid')}</strong> <span>{result.batchId}</span></div>
                            <div className="detail-item"><strong>{t('expiryDate')}</strong> <span>{result.formattedDate}</span></div>
                            <div className="detail-item"><strong>{t('manufacturer')}</strong> <span>{result.manufacturerName}</span></div>

                            {result.distributorName && (
                                <div className="detail-item" style={{ gridColumn: '1 / -1', background: 'rgba(255, 153, 51, 0.1)', border: '1px solid var(--gov-orange)' }}>
                                    <strong>{t('logisticsPartner')}</strong> <span style={{ color: '#d35400' }}>🚚 {result.distributorName}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            {result.ipfsHash ? (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ marginBottom: '10px', fontWeight: '600', color: 'var(--gov-blue)' }}>{t('qaCert')}</p>
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
                                <p style={{ color: 'red' }}>{t('certMissing')}</p>
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
                                {showProMode ? t('hideProof') : t('viewProof')}
                            </div>

                            {showProMode && (
                                <div className="glass-panel" style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.03)', fontSize: '0.85rem', textAlign: 'left', padding: '1rem' }}>
                                    <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>{t('onChainProof')}</h4>

                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>{t('ledgerStatus')}</strong> <span style={{ color: 'green' }}>{t('immutable')}</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>{t('contract')}</strong> <span style={{ fontFamily: 'monospace' }}>{contract.address}</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>{t('signer')}</strong> <span style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{result.manufacturerName}</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <strong>{t('integrityCheck')}</strong> PASSED
                                    </div>
                                    <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#888' }}>
                                        {t('dataSource')}
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
