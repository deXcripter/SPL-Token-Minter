"use client";

import { useState } from "react";
import GradientButton from "@/components/GradientButton";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import * as token from "@solana/spl-token";
import { toast } from "react-toastify";
import SolidButton from "@/components/SolidButton";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import {
  ArrowLeftIcon,
  PhotoIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

function Page() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const router = useRouter();
  const [mintSignature, setMintSignature] = useState("");
  const [mintAddress, setMintAddress] = useState<PublicKey | null>(null);
  const [accTx, setAccTx] = useState("");
  const [mintTokenTxSignature, setMintTokenTxSignature] = useState("");
  const [accAddr, setAccAddr] = useState<PublicKey | null>(null);
  const [justMinted, setJustMinted] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    ticker: string;
    maxSupply: string;
    image: File | null;
  }>({
    name: "",
    ticker: "",
    maxSupply: "",
    image: null,
  });

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const { connected, publicKey, sendTransaction, wallet } = useWallet();

  const connectionErr = () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet");
      setCurrentStep(null);
      return true;
    }
    return false;
  };

  const setTokenMetadata = async (
    mintAddr: PublicKey,
    data: { imageLink: string }
  ) => {
    if (!wallet || !publicKey) return toast.error("Wallet not connected");

    try {
      setCurrentStep("Setting token metadata...");
      const metadataProgramId = new PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );
      const metadataPDA = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          metadataProgramId.toBuffer(),
          mintAddr.toBuffer(),
        ],
        metadataProgramId
      )[0];

      const transaction = new Transaction().add(
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataPDA,
            mint: mintAddr,
            mintAuthority: publicKey,
            payer: publicKey,
            updateAuthority: publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: formData.name,
                symbol: formData.ticker,
                uri:
                  data.imageLink || "https://example.com/default-metadata.json",
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null,
              },
              isMutable: true,
              collectionDetails: null,
            },
          }
        )
      );

      transaction.feePayer = publicKey;
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      setJustMinted(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to set token metadata");
    } finally {
      setCurrentStep(null);
    }
  };

  const createMintAndTokenAccount = async () => {
    if (connectionErr()) {
      setLoading(false);
      return;
    }

    try {
      setCurrentStep("Creating mint and token account...");
      const tokenMint = Keypair.generate();
      const account = Keypair.generate();
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
        ),
        SystemProgram.createAccount({
          fromPubkey: publicKey!,
          newAccountPubkey: account.publicKey,
          space: token.ACCOUNT_SIZE,
          lamports,
          programId: token.TOKEN_PROGRAM_ID,
        }),
        token.createInitializeAccountInstruction(
          account.publicKey,
          tokenMint.publicKey,
          publicKey!,
          token.TOKEN_PROGRAM_ID
        ),
        token.createMintToInstruction(
          tokenMint.publicKey,
          account.publicKey,
          publicKey!,
          parseInt(formData.maxSupply) * 10 ** 6
        )
      );

      const signature = await sendTransaction(transaction, connection, {
        signers: [tokenMint, account],
      });

      await connection.confirmTransaction(signature);

      toast.done("Token minted successfully");
      setMintAddress(new PublicKey(tokenMint.publicKey.toBase58()));
      setMintSignature(signature);
      setAccAddr(account.publicKey);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("ticker", formData.ticker);
      data.append("maxSupply", formData.maxSupply);
      if (formData.image) data.append("image", formData.image);
      data.append("address", publicKey!.toBase58());
      data.append("mintAddress", account.publicKey.toBase58());

      setCurrentStep("Uploading metadata...");
      const res = await axiosInstance.post("/", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setCurrentStep(`Uploading metadata... ${percentCompleted}%`);
        },
      });
      await setTokenMetadata(tokenMint.publicKey, {
        imageLink: res.data.data.imageUrl,
      });
      toast.success("Token minted successfully");
      setMintTokenTxSignature(signature);
    } catch (error) {
      console.error(error);
      toast.error("Error minting token");
      setCurrentStep(null);
    } finally {
      setLoading(false);
    }
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
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleCollectionNav = () => {
    router.push("/collection");
  };

  const handleNewMint = () => {
    setJustMinted(false);
    setFormData({
      name: "",
      ticker: "",
      maxSupply: "",
      image: null,
    });
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

    if (!connected || !publicKey) {
      return toast.error("Please connect your wallet");
    }

    try {
      setLoading(true);
      await createMintAndTokenAccount();
    } catch (err) {
      setCurrentStep(null);
    }
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center space-y-4">
        <BeatLoader color="#10B981" size={15} />
        <p className="text-emerald-400 text-lg font-medium">{currentStep}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 my-10">
      {currentStep && <LoadingOverlay />}

      <div className="max-w-4xl mx-auto px-4 py-12">
        {!justMinted ? (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">
                Create New Token
              </h1>
              <button
                onClick={() => router.push("/collection")}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Collection
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Token Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="My Awesome Token"
                  className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-100 placeholder-gray-500"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ticker Symbol
                </label>
                <input
                  type="text"
                  name="ticker"
                  placeholder="MAWS"
                  className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-100 placeholder-gray-500 uppercase"
                  maxLength={5}
                  value={formData.ticker}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs mt-2 text-gray-400">Max 5 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Supply
                </label>
                <input
                  type="number"
                  name="maxSupply"
                  placeholder="1000000"
                  className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-100 placeholder-gray-500"
                  min="1"
                  value={formData.maxSupply}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Token Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                      <PhotoIcon className="h-5 w-5 text-gray-400" />
                      <span>Upload Image</span>
                    </div>
                  </label>
                  {preview && (
                    <img
                      src={preview}
                      alt="Token preview"
                      className="w-12 h-12 rounded-lg object-cover border-2 border-gray-600"
                    />
                  )}
                </div>
                <p className="text-xs mt-2 text-gray-400">
                  Recommended size: 256x256px
                </p>
              </div>

              <GradientButton
                text="Create Token"
                handleClick={handleSubmit}
                isDisabled={!!currentStep}
                icon={<SparklesIcon className="h-5 w-5" />}
              />
            </form>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-green-500/20 p-8">
            <div className="text-center">
              <div className="inline-block p-6 rounded-full bg-green-500/10 mb-6">
                <SparklesIcon className="h-12 w-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-4">
                Token Minted Successfully!
              </h2>
              <p className="text-gray-400 mb-8">
                Your token has been created and added to your collection
              </p>

              <div className="bg-gray-700/50 rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Token Name</span>
                    <span className="font-medium text-green-400">
                      {formData.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Token Symbol</span>
                    <span className="font-medium text-green-400">
                      {formData.ticker}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Supply</span>
                    <span className="font-medium text-green-400">
                      {formData.maxSupply}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Token Address</span>
                    <a
                      href={`https://explorer.solana.com/address/${accAddr?.toBase58()}?cluster=devnet`}
                      className="text-green-400 hover:text-green-300 flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Explorer
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <SolidButton
                  text="View Collection"
                  handleClick={handleCollectionNav}
                  icon={<ArrowLeftIcon className="h-5 w-5" />}
                />
                <GradientButton
                  text="Mint Another"
                  handleClick={handleNewMint}
                  icon={<SparklesIcon className="h-5 w-5" />}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
