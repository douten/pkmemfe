import { useEffect, useState, useContext, useCallback, useRef } from "react";
import GlobalContext from "../context/globalContext";
import type {
  GameInterface,
  GameChannelBroadcastInterface,
  CardInterface,
  GameTurnResultInterface,
} from "../types/types";

export const useGameChannel = (
  gameId: string | undefined,
  playerId: string | undefined
) => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }

  const { subscribe, unsubscribe, send } = context;

  // Main state variables for game data
  // comes from GameChannel broadcast
  const [game, setGame] = useState<GameInterface | null>(null);
  const [cards, setCards] = useState<CardInterface[]>([]);
  // useRef to keep track of the current cards state
  const cardsRef = useRef(cards);
  // used for preloading card images
  const [cardImages, setCardImages] = useState<string[]>([]);

  // players & error states
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [turnPlayerId, setTurnPlayerId] = useState<string | undefined>(
    undefined
  );
  const [gameError, setGameError] = useState<string | null>(null);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  const updateGameStates = (game: GameInterface, newCards: CardInterface[]) => {
    setCards((prevCards) => {
      let updatedCards: CardInterface[] = [];
      if (newCards.length > 0) {
        updatedCards = [...prevCards];
        newCards.forEach((newCard) => {
          const idx = newCard.position - 1;
          updatedCards[idx] = newCard;
        });
      } else {
        prevCards.forEach((newCard) => {
          // reset/unflipped all cards if there's no flipped cards
          newCard.image_url = undefined;
          updatedCards.push(newCard);
        });
      }

      return updatedCards;
    });
    setGame(game);
    setTurnPlayerId(game.playerTurnId);
  };

  // Animates matched cards with fade-out/fade-in effect before updating game state
  const handleMatchedCards = useCallback(
    (newCardsToAdd: CardInterface[], game: GameInterface) => {
      newCardsToAdd.forEach((card, index) => {
        const oldCardIndex = card.position - 1;
        const oldId = cardsRef.current[oldCardIndex]?.id.toString();
        const el = document.getElementById(oldId);

        if (el) {
          el.classList.add("card-out");
          setTimeout(() => {
            if (index === newCardsToAdd.length - 1) {
              // Update game state after all cards have faded out
              updateGameStates(game, newCardsToAdd);
            }
            el.classList.remove("card-out");
            el.classList.add("card-in");
            setTimeout(() => {
              el.classList.remove("card-in");
            }, 800);
          }, 1000);
        }
      });
    },
    []
  );

  // Handle GameChannel data helpers
  const handleGameSetup = useCallback(
    (
      game: GameInterface,
      initialCards: CardInterface[],
      imagesArray: string[]
    ) => {
      setGame(game);
      setCards(initialCards);
      setCardImages([
        "https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg",
        ...imagesArray,
      ]);

      // set up player ids
      const playerInPlayingGame =
        game?.players.some((p) => p.id === playerId) &&
        game.state !== "finished";

      if (playerInPlayingGame) {
        setTurnPlayerId(game.playerTurnId);
        setOpponentId(game.players.find((p) => p.id !== playerId)?.id || "");
      }
    },
    [playerId]
  );

  const handleTurnResult = useCallback(
    (game: GameInterface, turnResult: GameTurnResultInterface) => {
      const {
        cards_match_whole_set: allMatched,
        no_match: noMatch,
        first_flip: firstFlip,
        // TODO: cardNames might be useful for UI later
        // flipped_cards_name: cardNames,
        flipped_game_cards: flippedGameCards,
        new_cards_to_add: newCardsToAdd,
      } = turnResult;

      if (noMatch && !firstFlip) {
        // Give a delay if there's no match for players to see
        setTimeout(() => updateGameStates(game, flippedGameCards), 1200);
      } else if (allMatched && newCardsToAdd) {
        handleMatchedCards(newCardsToAdd, game);
      } else {
        updateGameStates(game, flippedGameCards);
      }
    },
    [handleMatchedCards]
  );

  // Processes incoming WebSocket messages and updates game state or triggers animations
  const handleChannelMessage = useCallback(
    (data: { games_channel: GameChannelBroadcastInterface }) => {
      console.log("Received data:", data);

      const { games_channel: gc_response } = data;

      // set main game data
      const {
        init_cards: initialCards,
        game,
        images_array: imagesArray,
        turn_result: turnResult,
      } = gc_response;

      const isSetupData =
        initialCards &&
        initialCards.length === 16 &&
        imagesArray &&
        imagesArray?.length > 0;

      if (isSetupData) {
        handleGameSetup(game, initialCards, imagesArray);
      }

      if (turnResult) {
        handleTurnResult(game, turnResult);
      }

      // TODO: Check the can_flip logic
      // it used to be in player.can_flip
      // but now it's in game.playerTurnId

      // TODO: update toast logic below
      // const hasTurn = game?.players.find((p) => p.can_flip)?.id === playerId;
      // let toastMessage = "";
      // if (firstFlip) {
      //   toastMessage = `${hasTurn ? "You" : "Opponent"} flipped ${cardNames}!`;
      // } else if (noMatch) {
      //   toastMessage = `${
      //     hasTurn ? "Your" : "Opponent's"
      //   } turn. ${cardNames} did not match.`;
      // } else if (allMatched) {
      //   toastMessage = `${cardNames} matched! ${
      //     hasTurn ? "You" : "Opponent"
      //   } +${games_channel_response.matched_cards?.length} points!`;
      // }

      // if (toastMessage) {
      //   context.showToast?.({
      //     message: toastMessage,
      //     type: "info",
      //     duration: 1800,
      //   }); // Show toast using context method
      // }
    },
    [handleGameSetup, handleTurnResult]
  );

  // Handles WebSocket connection errors and sets appropriate error state
  const handleChannelError = useCallback(() => {
    console.error("GameChannel rejected");
    setGameError("Game not found.");
  }, []);

  // Establishes WebSocket subscription to game channel and manages cleanup
  useEffect(() => {
    if (!gameId) return;

    const initGame = !game && cardImages.length === 0;
    const opts: { init_game?: boolean } = {};

    if (initGame) {
      opts.init_game = true;
    }

    subscribe(
      {
        channel: "GamesChannel",
        id: `${playerId
          ?.slice(-4)
          .toLocaleUpperCase()}-${Date.now().toString()}`,
        game_id: gameId,
        opts,
      },
      {
        received: handleChannelMessage,
        rejected: handleChannelError,
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

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
    cards,
    opponentId,
    turnPlayerId,
    gameError,
    cardImages,
    flipCard,
    concede,
  };
};
