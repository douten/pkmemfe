import { use, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../Button";
import { Card } from "../Card";

// context
import GlobalContext from "../../context/globalContext";

// components
import { PlayerBadge } from "../PlayerBadge";

export const Game = () => {
  const { id: gameId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!gameId) {
    return <div>Game ID is required</div>;
  }

  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }

  const { subscribe, unsubscribe, send, player, setStopBg } = context;
  const [game, setGame] = useState<any>(null);
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [canFlip, setCanFlip] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [cardImages, setCardImages] = useState<string[]>([]);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  const playerId = player?.id;

  const updateGameStates = (game: any) => {
    setGame({ ...game });

    const playerInPlayingGame =
      game?.players.some((p: any) => p.id === playerId) &&
      game.state !== "finished";

    if (playerInPlayingGame) {
      setCanFlip(game.players.find((p: any) => p.id === playerId)?.can_flip);
      setOpponentId(game.players.find((p: any) => p.id !== playerId)?.id || "");
    }
  };

  useEffect(() => {
    if (!gameId) return;

    setStopBg(true); // stop background animation
    subscribe(
      {
        channel: "GamesChannel",
        id: gameId,
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
              updateGameStates(game);
            }
          }
        },
        rejected: () => {
          console.error("GameChannel rejected");
          setGameError("Game not found or you are not allowed to join.");
        },
      }
    );

    // there is some kind of race condition bug with ActionCable
    // stopping the unsubscribe here seems to fix it
    return () => {
      unsubscribe();
    };
  }, [gameId, playerId, cardImages]);

  useEffect(() => {
    if (cardImages.length > 0) {
      // preload images
      const promises = cardImages.map((imageUrl) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = imageUrl;
          img.onload = () => {
            setLoadedImages((prev) => [...prev, imageUrl]);
            resolve(imageUrl);
          };
        });
      });

      Promise.all(promises);
    }
  }, [cardImages]);

  const flipCard = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.dataset.flipped === "true" || !canFlip) return;

    send("flip_card", {
      game_card_id: e.currentTarget.id,
      player_id: playerId,
    });
  };

  // Can't Find Game State
  if (gameError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 gap-2">
        <h3 className="text-7xl mb-4">⚠️</h3>
        <p className="text-vermilion mb-3 text-center">{gameError}</p>
        <Button
          label="Back to Home"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
    );
  }

  if (!game) {
    return <div className="m-5">Getting Game...</div>;
  }

  if (game.state === "finished") {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-1 sm:my-3">
        <div className="flex flex-col items-center justify-center w-fit gap-8 p-4">
          <div className="text-2xl">Game #{game.id} results:</div>

          {game.state === "finished" && game?.winner && (
            <div className="text-lg h-full flex flex-col items-start justify-center gap-4">
              {game.players.map((p: any) => (
                <div key={p.id} className="flex items-center gap-2">
                  {p.id === game.winner
                    ? ["👑", "🏆", "🥇", "😏", "😎", "🥳", "💅"][
                        Math.floor(Math.random() * 7)
                      ]
                    : ["💔", "😢", "😞", "😤", "🫥", "😡"][
                        Math.floor(Math.random() * 6)
                      ]}{" "}
                  <PlayerBadge playerId={p.id} size="lg" />
                  {playerId && p.id === playerId ? "(you)" : <div>&nbsp;</div>}
                </div>
              ))}
            </div>
          )}

          <Button
            label="Back to Home"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
      </div>
    );
  }

  if (loadedImages.length < cardImages.length) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-1 sm:my-3 p-7">
        <div className="text-lg">Loading game...</div>
        <div className="w-64 h-2 bg-gray animate-pulse rounded-gray overflow-hidden">
          <div
            className="h-full bg-cerulean transition-all duration-100"
            style={{
              width: `${(loadedImages.length / cardImages.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    );
  }

  // Live Game
  return (
    <div className="h-full flex items-center justify-center flex-col gap-1 sm:my-3">
      {/* <span>game{game.id}:</span> */}

      <div className="w-full flex items-center gap-4 my-4 justify-center p-3">
        {playerId && <PlayerBadge playerId={playerId} size="lg" />}
        {/* score badge */}
        <span className="text-md text-black-text font-bold">
          {game.players.find((p: any) => p.id === playerId)?.score || 0}
        </span>
        <span className="text-xl font-bold text-black-text font-black">:</span>
        <span className="text-md text-black-text font-bold">
          {game.players.find((p: any) => p.id !== playerId)?.score || 0}
        </span>
        {opponentId && <PlayerBadge playerId={opponentId} size="lg" />}
      </div>

      <div className="sm:px-4 grid grid-cols-4 w-fit gap-[5px]">
        {game.cards?.map((card: any, index: number) => (
          <div
            key={index}
            id={card.id}
            className="w-22 h-31 rounded-md"
            data-flipped={card.flipped}
            onClick={flipCard}
          >
            <Card
              isFlipped={card.flipped}
              image_url={card.image_url}
              width="100%"
              height="100%"
            />
          </div>
        ))}
      </div>

      <div className="w-full flex items-center gap-2 my-4 p-1 text-black-text justify-center">
        {canFlip ? (
          <span className="text-green-500">your turn...</span>
        ) : (
          <span className="text-red-500">waiting on opponent...</span>
        )}
        <button
          className="py-1 px-2 bg-gray text-white rounded text-xs"
          onClick={() => {
            send("concede", {});
          }}
        >
          Concede
        </button>
      </div>
    </div>
  );
};
