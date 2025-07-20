import { useEffect, useState, useContext, useCallback } from "react";
import GlobalContext from "../context/globalContext";
import type { GameInterface } from "../components/types";

export const useGameChannel = (
  gameId: string | undefined,
  playerId: string | undefined
) => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }

  const { subscribe, unsubscribe, send } = context;
  const [game, setGame] = useState<GameInterface | null>(null);
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [turnPlayerId, setTurnPlayerId] = useState<string | undefined>(
    undefined
  );
  const [gameError, setGameError] = useState<string | null>(null);
  const [cardImages, setCardImages] = useState<string[]>([]);

  // Updates game state and determines current turn player and opponent
  const updateGameStates = useCallback(
    (game: GameInterface) => {
      setGame({ ...game });

      const playerInPlayingGame =
        game?.players.some((p) => p.id === playerId) &&
        game.state !== "finished";

      if (playerInPlayingGame) {
        setTurnPlayerId(game.players.find((p) => p.can_flip)?.id);
        setOpponentId(game.players.find((p) => p.id !== playerId)?.id || "");
      }
    },
    [playerId]
  );

  // Animates matched cards with fade-out/fade-in effect before updating game state
  const handleMatchedCards = useCallback(
    (matchedCards: string[], game: GameInterface) => {
      matchedCards.forEach((cardId) => {
        const el = document.getElementById(cardId.toString());
        if (el) {
          el.classList.add("card-out");
          setTimeout(() => {
            updateGameStates(game);
            el.classList.remove("card-out");
            el.classList.add("card-in");
            setTimeout(() => {
              el.classList.remove("card-in");
            }, 800);
          }, 1000);
        }
      });
    },
    [updateGameStates]
  );

  // Processes incoming WebSocket messages and updates game state or triggers animations
  const handleChannelMessage = useCallback(
    (data: any) => {
      console.log("Received data:", data);

      const { games_channel: games_channel_response } = data;
      const delay = games_channel_response.delay || 0;
      const game = games_channel_response.game;
      const imagesArray = games_channel_response.images_array || [];

      // Handle images
      if (imagesArray.length > 0) {
        setCardImages([
          "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg",
          ...imagesArray,
        ]);
      }

      // Handle game updates
      if (game) {
        if (delay > 0) {
          setTimeout(() => updateGameStates(game), delay);
        } else if (games_channel_response.matched_cards?.length) {
          handleMatchedCards(games_channel_response.matched_cards, game);
        } else {
          updateGameStates(game);
        }
      }
    },
    [updateGameStates, handleMatchedCards]
  );

  // Handles WebSocket connection errors and sets appropriate error state
  const handleChannelError = useCallback(() => {
    console.error("GameChannel rejected");
    setGameError("Game not found.");
  }, []);

  // Establishes WebSocket subscription to game channel and manages cleanup
  useEffect(() => {
    if (!gameId) return;

    subscribe(
      {
        channel: "GamesChannel",
        id: Date.now().toString(),
        game_id: gameId,
        get_images: cardImages.length === 0,
      },
      {
        received: handleChannelMessage,
        rejected: handleChannelError,
      }
    );

    return () => {
      unsubscribe();
    };
  }, [
    gameId,
    cardImages.length,
    subscribe,
    unsubscribe,
    handleChannelMessage,
    handleChannelError,
  ]);

  const flipCard = (cardId: string) => {
    send("flip_card", {
      game_card_id: cardId,
      player_id: playerId,
    });
  };

  const concede = () => {
    send("concede", {});
  };

  return {
    game,
    opponentId,
    turnPlayerId,
    gameError,
    cardImages,
    flipCard,
    concede,
  };
};
