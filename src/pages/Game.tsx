import { useContext } from "react";
import { useParams, useNavigate } from "react-router";

// context
import GlobalContext from "../context/globalContext";

// hooks
import { useGameChannel, useImagePreloader } from "@hooks/index";

// components
import { ErrorModal, LoadingScreen } from "@ui/index";
import { GameFinished, GameBoard } from "@c/game/index";

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
    cards,
    flippedCards,
    opponentId,
    turnPlayerId,
    gameError,
    cardImages,
    flipCard,
    concede,
  } = useGameChannel(gameId, playerId);

  const { loadedImages, isLoading } = useImagePreloader(cardImages);

  const handleBackToHome = () => navigate("/");

  // Error state
  if (gameError) {
    return <ErrorModal error={gameError} onClick={handleBackToHome} />;
  }

  // Loading game data
  if (!game) {
    return <LoadingScreen message="Getting Game..." />;
  }

  // Game finished
  if (["finished", "abandoned", "conceded"].includes(game.state)) {
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
      cards={cards}
      flippedCards={flippedCards}
      playerId={playerId}
      opponentId={opponentId}
      turnPlayerId={turnPlayerId}
      onFlipCard={flipCard}
      onConcede={concede}
    />
  );
};
