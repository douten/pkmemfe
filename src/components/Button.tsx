export const Button = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  const btnStyle = [
    // "bg-white/05",
    "backdrop-blur-md",
    "hover:bg-saffron",
    "text-viridian",
    "font-bold",
    "uppercase",
    "rounded-lg",
    "py-2",
    "px-4",
    "text-sm",
    "w-full",
  ];

  return (
    <button className={btnStyle.join(" ")} onClick={onClick}>
      {label}
    </button>
  );
};
