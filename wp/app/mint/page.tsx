"use client";

import { useState } from "react";
import GradientButton from "@/components/GradientButton";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { getMinimumBalanceForRentExemptAccount } from "@solana/spl-token";
import * as token from "@solana/spl-token";
import { toast } from "react-toastify";

function Page() {
  const [loading, setLoading] = useState(false);
  const [mintSignature, setMintSignature] = useState("");
  const [mintAddress, setMintAddress] = useState<PublicKey | null>(null);
  const [accTx, setAccTx] = useState("");
  const [mintTokenTxSignature, setMintTokenTxSignature] = useState("");
  const [accAddr, setAccAddr] = useState<PublicKey | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    maxSupply: "",
    image: "",
  });

  const connection = new Connection(clusterApiUrl("devnet"));
  const { connected, publicKey, sendTransaction } = useWallet();

  const connectionErr = () => {
    if (!connected) {
      toast.error("Please connect your wallet");
      return true;
    }
    return false;
  };

  const createMint = async () => {
    if (connectionErr()) {
      setLoading(false);
      return;
    }

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

      await connection.confirmTransaction(signature);

      toast.done("Token minted successfully");
      setMintAddress(new PublicKey(tokenMint.publicKey.toBase58()));
      console.log(
        `Setting the mint address to ${new PublicKey(
          tokenMint.publicKey.toBase58()
        )}`
      );
      setMintSignature(signature);
      await createTokenAccount(new PublicKey(tokenMint.publicKey.toBase58()));
    } catch (error) {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          image: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const createTokenAccount = async (mintAddr: PublicKey) => {
    if (connectionErr()) return toast.error("Please connect your wallet");
    if (!mintAddr) throw new Error("No Mint Address");

    try {
      const account = Keypair.generate();
      const space = token.ACCOUNT_SIZE;
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
          mintAddr,
          publicKey!,
          token.TOKEN_PROGRAM_ID
        )
      );

      const signature = await sendTransaction(transaction, connection, {
        signers: [account],
      });
      await connection.confirmTransaction(signature);
      setAccTx(signature);
      setAccAddr(account.publicKey);
      await mintToken(mintAddr, account.publicKey);
      console.log(`Setting the account address to ${account.publicKey}`);
    } catch (err) {
      console.error(err);
      toast.error("Error creating token account");
    }
  };

  const mintToken = async (mintAddr: PublicKey, accAddr: PublicKey) => {
    if (connectionErr()) return;

    if (!publicKey) return toast.error("No public key found");

    try {
      const transaction = new Transaction().add(
        token.createMintToInstruction(
          mintAddr,
          accAddr,
          publicKey,
          parseInt(formData.maxSupply) * 10 ** 6
        )
      );

      transaction.feePayer = publicKey;
      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature);
      toast.success("Token minted successfully");
      setMintTokenTxSignature(signature);
    } catch (err) {
      console.error(err);
      toast.error("Error minting token");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.image ||
      !formData.maxSupply ||
      !formData.name ||
      !formData.ticker
    ) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);
      await createMint();
      // TODO : Handle form submission to be here
      console.log("Form Data:", formData);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #000000, #111827)",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="py-5"
    >
      {/* Form Section */}
      <form
        className="mt-10 w-full max-w-2xl px-10 py-12 rounded-2xl shadow-lg border border-[#1F2937] text-[#9CA3AF]"
        style={{
          backgroundColor: "rgba(17, 24, 39, 0.5)",
        }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-white text-2xl font-bold mb-6">Create New Token</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Token Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter token name (e.g. My Awesome Token)"
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Ticker Symbol
          </label>
          <input
            type="text"
            name="ticker"
            placeholder="Enter ticker (e.g. MAWS)"
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={5}
            value={formData.ticker}
            onChange={handleInputChange}
            required
          />
          <p className="text-xs mt-1 text-gray-400">Max 5 characters</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Max Supply</label>
          <input
            type="number"
            name="maxSupply"
            placeholder="Enter total supply (e.g. 1000000)"
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            value={formData.maxSupply}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Token Image</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <span className="sr-only">Choose token logo</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                Upload Image
              </div>
            </label>
            {formData.image && (
              <img
                src={formData.image}
                alt="Token preview"
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
          </div>
          <p className="text-xs mt-1 text-gray-400">
            Recommended size: 256x256px
          </p>
        </div>

        <div className="w-full h-[3rem] text-white flex">
          {!loading ? (
            <GradientButton
              imagePath="Vector.png"
              text="Create Token"
              height="58"
            />
          ) : (
            "Loading"
          )}
        </div>
      </form>
    </div>
  );
}

export default Page;
