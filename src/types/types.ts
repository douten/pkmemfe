interface PlayerInterface {
  id: string;
  game_id: string;
}

interface CardInterface {
  id: string;
  flipped: boolean;
  image_url: string | undefined;
}

interface GamePlayerInterface {
  id: string;
  score: number;
  can_flip: boolean;
}

interface GameInterface {
  id: string;
  players: GamePlayerInterface[];
  state: "matching" | "playing" | "finished" | "disconnected" | "abandoned";
  winner?: string | null;
  cards: CardInterface[];
}

export type { PlayerInterface, CardInterface, GameInterface };
