"use client";
import GradientButton from "@/components/GradientButton";
import SolidButton from "@/components/SolidButton";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RocketLaunchIcon, WalletIcon } from "@heroicons/react/24/outline";

function Home() {
  const router = useRouter();

  const mintNavigate = () => router.push("/mint");
  const airdropNavigate = () => router.push("/collection");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-8 mx-auto">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent mb-6"
            >
              Create & Launch
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Your Web3 Token
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Transform your ideas into blockchain assets in seconds. Zero
              coding required. Instant liquidity and community-ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <GradientButton
                text="Start Minting"
                handleClick={mintNavigate}
                icon={<RocketLaunchIcon className="h-5 w-5" />}
              />
              <SolidButton
                text="Your Collection"
                handleClick={airdropNavigate}
                icon={<WalletIcon className="h-5 w-5" />}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 opacity-60"
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
