"use client"
import React, { useState } from "react";

export function useMetaMask() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    setConnecting(true);
    setError(null);
    try {
      if (!window.ethereum) {
        setError("MetaMask not found. Please install MetaMask.");
        setConnecting(false);
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (err: any) {
      setError(err?.message || "Connection failed");
    } finally {
      setConnecting(false);
    }
  };

  return { account, connect, error, connecting };
}

export default function MetaMaskConnectButton({ className = "" }: { className?: string }) {
  const { account, connect, error, connecting } = useMetaMask();
  return (
    <div className={className}>
      {account ? (
        <span className="text-green-600 font-mono">Connected: {account.slice(0, 6)}...{account.slice(-4)}</span>
      ) : (
        <button onClick={connect} className="btn btn-primary" disabled={connecting}>
          {connecting ? "Connecting..." : "Connect MetaMask"}
        </button>
      )}
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}