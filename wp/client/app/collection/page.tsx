"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GradientButton from "@/components/GradientButton";
import SolidButton from "@/components/SolidButton";

interface TokenData {
  name: string;
  ticker: string;
  maxSupply: string;
  image?: string;
  mintAddress: string;
}

function CollectionPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCollection = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://backend.com/api/collection/");
      if (!res.ok) {
        throw new Error("Failed to fetch tokens");
      }
      const data = await res.json();
      setTokens(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch token collection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

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
      <h2 className="text-white text-3xl font-bold mb-6">
        My Token Collection
      </h2>

      {loading ? (
        <p className="text-white">Loading tokens...</p>
      ) : tokens.length === 0 ? (
        <p className="text-white">No minted tokens found.</p>
      ) : (
        tokens.map((tokenItem, idx) => (
          <div
            key={idx}
            className="mt-10 w-[40%] max-w-2xl py-10 rounded-2xl shadow-lg border border-[#1F2937] text-[#9CA3AF]"
            style={{
              backgroundColor: "rgba(17, 24, 39, 0.5)",
              border: "1px solid #10b981",
            }}
          >
            <div className="text-center flex flex-col justify-center gap-4">
              {tokenItem.image ? (
                <img
                  src={tokenItem.image}
                  alt={tokenItem.name}
                  className="h-25 w-25 mx-auto"
                />
              ) : (
                <div className="h-25 w-25 mx-auto bg-gray-700 flex items-center justify-center">
                  <span className="text-white">No Image</span>
                </div>
              )}
              <h2 className="text-[#10B981] font-bold text-3xl">
                {tokenItem.name}
              </h2>
              <p>Your token has been minted.</p>
            </div>
            {/* Token details card */}
            <div className="bg-[#1F2937] rounded-xl overflow-hidden my-8 w-[90%] m-auto">
              <div className="flex flex-col gap-1 p-2 px-8">
                <div className="flex gap-5 justify-between">
                  <p className="text-2xl">Token Name:</p>
                  <p className="text-2xl text-green-600">{tokenItem.name}</p>
                </div>
                <div className="flex gap-5 justify-between">
                  <p className="text-2xl">Token Symbol:</p>
                  <p className="text-2xl text-green-600">{tokenItem.ticker}</p>
                </div>
                <div className="flex gap-5 justify-between">
                  <span className="text-2xl">Supply:</span>
                  <span className="text-2xl text-green-600">
                    {tokenItem.maxSupply}
                  </span>
                </div>
                <div className="flex gap-5 justify-between">
                  <p className="text-2xl">Token Address:</p>
                  <a
                    href={`https://explorer.solana.com/address/${tokenItem.mintAddress}?cluster=devnet`}
                    className="text-xl text-green-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View in explorer
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <div className="flex gap-6 mt-6">
        <SolidButton
          imagePath="refresh.png"
          text="Refresh"
          handleClick={fetchCollection}
        />
      </div>
    </div>
  );
}

export default CollectionPage;
