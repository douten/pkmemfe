export const PlayerBadge = ({
  playerId,
  size,
}: {
  playerId: string;
  size?: "sm" | "md" | "lg";
}) => {
  const displayId = playerId.slice(-4).toLocaleUpperCase();

  const sizeClasses = {
    sm: "text-xs py-[1px] px-[5px]",
    md: "text-sm py-[2px] px-[6px]",
    lg: "text-md py-[3px] px-[8px]",
  };
  const sizeClass = size ? sizeClasses[size] : sizeClasses.md;
  return (
    <div
      className={`rounded-sm w-fit h-fit bg-viridian ${sizeClass} text-center text-white shadow-sm`}
    >
      <span className="whitespace-nowrap">PLAYER {displayId}</span>
    </div>
  );
};
