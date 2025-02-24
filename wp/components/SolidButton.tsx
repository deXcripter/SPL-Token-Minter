function SolidButton({
  text,
  imagePath,
  height = "58",
  radius = "7",
}: {
  text: string;
  imagePath: string;
  height?: string;
  radius?: string;
}) {
  return (
    <button
      className={`w-full h-[${height}px] flex items-center justify-center gap-2 px-4 whitespace-nowrap`}
      style={{
        backgroundColor: "#1F2937",
        borderRadius: `${radius}px`,
        border: "1px solid #374151",
      }}
    >
      <img src={imagePath} alt="" className="w-6 h-6" />
      <span className="text-white">{text}</span>
    </button>
  );
}

export default SolidButton;
