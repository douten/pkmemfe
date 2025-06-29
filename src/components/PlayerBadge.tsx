export const PlayerBadge = ({ playerId }: { playerId: string }) => {
  const displayId = playerId.slice(-4).toLocaleUpperCase();

  return (
    <div className="rounded-sm w-fit h-fit bg-amber-800 py-1 px-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
      <span className="font-bold">{displayId}</span>
    </div>
  );
};
