"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SolidButton from "@/components/SolidButton";
import axiosInstance from "@/lib/axios";
import { useWallet } from "@solana/wallet-adapter-react";
import GradientButton from "@/components/GradientButton";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowPathIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface TokenData {
  name: string;
  ticker: string;
  maxSupply: string;
  imageUrl: string;
  mintAddress: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function CollectionPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(false);
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  const handleMint = () => router.push("/mint");

  const fetchCollection = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/wallet/${publicKey?.toBase58()}`);
      setTokens(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch token collection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!connected) {
      toast.error("Please connect your wallet");
      router.push("/");
    } else {
      fetchCollection();
    }
  }, [connected]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 my-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-4"
          >
            Digital Asset Vault
          </motion.h1>

          <div className="flex justify-center gap-4 mb-8">
            <GradientButton
              text="Mint New Token"
              handleClick={handleMint}
              icon={<SparklesIcon className="h-5 w-5" />}
            />
            <SolidButton
              text="Refresh Collection"
              handleClick={fetchCollection}
              icon={<ArrowPathIcon className="h-5 w-5" />}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-gray-800 bg-opacity-40 backdrop-blur-lg border border-gray-700"
                >
                  <Skeleton
                    height={200}
                    borderRadius="1.5rem"
                    baseColor="purple"
                  />
                </div>
              ))}
            </div>
          ) : tokens.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="mb-8 inline-block bg-gray-800 p-8 rounded-3xl">
                <SparklesIcon className="h-24 w-24 text-gray-600 mx-auto" />
                <h3 className="text-2xl text-gray-300 mt-4">
                  Your collection is empty
                </h3>
                <p className="text-gray-500 mt-2">
                  Start by minting your first token
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {tokens.map((tokenItem, idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-600 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative rounded-3xl bg-gray-800 bg-opacity-40 backdrop-blur-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
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
                          <span className="text-green-400">
                            {tokenItem.maxSupply}
                          </span>
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
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollectionPage;
