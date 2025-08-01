import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { DEFAULT_NETWORK } from '../config/networks';

export const useWallet = () => {
  const [account, setAccount] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      setIsConnecting(true);
      
      // Request account access - NO AUTOMATIC TRANSFERS
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Switch to Lisk network if not already connected
      if (Number(network.chainId) !== DEFAULT_NETWORK.chainId) {
        await switchNetwork();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // Check if user rejected the request
      if ((error as any).code === 4001) {
        alert('Wallet connection rejected by user.');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${DEFAULT_NETWORK.chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Network not added, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${DEFAULT_NETWORK.chainId.toString(16)}`,
                chainName: DEFAULT_NETWORK.name,
                rpcUrls: [DEFAULT_NETWORK.rpcUrl],
                blockExplorerUrls: [DEFAULT_NETWORK.blockExplorer],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setChainId(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16));
      });

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet();
          }
        });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    account,
    provider,
    signer,
    isConnected,
    isConnecting,
    chainId,
    connectWallet,
    disconnectWallet,
    switchNetwork
  };
};