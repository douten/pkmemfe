import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../Button";

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

  const playerId = player?.id;

  const updateGameStates = (game: any) => {
    setGame({ ...game });
    setCanFlip(game.players.find((p: any) => p.id === playerId)?.can_flip);
    setOpponentId(game.players.find((p: any) => p.id !== playerId)?.id || "");
  };

  useEffect(() => {
    if (!gameId) return;
    setStopBg(true); // stop background animation

    subscribe(
      { channel: "GamesChannel", id: gameId },
      {
        received: (data) => {
          console.log("Received data:", data);

          const { games_channel: games_channel_response } = data;

          const delay = games_channel_response.delay || 0;
          const game = games_channel_response.game;

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

    return () => {
      unsubscribe();
    };
  }, [gameId]);

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
      <div className="text-red-500">
        {gameError}

        <button
          className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
          onClick={() => {
            navigate("/");
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!game) {
    return <div>Getting Game...</div>;
  }

  if (game.state === "finished") {
    setStopBg(false); // resume background animation
    return (
      <div className="flex flex-col items-center justify-center m-6 gap-2">
        <div>Game #{game.id} </div>
        <div>{playerId && <PlayerBadge playerId={playerId} />}</div>
        {playerId &&
          (game?.winner === playerId ? (
            <div className="text-lg">Congratulations You won!</div>
          ) : (
            <div className="text-lg">welp.. someone has to lose!</div>
          ))}

        {!playerId && game?.winner && (
          <div className="text-lg">
            {game.players.map((p: any) => (
              <div key={p.id} className="flex items-center gap-2">
                {p.id === game.winner
                  ? ["👑", "🏆", "🥇", "😏", "😎", "🥳", "💅"][
                      Math.floor(Math.random() * 7)
                    ]
                  : ["💔", "😢", "😞", "😤", "🫥", "😡"][
                      Math.floor(Math.random() * 6)
                    ]}{" "}
                <PlayerBadge playerId={p.id} />
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
    );
  }

  // Live Game
  return (
    <div className="h-full flex items-center justify-center flex-col gap-1 sm:my-3">
      {/* <span>game{game.id}:</span> */}

      <div className="w-full flex items-center gap-4 my-4 justify-center bg-saffron p-3">
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
            style={{
              backgroundColor: card.flipped ? "#686868" : "#fff",
            }}
            data-flipped={card.flipped}
            onClick={flipCard}
          >
            {card.flipped ? (
              <img
                src={card.image_url}
                alt="Card"
                className="w-full h-full rounded-md"
              />
            ) : (
              <img
                src="https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
                alt="Card Back"
                className="w-full h-full rounded-md"
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full flex items-center gap-2 my-4 p-1 text-black-text justify-center bg-saffron">
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
