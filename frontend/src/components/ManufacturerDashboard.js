import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Updated import for v3+

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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

            const tx = await contract.registerBatch(
                formData.batchId,
                formData.medicineName,
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
        <div className="panel dashboard-panel">
            <h2>🏭 Manufacturer Dashboard</h2>
            <div className="form-container">
                <form onSubmit={registerBatch}>
                    <div className="input-group">
                        <label>Medicine Name</label>
                        <input type="text" name="medicineName" placeholder="e.g. Paracetamol 500mg" required onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Batch ID (Printed on Pack)</label>
                        <input type="text" name="batchId" placeholder="e.g. BATCH-001" required onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Manufacturer Name</label>
                        <input type="text" name="manufacturerName" placeholder="e.g. HealthCorp India" required onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Expiry Date</label>
                        <input type="date" name="expiryDate" required onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>Certificate of Analysis (Lab Report)</label>
                        <input type="file" required onChange={handleFileChange} />
                    </div>

                    <button type="submit" disabled={loading} className="action-button">
                        {loading ? 'Processing...' : 'Register Batch on Blockchain'}
                    </button>
                </form>

                {status && <p className="status-text">{status}</p>}

                {generatedQr && (
                    <div className="qr-section">
                        <h3>🖨️ Print this QR Code</h3>
                        <div className="qr-code">
                            <QRCodeCanvas value={generatedQr} size={200} />
                        </div>
                        <p>URL: {generatedQr}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManufacturerDashboard;
