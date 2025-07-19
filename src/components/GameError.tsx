import { Button } from "./Button";

interface GameErrorProps {
  error: string;
  onBackToHome: () => void;
}

export const GameError = ({ error, onBackToHome }: GameErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 gap-2">
      <h3 className="text-7xl mb-4">⚠️</h3>
      <p className="text-vermilion mb-3 text-center">{error}</p>
      <Button label="Back to Home" onClick={onBackToHome} />
    </div>
  );
};
