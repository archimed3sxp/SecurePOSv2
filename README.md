# SecurePOS - Tamper-Proof Audit for Retail Systems

A blockchain-based Point of Sale system that provides tamper-proof audit trails for retail operations using the Lisk network.

## Features

- **Tamper-Proof Sales Recording**: All sales are cryptographically hashed and stored on the blockchain
- **Role-Based Access Control**: Manager, Auditor, and Cashier roles with appropriate permissions
- **Real-Time Audit**: Instant verification of sales data integrity
- **User Management**: Whitelist-based user access control
- **Inventory Management**: Track products and stock levels
- **Merkle Tree Verification**: Batch verification of sales records
- **Blockchain Integration**: Deployed on Lisk Sepolia testnet

## Smart Contract

The SecurePOS smart contract is deployed on Lisk Sepolia and provides:

- Sale hash recording with tamper-proof storage
- User role management (Manager, Auditor, Cashier)
- Audit trail with merkle root verification
- Access control and permissions
- Statistical tracking and reporting

### Contract Features

- **Sale Recording**: `recordSaleHash(bytes32 saleHash, uint256 amount)`
- **User Management**: `addUser()`, `removeUser()`, `changeUserRole()`
- **Audit Functions**: `recordAudit()`, `getAuditRecord()`
- **Role Verification**: `isManager()`, `isAuditor()`, `isCashier()`
- **Statistics**: `getStatistics()`, `getSaleCount()`, `totalRevenue()`

## Deployment

### Prerequisites

1. Node.js and npm installed
2. MetaMask or compatible Web3 wallet
3. Lisk Sepolia testnet ETH for deployment

### Smart Contract Deployment

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Add your private key to `.env`:
```
PRIVATE_KEY=your_private_key_here
```

4. Compile the contract:
```bash
npm run compile
```

5. Deploy to Lisk Sepolia:
```bash
npm run deploy:lisk-sepolia
```

6. Update the contract address in your `.env` file:
```
VITE_CONTRACT_ADDRESS=deployed_contract_address_here
```

### Frontend Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred hosting service (Netlify, Vercel, etc.)

## Usage

### For Managers
- Access all POS functions
- Manage users and roles
- View audit dashboard
- Manage inventory
- Generate audit reports

### For Auditors
- View all sales records
- Verify data integrity
- Generate audit reports
- Access blockchain verification

### For Cashiers
- Process sales transactions
- Record sales on blockchain
- View basic sales history

## Network Configuration

The application is configured for Lisk networks:

- **Lisk Sepolia Testnet**: Chain ID 4202
- **Lisk Mainnet**: Chain ID 1135

## Security Features

- **Cryptographic Hashing**: SHA-256 hashing of all sale data
- **Blockchain Storage**: Immutable storage on Lisk network
- **Role-Based Access**: Smart contract enforced permissions
- **Merkle Tree Verification**: Batch verification of records
- **Tamper Detection**: Automatic integrity checking

## Development

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Connect MetaMask to Lisk Sepolia testnet

### Testing

The smart contract includes comprehensive testing for:
- Sale recording functionality
- User management operations
- Role-based access control
- Audit trail verification
- Statistical tracking

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Check the documentation
- Review smart contract code
- Test on Lisk Sepolia testnet first
- Ensure proper wallet configuration

## Roadmap

- [ ] Multi-store support
- [ ] Advanced reporting features
- [ ] Mobile application
- [ ] Integration with existing POS systems
- [ ] Enhanced audit analytics
- [ ] Automated compliance reporting