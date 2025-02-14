"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Connection } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Home() {
  const { publicKey, sendTransaction } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(0);
  const [solBalanceLoading, setSolBalanceLoading] = useState(false);

  const connection = new Connection("https://api.devnet.solana.com");
  useEffect(() => {
    setBalance();
  });

  const setBalance = async () => {
    if (!publicKey) return;
    const conn = await connection.getBalance(publicKey);
    setSolBalance(conn / 1000000000);
  };

  const recieveSol = async () => {
    setSolBalanceLoading(true);
    try {
      if (!publicKey) return;
      const signature = await connection.requestAirdrop(publicKey, 1000000000);

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });

      setBalance();
    } catch (err: any) {
      toast.error(err.message);
    }
    {
      setSolBalanceLoading(false);
    }
  };

  return (
    <div className="h-screen w-[100vw]  flex justify-center items-center">
      <section className="w-[40%] h-[50%] bg-blue-200 py-5 rounded-md text-slate-900">
        <div className="flex justify-between mx-10">
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>

        <div className="flex p-10">
          <h1 className="text-2xl">
            Wallet Balance:
            {typeof solBalance === "number"
              ? solBalance?.toString() + " sol"
              : "Wallet not Connected"}
          </h1>
        </div>
        <div className="px-10">
          <button
            onClick={recieveSol}
            className="bg-red-300 px-5 py-2 rounded-md"
          >
            Recieve Airdrop
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
