import { useEffect, useState, useContext } from "react";
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

  const { subscribe, unsubscribe, send, setStopBg } = context;
  const [game, setGame] = useState<GameInterface | null>(null);
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [turnPlayerId, setTurnPlayerId] = useState<string | undefined>(
    undefined
  );
  const [gameError, setGameError] = useState<string | null>(null);
  const [cardImages, setCardImages] = useState<string[]>([]);

  useEffect(() => {
    if (!gameId) return;
    console.log("useChannelGame useEffect");

    const updateGameStates = (game: GameInterface) => {
      setGame({ ...game });

      const playerInPlayingGame =
        game?.players.some((p) => p.id === playerId) &&
        game.state !== "finished";

      if (playerInPlayingGame) {
        setTurnPlayerId(game.players.find((p) => p.can_flip)?.id);
        setOpponentId(game.players.find((p) => p.id !== playerId)?.id || "");
      }
    };

    const handleMatchedCards = (
      matchedCards: string[],
      game: GameInterface
    ) => {
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
    };

    setStopBg(true);
    subscribe(
      {
        channel: "GamesChannel",
        id: Date.now().toString(),
        game_id: gameId,
        get_images: cardImages.length === 0,
      },
      {
        received: (data) => {
          console.log("Received data:", data);

          const { games_channel: games_channel_response } = data;
          const delay = games_channel_response.delay || 0;
          const game = games_channel_response.game;
          const imagesArray = games_channel_response.images_array || [];

          if (imagesArray.length > 0) {
            setCardImages([
              "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg",
              ...imagesArray,
            ]);
          }

          if (game) {
            if (delay > 0) {
              setTimeout(() => {
                updateGameStates(game);
              }, delay);
            } else {
              if (games_channel_response.matched_cards?.length) {
                handleMatchedCards(games_channel_response.matched_cards, game);
              } else {
                updateGameStates(game);
              }
            }
          }
        },
        rejected: () => {
          console.error("GameChannel rejected");
          setGameError("Game not found.");
        },
      }
    );

    return () => {
      unsubscribe();
    };
  }, [gameId, playerId, cardImages, setStopBg, subscribe, unsubscribe]);

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
