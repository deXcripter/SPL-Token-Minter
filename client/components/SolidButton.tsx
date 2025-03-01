function SolidButton({
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
                 bg-gray-800 rounded-xl border border-gray-700 hover:border-green-500 
                 transition-all duration-200 text-white font-medium"
      onClick={handleClick}
      disabled={isDisabled}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}

export default SolidButton;
