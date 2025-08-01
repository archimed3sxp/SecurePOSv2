// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SecurePOS
 * @dev Tamper-Proof Audit System for Retail Operations
 * @author SecurePOS Team
 */
contract SecurePOS {
    // Events
    event SaleRecorded(bytes32 indexed saleHash, uint256 timestamp, address indexed recorder, uint256 amount);
    event UserAdded(address indexed user, Role role, address indexed addedBy);
    event UserRemoved(address indexed user, address indexed removedBy);
    event RoleChanged(address indexed user, Role oldRole, Role newRole, address indexed changedBy);
    event AuditPerformed(address indexed auditor, uint256 timestamp, bytes32 merkleRoot);

    // Enums
    enum Role { NONE, CASHIER, AUDITOR, MANAGER }

    // Structs
    struct Sale {
        bytes32 saleHash;
        uint256 timestamp;
        address recorder;
        uint256 amount;
        bool verified;
    }

    struct User {
        Role role;
        bool active;
        uint256 addedAt;
        address addedBy;
        string name;
    }

    struct AuditRecord {
        uint256 timestamp;
        address auditor;
        bytes32 merkleRoot;
        uint256 salesCount;
    }

    // State variables
    address public owner;
    uint256 public totalSales;
    uint256 public totalRevenue;
    uint256 public auditCount;

    // Mappings
    mapping(address => User) public users;
    mapping(uint256 => Sale) public sales;
    mapping(bytes32 => bool) public recordedHashes;
    mapping(uint256 => AuditRecord) public auditRecords;
    
    // Arrays for enumeration
    address[] public userAddresses;
    bytes32[] public saleHashes;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyManager() {
        require(users[msg.sender].role == Role.MANAGER || msg.sender == owner, "Only managers can perform this action");
        _;
    }

    modifier onlyAuditor() {
        require(users[msg.sender].role == Role.AUDITOR || users[msg.sender].role == Role.MANAGER || msg.sender == owner, "Only auditors can perform this action");
        _;
    }

    modifier onlyCashier() {
        require(
            users[msg.sender].role == Role.CASHIER || 
            users[msg.sender].role == Role.MANAGER || 
            msg.sender == owner, 
            "Only cashiers can perform this action"
        );
        _;
    }

    modifier onlyActiveUser() {
        require(users[msg.sender].active || msg.sender == owner, "User is not active");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        
        // Add owner as manager
        users[owner] = User({
            role: Role.MANAGER,
            active: true,
            addedAt: block.timestamp,
            addedBy: owner,
            name: "Contract Owner"
        });
        userAddresses.push(owner);
    }

    /**
     * @dev Record a sale hash on the blockchain
     * @param _saleHash The hash of the sale data
     * @param _amount The sale amount in wei (for statistics)
     */
    function recordSaleHash(bytes32 _saleHash, uint256 _amount) external onlyCashier onlyActiveUser {
        require(_saleHash != bytes32(0), "Sale hash cannot be empty");
        require(!recordedHashes[_saleHash], "Sale hash already recorded");
        require(_amount > 0, "Sale amount must be greater than 0");

        // Record the sale
        sales[totalSales] = Sale({
            saleHash: _saleHash,
            timestamp: block.timestamp,
            recorder: msg.sender,
            amount: _amount,
            verified: true
        });

        // Update mappings and arrays
        recordedHashes[_saleHash] = true;
        saleHashes.push(_saleHash);
        
        // Update statistics
        totalSales++;
        totalRevenue += _amount;

        emit SaleRecorded(_saleHash, block.timestamp, msg.sender, _amount);
    }

    /**
     * @dev Add a new user to the system
     * @param _user Address of the user to add
     * @param _role Role to assign to the user
     * @param _name Name of the user (optional)
     */
    function addUser(address _user, Role _role, string memory _name) external onlyManager onlyActiveUser {
        require(_user != address(0), "Invalid user address");
        require(_role != Role.NONE, "Invalid role");
        require(!users[_user].active, "User already exists");

        users[_user] = User({
            role: _role,
            active: true,
            addedAt: block.timestamp,
            addedBy: msg.sender,
            name: _name
        });

        userAddresses.push(_user);
        emit UserAdded(_user, _role, msg.sender);
    }

    /**
     * @dev Remove a user from the system
     * @param _user Address of the user to remove
     */
    function removeUser(address _user) external onlyManager onlyActiveUser {
        require(_user != address(0), "Invalid user address");
        require(_user != owner, "Cannot remove contract owner");
        require(users[_user].active, "User does not exist or already inactive");

        users[_user].active = false;
        emit UserRemoved(_user, msg.sender);
    }

    /**
     * @dev Change a user's role
     * @param _user Address of the user
     * @param _newRole New role to assign
     */
    function changeUserRole(address _user, Role _newRole) external onlyManager onlyActiveUser {
        require(_user != address(0), "Invalid user address");
        require(_user != owner, "Cannot change owner role");
        require(users[_user].active, "User does not exist or is inactive");
        require(_newRole != Role.NONE, "Invalid role");

        Role oldRole = users[_user].role;
        users[_user].role = _newRole;
        
        emit RoleChanged(_user, oldRole, _newRole, msg.sender);
    }

    /**
     * @dev Record an audit with merkle root
     * @param _merkleRoot Merkle root of all sales at time of audit
     */
    function recordAudit(bytes32 _merkleRoot) external onlyAuditor onlyActiveUser {
        require(_merkleRoot != bytes32(0), "Merkle root cannot be empty");

        auditRecords[auditCount] = AuditRecord({
            timestamp: block.timestamp,
            auditor: msg.sender,
            merkleRoot: _merkleRoot,
            salesCount: totalSales
        });

        auditCount++;
        emit AuditPerformed(msg.sender, block.timestamp, _merkleRoot);
    }

    /**
     * @dev Get sale by index
     * @param _index Index of the sale
     * @return Sale data
     */
    function getSale(uint256 _index) external view returns (Sale memory) {
        require(_index < totalSales, "Sale index out of bounds");
        return sales[_index];
    }

    /**
     * @dev Get sale hash by index
     * @param _index Index of the sale
     * @return Sale hash
     */
    function getSaleHash(uint256 _index) external view returns (bytes32) {
        require(_index < totalSales, "Sale index out of bounds");
        return sales[_index].saleHash;
    }

    /**
     * @dev Get user information
     * @param _user Address of the user
     * @return User data
     */
    function getUser(address _user) external view returns (User memory) {
        return users[_user];
    }

    /**
     * @dev Check if user has specific role
     * @param _user Address of the user
     * @param _role Role to check
     * @return True if user has the role
     */
    function hasRole(address _user, Role _role) external view returns (bool) {
        return users[_user].active && users[_user].role == _role;
    }

    /**
     * @dev Check if user is manager
     * @param _user Address of the user
     * @return True if user is manager
     */
    function isManager(address _user) external view returns (bool) {
        return _user == owner || (users[_user].active && users[_user].role == Role.MANAGER);
    }

    /**
     * @dev Check if user is auditor
     * @param _user Address of the user
     * @return True if user is auditor
     */
    function isAuditor(address _user) external view returns (bool) {
        return _user == owner || (users[_user].active && (users[_user].role == Role.AUDITOR || users[_user].role == Role.MANAGER));
    }

    /**
     * @dev Check if user is cashier
     * @param _user Address of the user
     * @return True if user is cashier
     */
    function isCashier(address _user) external view returns (bool) {
        return _user == owner || (users[_user].active && (users[_user].role == Role.CASHIER || users[_user].role == Role.MANAGER));
    }

    /**
     * @dev Get total number of sales
     * @return Total sales count
     */
    function getSaleCount() external view returns (uint256) {
        return totalSales;
    }

    /**
     * @dev Get total number of users
     * @return Total users count
     */
    function getUserCount() external view returns (uint256) {
        return userAddresses.length;
    }

    /**
     * @dev Get all sale hashes (for audit purposes)
     * @return Array of all sale hashes
     */
    function getAllSaleHashes() external view onlyAuditor returns (bytes32[] memory) {
        return saleHashes;
    }

    /**
     * @dev Get sales in range (for pagination)
     * @param _start Start index
     * @param _count Number of sales to return
     * @return Array of sales
     */
    function getSalesInRange(uint256 _start, uint256 _count) external view returns (Sale[] memory) {
        require(_start < totalSales, "Start index out of bounds");
        
        uint256 end = _start + _count;
        if (end > totalSales) {
            end = totalSales;
        }
        
        Sale[] memory result = new Sale[](end - _start);
        for (uint256 i = _start; i < end; i++) {
            result[i - _start] = sales[i];
        }
        
        return result;
    }

    /**
     * @dev Get audit record by index
     * @param _index Index of the audit record
     * @return Audit record data
     */
    function getAuditRecord(uint256 _index) external view returns (AuditRecord memory) {
        require(_index < auditCount, "Audit index out of bounds");
        return auditRecords[_index];
    }

    /**
     * @dev Get contract statistics
     * @return totalSales, totalRevenue, auditCount, userCount
     */
    function getStatistics() external view returns (uint256, uint256, uint256, uint256) {
        return (totalSales, totalRevenue, auditCount, userAddresses.length);
    }

    /**
     * @dev Verify if a sale hash exists
     * @param _saleHash Hash to verify
     * @return True if hash exists
     */
    function verifySaleHash(bytes32 _saleHash) external view returns (bool) {
        return recordedHashes[_saleHash];
    }

    /**
     * @dev Emergency function to pause contract (only owner)
     */
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause if needed
        // This is a placeholder for future emergency functionality
    }

    /**
     * @dev Transfer ownership (only current owner)
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner address");
        require(_newOwner != owner, "New owner is the same as current owner");
        
        // Add new owner as manager
        users[_newOwner] = User({
            role: Role.MANAGER,
            active: true,
            addedAt: block.timestamp,
            addedBy: owner,
            name: "New Contract Owner"
        });
        
        userAddresses.push(_newOwner);
        owner = _newOwner;
    }
}