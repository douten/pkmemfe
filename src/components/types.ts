interface PlayerInterface {
  id: string;
  game_id: number;
}

interface CardInterface {
  id: number;
  flipped: boolean;
  image_url: string | null;
}

interface GamePlayerInterface {
  id: number;
  score: number;
  can_flip: boolean;
}

interface GameInterface {
  id: number;
  players: GamePlayerInterface[];
  state: "matching" | "playing" | "finished" | "disconnected";
  winner?: number | null;
  cards: CardInterface[];
}

export type { PlayerInterface, CardInterface, GameInterface };
