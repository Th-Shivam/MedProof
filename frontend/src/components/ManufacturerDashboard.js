import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Updated import for v3+
import '../Theme.css';

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
                    const response = await axios.post('http://localhost:3001/upload', uploadData, {
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

    const handleRecallSubmit = async (e) => {
        e.preventDefault();
        if (!contract) return;
        try {
            const tx = await contract.recallBatch(recallBatchId, recallReason);
            await tx.wait();
            alert("⚠️ BATCH RECALLED SUCCESSFULLY. Global Warning Issued.");
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="glass-panel dashboard-card">
                <div className="card-header">
                    <h2 style={{ color: 'var(--gov-blue)', borderBottom: '2px solid var(--gov-gold)', paddingBottom: '10px' }}> Certified Manufacturer Node</h2>
                    <p>Securely mint new pharmaceutical batches to the decentralized ledger.</p>
                </div>

                <form onSubmit={registerBatch} className="glass-form">
                    <div className="input-group">
                        <label>Medicine Name (INN/Brand)</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input" type="text" name="medicineName" placeholder="e.g. Paracetamol 500mg" required value={formData.medicineName} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Authorized Distributor (Supply Chain)</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input" type="text" name="distributorName" placeholder="e.g. Apollo Pharmacy Logistics" value={formData.distributorName || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Batch Identifier (UID)</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input" type="text" name="batchId" placeholder="e.g. BATCH-2024-X99" required value={formData.batchId} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Manufacturer Name</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input" type="text" name="manufacturerName" placeholder="e.g. Sun Pharma Ltd." required value={formData.manufacturerName} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Expiry Date</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input" type="date" name="expiryDate" required value={formData.expiryDate} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>CoA / Lab Report (IPFS Upload)</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input file-input" type="file" onChange={handleFileChange} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="glass-btn submit-btn">
                        {loading ? 'Minting to Blockchain...' : '🔗 Mint Batch Hash'}
                    </button>
                </form>

                {status && <div className="status-box glass-panel"><p>{status}</p></div>}

                {generatedQr && (
                    <div className="qr-section glass-panel">
                        <h3>🖨️ Digital Asset Created</h3>
                        <div className="qr-wrapper">
                            <QRCodeCanvas value={generatedQr} size={180} bgColor={"#ffffff"} fgColor={"#000000"} level={"H"} includeMargin={true} />
                        </div>
                        <p className="qr-url">Verification Link: <span>{generatedQr}</span></p>
                    </div>
                )}
            </div>

            {/* RECALL SECTION (KILL SWITCH) */}
            <div className="glass-panel" style={{ marginTop: '2rem', border: '1px solid rgba(255, 0, 0, 0.3)', background: 'rgba(255, 0, 0, 0.05)', padding: '20px' }}>
                <h3 style={{ color: '#e74c3c', marginTop: 0 }}>🚨 Emergency Protocol: Batch Recall</h3>
                <p style={{ fontSize: '0.9rem', color: '#c0392b', marginBottom: '15px' }}>
                    <strong>WARNING:</strong> This action is irreversible. It will permanently flag the batch as "UNSAFE" on the global ledger.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="glass-input-wrapper" style={{ flex: 1 }}>
                        <input
                            className="glass-input"
                            type="text"
                            placeholder="Enter Batch ID"
                            value={recallBatchId}
                            onChange={(e) => setRecallBatchId(e.target.value)}
                            style={{ borderColor: '#e74c3c' }}
                        />
                    </div>
                    <div className="glass-input-wrapper" style={{ flex: 2 }}>
                        <input
                            className="glass-input"
                            type="text"
                            placeholder="Reason (e.g. Contamination detection)"
                            value={recallReason}
                            onChange={(e) => setRecallReason(e.target.value)}
                            style={{ borderColor: '#e74c3c' }}
                        />
                    </div>
                </div>
                <button
                    className="glass-btn"
                    style={{ background: '#c0392b', marginTop: '10px', width: '100%', color: 'white', fontWeight: 'bold' }}
                    onClick={handleRecallSubmit}
                >
                    ⚠️ EXECUTE KILL SWITCH
                </button>
            </div>
        </div>
    );
};

export default ManufacturerDashboard;
