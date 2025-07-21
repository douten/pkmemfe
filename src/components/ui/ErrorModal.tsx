import { Button } from "@ui/Button";

interface ErrorModalProps {
  error: string;
  buttonLabel?: string;
  onClick: () => void;
}

export const ErrorModal = ({
  error,
  buttonLabel = "Retry",
  onClick,
}: ErrorModalProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h3 className="text-7xl mb-4">⚠️</h3>
      <p className="text-vermilion mb-3 text-center">{error}</p>
      <Button label={buttonLabel} onClick={onClick} />
    </div>
  );
};
