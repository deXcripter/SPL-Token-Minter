"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Connection } from "@solana/web3.js";
import { useEffect, useState } from "react";

function Home() {
  const { publicKey, sendTransaction } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(0);

  const connection = new Connection("https://api.devnet.solana.com");
  useEffect(() => {
    setBalance();
  });

  const setBalance = async () => {
    if (!publicKey) return;
    const conn = await connection.getBalance(publicKey);
    console.log(conn);
    setSolBalance(conn / 1000000000); // solana has 9 decimal places
  };

  return (
    <div className="h-screen w-[100vw]  flex justify-center items-center">
      <section className="w-[40%] h-[50%] bg-blue-200 py-5 rounded-md text-slate-900">
        <div className="flex justify-between mx-10">
          <WalletMultiButton />
          <WalletDisconnectButton onClick={() => setSolBalance(null)} />
        </div>

        <div>
          <div className="flex p-10">
            <h1 className="text-2xl">
              Wallet Balance: {solBalance?.toString() || "Connect Wallet"}
            </h1>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
