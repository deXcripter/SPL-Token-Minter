"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import * as token from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";

function CreateTokenAccount({
  mintAddress,
  tokenAcct,
}: {
  mintAddress: PublicKey;
  tokenAcct: string;
}) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [accTx, setAccTx] = useState("");
  const [accAddr, setAccAddr] = useState<PublicKey | null>(null);

  const connectionErr = () => {
    if (!connection || !publicKey) return true;
    return false;
  };

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (connectionErr()) return toast.error("Please connect your wallet");

    const account = Keypair.generate();
    const space = token.MINT_SIZE;
    const lamports = await token.getMinimumBalanceForRentExemptAccount(
      connection
    );
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey!,
        newAccountPubkey: account.publicKey,
        space,
        lamports,
        programId: token.TOKEN_PROGRAM_ID,
      }),
      token.createInitializeAccountInstruction(
        account.publicKey,
        mintAddress,
        publicKey!,
        token.TOKEN_PROGRAM_ID
      )
    );

    const signature = await sendTransaction(transaction, connection, {
      signers: [account],
    });
    setAccTx(signature);
    setAccAddr(account.publicKey);
  };

  const acctOutputs = [
    {
      title: "Token Account Address",
      dependency: accAddr,
      href: accAddr
        ? `https://explorer.solana.com/address/${accAddr.toBase58()}?cluster=devnet`
        : "",
    },
    {
      title: "Account Tx Signature",
      dependency: accAddr,
      href: accTx
        ? `https://explorer.solana.com/tx/${accTx}?cluster=devnet`
        : "",
    },
  ];
  return <div></div>;
}

export default CreateTokenAccount;
