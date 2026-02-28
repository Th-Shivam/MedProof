```mermaid
graph TD
    %% Start
    start((App Start)) --> checkAuth{Wallet Connected?} -- No --> publicAuth{Public Mode?}
    checkAuth -- Yes --> mainApp[Main App Content]
    publicAuth -- No --> landing[Landing Page]
    publicAuth -- Yes --> mainApp

    %% Landing Page Actions
    landing -->|Connect Wallet| connect[MetaMask / Web3 Provider]
    landing -->|Enter Public Mode| public[JsonRpcProvider (Read-Only)]
    connect --> mainApp
    public --> mainApp

    %% Main App Structure
    mainApp --> navbar{Navbar Navigation}
    navbar --> viewConsumer[Consumer View (PatientVerify)]
    navbar --> viewManufacturer[Manufacturer View (ManufacturerDashboard)]
    navbar --> viewSupport[Support Page]
    navbar --> checkNet[Check Network Status]

    %% Consumer Flow (PatientVerify)
    viewConsumer --> inputMethod{Input Method}
    inputMethod -- Scan QR Code --> scanner[QR Scanner Component]
    inputMethod -- Manual Entry --> textInput[Input Field]
    
    scanner -->|Extract ID| verifyLogic[Logic: Verify Batch ID]
    textInput --> verifyLogic

    verifyLogic --> contractCallVerify[Smart Contract: verifyBatch(batchId)]
    contractCallVerify --> result{Result Status}
    
    result -- "Valid & Active" --> showValid[Show: Green Card, Details, Expiry Date]
    result -- "Expired" --> showExpired[Show: Red Card, Expiry Warning]
    result -- "Recalled (Kill Switch)" --> showRecalled[Show: Recalled Alert, Reason]
    result -- "Invalid / Not Found" --> showError[Show: Error Message]

    showValid -- "View Proof (Pro Mode)" --> proMode[Show Blockchain Details: Hash, Block]
    showValid -- "View Lab Report" --> ipfsLink[Open IPFS Document]

    %% Manufacturer Flow (ManufacturerDashboard)
    viewManufacturer --> manuAction{Action Type}
    
    %% Register Flow
    manuAction -- "Register New Batch" --> fillForm[Form: Medicine Name, Batch ID, Expiry, Manufacturer]
    fillForm --> uploadFile[Upload File (CoA / Lab Report)]
    uploadFile -->|Upload to IPFS| ipfsHash[Get IPFS Hash]
    ipfsHash --> contractCallRegister[Smart Contract: registerBatch(...)]
    contractCallRegister -->|Success| genQR[Generate QR Code with Verify URL]
    genQR --> displayQR[Display QR for Packaging]

    %% Recall Flow
    manuAction -- "Recall Batch (Emergency)" --> fillRecall[Form: Batch ID, Reason]
    fillRecall --> contractCallRecall[Smart Contract: recallBatch(batchId, reason)]
    contractCallRecall -->|Success| updateStatus[Batch Status Updated on Chain (RECALLED)]

    %% Styling
    classDef page fill:#f9f,stroke:#333,stroke-width:2px;
    classDef decision fill:#ff9,stroke:#333,stroke-width:2px;
    classDef logic fill:#bbf,stroke:#333,stroke-width:2px;
    classDef result fill:#dfd,stroke:#333,stroke-width:2px;
    classDef error fill:#fdd,stroke:#333,stroke-width:2px;

    class landing,mainApp,viewConsumer,viewManufacturer,viewSupport page;
    class checkAuth,publicAuth,inputMethod,result,manuAction,navbar decision;
    class verifyLogic,contractCallVerify,contractCallRegister,contractCallRecall logic;
    class showValid,genQR,displayQR,updateStatus result;
    class showExpired,showRecalled,showError error;
```
