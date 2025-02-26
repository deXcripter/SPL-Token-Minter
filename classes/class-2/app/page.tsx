"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Home() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(0);
  const [solBalanceLoading, setSolBalanceLoading] = useState(false);
  const [receipientAddress, setReceipientAddress] = useState<string>("");
  const [transferAmount, setTransfrAmount] = useState<string>("");
  const [sendingTransaction, setSendingTransaction] = useState(false);

  const connection = new Connection("https://api.devnet.solana.com");

  useEffect(() => {
    setBalance();
  }, [connected]);

  const setBalance = async () => {
    if (!publicKey) return;
    const conn = await connection.getBalance(publicKey);
    setSolBalance(conn / LAMPORTS_PER_SOL);
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

  const sendSol = async () => {
    if (!publicKey) return;
    if (receipientAddress)
      return toast.error("Please enter receipient address");
    setSendingTransaction(true);

    try {
      const tx = new Transaction();

      tx.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(receipientAddress),
          lamports: parseInt(transferAmount) * 1e9,
        })
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");

      tx.feePayer = publicKey;
      tx.recentBlockhash = blockhash;

      const signature = await sendTransaction(tx, connection);
      console.log("Transaction Signature:", signature);

      await connection.confirmTransaction(
        { blockhash, signature, lastValidBlockHeight },
        "confirmed"
      );

      toast.success(`Transaction completed: ${signature}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSendingTransaction(false);
      setBalance();
    }
  };

  return (
    <div className="h-screen w-[100vw]  flex justify-center items-center">
      <section className="w-[40%] h-fit bg-blue-200 py-5 rounded-md text-slate-900">
        <div className="flex justify-between mx-10">
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>

        <div className="flex p-10">
          <h1 className="text-2xl">
            Wallet Balance:
            {connected
              ? solBalance?.toString() + " sol"
              : "Wallet not Connected"}
          </h1>
        </div>
        <div className={`px-10`}>
          <button
            onClick={recieveSol}
            disabled={!connected}
            className={` px-5 py-2 rounded-md ${
              connected ? "bg-red-300" : "cursor-not-allowed bg-slate-400"
            }`}
          >
            Recieve Airdrop
          </button>

          <div className="flex flex-col mt-5">
            <input
              type="text"
              placeholder="Receipient Address"
              value={receipientAddress}
              onChange={(e) => setReceipientAddress(e.target.value)}
              className="p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransfrAmount(e.target.value)}
              className="p-2 rounded-md mt-2"
            />
            <button
              onClick={sendSol}
              disabled={sendingTransaction}
              className={`bg-red-300 px-5 py-2 rounded-md mt-2`}
            >
              Send Sol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
