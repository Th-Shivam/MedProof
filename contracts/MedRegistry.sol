// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MedRegistry is AccessControl {
    
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");

    struct MedicineBatch {
        string batchId;          // Unique Identifier printed on the pack
        string medicineName;     // e.g. "Dolo-650"
        string manufacturerName; // e.g. "MedLife Pharma"
        string ipfsHash;         // CID of the Certificate of Analysis (Lab Report)
        uint256 expiryDate;      // Unix Timestamp
        address registrant;      // Wallet address of the manufacturer
        uint256 registrationTime;
        bool exists;
    }

    // Mapping from BatchID to the Batch Data
    mapping(string => MedicineBatch) private _batches;
    string[] private _allBatchIds;

    event BatchRegistered(
        string batchId,
        string medicineName,
        string manufacturerName,
        uint256 expiryDate,
        address indexed registrant
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // In a real app, you'd grant this role to verified pharma wallets.
        // For Hackathon demo, deployer gets it automatically.
        _grantRole(MANUFACTURER_ROLE, msg.sender); 
    }

    function registerBatch(
        string memory batchId,
        string memory medicineName,
        string memory manufacturerName,
        string memory ipfsHash,
        uint256 expiryDate
    ) public {
        // --- HACKATHON MODE: AUTO-ONBOARDING ---
        // If the user is not yet a manufacturer, we auto-register them.
        // In a real production app, this would require KYC/Admin approval.
        if (!hasRole(MANUFACTURER_ROLE, msg.sender)) {
            _grantRole(MANUFACTURER_ROLE, msg.sender);
        }

        require(!_batches[batchId].exists, "Batch ID already exists. Cannot overwrite.");
        require(expiryDate > block.timestamp, "Expiry date must be in the future.");

        _batches[batchId] = MedicineBatch(
            batchId,
            medicineName,
            manufacturerName,
            ipfsHash,
            expiryDate,
            msg.sender,
            block.timestamp,
            true
        );
        _allBatchIds.push(batchId);

        emit BatchRegistered(
            batchId,
            medicineName,
            manufacturerName,
            expiryDate,
            msg.sender
        );
    }

    function getBatch(string memory batchId) public view returns (MedicineBatch memory) {
        return _batches[batchId];
    }
    
    // Helper to check validity status in one call
    function verifyBatch(string memory batchId) public view returns (
        bool isValid, 
        bool isExpired, 
        string memory medicineName,
        string memory manufacturerName, 
        string memory ipfsHash
    ) {
        MedicineBatch memory batch = _batches[batchId];
        
        if (!batch.exists) {
            return (false, false, "", "", "");
        }

        bool expired = block.timestamp > batch.expiryDate;
        
        return (
            true, 
            expired, 
            batch.medicineName, 
            batch.manufacturerName, 
            batch.ipfsHash
        );
    }
}
