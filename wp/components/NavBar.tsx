"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModal,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

function NavBar() {
  const connection = new Connection(clusterApiUrl("devnet"));
  const { publicKey, sendTransaction, connected } = useWallet();
  const [solBalance, setSolBalance] = useState(0);

  useEffect(() => {
    setBalance();
  }, [connected]);

  const setBalance = async () => {
    if (!publicKey) return;
    const conn = await connection.getBalance(publicKey);
    setSolBalance((conn * 2) / LAMPORTS_PER_SOL);
  };
  return (
    <div className="bg-black flex justify-between items-center w-full px-10 py-1 h-16 fixed top-0 left-0 z-50 border-b border-[#1F2937] border-solid">
      <div>
        {!connected ? (
          <img src="Vector.png" height={24} width={24} alt="Logo" />
        ) : (
          <p className="bg-purple-800 px-5 py-2.5 rounded- font-bold">
            Balance: {solBalance} Sol
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
    </div>
  );
}

export default NavBar;
