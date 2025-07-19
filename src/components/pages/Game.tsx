import { useContext } from "react";
import { useParams, useNavigate } from "react-router";

// context
import GlobalContext from "../../context/globalContext";

// hooks
import { useGameChannel } from "../../hooks/useGameChannel";
import { useImagePreloader } from "../../hooks/useImagePreloader";

// components
import { GameError } from "../GameError";
import { GameFinished } from "../GameFinished";
import { LoadingScreen } from "../LoadingScreen";
import { GameBoard } from "../GameBoard";

export const Game = () => {
  const { id: gameId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }

  const { player } = context;
  const playerId = player?.id;

  const {
    game,
    opponentId,
    canFlip,
    gameError,
    cardImages,
    flipCard,
    concede,
  } = useGameChannel(gameId, playerId);

  const { loadedImages, isLoading } = useImagePreloader(cardImages);

  const handleBackToHome = () => navigate("/");

  // Error state
  if (gameError) {
    return <GameError error={gameError} onBackToHome={handleBackToHome} />;
  }

  // Loading game data
  if (!game) {
    return <LoadingScreen message="Getting Game..." />;
  }

  // Game finished
  if (game.state === "finished") {
    return (
      <GameFinished
        game={game}
        playerId={playerId}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Loading images
  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading game..."
        progress={loadedImages.length}
        total={cardImages.length}
      />
    );
  }

  // Active game
  return (
    <GameBoard
      game={game}
      playerId={playerId}
      opponentId={opponentId}
      canFlip={canFlip}
      onFlipCard={flipCard}
      onConcede={concede}
    />
  );
};
