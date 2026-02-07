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
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [generatedQr, setGeneratedQr] = useState(null);

    const [recallData, setRecallData] = useState({
        batchId: '',
        reason: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleRecallSubmit = async () => {
        if (!contract || !recallData.batchId || !recallData.reason) return;
        try {
            setLoading(true);
            setStatus('⚠️ Initiating Batch Recall on Blockchain...');
            const tx = await contract.recallBatch(recallData.batchId, recallData.reason);
            await tx.wait();
            setStatus('🚨 BATCH RECALLED SUCCESSFULLY. It is now flagged as dangerous.');
            setRecallData({ batchId: '', reason: '' });
        } catch (error) {
            console.error(error);
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const registerBatch = async (e) => {
        e.preventDefault();
        if (!contract || !file) return;

        try {
            setLoading(true);
            setStatus('Step 1: Uploading Certificate of Analysis to IPFS...');

            // 1. Upload to IPFS via Backend
            const uploadData = new FormData();
            uploadData.append('file', file);

            const response = await axios.post('http://localhost:3001/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const ipfsHash = response.data.ipfsHash;
            setStatus('Step 2: Confirming Transaction on Polygon...');

            // 2. Register on Blockchain
            // Fix: Set time to 23:59:59 of the selected date to ensure it's in the future if 'today' is selected.
            const dateObj = new Date(formData.expiryDate);
            dateObj.setHours(23, 59, 59, 999);
            const expiryTimestamp = Math.floor(dateObj.getTime() / 1000);

            console.log("Registering Batch:", {
                ...formData,
                ipfsHash,
                expiryTimestamp,
                contractAddress: contract.address
            });

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

            setStatus('✅ Batch Registered Successfully!');
            const verifyUrl = `${window.location.origin}/verify/${formData.batchId}`;
            setGeneratedQr(verifyUrl);

        } catch (error) {
            console.error(error);
            setStatus(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="glass-panel dashboard-card">
                <div className="card-header">
                    <h2>🏭 Manufacturer Dashboard</h2>
                    <p>Register new medicine batches on the blockchain.</p>
                </div>

                <form onSubmit={registerBatch} className="glass-form">
                    <div className="input-group">
                        <label>Medicine Name</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input" type="text" name="medicineName" placeholder="e.g. Paracetamol 500mg" required value={formData.medicineName} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Authorized Distributor (Supply Chain)</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input" type="text" name="distributorName" placeholder="e.g. Apollo Pharmacy / MedPlus" required value={formData.distributorName || ''} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Batch ID (Printed on Pack)</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input" type="text" name="batchId" placeholder="e.g. BATCH-001" required value={formData.batchId} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Manufacturer Name</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input" type="text" name="manufacturerName" placeholder="e.g. HealthCorp India" required value={formData.manufacturerName} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Expiry Date</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input" type="date" name="expiryDate" required value={formData.expiryDate} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Certificate of Analysis (Lab Report)</label>
                        <div className="glass-input-wrapper">
                            <input className="glass-input file-input" type="file" required onChange={handleFileChange} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="glass-btn submit-btn">
                        {loading ? 'Processing Transaction...' : 'Register Batch'}
                    </button>
                </form>

                {status && <div className="status-box glass-panel"><p>{status}</p></div>}

                {generatedQr && (
                    <div className="qr-section glass-panel">
                        <h3>🖨️ Batch Registered!</h3>
                        <div className="qr-wrapper">
                            <QRCodeCanvas value={generatedQr} size={180} bgColor={"#ffffff"} fgColor={"#000000"} level={"H"} includeMargin={true} />
                        </div>
                        <p className="qr-url">Verification URL: <span>{generatedQr}</span></p>
                    </div>
                )}
            </div>

            {/* RECALL SECTION (KILL SWITCH) */}
            <div className="glass-panel" style={{ marginTop: '2rem', border: '1px solid rgba(255, 0, 0, 0.3)', background: 'rgba(255, 0, 0, 0.05)', padding: '20px' }}>
                <h3 style={{ color: '#e74c3c', marginTop: 0 }}>🚨 Emergency Batch Recall</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#c0392b' }}>
                    Use this tool to immediately flag a batch as unsafe. This will trigger a "DANGER" warning for all patients.
                </p>

                <div className="input-group">
                    <label style={{ color: '#c0392b' }}>Batch ID to Recall</label>
                    <div className="glass-input-wrapper" style={{ borderColor: '#e74c3c' }}>
                        <input
                            className="glass-input"
                            type="text"
                            placeholder="e.g. BATCH-001"
                            value={recallData.batchId}
                            onChange={(e) => setRecallData({ ...recallData, batchId: e.target.value })}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label style={{ color: '#c0392b' }}>Reason for Recall</label>
                    <div className="glass-input-wrapper" style={{ borderColor: '#e74c3c' }}>
                        <input
                            className="glass-input"
                            type="text"
                            placeholder="e.g. Failed Stability Test / Contamination"
                            value={recallData.reason}
                            onChange={(e) => setRecallData({ ...recallData, reason: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    onClick={handleRecallSubmit}
                    disabled={loading || !recallData.batchId}
                    className="glass-btn"
                    style={{ background: '#e74c3c', width: '100%', marginTop: '10px', fontWeight: 'bold' }}
                >
                    {loading ? 'Processing Recall...' : '⚠️ RECALL BATCH PERMANENTLY'}
                </button>
            </div>
        </div>
    );
};

export default ManufacturerDashboard;
