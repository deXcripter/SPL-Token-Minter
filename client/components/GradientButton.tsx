function GradientButton({
  text,
  imagePath,
  height = "58",
  radius = "7",
  handleClick,
  isDisabled,
}: {
  text: string;
  imagePath: string;
  height?: string;
  radius?: string;
  isDisabled?: boolean;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className={`w-full h-[${height}px] flex items-center justify-center gap-2 px-4 whitespace-nowrap`}
      style={{
        background: "linear-gradient(to right, #EC4899, #8B5CF6)",
        borderRadius: `${radius}px`,
      }}
      onClick={handleClick}
      disabled={isDisabled}
    >
      <img src={imagePath} alt="" />
      <span>{text}</span>
    </button>
  );
}

export default GradientButton;
