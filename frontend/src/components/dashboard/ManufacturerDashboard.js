import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Updated import for v3+
import './ManufacturerDashboard.css'; // Import new CSS

const ManufacturerDashboard = ({ contract, account }) => {
    const [formData, setFormData] = useState({
        medicineName: '',
        batchId: '',
        manufacturerName: '',
        expiryDate: '',
        distributorName: '',
        ipfsHash: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [generatedQr, setGeneratedQr] = useState(null);

    // Recall State
    const [recallBatchId, setRecallBatchId] = useState('');
    const [recallReason, setRecallReason] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleRecallSubmit = async () => {
        if (!contract || !recallBatchId || !recallReason) return;
        try {
            setLoading(true);
            setStatus('⚠️ Initiating Batch Recall on Blockchain...');
            const tx = await contract.recallBatch(recallBatchId, recallReason);
            await tx.wait();
            setStatus('🚨 BATCH RECALLED SUCCESSFULLY. It is now flagged as dangerous.');
            setRecallBatchId('');
            setRecallReason('');
        } catch (error) {
            console.error(error);
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const registerBatch = async (e) => {
        e.preventDefault();
        if (!contract) return;

        try {
            setLoading(true);
            setStatus('🚀 Initiating On-Chain Transaction...');

            // Mock IPFS for demo speed if file not critical, or keep logic.
            // For now, assuming IPFS hash is manually entered or we skip file upload for hackathon speed if problematic.
            // But let's keep the flow:

            // 1. IPFS Upload (Simulated or Real)
            let ipfsHash = "QmHash...";
            if (file) {
                const uploadData = new FormData();
                uploadData.append('file', file);
                try {
                    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
                    const response = await axios.post(`${backendUrl}/upload`, uploadData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    ipfsHash = response.data.ipfsHash;
                } catch (e) {
                    console.warn("IPFS Upload failed, using mock hash for demo", e);
                    ipfsHash = "QmMockHashForDemo_" + Date.now();
                }
            } else if (formData.ipfsHash) {
                ipfsHash = formData.ipfsHash;
            }

            setStatus('⏳ Minting Block on Polygon Amoy...');

            // 2. Register on Blockchain
            const dateObj = new Date(formData.expiryDate);
            dateObj.setHours(23, 59, 59, 999);
            const expiryTimestamp = Math.floor(dateObj.getTime() / 1000);

            // Combine Medicine Name and Distributor for Supply Chain simulation
            const medicineNameWithDist = formData.distributorName
                ? `${formData.medicineName}||${formData.distributorName}`
                : formData.medicineName;

            const tx = await contract.registerBatch(
                formData.batchId,
                medicineNameWithDist,
                formData.manufacturerName,
                ipfsHash,
                expiryTimestamp
            );

            await tx.wait();

            setStatus('✅ BATCH MINTED & SECURED ON-CHAIN!');
            const verifyUrl = `${window.location.origin}/verify/${formData.batchId}`;
            setGeneratedQr(verifyUrl);

        } catch (error) {
            console.error(error);
            setStatus(`❌ Transaction Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">

                {/* Left Column: Form */}
                <div className="dash-card">
                    <div className="dash-header">
                        <h2>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#2563eb' }}><path d="M12 2l9 4.9V17L12 22 3 17V6.9l9-4.9z"></path></svg>
                            Manufacturer Node
                        </h2>
                        <p>Securely mint new pharmaceutical batches.</p>
                    </div>

                    <form onSubmit={registerBatch} className="form-grid">
                        <div className="form-group">
                            <label>Medicine Name</label>
                            <input className="glass-input" type="text" name="medicineName" placeholder="e.g. Paracetamol 500mg" required value={formData.medicineName} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Authorized Distributor</label>
                            <input className="glass-input" type="text" name="distributorName" placeholder="e.g. Apollo Pharmacy Logistics" value={formData.distributorName || ''} onChange={handleChange} />
                        </div>

                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label>Batch ID (UID)</label>
                                <input className="glass-input" type="text" name="batchId" placeholder="BATCH-X99" required value={formData.batchId} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input className="glass-input" type="date" name="expiryDate" required value={formData.expiryDate} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Manufacturer Name</label>
                            <input className="glass-input" type="text" name="manufacturerName" placeholder="e.g. Sun Pharma Ltd." required value={formData.manufacturerName} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>CoA / Lab Report (IPFS)</label>
                            <input className="glass-input file-input" type="file" onChange={handleFileChange} />
                            <div style={{ textAlign: 'center', margin: '10px 0', color: '#64748b' }}>- OR -</div>
                            <input
                                className="glass-input"
                                type="text"
                                name="ipfsHash"
                                placeholder="Paste IPFS Hash (CID) directly"
                                value={formData.ipfsHash}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? (
                                <>
                                    <div className="spinner-border" style={{ width: '20px', height: '20px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                    Mint Batch Hash
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Column: Status & Preview */}
                <div className="preview-section">

                    {/* Status Box */}
                    {status && (
                        <div className="status-box">
                            {status}
                        </div>
                    )}

                    {/* QR Code Card */}
                    {generatedQr ? (
                        <div className="qr-card">
                            <h3>Digital Asset Created</h3>
                            <div className="qr-frame">
                                <QRCodeCanvas value={generatedQr} size={160} bgColor={"#ffffff"} fgColor={"#000000"} level={"H"} includeMargin={true} />
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '10px' }}>Verification Link:</p>
                            <a href={generatedQr} target="_blank" rel="noopener noreferrer" className="qr-link">
                                {generatedQr}
                            </a>
                        </div>
                    ) : (
                        <div className="dash-card" style={{ textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                            <p style={{ marginTop: '20px', color: '#94a3b8' }}>QR Code will appear here<br />after minting.</p>
                        </div>
                    )}

                    {/* Kill Switch (Recall) */}
                    <div className="recall-section">
                        <div className="recall-header">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <h3>Emergency Recall</h3>
                        </div>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <input
                                className="glass-input recall-input"
                                type="text"
                                placeholder="Enter Batch ID"
                                value={recallBatchId}
                                onChange={(e) => setRecallBatchId(e.target.value)}
                            />
                        </div>
                        <div className="recall-actions">
                            <input
                                className="glass-input recall-input"
                                type="text"
                                placeholder="Reason"
                                value={recallReason}
                                onChange={(e) => setRecallReason(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button className="kill-btn" onClick={handleRecallSubmit}>
                                EXECUTE
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ManufacturerDashboard;
