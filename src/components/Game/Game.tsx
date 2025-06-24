import styles from "./DoroList.module.scss";
import type { GameInterface } from "../../components/types";

export const Game = ({ game }: { game: GameInterface }) => {
  const flipCard = async (e: React.MouseEvent<HTMLDivElement>) => {
    // if (e.currentTarget.dataset.flipped === "true") return;
    // send("flip_card", {
    //   game_card_id: e.currentTarget.id,
    //   player_id: playerId,
    // });
  };

  // Match Making Phase
  if (game.players.length < 2) {
    return (
      <div className={styles["doro-list-wrapper"]}>No players available</div>
    );
  }

  // Live Game
  return (
    <div className={styles["doro-list-wrapper"]}>
      <div>{game.players[0].guestId}</div>
      {game.cards?.map((card: any, index) => (
        <div
          key={index}
          id={card.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            width: "50px",
            height: "75px",
            backgroundColor: card.flipped ? "#686868" : "#fff",
          }}
          data-flipped={card.flipped}
          onClick={flipCard}
        >
          {card.card?.number && (
            <div style={{ fontWeight: "bold" }}>{card.card.number}</div>
          )}
        </div>
      ))}
      <div>{game.players[1].guestId}</div>
    </div>
  );
};
