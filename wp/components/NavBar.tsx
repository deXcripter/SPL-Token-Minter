"use client";

import { getMinimumBalanceForRentExemptAccount } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModal,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function NavBar() {
  // const connection = new Connection(clusterApiUrl("devnet"));
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [solBalance, setSolBalance] = useState(0);

  useEffect(() => {
    setBalance();
  }, [connected]);

  const connetionErr = () => {
    if (!connection || !publicKey) return true;
    toast.error("Please connect your wallet");
    return false;
  };

  const createMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (connetionErr()) return;

    try {
      const tokenMint = Keypair.generate();
      const lamports = await token.getMinimumBalanceForRentExemptAccount(
        connection
      );
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey!,
          newAccountPubkey: tokenMint.publicKey,
          space: token.MINT_SIZE,
          lamports,
          programId: token.TOKEN_PROGRAM_ID,
        }),
        token.createInitializeMintInstruction(
          tokenMint.publicKey,
          6,
          publicKey!,
          null,
          token.TOKEN_PROGRAM_ID
        )
      );

      const signature = await sendTransaction(transaction, connection, {
        signers: [tokenMint],
      });
    } catch (error) {}

    //
  };

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
          <p className="bg-purple-800 px-5 py-2.5 rounded-sm font-bold">
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
