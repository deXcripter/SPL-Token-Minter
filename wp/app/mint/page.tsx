import GradientButton from "@/components/GradientButton";

function Page() {
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
      {/* Form Section */}
      <form
        className="mt-10 w-full max-w-2xl px-10 py-12 rounded-2xl shadow-lg border border-[#1F2937] text-[#9CA3AF]"
        style={{
          backgroundColor: "rgba(17, 24, 39, 0.5)",
        }}
      >
        <h2 className="text-white text-2xl font-bold mb-6">Create New Token</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Token Name</label>
          <input
            type="text"
            placeholder="Enter token name (e.g. My Awesome Token)"
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Ticker Symbol
          </label>
          <input
            type="text"
            placeholder="Enter ticker (e.g. MAWS)"
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={5}
            required
          />
          <p className="text-xs mt-1 text-gray-400">Max 5 characters</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Max Supply</label>
          <input
            type="number"
            placeholder="Enter total supply (e.g. 1000000)"
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Token Image</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <span className="sr-only">Choose token logo</span>
              <input type="file" className="hidden" accept="image/*" />
              <div className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
                Upload Image
              </div>
            </label>
          </div>
          <p className="text-xs mt-1 text-gray-400">
            Recommended size: 256x256px
          </p>
        </div>

        <div className="w-full h-[3rem] text-white flex">
          <GradientButton
            imagePath="Vector.png"
            text="Create Token"
            height="58"
          />
        </div>
      </form>
    </div>
  );
}

export default Page;
