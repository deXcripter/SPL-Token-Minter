"use client";
import GradientButton from "@/components/GradientButton";
import SolidButton from "@/components/SolidButton";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  const mintNavigate = () => {
    router.push("/mint");
  };

  const airdropNavigate = () => {
    router.push("/collection");
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
    >
      {/* Hero Section */}
      <div className="w-[65%] h-fit py-28 px-10">
        <h1 className="text-6xl font-bold text-center">
          Create & Launch
          <br />
          your own crypto token in seconds
        </h1>
        <p className="py-6 text-center">
          Turn your idea into a tradable asset in seconds. No code needed.
          Instant liquidity and social sharing.
        </p>
        <div className="flex gap-4 h-14 w-fit mx-auto">
          <GradientButton
            text="Start Minting"
            imagePath="rocket.png"
            handleClick={mintNavigate}
          />
          <SolidButton
            imagePath="play-btn.png"
            text="Your Tokens"
            handleClick={airdropNavigate}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
