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

function Page() {
  const [loading, setLoading] = useState(false);
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

  const connection = new Connection(clusterApiUrl("devnet"));
  const { connected, publicKey, sendTransaction, wallet } = useWallet();

  const connectionErr = () => {
    if (!connected) {
      toast.error("Please connect your wallet");
      return true;
    }
    return false;
  };

  const setTokenMetadata = async (
    mintAddr: PublicKey,
    data: { imageLink: string }
  ) => {
    if (!wallet) return toast.error("Wallet not connected");

    try {
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
            mintAuthority: publicKey!,
            payer: publicKey!,
            updateAuthority: publicKey!,
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

      transaction.feePayer = publicKey!;
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      setJustMinted(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to set token metadata");
    }
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
      console.log(`Setting the account address to ${account.publicKey}`);
      await mintToken(mintAddr, account.publicKey);
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

      const data = new FormData();
      data.append("name", formData.name);
      data.append("ticker", formData.ticker);
      data.append("maxSupply", formData.maxSupply);
      if (formData.image) data.append("image", formData.image);
      data.append("address", publicKey!.toBase58());
      data.append("mintAddress", accAddr.toBase58());

      const res = await axiosInstance.post("/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await setTokenMetadata(mintAddr, { imageLink: res.data.data.imageUrl });
      toast.success("Token minted successfully");
      setMintTokenTxSignature(signature);
    } catch (err) {
      console.error(err);
      toast.error("Error minting token");
    }
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

    try {
      setLoading(true);
      await createMint();
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
      {!justMinted ? (
        <form
          className="mt-10 w-full max-w-2xl px-10 py-12 rounded-2xl shadow-lg border border-[#1F2937] text-[#9CA3AF]"
          style={{
            backgroundColor: "rgba(17, 24, 39, 0.5)",
          }}
          onSubmit={handleSubmit}
        >
          <h2 className="text-white text-2xl font-bold mb-6">
            Create New Token
          </h2>

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
            <label className="block text-sm font-medium mb-2">
              Token Image
            </label>
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
                  src={preview || ""}
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
      ) : (
        <div
          className="mt-10 w-[40%] max-w-2xl py-10 rounded-2xl shadow-lg border border-[#1F2937] text-[#9CA3AF]"
          style={{
            backgroundColor: "rgba(17, 24, 39, 0.5)",
            border: "1px solid #10b981",
          }}
        >
          <div className="text-center flex flex-col justify-center gap-4">
            <img
              src="div.png"
              alt={formData.name}
              className="h-25 w-25 mx-auto"
            />
            <h2 className="text-[#10B981] font-bold text-3xl">
              Token Minted Sucessfully
            </h2>
            <p>Your token has been created and added to your collection</p>
          </div>
          {/* card */}
          <div className="bg-[#1F2937] rounded-xl overflow-hidden my-8 w-[90%] m-auto">
            {/* <div>
              <img
                src={formData.image}
                alt={`${formData.name} image`}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                }}
              />
            </div> */}
            <div className="flex flex-col gap-1 p-2 px-8">
              <div className="flex gap-5 justify-between">
                <p className="text-2xl">Token Name</p>
                <p className="text-2xl text-green-600">{formData.name}</p>
              </div>
              <div className="flex gap-5 justify-between">
                <p className="text-2xl">Token Symbol</p>
                <p className="text-2xl text-green-600">{formData.ticker}</p>
              </div>
              <div className="flex gap-5 justify-between">
                <span className="text-2xl"> Supply </span>
                <span className="text-2xl text-green-600">
                  {formData.maxSupply}
                </span>
              </div>
              <div className="flex gap-5 justify-between">
                <p className="text-2xl">Token Address</p>
                <a
                  href={`https://explorer.solana.com/address/${accAddr!.toBase58()}?cluster=devnet`}
                  className="text-xl text-green-600"
                  target="_blank"
                >
                  Click to view in explorer
                </a>
              </div>
            </div>
          </div>

          <div className="flex h-14 gap-6 text-white w-[90%] m-auto">
            <SolidButton
              imagePath="share.png"
              text="View in collection"
              handleClick={handleCollectionNav}
            />
            <GradientButton
              text="Mint Another"
              imagePath="Vector.png"
              handleClick={handleNewMint}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
