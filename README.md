# MedProof
**Blockchain-Based Medicine Authenticity & Expiry Verification System**

MedProof is a decentralized healthcare solution built for the **TH03 MedTech / BioTech / HealthTech** track. It directly addresses the "Trust Gap" in patient care by ensuring that every medicine consumed is authentic and safe.

## ⚕️ Alignment with TH03 (MedTech)
*   **Problem**: "Disparities in quality of care" & "Reliability of medical services". Counterfeit drugs kill patients and erode trust in the healthcare system.
*   **Solution**: An indigenous, scalable "Truth Infrastructure" that empowers even rural patients to verify life-saving medicines using a simple QR scan.
*   **Outcome**: "Strengthened healthcare systems supporting national self-reliance" (Atmanirbhar Bharat).

## 💡 Key Features
- **Smart Contract Verified**: Logic for `Batch ID`, `Expiry Date`, and `Manufacturer Identity` runs on-chain.
- **Expiry Guard**: The blockchain automatically flags expired medicines even if the packaging date is faked.
- **Tamper-Proof Certificates**: Lab reports (CoAs) are pinned to IPFS; any change in the file changes the hash.
- **Role-Based Access**: Only authorized manufacturers can register new batches.

## 🛠️ Tech Stack
- **Blockchain**: Polygon Amoy Testnet / Hardhat
- **Smart Contract**: Solidity (MedRegistry.sol)
- **Frontend**: React.js (Manufacturer Dashboard + Patient Scanner)
- **Storage**: IPFS (via Pinata)
- **Backend**: Node.js/Express (Relay)

## 📦 Installation

### Prerequisites
- Node.js 16+
- MetaMask Wallet
- Pinata API Keys (in `.env`)

### Setup
1. **Install Dependencies**
   ```bash
   npm install              # Root
   cd frontend && npm install
   cd backend && npm install
   ```

2. **Deploy Contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network amoy
   ```
   *Note: Update `frontend/src/contracts/MedRegistry.json` if ABI changes.*

3. **Run Application**
   - **Backend**: `cd backend && npm start` (Port 3001)
   - **Frontend**: `cd frontend && npm start` (Port 3000)

## 🔍 How to Demo
1. **Manufacturer View**:
   - Connect Wallet (ensure you have `MANUFACTURER_ROLE` or deployed the contract).
   - Enter Batch Details (e.g., "Dolo-650", "BATCH-X1").
   - Upload a dummy PDF (Certificate).
   - Click **Register**. A QR code will be generated.
2. **Patient View**:
   - Open the "For Patients" tab (or scan the QR).
   - Enter the Batch ID.
   - See the Green "Authenticated" or Red "Fake" result.

---
*Built with ❤️ for Atmanirbhar Bharat*

# MedProof