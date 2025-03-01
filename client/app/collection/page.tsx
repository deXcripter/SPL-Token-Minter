"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

function NavBar() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Fetch balance when publicKey or connection changes
  useEffect(() => {
    if (publicKey && connected) {
      fetchBalance();
    } else {
      setSolBalance(null); // Reset balance when wallet is disconnected
    }
  }, [publicKey, connected]);

  const fetchBalance = async () => {
    if (!publicKey) return;
    setLoadingBalance(true);
    try {
      const balanceInLamports = await connection.getBalance(publicKey);
      const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
      setSolBalance(balanceInSOL);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setSolBalance(null);
    } finally {
      setLoadingBalance(false);
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-md flex justify-between items-center w-full px-6 sm:px-10 py-3 h-16 fixed top-0 left-0 z-50 border-b border-gray-800">
      {/* Logo or Balance Section */}
      <div className="flex items-center gap-4">
        {!connected ? (
          <img
            src="Vector.png"
            height={32}
            width={32}
            alt="Logo"
            className="hover:opacity-80 transition-opacity"
          />
        ) : (
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg shadow-lg">
              {loadingBalance ? (
                <BeatLoader color="#FFFFFF" size={8} />
              ) : (
                <p className="text-white font-medium text-sm sm:text-base">
                  Balance: {solBalance !== null ? solBalance.toFixed(2) : "N/A"}{" "}
                  SOL
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Wallet Buttons */}
      <div className="flex gap-3 sm:gap-4">
        <WalletMultiButton className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-purple-500/20" />
        {connected && (
          <WalletDisconnectButton className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-red-500/20" />
        )}
      </div>
    </div>
  );
}

export default NavBar;
