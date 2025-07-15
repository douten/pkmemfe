interface PlayerInterface {
  id: string;
  game_id: string;
}

interface CardInterface {
  id: string;
  flipped: boolean;
  image_url: string | null;
}

interface GamePlayerInterface {
  id: string;
  score: number;
  can_flip: boolean;
}

interface GameInterface {
  id: string;
  players: GamePlayerInterface[];
  state: "matching" | "playing" | "finished" | "disconnected";
  winner?: string | null;
  cards: CardInterface[];
}

export type { PlayerInterface, CardInterface, GameInterface };
