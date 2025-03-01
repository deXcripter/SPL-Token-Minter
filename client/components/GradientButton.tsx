function GradientButton({
  text,
  icon,
  handleClick,
  isDisabled,
}: {
  text: string;
  icon?: React.ReactNode;
  isDisabled?: boolean;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className="w-full h-14 flex items-center justify-center gap-2 px-6 whitespace-nowrap 
                 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl hover:opacity-90 
                 transition-opacity duration-200 text-white font-medium"
      onClick={handleClick}
      disabled={isDisabled}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}

export default GradientButton;
