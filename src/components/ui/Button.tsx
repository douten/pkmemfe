export const Button = ({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) => {
  const btnStyle = [
    "backdrop-blur-md",
    "bg-white/60",
    "hover:bg-saffron",
    "hover:scale-x-105",
    "hover:text-white",
    "cursor-pointer",
    "hover:text-md",
    "text-viridian",
    "font-bold",
    "uppercase",
    "rounded-lg",
    "py-2",
    "px-4",
    "text-sm",
    "w-full",
    "transition-all",
    "duration-450",
    ...className.split(" "),
  ];

  return (
    <button className={btnStyle.join(" ")} onClick={onClick}>
      {label}
    </button>
  );
};
