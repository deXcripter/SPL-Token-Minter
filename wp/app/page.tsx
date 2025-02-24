import GradientButton from "@/components/GradientButton";
import SolidButton from "@/components/SolidButton";

function Home() {
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
          Turn your idea into a tradable asset—no code or experience needed.
          Mint tokens instantly, set up liquidity, and share your creation with
          communities across social and DeFi platforms.
        </p>
        <div className="flex gap-4 h-14 w-fit mx-auto">
          <GradientButton text="Start Creating" imagePath="rocket.png" />
          <SolidButton imagePath="play-btn.png" text="Watch Demo" />
        </div>
      </div>
    </div>
  );
}

export default Home;
