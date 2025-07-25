export const Button = ({
  label,
  onClick,
  className = "",
  type = "primary",
}: {
  label: string;
  onClick: () => void;
  className?: string;
  type: "primary" | "secondary" | "warning";
}) => {
  const btnStyle = [
    "backdrop-blur-md",
    "bg-white/60",
    `hover:bg-${type === "warning" ? "vermilion" : "hover:bg-saffron"}`,
    "hover:scale-x-105",
    "hover:text-white",
    "cursor-pointer",
    "hover:text-md",
    `text-${type === "warning" ? "vermilion" : "viridian"}`,
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
