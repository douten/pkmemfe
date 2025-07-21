export function LoadingPlayerScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full m-8">
      <div className="text-black-text text-center flex items-center gap-1">
        Loading player data
        <div className="flex gap-[2px] justify-end items-center mt-[3px]">
          <span className="sr-only">Loading...</span>
          <div className="h-[5px] w-[5px] bg-black-text rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-[5px] w-[5px] bg-black-text rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-[5px] w-[5px] bg-black-text rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
