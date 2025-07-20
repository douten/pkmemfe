import { useNavigate } from "react-router";
import { Button } from "./Button";

interface LoadingScreenProps {
  message?: string;
  progress?: number;
  total?: number;
}

export const LoadingScreen = ({
  message = "Loading game...",
  progress,
  total,
}: LoadingScreenProps) => {
  const showProgress = progress !== undefined && total !== undefined;
  const percentage = showProgress ? (progress / total) * 100 : 0;
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center flex-col gap-1 sm:my-3 p-7">
      <div className="text-lg mb-3">{message}</div>
      {showProgress && (
        <div className="w-64 h-2 bg-gray animate-pulse rounded-gray overflow-hidden">
          <div
            className="h-full bg-cerulean transition-all duration-100"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
      <Button
        label="Cancel"
        onClick={() => navigate("/")}
        className="mt-3 max-w-xs"
      />
    </div>
  );
};
