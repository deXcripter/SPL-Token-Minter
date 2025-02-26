"use client";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

function Home() {
  return (
    <div className="bg-slate-200 min-h-screen px-[20%]">
      <div>
        
        <h1 className="text-5xl text-blue-600 font-bold">
          Solana Wallet Connect
        </h1>
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
    </div>
  );
}

export default Home;
