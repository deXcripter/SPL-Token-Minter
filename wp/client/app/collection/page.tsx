"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SolidButton from "@/components/SolidButton";
import axiosInstance from "@/lib/axios";
import { useWallet } from "@solana/wallet-adapter-react";
import GradientButton from "@/components/GradientButton";
import { useRouter } from "next/navigation";

interface TokenData {
  name: string;
  ticker: string;
  maxSupply: string;
  imageUrl: string;
  mintAddress: string;
}

function CollectionPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  const handleMint = () => {
    router.push("/mint");
  };

  const fetchCollection = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/wallet/${publicKey?.toBase58()}`);

      if (!res.data) throw new Error("Failed to fetch tokens");
      setTokens(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch token collection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!connected) {
      toast.error("Please connect your wallet to view your collection");
      router.push("/");
    }
    fetchCollection();
  }, [connected]);

  return (
    <div className="py-5 min-h-screen w-full flex flex-col items-center bg-gradient-to-r from-black to-gray-900">
      <h2 className="text-white text-3xl font-bold mb-6">
        My Token Collection
      </h2>

      {loading ? (
        <p className="text-white">Loading tokens...</p>
      ) : tokens.length === 0 ? (
        <p className="text-white">No minted tokens found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          {tokens.map((tokenItem, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl shadow-lg border border-green-500 bg-gray-900 bg-opacity-50 text-gray-300"
            >
              <div className="flex flex-col items-center gap-4">
                {tokenItem.imageUrl ? (
                  <img
                    src={tokenItem.imageUrl}
                    alt={tokenItem.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 bg-gray-700 flex items-center justify-center rounded-full">
                    <span className="text-white">No image</span>
                  </div>
                )}
                <h2 className="text-green-500 font-bold text-2xl">
                  {tokenItem.name}
                </h2>
              </div>

              {/* Token details card */}
              <div className="bg-gray-800 rounded-xl p-4 mt-6">
                <div className="flex justify-between text-lg">
                  <p>Token Name:</p>
                  <p className="text-green-400">{tokenItem.name}</p>
                </div>
                <div className="flex justify-between text-lg">
                  <p>Token Symbol:</p>
                  <p className="text-green-400">{tokenItem.ticker}</p>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Supply:</span>
                  <span className="text-green-400">{tokenItem.maxSupply}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <p>Token Address:</p>
                  <a
                    href={`https://explorer.solana.com/address/${tokenItem.mintAddress}?cluster=devnet`}
                    className="text-green-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View in explorer
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-6 pt-6">
        <SolidButton
          imagePath="play-btn.png"
          text="Refresh"
          handleClick={fetchCollection}
        />
        <GradientButton
          imagePath=""
          text="Mint new tokens"
          handleClick={handleMint}
        />
      </div>
    </div>
  );
}

export default CollectionPage;
