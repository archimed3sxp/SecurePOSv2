import { Sale, AuditRecord } from '../types';
import { User, InventoryItem, WhitelistEntry } from '../types';

const SALES_KEY = 'pos_sales';
const AUDIT_KEY = 'pos_audit_records';
const USERS_KEY = 'pos_users';
const INVENTORY_KEY = 'pos_inventory';
const WHITELIST_KEY = 'pos_whitelist';

export const saveSale = (sale: Sale): void => {
  const sales = getSales();
  sales.push(sale);
  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
};

export const getSales = (): Sale[] => {
  const sales = localStorage.getItem(SALES_KEY);
  return sales ? JSON.parse(sales) : [];
};

export const getSaleById = (id: string): Sale | null => {
  const sales = getSales();
  return sales.find(sale => sale.id === id) || null;
};

export const saveAuditRecord = (record: AuditRecord): void => {
  const records = getAuditRecords();
  records.push(record);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(records));
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.address === user.address);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const removeUser = (address: string): void => {
  const users = getUsers().filter(user => user.address !== address);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const saveInventoryItem = (item: InventoryItem): void => {
  const items = getInventoryItems();
  const existingIndex = items.findIndex(i => i.id === item.id);
  if (existingIndex >= 0) {
    items[existingIndex] = item;
  } else {
    items.push(item);
  }
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
};

export const getInventoryItems = (): InventoryItem[] => {
  const items = localStorage.getItem(INVENTORY_KEY);
  return items ? JSON.parse(items) : [];
};

export const removeInventoryItem = (id: string): void => {
  const items = getInventoryItems().filter(item => item.id !== id);
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
};

export const saveWhitelistEntry = (entry: WhitelistEntry): void => {
  const whitelist = getWhitelist();
  const existingIndex = whitelist.findIndex(w => w.address === entry.address);
  if (existingIndex >= 0) {
    whitelist[existingIndex] = entry;
  } else {
    whitelist.push(entry);
  }
  localStorage.setItem(WHITELIST_KEY, JSON.stringify(whitelist));
};

export const getWhitelist = (): WhitelistEntry[] => {
  const whitelist = localStorage.getItem(WHITELIST_KEY);
  return whitelist ? JSON.parse(whitelist) : [];
};

export const removeWhitelistEntry = (address: string): void => {
  const whitelist = getWhitelist().filter(entry => entry.address !== address);
  localStorage.setItem(WHITELIST_KEY, JSON.stringify(whitelist));
};

export const isWhitelisted = (address: string, role: 'manager' | 'auditor' | 'cashier'): boolean => {
  const whitelist = getWhitelist();
  return whitelist.some(entry => entry.address.toLowerCase() === address.toLowerCase() && entry.role === role);
};

export const getAuditRecords = (): AuditRecord[] => {
  const records = localStorage.getItem(AUDIT_KEY);
  return records ? JSON.parse(records) : [];
};

export const clearAllData = (): void => {
  localStorage.removeItem(SALES_KEY);
  localStorage.removeItem(AUDIT_KEY);
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(INVENTORY_KEY);
  localStorage.removeItem(WHITELIST_KEY);
};